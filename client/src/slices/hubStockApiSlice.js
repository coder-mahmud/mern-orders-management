import apiSlice from "./apiSlice";

const HUBSTOCK_URL = '/hubstock'

export const hubStockApiSlice = apiSlice.injectEndpoints({
  
  endpoints:(builder) =>({

    getHubStock:builder.query({
      query:(data) => ({
        url:`${HUBSTOCK_URL}/gethubstock/${data.id}`,
        method: "GET",
      }),
      providesTags: ['HubStock']
    }),
    
    editHubStock:builder.mutation({
      query:(data) => ({
        url:`${HUBSTOCK_URL}/edit`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ['HubStock']
    }),

    




  })
})


export const { useGetHubStockQuery, useEditHubStockMutation,  } = hubStockApiSlice;