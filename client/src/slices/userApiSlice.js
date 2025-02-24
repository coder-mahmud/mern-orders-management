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








    getUsers:builder.query({
      query:() => ({
        url:`${USERS_URL}/admin/users`,
        method: "GET" ,
        headers: {
          'Content-Type': 'application/json'
        },
      }),
      providesTags: ['User'],
    }),

    getUserById:builder.query({
      query:({id}) => ({
        url:`${USERS_URL}/admin/users/${id}`,
        method: "GET",
      }),
      providesTags: ['User'],
    }),

    getUserByEmail:builder.mutation({
      query:(data) => ({
        url:`${USERS_URL}/getUser`,
        method: "POST",
        body:data
      })
    }),

    queryUserByEmail:builder.query({
      query:({email}) => ({
        url:`${USERS_URL}/getuser/${email}`,
        method: "GET",
      }),
      providesTags: ['User'],
    }),

    editUserAdmin:builder.mutation({
      query:(data) => ({
        url:`${USERS_URL}/admin/useredit`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ['User', 'Notifications'],
    }),

    editUser:builder.mutation({
      query:(data) => ({
        url:`${USERS_URL}/edituser`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ['User','Notifications'],
    }),

    addFiletoUser:builder.mutation({
      query:(data) => ({
        url:`${USERS_URL}/addfile`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ['User'],
    }),
    
    removeFileFromUser:builder.mutation({
      query:(data) => ({
        url:`${USERS_URL}/removefile`,
        method: "POST",
        body:data
      }),
      invalidatesTags: ['User'],
    }),
    
    setUserPass:builder.mutation({
      query:(data) => ({
        url:`${USERS_URL}/setpassword`,
        method: "POST",
        body:data
      })
    }),

    reqPassChange:builder.mutation({
      query:(data) => ({
        url:`${USERS_URL}/reset-password`,
        method: "POST",
        body:data
      })
    }),

    setNewPass:builder.mutation({
      query:(data) => ({
        url:`${USERS_URL}/reset-password/${data.token}`,
        method: "POST",
        body:data
      })
    }),



  })
})


export const { useRegisterMutation,useLoginMutation, useVerifyMutation,useLogoutMutation, useResetPassReqMutation, useResetPassMutation } = userApiSlice;