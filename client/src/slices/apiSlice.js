import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const apiUrl = import.meta.env.VITE_apiUrl;
// const baseQuery = fetchBaseQuery({baseUrl:'http://localhost:5000', credentials: 'include'})

const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery:fetchBaseQuery({ baseUrl: apiUrl, credentials: 'include' }),
  endpoints: (builder) => ({}),
  //tagTypes: ['User'],
})

export default apiSlice