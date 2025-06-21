import apiSlice from "./apiSlice";

const INTERNAL_REPORT_URL = '/internalreport'

export const internalReportApiSlice = apiSlice.injectEndpoints({
  
  endpoints:(builder) =>({

    createInternalReport: builder.mutation({
      query : (data) =>({
        url:`${INTERNAL_REPORT_URL}/create/`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ['InternalReport'],
    }),


    getInternalReportsByDate: builder.query({
      query : (date) =>({
        url:`${INTERNAL_REPORT_URL}/getbydate/${date}`,
        method: "GET",
      }),
      providesTags: ['InternalReport'],
    }),



  })
})


export const { useCreateInternalReportMutation, useGetInternalReportsByDateQuery   } = internalReportApiSlice;