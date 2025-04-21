import { apiSlice } from "../api/apiSlice";
import { db } from "../../firebase/config";


const serializeError = (error) => {
  if (!error) return null;
  return {
    name: error.name || "Error",
    message: error.message || "Unknown error",
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    code: error.code || undefined,
  };
};

export const categoryApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Add new category
    addCategory: builder.mutation({
      async queryFn(data) {
        try {
          const { collection, setDoc, doc } = await import(
            "firebase/firestore"
          );
          const newCategoryRef = doc(collection(db, "categories"));
          await setDoc(newCategoryRef, {
            ...data,
            id: newCategoryRef.id,
            status: "Show",
            products: [],
          });
          return { data: { id: newCategoryRef.id, ...data } };
        } catch (error) {
          return { error: serializeError(error) };
        }
      },
    }),

    // Get all categories
    getShowCategory: builder.query({
      async queryFn() {
        try {
          const { collection, getDocs } = await import("firebase/firestore");
          const categoriesRef = collection(db, "categories");
          const snapshot = await getDocs(categoriesRef);
          const categories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            // Convert array children to comma-separated string if needed
            children: doc.data().children?.join(", ") || "",
          }));
          return { data: { result: categories } };
        } catch (error) {
          return { error: serializeError(error) };
        }
      },
    }),

    getProductTypeCategory: builder.query({
      async queryFn(type) {
        try {
          const { collection, query, where, getDocs } = await import(
            "firebase/firestore"
          );
          const q = query(
            collection(db, "categories"),
            where("productType", "==", type),
            where("status", "==", "Show")
          );
          const snapshot = await getDocs(q);
          const categories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            children: doc.data().children?.join(", ") || "",
          }));
          return { data: categories };
        } catch (error) {
          return { error: serializeError(error) };
        }
      },
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useGetProductTypeCategoryQuery,
  useGetShowCategoryQuery,
} = categoryApi;
