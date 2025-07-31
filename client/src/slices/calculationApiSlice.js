import apiSlice from "./apiSlice";

const CALC_URL = '/calculation'

export const calculationApiSlice = apiSlice.injectEndpoints({
  
  endpoints:(builder) =>({

    createCalculation: builder.mutation({
      query : (data) =>({
        url:`${CALC_URL}/add`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ['Calculation'],
    }),

    hubCalcByDate: builder.query({
      query : (data) =>({
        url:`${CALC_URL}/hub/${data.hub}/${data.date}`,
        method: "GET",
      }),
      invalidatesTags: ['Calculation'],
    }),

    editCalculation: builder.mutation({
      query : (data) =>({
        url:`${CALC_URL}/update`,
        method: "PUT",
        body:data
      }),
      invalidatesTags: ['Calculation'],
    }),





  })
})


export const { useCreateCalculationMutation, useEditCalculationMutation, useHubCalcByDateQuery } = calculationApiSlice;