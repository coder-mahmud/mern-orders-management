import apiSlice from "./apiSlice";

const RIDER_INPUT_URL = "/riderinput";

export const riderInputApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrUpdateRiderInput: builder.mutation({
      query: (data) => ({
        url: RIDER_INPUT_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["RiderInput"],
    }),

    getMyRiderInputByDate: builder.query({
      query: (date) => ({
        url: `${RIDER_INPUT_URL}/my`,
        params: { date },
      }),
      providesTags: ["RiderInput"],
    }),

    getAllRiderInputsByDate: builder.query({
      query: (date) => ({
        url: RIDER_INPUT_URL,
        params: { date },
      }),
      providesTags: ["RiderInput"],
    }),

    getAllRiderInputComparisonByDate: builder.query({
      query: (date) => `ridercomparison/${date}`,
      providesTags: ["RiderInput"],
    }),

    updateRiderInputByAdmin: builder.mutation({
      query: ({ id, items, extraNote }) => ({
        url: `${RIDER_INPUT_URL}/${id}`,
        method: "PUT",
        body: { items, extraNote },
      }),
      invalidatesTags: ["RiderInput"],
    }),

    getRiderInputByRiderAndDateForAdmin: builder.query({
      query: ({ riderId, date }) => ({
        url: `${RIDER_INPUT_URL}/admin-entry`,
        params: {
          riderId,
          date,
        },
      }),
      providesTags: ["RiderInput"],
      keepUnusedDataFor: 0,
    }),

    createOrUpdateRiderInputByAdmin: builder.mutation({
      query: (data) => ({
        url: `${RIDER_INPUT_URL}/admin-entry`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["RiderInput"],
    }),
  }),
});

export const {
  useCreateOrUpdateRiderInputMutation,
  useGetMyRiderInputByDateQuery,
  useGetAllRiderInputsByDateQuery,
  useGetAllRiderInputComparisonByDateQuery,
  useUpdateRiderInputByAdminMutation,
  useGetRiderInputByRiderAndDateForAdminQuery,
  useCreateOrUpdateRiderInputByAdminMutation,
} = riderInputApiSlice;