import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  accessToken: undefined,
  admin: undefined,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    adminLoggedIn: (state, { payload }) => {
      state.accessToken = payload.accessToken;
      state.admin = payload.admin;
      state.loading = false;
      state.error = null;
    },
    adminLoggedOut: (state) => {
      state.accessToken = undefined;
      state.admin = undefined;
      state.loading = false;
      state.error = null;
      Cookies.remove('adminInfo');
    },
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    }
  },
});

export const { adminLoggedIn, adminLoggedOut, authStart, authError } = authSlice.actions;
export default authSlice.reducer;