import apiSlice from "./apiSlice";

const RIDER_STOCK_URL = '/riderstock'

export const riderStockApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getRiderStocks: builder.query({
      query: () => ({
        url: RIDER_STOCK_URL,
        method: "GET",
      }),
      providesTags: ["RiderStock"],
    }),

    getRiderStockById: builder.query({
      query: (id) => ({
        url: `${RIDER_STOCK_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ["RiderStock"],
    }),

    createOrUpdateRiderStock: builder.mutation({
      query: (data) => ({
        url: RIDER_STOCK_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["RiderStock"],
    }),

    editRiderStock: builder.mutation({
      query: (data) => ({
        url: RIDER_STOCK_URL,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["RiderStock"],
    }),

    deleteRiderStock: builder.mutation({
      query: (data) => ({
        url: RIDER_STOCK_URL,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["RiderStock"],
    }),

    getRiderStockByDate: builder.query({
      query: ({ riderId, date }) => ({
        url: `${RIDER_STOCK_URL}/date/${riderId}/${date}`,
        method: "GET",
      }),
      providesTags: ["RiderStock"],
    }),

    getRiderRemainingStock: builder.query({
      query: ({ riderId, date }) => ({
        url: `${RIDER_STOCK_URL}/remaining/${riderId}/${date}`,
        method: "GET",
      }),
      providesTags: ["RiderStock"],
    }),

    getRiderDeliverySummary: builder.query({
      query: ({ riderId, date }) => ({
        url: `${RIDER_STOCK_URL}/summary/${riderId}/${date}`,
        method: "GET",
      }),
      providesTags: ["RiderStock"],
    }),

    
  }),
});

export const {
  useGetRiderStocksQuery,
  useGetRiderStockByIdQuery,
  useCreateOrUpdateRiderStockMutation,
  useEditRiderStockMutation,
  useDeleteRiderStockMutation,
  useGetRiderStockByDateQuery,
  useGetRiderRemainingStockQuery,
  useGetRiderDeliverySummaryQuery,
} = riderStockApiSlice;