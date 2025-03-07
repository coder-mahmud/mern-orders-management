import apiSlice from "./apiSlice";

const HUB_URL = '/hub'

export const userApiSlice = apiSlice.injectEndpoints({
  
  endpoints:(builder) =>({

    createHub: builder.mutation({
      query : (data) =>({
        url:`${HUB_URL}/`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ['Hub'],
    }),

    getAllHub: builder.query({
      query : () =>({
        url:`${HUB_URL}/`,
        method: "GET",
      }),
      providesTags: ['Hub'],
      // invalidatesTags: ['Product'],
    }),

    getHubById: builder.query({
      query : (id) =>({
        url:`${HUB_URL}/${id}`,
        method: "GET",
      }),
      providesTags: ['Hub'],
      // invalidatesTags: ['Product'],
    }),





  })
})


export const { useCreateHubMutation, useGetAllHubQuery, useGetHubByIdQuery } = userApiSlice;