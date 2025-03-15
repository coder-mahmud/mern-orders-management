import apiSlice from "./apiSlice";

const USERS_URL = '/user'

export const userApiSlice = apiSlice.injectEndpoints({
  
  endpoints:(builder) =>({

    register: builder.mutation({
      query : (data) =>({
        url:`${USERS_URL}/`,
        method: "POST",
        body:data
      })
    }),

    login:builder.mutation({
      query:(data) => ({
        url:`${USERS_URL}/login`,
        method: "POST",
        body:data
      })
    }),

    verify:builder.mutation({
      query:(data) => ({
        url:`${USERS_URL}/verify`,
        method: "POST",
        body:data
      })
    }),

    logout:builder.mutation({
      query:(data) => ({
        url:`${USERS_URL}/logout`,
        method: "POST",
        body:data
      })
    }),

    resetPassReq:builder.mutation({
      query:(data) => ({
        url:`${USERS_URL}/reqpass`,
        method: "POST",
        body:data
      })
    }),

    resetPass:builder.mutation({
      query:(data) => ({
        url:`${USERS_URL}/resetpass/${data.token}`,
        method: "POST",
        body:data
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


export const { useRegisterMutation,useLoginMutation, useVerifyMutation,useLogoutMutation, useResetPassReqMutation, useResetPassMutation, useGetAllUsersQuery } = userApiSlice;