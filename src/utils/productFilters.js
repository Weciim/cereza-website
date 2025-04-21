/**
 * Formats product type for consistent comparison
 * @param {string} type - The product type to format
 * @returns {string} Formatted product type
 */
export const formatProductType = (type) => {
  if (!type) return "";
  return type
    .toString()
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/\s+/g, "-");
};

/**
 * Filters products by product type
 * @param {Array} products - Array of products to filter
 * @param {string} productType - The product type to filter by
 * @returns {Array} Filtered array of products
 */
export const filterProductsByType = (products, productType) => {
  if (!productType) return products;
  
  return products.filter((product) => {
    const formattedProductType = formatProductType(product.productType);
    return formattedProductType === productType;
  });
};

/**
 * Gets unique product types with counts
 * @param {Array} products - Array of products
 * @returns {Object} Object with product types as keys and counts as values
 */
export const getProductTypeCounts = (products) => {
  return products.reduce((acc, product) => {
    if (product.productType) {
      const type = product.productType;
      acc[type] = (acc[type] || 0) + 1;
    }
    return acc;
  }, {});
};