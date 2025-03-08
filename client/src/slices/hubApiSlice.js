import apiSlice from "./apiSlice";

const HUB_URL = '/hub'

export const hubApiSlice = apiSlice.injectEndpoints({
  
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

    addProductToHub: builder.mutation({
      query : (data) =>({
        url:`${HUB_URL}/${data.id}/addproduct`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ['Hub'],
    }),

    editHub: builder.mutation({
      query : (data) =>({
        url:`${HUB_URL}/edit`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ['Hub'],
    }),

     





  })
})


export const { useCreateHubMutation, useGetAllHubQuery, useGetHubByIdQuery, useAddProductToHubMutation, useEditHubMutation } = hubApiSlice;