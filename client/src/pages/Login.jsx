import React, { useState,useEffect } from 'react'
import { useLoginMutation } from '../slices/userApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../components/shared/Loader'
import { setCredentials } from '../slices/authSlice'
import Logo from '../assets/images/PremiumLogo.svg'



const Login = () => {

  const userEmail = useSelector(state => state.auth?.userInfo?.email);
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login,{isLoading, isError, error}] = useLoginMutation()
  
  
  
  useEffect(() => {
    if(userEmail){
      navigate('/')
    }
  },[userEmail])

  if(isLoading){
    return <Loader/>
  }

  if(isError){
    console.log("Error", error)
    //return 'Something went wrong!'
    
  }


  const formHandler = async (e) => {
    e.preventDefault();
    
    if(!username || !password){
      toast.warn ("Please write both username and password");
      return;
    }

    const data = {
      username, password
    }
    try {
      const apiRes = await login(data).unwrap();
      console.log("apiRes:", apiRes)
      toast.success("Login successful!")
      dispatch(setCredentials(apiRes))
      navigate('/');
    } catch (error) {
      console.log(error);
      toast.error(error.data.message)
    }
    
    
  }

  return (
    <div className='bg-gray-800 flex items-center justify-center text-white h-screen w-screen'>
      <div className="auth_inner max-w-[90%] lg:max-w-lg mx-auto border border-gray-500 rounded-lg p-6 w-full">
        
        <img src={Logo} className='w-24 block mx-auto mb-6' alt="" />
        <h1 className='text-center text-2xl'>Welcome champ!</h1>
        <p className="text-center mt-2 mb-4">Please enter your details to login!</p>
        
        <form action="" onSubmit={formHandler}>
          
          <div className="form_group flex flex-col gap-2 ">
            <label className='font-semibold' htmlFor="userName">User name:</label>
            <input className='bg-black focus:bg-black  active:bg-black border border-gray-500 focus:border-gray-500 active:border-gray-500  rounded py-2 px-4 outline-0 text-gray-200 appearance-none' type="text" id="userName" placeholder='Enter user name...' value={username} onChange ={e => setUsername(e.target.value)} />
          </div>           


          <div className="form_group mt-4 flex flex-col gap-2 ">
            <label className='font-semibold' htmlFor="password">Password:</label>
            <input className='bg-black border border-gray-500 focus:border-gray-500 active:border-gray-500  rounded py-2 px-4 outline-0 text-gray-200' type="password" id="password" placeholder='Enter password...' value={password} onChange ={e => setPassword(e.target.value)} />
          </div>

          <button className='bg-gray-700 hover:bg-gray-500 rounded py-2 px-6 cursor-pointer text-white mt-4' type='submit'>Login</button>


        </form>

        <div className="forget_pass text-center text-xs mt-6">
          Forgot Password? Click <Link className='text-blue-400' to="/forgot">here</Link>  to reset.
        </div>
      </div>
    </div>
  )
}

export default Login