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
      providesTags: ['Order'],
    }),

    getOrderById: builder.query({
      query : (id) =>({
        url:`${ORDER_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ['Order'],
    }),

    orderStatus: builder.mutation({
      query : (data) =>({
        url:`${ORDER_URL}/status/`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ['Order'],
    }),


    editOrder: builder.mutation({
      query : (data) =>({
        url:`${ORDER_URL}/edit/`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ['Order'],
    }),

    






  })
})


export const { useCreateOrderMutation, useGetHubOrderQuery, useGetOrderByIdQuery, useOrderStatusMutation, useEditOrderMutation  } = orderApiSlice;