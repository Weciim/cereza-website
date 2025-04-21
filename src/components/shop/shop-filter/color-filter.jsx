import React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
// internal
import ErrorMsg from "@/components/common/error-msg";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import ShopColorLoader from "@/components/loader/shop/color-filter-loader";

const ProductTypeFilter = ({ setCurrPage, shop_right = false }) => {
  const { data: products, isError, isLoading } = useGetAllProductsQuery();
  const router = useRouter();
  const dispatch = useDispatch();

  // Format product type for URL consistency
  const formatProductType = (type) => {
    if (!type) return "";
    return type
      .toString()
      .toLowerCase()
      .replace(/&/g, "")
      .replace(/\s+/g, "-");
  };

  // Handle product type selection
  const handleProductType = (type) => {
    setCurrPage(1);
    const formattedType = formatProductType(type);
    
    // Create new query object
    const newQuery = { ...router.query };
    delete newQuery.page; // Remove page parameter
    
    // Toggle product type filter
    if (newQuery.productType === formattedType) {
      delete newQuery.productType; // Remove if already selected
    } else {
      newQuery.productType = formattedType; // Add new filter
    }

    // Update URL without page reload
    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { 
        shallow: true,
        scroll: false 
      }
    );
    
    // Close mobile filter sidebar if open
    dispatch(handleFilterSidebarClose());
  };

  // Render content based on state
  let content = null;

  if (isLoading) {
    content = <ShopColorLoader loading={isLoading} />;
  } else if (isError) {
    content = <ErrorMsg msg="There was an error loading products" />;
  } else if (!products?.data?.length) {
    content = <ErrorMsg msg="No products found" />;
  } else {
    const productItems = products.data;
    
    // Calculate product type counts
    const productTypeCounts = productItems.reduce((acc, product) => {
      if (product.productType) {
        const type = product.productType;
        acc[type] = (acc[type] || 0) + 1;
      }
      return acc;
    }, {});

    // Sort product types alphabetically
    const sortedProductTypes = Object.keys(productTypeCounts).sort((a, b) =>
      a.localeCompare(b)
    );

    content = sortedProductTypes.map((type, index) => {
      const formattedType = formatProductType(type);
      const isActive = router.query.productType === formattedType;
      
      return (
        <li key={index}>
          <div className="tp-shop-widget-checkbox-circle">
            <input
              type="checkbox"
              id={`product-type-${index}`}
              checked={isActive}
              readOnly
            />
            <label
              onClick={() => handleProductType(type)}
              htmlFor={`product-type-${index}`}
              className={isActive ? "active" : ""}
            >
              {type}
            </label>
          </div>
          <span className="tp-shop-widget-checkbox-circle-number">
            {productTypeCounts[type]}
          </span>
        </li>
      );
    });
  }

  return (
    <div className="tp-shop-widget mb-50">
      <h3 className="tp-shop-widget-title">Filter by Product Type</h3>
      <div className="tp-shop-widget-content">
        <div className="tp-shop-widget-checkbox-circle-list">
          <ul>{content}</ul>
        </div>
      </div>
    </div>
  );
};

export default ProductTypeFilter;