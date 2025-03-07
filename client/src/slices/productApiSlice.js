import apiSlice from "./apiSlice";

const PRODUCTS_URL = '/product'

export const userApiSlice = apiSlice.injectEndpoints({
  
  endpoints:(builder) =>({

    createProduct: builder.mutation({
      query : (data) =>({
        url:`${PRODUCTS_URL}/create/`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ['Product'],
    }),

    getAllProduct: builder.query({
      query : () =>({
        url:`${PRODUCTS_URL}/`,
        method: "GET",
      }),
      providesTags: ['Product'],
      // invalidatesTags: ['Product'],
    }),





  })
})


export const { useCreateProductMutation, useGetAllProductQuery  } = userApiSlice;