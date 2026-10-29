import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../src/lib/imageUrl.js", import.meta.url), "utf8");
const { parseImageUrls } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);

test("single URLs still work and empty or invalid entries are skipped", () => {
  assert.deepEqual(parseImageUrls(" https://example.com/front.jpg "), ["https://example.com/front.jpg"]);
  for (const value of [undefined, null, 0, "", " | | ", "- | not-a-url | javascript:alert(1)"]) {
    assert.deepEqual(parseImageUrls(value), []);
  }
});

test("pipe-separated images retain order, normalize Drive links, and remove duplicates", () => {
  assert.deepEqual(parseImageUrls([
    " ",
    "not-a-url",
    ' "https://drive.google.com/file/d/front_ID/view?usp=sharing" ',
    "https://example.com/back.jpg?crop=1,2&token=a%7Cb",
    "https://drive.google.com/open?id=front_ID",
    "https://drive.google.com/open?id=side_ID",
    "",
  ].join("|")), [
    "https://lh3.googleusercontent.com/d/front_ID=w1000",
    "https://example.com/back.jpg?crop=1,2&token=a%7Cb",
    "https://lh3.googleusercontent.com/d/side_ID=w1000",
  ]);
});

test("the image list is not capped at the old ten extra-image fields", () => {
  const images = Array.from({ length: 12 }, (_, index) => `https://example.com/${index}.jpg`);
  assert.deepEqual(parseImageUrls(images.join(" | ")), images);
});
