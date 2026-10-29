export function normalizeVariantKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatVariantLabel(value) {
  return String(value || "")
    .trim()
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function normalizeVariantSelections(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.entries(value).reduce((selections, [rawKey, rawValue]) => {
    const key = normalizeVariantKey(rawKey);
    const unit = String(rawValue ?? "").trim();

    if (key && unit) {
      selections[key] = unit;
    }

    return selections;
  }, {});
}

export function getItemVariants(item) {
  const variants = normalizeVariantSelections(item?.variants);

  if (Object.keys(variants).length > 0) {
    return variants;
  }

  return normalizeVariantSelections({
    size: item?.size,
    color: item?.color,
  });
}

export function getVariantLabel(item, key) {
  return (
    item?.variantLabels?.[key] ||
    item?.variantTypes?.find((type) => type.key === key)?.label ||
    formatVariantLabel(key)
  );
}

export function normalizeProductVariantSelections(product, selections) {
  const normalized = normalizeVariantSelections(selections);
  const sizeType = product?.variantTypes?.find((type) => type.key === "size");
  // Keep carts and checkout links created before sizes used the raw sheet values.
  const legacySize = normalized.size?.match(/^UK \d+ \/ EU (\d+) \/ US \d+ \/ PAK \d+ \/ [\d.]+ cm$/)?.[1];
  if (legacySize && !sizeType?.values.includes(normalized.size) && sizeType?.values.includes(legacySize)) {
    normalized.size = legacySize;
  }
  return normalized;
}

export function getInitialVariantSelections(product, preferred = {}) {
  const types = product?.variantTypes || [];
  const rows = product?.variants || [];
  const wanted = normalizeProductVariantSelections(product, preferred);
  const completeRows = rows.filter((row) =>
    types.every((type) => row.options?.[type.key])
  );
  const stockedRows = completeRows.filter((row) => Number(row.stock) > 0);

  const matchingRow = [...stockedRows, ...completeRows].find((row) =>
    Object.entries(wanted).every(
      ([key, value]) => !row.options?.[key] || row.options[key] === value
    )
  );
  const selectedRow = matchingRow || stockedRows[0] || completeRows[0] || rows[0];

  return types.reduce((selections, type) => {
    const rowValue = selectedRow?.options?.[type.key];

    selections[type.key] = wanted[type.key] || rowValue || type.values[0] || "";

    return selections;
  }, {});
}

function rowMatches(row, selections, keys) {
  return keys.every(
    (key) => selections[key] && row.options?.[key] === selections[key]
  );
}

export function getVariantOptionStock(
  product,
  selections,
  typeIndex,
  value
) {
  const types = product?.variantTypes || [];
  const rows = product?.variants || [];
  const type = types[typeIndex];

  if (!type) {
    return 0;
  }

  const nextSelections = {
    ...normalizeVariantSelections(selections),
    [type.key]: value,
  };
  const constrainedKeys = types
    .slice(0, typeIndex + 1)
    .map((item) => item.key);

  return rows.reduce(
    (total, row) =>
      types.every((item) => row.options?.[item.key]) &&
      rowMatches(row, nextSelections, constrainedKeys)
        ? total + Math.max(0, Number(row.stock) || 0)
        : total,
    0
  );
}

export function selectVariantOption(product, selections, typeIndex, value) {
  const types = product?.variantTypes || [];
  const rows = product?.variants || [];
  const type = types[typeIndex];

  if (!type) {
    return normalizeVariantSelections(selections);
  }

  const nextSelections = {
    ...normalizeVariantSelections(selections),
    [type.key]: value,
  };
  const constrainedKeys = types
    .slice(0, typeIndex + 1)
    .map((item) => item.key);
  const matchingRow = rows.find(
    (row) =>
      Number(row.stock) > 0 &&
      types.every((item) => row.options?.[item.key]) &&
      rowMatches(row, nextSelections, constrainedKeys)
  );

  if (!matchingRow) {
    return nextSelections;
  }

  return types.reduce((resolved, item, index) => {
    if (index > typeIndex && matchingRow.options?.[item.key]) {
      resolved[item.key] = matchingRow.options[item.key];
    }
    return resolved;
  }, nextSelections);
}

export function getSelectedVariantStock(product, selections) {
  const types = product?.variantTypes || [];
  const rows = product?.variants || [];
  const normalized = normalizeProductVariantSelections(product, selections);
  const requiredKeys = types.map((type) => type.key);

  if (requiredKeys.length === 0) {
    return rows.reduce(
      (total, row) => total + Math.max(0, Number(row.stock) || 0),
      0
    );
  }

  if (requiredKeys.some((key) => !normalized[key])) {
    return 0;
  }

  return rows.reduce(
    (total, row) =>
      rowMatches(row, normalized, requiredKeys)
        ? total + Math.max(0, Number(row.stock) || 0)
        : total,
    0
  );
}

export function getVariantLabels(product) {
  return (product?.variantTypes || []).reduce((labels, type) => {
    labels[type.key] = type.label;
    return labels;
  }, {});
}

export function withCategoryVariantOptions(products) {
  const categories = new Map();

  for (const product of products) {
    const type = product.variantTypes?.[0];
    if (!type) continue;
    const category = String(product.category || "").trim().toLowerCase();
    const key = JSON.stringify([category, type.key]);
    const values = categories.get(key) || new Set();
    type.values.forEach((value) => values.add(value));
    categories.set(key, values);
  }

  return products.map((product) => {
    const type = product.variantTypes?.[0];
    if (!type) return product;
    const category = String(product.category || "").trim().toLowerCase();
    const key = JSON.stringify([category, type.key]);
    return {
      ...product,
      cardVariantType: { ...type, values: [...categories.get(key)] },
    };
  });
}
