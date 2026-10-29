import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const variantSource = await readFile(new URL("../src/lib/variants.js", import.meta.url), "utf8");
const variants = await import(`data:text/javascript;base64,${Buffer.from(variantSource).toString("base64")}`);
const {
  getInitialVariantSelections,
  getSelectedVariantStock,
  getVariantOptionStock,
  normalizeProductVariantSelections,
  selectVariantOption,
  withCategoryVariantOptions,
} = variants;

const jacket = {
  category: "Jackets",
  variantTypes: [
    { key: "size", label: "Size", values: ["S", "M", "L", "XL", "XXL", "XXXL"] },
    { key: "color", label: "Color", values: ["Black", "Brown"] },
  ],
  variants: [
    { options: { size: "M", color: "Black" }, stock: 6 },
    { options: { size: "L", color: "Brown" }, stock: 2 },
    { options: { size: "XL", color: "Black" }, stock: 0 },
    { options: { size: "S" }, stock: 3 },
  ],
};

test("available option counts differ from unit counts and respect earlier selections", () => {
  const selected = getInitialVariantSelections(jacket);
  assert.deepEqual(selected, { size: "M", color: "Black" });
  assert.equal(getSelectedVariantStock(jacket, selected), 6);
  const colors = jacket.variantTypes[1].values.filter((value) => getVariantOptionStock(jacket, selected, 1, value) > 0);
  assert.deepEqual(colors, ["Black"]);
  assert.equal(getVariantOptionStock(jacket, {}, 0, "XL"), 0);
  assert.equal(getVariantOptionStock(jacket, {}, 0, "S"), 0);
  assert.deepEqual(selectVariantOption(jacket, selected, 0, "L"), { size: "L", color: "Brown" });
});

test("explicit unavailable selections are preserved instead of silently substituted", () => {
  for (const preferred of [{ size: "M", color: "Brown" }, { size: "XL", color: "Black" }, { size: "removed-size" }]) {
    const selected = getInitialVariantSelections(jacket, preferred);
    for (const [key, value] of Object.entries(preferred)) assert.equal(selected[key], value);
    assert.equal(getSelectedVariantStock(jacket, selected), 0);
  }
  assert.deepEqual(getInitialVariantSelections(jacket, { size: "XL" }), { size: "XL", color: "Black" });
  assert.deepEqual(getInitialVariantSelections(jacket, { size: "L" }), { size: "L", color: "Brown" });
  assert.deepEqual(getInitialVariantSelections(jacket), { size: "M", color: "Black" });
  const soldOut = { ...jacket, variants: jacket.variants.map((row) => ({ ...row, stock: 0 })) };
  assert.equal(getSelectedVariantStock(soldOut, getInitialVariantSelections(soldOut)), 0);
});

test("cards share primary options only within their own category and variant type", () => {
  const shoe = { category: "Peshawri Chappal", variantTypes: [{ key: "size", label: "Size", values: ["39", "40"] }] };
  const wallet = { category: "Wallets", variantTypes: [{ key: "color", label: "Color", values: ["Black"] }] };
  const largerJacket = { category: " jackets ", variantTypes: [{ key: "size", label: "Size", values: ["4XL"] }] };
  const result = withCategoryVariantOptions([jacket, largerJacket, shoe, wallet, { category: "Wallets" }]);
  assert.deepEqual(result[0].cardVariantType.values, ["S", "M", "L", "XL", "XXL", "XXXL", "4XL"]);
  assert.equal(getVariantOptionStock(result[0], {}, 0, "4XL"), 0);
  assert.deepEqual(result[1].cardVariantType.values, result[0].cardVariantType.values);
  assert.deepEqual(result[2].cardVariantType.values, ["39", "40"]);
  assert.deepEqual(result[3].cardVariantType.values, ["Black"]);
  assert.equal(result[4].cardVariantType, undefined);
  assert.equal(jacket.variantTypes[0].values.includes("4XL"), false);
});

test("older generated shoe labels still resolve to sheet sizes without changing literal sheet labels", () => {
  const oldSize = "UK 5 / EU 39 / US 6 / PAK 7 / 24.5 cm";
  const shoe = {
    variantTypes: [{ key: "size", values: ["39"] }],
    variants: [{ options: { size: "39" }, stock: 2 }],
  };
  assert.deepEqual(normalizeProductVariantSelections(shoe, { size: oldSize }), { size: "39" });
  assert.equal(getSelectedVariantStock(shoe, { size: oldSize }), 2);
  assert.deepEqual(getInitialVariantSelections(shoe, { size: oldSize }), { size: "39" });
  assert.deepEqual(normalizeProductVariantSelections({ variantTypes: [{ key: "size", values: [oldSize] }] }, { size: oldSize }), { size: oldSize });
});

