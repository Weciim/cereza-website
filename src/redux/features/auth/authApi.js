import { apiSlice } from "@/redux/api/apiSlice";
import { 
  adminLoggedIn, 
  adminLoggedOut, 
  authStart, 
  authError 
} from "./authSlice";
import Cookies from "js-cookie";
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import {  doc, getDoc } from "firebase/firestore";

import { db,auth } from "../../../firebase/config";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Admin login
    loginAdmin: builder.mutation({
      queryFn: async (credentials, { dispatch }) => {
        dispatch(authStart());
        try {
          const { email, password } = credentials;
          
          // First sign in with Firebase Auth
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          
          // Check if user is an admin in Firestore
          const adminDoc = await getDoc(doc(db, "admins", userCredential.user.uid));
          
          if (!adminDoc.exists()) {
            await signOut(auth);
            throw new Error("Access restricted to admins only");
          }
          
          const token = await userCredential.user.getIdToken();
          
          Cookies.set(
            "adminInfo",
            JSON.stringify({
              accessToken: token,
              admin: {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                name: adminDoc.data().name,
                role: adminDoc.data().role
              }
            }),
            { expires: 1 } // 1 day expiration
          );

          dispatch(
            adminLoggedIn({
              accessToken: token,
              admin: {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                name: adminDoc.data().name,
                role: adminDoc.data().role
              }
            })
          );

          return { data: adminDoc.data() };
        } catch (error) {
          dispatch(authError(error.message));
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      }
    }),

    // Get current admin
    getCurrentAdmin: builder.query({
      queryFn: async (_, { dispatch }) => {
        dispatch(authStart());
        try {
          return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
              if (user) {
                // Verify admin status
                const adminDoc = await getDoc(doc(db, "admins", user.uid));
                
                if (!adminDoc.exists()) {
                  await signOut(auth);
                  dispatch(adminLoggedOut());
                  resolve({ data: null });
                  return;
                }
                
                const token = await user.getIdToken();
                
                Cookies.set(
                  "adminInfo",
                  JSON.stringify({
                    accessToken: token,
                    admin: {
                      uid: user.uid,
                      email: user.email,
                      name: adminDoc.data().name,
                      role: adminDoc.data().role
                    }
                  }),
                  { expires: 1 }
                );

                dispatch(
                  adminLoggedIn({
                    accessToken: token,
                    admin: {
                      uid: user.uid,
                      email: user.email,
                      name: adminDoc.data().name,
                      role: adminDoc.data().role
                    }
                  })
                );
                
                resolve({ data: adminDoc.data() });
              } else {
                dispatch(adminLoggedOut());
                resolve({ data: null });
              }
              unsubscribe();
            });
          });
        } catch (error) {
          dispatch(authError(error.message));
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      }
    }),

    // Admin logout
    logoutAdmin: builder.mutation({
      queryFn: async (_, { dispatch }) => {
        try {
          await signOut(auth);
          dispatch(adminLoggedOut());
          return { data: { message: 'Logged out successfully' } };
        } catch (error) {
          dispatch(authError(error.message));
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      }
    })
  }),
});

export const {
  useLoginAdminMutation,
  useGetCurrentAdminQuery,
  useLogoutAdminMutation
} = authApi;

// Initialize auth state on app load
export const initializeAdminAuth = (dispatch) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Verify admin status
      const adminDoc = await getDoc(doc(db, "admins", user.uid));
      
      if (!adminDoc.exists()) {
        await signOut(auth);
        dispatch(adminLoggedOut());
        return;
      }
      
      const token = await user.getIdToken();
      
      Cookies.set(
        "adminInfo",
        JSON.stringify({
          accessToken: token,
          admin: {
            uid: user.uid,
            email: user.email,
            name: adminDoc.data().name,
            role: adminDoc.data().role
          }
        }),
        { expires: 1 }
      );

      dispatch(
        adminLoggedIn({
          accessToken: token,
          admin: {
            uid: user.uid,
            email: user.email,
            name: adminDoc.data().name,
            role: adminDoc.data().role
          }
        })
      );
    } else {
      dispatch(adminLoggedOut());
    }
  });
};