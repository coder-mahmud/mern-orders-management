import apiSlice from "./apiSlice";

const RIDER_REPORT_URL = '/riderreport'

export const riderReportApiSlice = apiSlice.injectEndpoints({
  
  endpoints:(builder) =>({

    createRiderReport: builder.mutation({
      query : (data) =>({
        url:`${RIDER_REPORT_URL}/create/`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ['RiderReport'],
    }),


    getRiderReportsByDate: builder.query({
      query : (date) =>({
        url:`${RIDER_REPORT_URL}/getbydate/${date}`,
        method: "GET",
      }),
      providesTags: ['RiderReport'],
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
    






  })
})


export const { useCreateRiderReportMutation, useGetRiderReportsByDateQuery  } = riderReportApiSlice;