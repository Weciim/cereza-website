import { apiSlice } from "../api/apiSlice";
import { db } from "../../firebase/config";
import { Timestamp } from "firebase/firestore";

// Enhanced error serializer
const serializeError = (error) => {
  if (!error) return null;
  return {
    name: error.name || "Error",
    message: error.message || "Unknown error",
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    code: error.code || undefined,
  };
};

// Helper to convert Firestore data to plain objects
const serializeFirestoreDoc = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        // Convert Timestamps to ISO strings
        if (value instanceof Timestamp) {
          return [key, value.toDate().toISOString()];
        }
        // Convert DocumentReferences to paths
        if (value?.path) {
          return [key, value.path];
        }
        return [key, value];
      })
    ),
  };
};

export const productApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get all products
    getAllProducts: builder.query({
      async queryFn() {
        try {
          const { collection, getDocs } = await import("firebase/firestore");
          const productsRef = collection(db, "products");
          const snapshot = await getDocs(productsRef);
          const products = snapshot.docs.map(serializeFirestoreDoc);
          return { data: { data: products } };
        } catch (error) {
          return { error: serializeError(error) };
        }
      },
      providesTags: ["Products"],
    }),
    getMostDiscountedProducts: builder.query({
      async queryFn(number) {
        try {
          const { collection, query, orderBy, limit, getDocs } = await import(
            "firebase/firestore"
          );
          const productsRef = collection(db, "products");

          const q = query(
            productsRef,
            orderBy("discount", "desc"),
            limit(number)
          );

          const snapshot = await getDocs(q);
          const products = snapshot.docs.map(serializeFirestoreDoc);

          return { data: { data: products } };
        } catch (error) {
          return { error: serializeError(error) };
        }
      },
      providesTags: ["Products"],
    }),
    // Get products by type
    getProductType: builder.query({
      async queryFn({ type, query: queryParams }) {
        try {
          const { collection, query, where, orderBy, limit, getDocs } =
            await import("firebase/firestore");
          let q = query(
            collection(db, "products"),
            where("productType", "==", type)
          );

          if (queryParams?.new === "true") {
            q = query(q, orderBy("createdAt", "desc"), limit(8));
          } else if (queryParams?.featured === "true") {
            q = query(q, where("featured", "==", true));
          } else if (queryParams?.topSellers === "true") {
            q = query(q, orderBy("sellCount", "desc"), limit(8));
          }

          const snapshot = await getDocs(q);
          const products = snapshot.docs.map(serializeFirestoreDoc);
          return { data: products };
        } catch (error) {
          return { error: serializeError(error) };
        }
      },
      providesTags: ["ProductType"],
    }),

    // Get offer products
    getOfferProducts: builder.query({
      async queryFn(type) {
        try {
          const { collection, query, where, getDocs } = await import(
            "firebase/firestore"
          );
          const now = new Date();
          let q = query(
            collection(db, "products"),
            where("offerDate.endDate", ">", now)
          );

          if (type) {
            q = query(q, where("productType", "==", type));
          }

          const snapshot = await getDocs(q);
          const products = snapshot.docs.map(serializeFirestoreDoc);
          return { data: products };
        } catch (error) {
          return { error: serializeError(error) };
        }
      },
      providesTags: ["OfferProducts"],
    }),

    // Get popular products by type
    getPopularProductByType: builder.query({
      async queryFn(type) {
        try {
          const { collection, query, where, orderBy, limit, getDocs } =
            await import("firebase/firestore");
          const q = query(
            collection(db, "products"),
            where("productType", "==", type),
            orderBy("reviews", "desc"),
            limit(8)
          );

          const snapshot = await getDocs(q);
          const products = snapshot.docs.map(serializeFirestoreDoc);
          return { data: products };
        } catch (error) {
          return { error: serializeError(error) };
        }
      },
      providesTags: ["PopularProducts"],
    }),

    // Get top rated products
    getTopRatedProducts: builder.query({
      async queryFn() {
        try {
          const { collection, query, where, getDocs } = await import(
            "firebase/firestore"
          );
          const q = query(
            collection(db, "products"),
            where("reviews", "!=", [])
          );

          const snapshot = await getDocs(q);
          const products = snapshot.docs.map((doc) => {
            const data = serializeFirestoreDoc(doc);
            const totalRating = data.reviews.reduce(
              (sum, r) => sum + r.rating,
              0
            );
            const avgRating = totalRating / data.reviews.length;
            return {
              ...data,
              rating: avgRating,
            };
          });

          // Sort by rating descending and return top 8
          return {
            data: products.sort((a, b) => b.rating - a.rating).slice(0, 8),
          };
        } catch (error) {
          return { error: serializeError(error) };
        }
      },
      providesTags: ["TopRatedProducts"],
    }),

    // Get single product
    getProduct: builder.query({
      async queryFn(itemID) {
        try {
          const { doc, getDoc } = await import("firebase/firestore");
          const productRef = doc(db, "products", itemID);
          const productSnap = await getDoc(productRef);

          if (!productSnap.exists()) {
            throw new Error("Product not found");
          }

          // Get brand and category data
          const product = serializeFirestoreDoc(productSnap);
          const [brandSnap, categorySnap] = await Promise.all([
            getDoc(doc(db, "brands", product.brand.id)),
            getDoc(doc(db, "categories", product.category.id)),
          ]);

          // Populate reviews with user data
          // const populatedReviews = await Promise.all(
          //   product.reviews?.map(async (review) => {
          //     if (review.userId) {
          //       const { doc, getDoc } = await import("firebase/firestore");
          //       const userSnap = await getDoc(doc(db, "users", review.userId));
          //       if (userSnap.exists()) {
          //         return {
          //           ...review,
          //           userId: serializeFirestoreDoc(userSnap),
          //         };
          //       }
          //     }
          //     return review;
          //   }) || []
          // );

          return {
            data: {
              ...product,
              // brand: { ...serializeFirestoreDoc(brandSnap), id: brandSnap.id },
              // category: {
              //   ...serializeFirestoreDoc(categorySnap),
              //   id: categorySnap.id,
              // },
              // reviews: populatedReviews,
            },
          };
        } catch (error) {
          return { error: serializeError(error) };
        }
      },
      providesTags: (result, error, arg) => [{ type: "Product", id: arg }],
    }),

    // Get related products
    getRelatedProducts: builder.query({
      async queryFn(id) {
        try {
          const { doc, getDoc, collection, query, where, limit, getDocs } =
            await import("firebase/firestore");
          const productRef = doc(db, "products", id);
          const productSnap = await getDoc(productRef);

          if (!productSnap.exists()) {
            throw new Error("Product not found");
          }

          const product = serializeFirestoreDoc(productSnap);
          const q = query(
            collection(db, "products"),
            where("category.id", "==", product.category.id),
            // where("img", "!=", product.img),
            limit(4)
          );

          const snapshot = await getDocs(q);
          const products = snapshot.docs.map(serializeFirestoreDoc);
          return { data: products };
        } catch (error) {
          return { error: serializeError(error) };
        }
      },
      providesTags: ["RelatedProducts"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductTypeQuery,
  useGetOfferProductsQuery,
  useGetPopularProductByTypeQuery,
  useGetTopRatedProductsQuery,
  useGetProductQuery,
  useGetRelatedProductsQuery,
  useGetMostDiscountedProductsQuery,
} = productApi;
