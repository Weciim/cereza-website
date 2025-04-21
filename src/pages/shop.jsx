import React, { useState, useEffect, useMemo } from "react";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import ShopArea from "@/components/shop/shop-area";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import ErrorMsg from "@/components/common/error-msg";
import Footer from "@/layout/footers/footer";
import ShopFilterOffCanvas from "@/components/common/shop-filter-offcanvas";
import ShopLoader from "@/components/loader/shop/shop-loader";
import { useRouter } from "next/router";

const ShopPage = ({ query }) => {
  const router = useRouter();
  const { data: products, isError, isLoading } = useGetAllProductsQuery();
  const [priceValue, setPriceValue] = useState([0, 0]);
  const [selectValue, setSelectValue] = useState("");
  const [currPage, setCurrPage] = useState(1);
  
  // Use router.query to get the latest query params on client-side navigation
  const { productType, status, category, subCategory, brand } = router.query;

  // Load the maximum price once the products have been loaded
  useEffect(() => {
    if (!isLoading && !isError && products?.data?.length > 0) {
      const maxPrice = products.data.reduce((max, product) => {
        return product.price > max ? product.price : max;
      }, 0);
      setPriceValue([0, maxPrice]);
    }
  }, [isLoading, isError, products]);

  // handleChanges
  const handleChanges = (val) => {
    setCurrPage(1);
    setPriceValue(val);
  };

  // selectHandleFilter
  const selectHandleFilter = (e) => {
    setSelectValue(e.value);
  };

  // other props
  const otherProps = {
    priceFilterValues: {
      priceValue,
      handleChanges,
    },
    selectHandleFilter,
    currPage,
    setCurrPage,
  };

  // Filter products based on query parameters
  const filteredProducts = useMemo(() => {
    if (!products?.data) return [];
    
    let productItems = [...products.data];
    
    // Apply all filters
    if (selectValue) {
      if (selectValue === "Low to High") {
        productItems.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (selectValue === "High to Low") {
        productItems.sort((a, b) => Number(b.price) - Number(a.price));
      } else if (selectValue === "New Added") {
        productItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (selectValue === "On Sale") {
        productItems = productItems.filter((p) => p.discount > 0);
      }
    }

    // Price filter
    productItems = productItems.filter(
      (p) => p.price >= priceValue[0] && p.price <= priceValue[1]
    );

    // Status filter
    if (status) {
      if (status === "on-sale") {
        productItems = productItems.filter((p) => p.discount > 0);
      } else if (status === "in-stock") {
        productItems = productItems.filter((p) => p.status === "in-stock");
      }
    }

    // Category filter
    if (category) {
      productItems = productItems.filter(
        (p) =>
          p.parent.toLowerCase().replace("&", "").split(" ").join("-") ===
          category
      );
    }

    // Subcategory filter
    if (subCategory) {
      productItems = productItems.filter(
        (p) =>
          p.children.toLowerCase().replace("&", "").split(" ").join("-") ===
          subCategory
      );
    }

    // Product type filter
    if (productType) {
      productItems = productItems.filter((product) => {
        const formattedProductType = product.productType
          ?.toLowerCase()
          .replace("&", "")
          .split(" ")
          .join("-");
        return formattedProductType === productType;
      });
    }

    // Brand filter
    if (brand) {
      productItems = productItems.filter(
        (p) =>
          p.brand?.name?.toLowerCase().replace("&", "").split(" ").join("-") ===
          brand
      );
    }

    return productItems;
  }, [
    products?.data,
    selectValue,
    priceValue,
    status,
    category,
    subCategory,
    productType,
    brand,
  ]);

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <ShopLoader loading={isLoading} />;
  } else if (isError) {
    content = (
      <div className="pb-80 text-center">
        <ErrorMsg msg="There was an error" />
      </div>
    );
  } else if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  } else {
    content = (
      <>
        <ShopArea
          all_products={products.data}
          products={filteredProducts}
          otherProps={otherProps}
        />
        <ShopFilterOffCanvas
          all_products={products.data}
          otherProps={otherProps}
        />
      </>
    );
  }

  return (
    <Wrapper>
      <SEO pageTitle="Shop" />
      <HeaderTwo style_2={true} />
      <ShopBreadcrumb title="Shop Grid" subtitle="Shop Grid" />
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ShopPage;

export const getServerSideProps = async (context) => {
  const { query } = context;

  return {
    props: {
      query,
    },
  };
};