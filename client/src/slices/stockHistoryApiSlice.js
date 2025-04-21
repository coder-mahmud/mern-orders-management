import apiSlice from "./apiSlice";

const STOCK_HISTORY_URL = '/stockhistory'

export const stockHistoryApiSlice = apiSlice.injectEndpoints({
  
  endpoints:(builder) =>({

    getHubStockHistory:builder.query({
      query:(data) => ({
        url:`${STOCK_HISTORY_URL}/${data.hubId}/${data.date}`,
        method: "GET",
      }),
      providesTags: ['HubStock']
    }),
    
    

    




  })
})


export const { useGetHubStockHistoryQuery   } = stockHistoryApiSlice;