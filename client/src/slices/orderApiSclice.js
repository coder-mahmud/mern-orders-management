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
      invalidatesTags: ['Order', 'HubStock'],
    }),

    orderVerifyStatus: builder.mutation({
      query : (data) =>({
        url:`${ORDER_URL}/verify/`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ['Order',],
    }),


    editOrder: builder.mutation({
      query : (data) =>({
        url:`${ORDER_URL}/edit/`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ['Order'],
    }),

    deleteOrder: builder.mutation({
      query : (data) =>({
        url:`${ORDER_URL}/delete/`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ['Order'],
    }),

    
    getAllOrdersByDate: builder.query({
      query : (data) =>({
        url:`${ORDER_URL}/date/${data}`,
        method: "GET",
      }),
      invalidatesTags: ['Order'],
    }),
    
    /*
    searchOrders: builder.query({
      query: ({ phone, startDate, endDate, productId }) => {
        const params = new URLSearchParams();
        console.log("phone:", phone)
    
        if (phone) params.append("phone", phone);
        if (startDate) params.append("start", startDate);
        if (endDate) params.append("end", endDate);
        if (productId) params.append("productId", productId);
    
        return `${ORDER_URL}/search?${params.toString()}`;
      },
    }),

    */

    searchOrders: builder.query({
      query: ({ phone, productIds = [], startDate, endDate, page = 1 }) => {
        const productIdsStr = productIds.join(","); // convert array to CSV
        return {
          url: `${ORDER_URL}/search?phone=${phone || ""}&productIds=${productIdsStr}&startDate=${startDate || ""}&endDate=${endDate || ""}&page=${page}&limit=100`,
          method: "GET",
        };
      },
    }),






  })
})


export const { useCreateOrderMutation, useGetHubOrderQuery, useGetOrderByIdQuery, useOrderStatusMutation, useEditOrderMutation, useGetAllOrdersByDateQuery, useDeleteOrderMutation, useOrderVerifyStatusMutation, useLazySearchOrdersQuery  } = orderApiSlice;