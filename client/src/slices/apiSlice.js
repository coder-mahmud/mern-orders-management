import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { clearCredential } from "./authSlice";

const apiUrl = import.meta.env.VITE_apiUrl;

const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl,
  credentials: "include",
});

const baseQueryWithAuthCheck = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (
    result.error?.status === 401 &&
    result.error?.data?.error === "TOKEN_VERSION_MISMATCH"
  ) {

    await baseQuery(
      {
        url: "/user/logout",
        method: "POST",
        credentials: "include",
      },
      api,
      extraOptions
    );
    // Clear Redux authentication state
    api.dispatch(clearCredential());

    // Redirect to login
    window.location.replace("/login");
  }

  return result;
};

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuthCheck,
  endpoints: (builder) => ({}),
});

export default apiSlice;


/*
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const apiUrl = import.meta.env.VITE_apiUrl;


const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery:fetchBaseQuery({ baseUrl: apiUrl, credentials: 'include' }),
  endpoints: (builder) => ({}),
})

export default apiSlice
*/