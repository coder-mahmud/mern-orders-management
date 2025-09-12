import apiSlice from "./apiSlice";

const ACTIVITY_URL = '/activity'

export const activityApiSlice = apiSlice.injectEndpoints({
  
  endpoints:(builder) =>({

    getAll: builder.query({
      query : () =>({
        url:`${ACTIVITY_URL}/`,
        method: "GET",
      })
    }),





    getAllUsers:builder.query({
      query:() => ({
        url:`${USERS_URL}/getall`,
        method: "GET" ,
        headers: {
          'Content-Type': 'application/json'
        },
      }),
      providesTags: ['User'],
    }),



  })
})


export const { useGetAllQuery } = activityApiSlice;