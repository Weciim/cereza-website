import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetMostDiscountedProductsQuery } from "@/redux/features/productApi";


// featured data

const BeautyFeatured = () => {
  const {
    data: featured_data,
    isLoading,
    isError,
  } = useGetMostDiscountedProductsQuery(3);
  return (
    <>
      <section className="tp-featured-product-area pt-70 pb-150">
        <div className="container">
          <div className="row gx-0">
            {featured_data?.data.map((item) => (
              <div key={item.id} className="col-lg-4 col-md-6">
                <div className="tp-featured-item-3 text-center">
                  <div className="tp-featured-thumb-3 d-flex align-items-end justify-content-center">
                    <img src={item.img} alt="featured image" />
                  </div>
                  <div className="tp-featured-content-3">
                    <h3 className="tp-featured-title-3">
                      <Link href="/shop">{item.title}</Link>
                    </h3>
                    <p>{item.description}</p>
                    <div className="tp-featured-price-3">
                      <span>Save {item.discount} %</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default BeautyFeatured;
