import { createSlice } from '@reduxjs/toolkit'


// const initialState = {
//   userInfo: {
//     email:''
//   },
// }

const initialState = {
  userInfo : localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
}


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials : (state,action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload))
    },
    clearCredential: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo')
    },
    
  },
})

export const {setCredentials, clearCredential} = authSlice.actions;
export default authSlice.reducer;