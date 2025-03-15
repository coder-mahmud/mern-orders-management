import apiSlice from "./apiSlice";

const ORDER_URL = '/order'

export const orderApiSlice = apiSlice.injectEndpoints({
  
  endpoints:(builder) =>({

    createOrder: builder.mutation({
      query : (data) =>({
        url:`${ORDER_URL}/create/`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ['Order'],
    }),


    getHubOrder: builder.query({
      query : (data) =>({
        url:`${ORDER_URL}/hub/${data.id}/${data.date}`,
        method: "GET",
      }),
      invalidatesTags: ['Order'],
    }),

    






  })
})


export const { useCreateOrderMutation, useGetHubOrderQuery  } = orderApiSlice;