test("raw sheet import preserves numeric and letter values, quotes, empty cells, and primary-column order", async () => {
  const csv = {
    "0": 'Product,Product Name,Category,Product Price,Product Description,Product Image,Status\r\n1,Shoe,Peshawri Chappal,5000,"Handmade, leather",,available\r\n48,Jacket,Jackets,30000,"Soft ""leather""\ncoat","",available\r\n49,Wallet,Wallets,1000,"","",available',
    "2034096658": 'product id,variant type 2,unit 2,variants type,unit,stock\n1,color,Black,size,39,2\n1,color,"",size,40,0\n48,color,Black,size,S,1\n48,color,Black,size,M,1\n48,color,Black,size,L,1\n48,color,Black,size,XL,1\n48,color,Black,size,XXL,1\n48,color,Black,size,XXXL,1\n49,,,color,"Black, matte",3\n49,,,color,Tan,-2',
    "199410352": 'Name,Parent,Image\nJackets,,',
  };
  csv["0"] += '\r\n50,Gallery test,Jackets,1000,," | https://drive.google.com/file/d/front/view | https://example.com/back.jpg?crop=1,2 | https://drive.google.com/open?id=front | ",available';
  csv["2034096658"] += '\n1,color,Black,size,41,"1,000"\n1,color,Black,size,42,"-1,000"\n1,color,Black,size,43,invalid\n1,color,Black,size,44,Infinity';
  const requests = [];
  const context = vm.createContext({ console, fetch: async (url) => {
    const parsed = new URL(url);
    requests.push(parsed);
    assert.ok(parsed.pathname.endsWith("/export"));
    assert.equal(parsed.searchParams.get("format"), "csv");
    const body = csv[parsed.searchParams.get("gid")];
    assert.notEqual(body, undefined);
    return new Response(body);
  } });
  const modules = new Map();
  async function load(path) {
    if (modules.has(path)) return modules.get(path);
    const source = await readFile(new URL(`../src/${path}.js`, import.meta.url), "utf8");
    const entry = new vm.SourceTextModule(source, { context });
    modules.set(path, entry);
    await entry.link((specifier) => load(specifier.replace("@/", "")));
    return entry;
  }
  const loader = await load("lib/googleSheets");
  await loader.evaluate();
  const products = JSON.parse(JSON.stringify(await loader.namespace.getProducts()));
  assert.equal(products.length, 4);
  const [shoe, coat, wallet] = products;
  assert.deepEqual(shoe.variantTypes[0].values, ["39", "40", "41", "42", "43", "44"]);
  assert.equal(getSelectedVariantStock(shoe, { size: "41", color: "Black" }), 1000);
  for (const size of ["42", "43", "44"]) {
    assert.equal(getSelectedVariantStock(shoe, { size, color: "Black" }), 0);
  }
  assert.deepEqual(shoe.variantTypes[1].values, ["Black"]);
  assert.deepEqual(coat.variantTypes[0].values, ["S", "M", "L", "XL", "XXL", "XXXL"]);
  assert.equal(coat.variantTypes[0].key, "size");
  assert.equal(coat.productDescription, 'Soft "leather"\ncoat');
  assert.equal(coat.productImage, "");
  assert.equal(getSelectedVariantStock(coat, { size: "L", color: "Black" }), 1);
  assert.deepEqual(wallet.cardVariantType.values, ["Black, matte", "Tan"]);
  assert.equal(getVariantOptionStock(wallet, {}, 0, "Tan"), 0);
  assert.equal(wallet.productDescription, "");
  assert.equal(products[3].productImage, "https://lh3.googleusercontent.com/d/front=w1000");
  assert.deepEqual(products[3].productImages, [
    "https://lh3.googleusercontent.com/d/front=w1000",
    "https://example.com/back.jpg?crop=1,2",
  ]);
  assert.deepEqual(coat.productImages, []);
  const categories = await loader.namespace.getCategoriesFromSheet();
  assert.equal(categories[0].count, 2);
  assert.ok(requests.some((url) => url.searchParams.get("gid") === "199410352"));
});
