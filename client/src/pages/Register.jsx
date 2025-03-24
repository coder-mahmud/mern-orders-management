import React, { useState,useEffect } from 'react'
import { useRegisterMutation } from '../slices/userApiSlice'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import Loader from '../components/shared/Loader'
import { setCredentials } from '../slices/authSlice'
import Logo from '../assets/images/PremiumLogo.svg'
import { Link } from 'react-router-dom'


const Register = () => {


  
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register,{isLoading, isError, error}] = useRegisterMutation()
  
  
  
  useEffect(() => {
    
  },[])

  if(isLoading){
    return <Loader/>
  }



  const formHandler = async (e) => {
    e.preventDefault();
    
    if(!username || !password || !firstName || !lastName || !email){
      toast.error ("Please enter into all fields!");
      return;
    }

    const data = {
      username, password, firstName, lastName, email
    }
    try {
      const apiRes = await register(data).unwrap();
      console.log("apiRes:", apiRes)
      toast.success("Registration successful!")
      // dispatch(setCredentials(apiRes.user))
      navigate('/login');
    } catch (error) {
      console.log(error);
      toast.error(error.data.message)
      // toast.error("User already exists! Please try different username or email!")
    }
    
    
  }

  return (
    <div className='bg-gray-800  text-white h-screen w-screen overflow-y-auto py-20 block'>
      <div className="flex items-center justify-center">
        <div className="auth_inner max-w-[90%] lg:max-w-lg mx-auto border border-gray-500 rounded-lg p-6 w-full ">

          <img src={Logo} className='w-24 block mx-auto mb-6' alt="" />
          <h1 className='text-center text-2xl'>Welcome to Premium Chicken!</h1>
          <p className="text-center mt-2 mb-4">Please enter your details to register on the portal!</p>
          
          <form action="" onSubmit={formHandler}>
            
            <div className="form_group flex flex-col gap-2 ">
              <label className='font-semibold' htmlFor="firstName">First name:</label>
              <input className='bg-black focus:bg-black  active:bg-black border border-gray-500 focus:border-gray-500 active:border-gray-500  rounded py-2 px-4 outline-0 text-gray-200 appearance-none' type="text" id="firstName" placeholder='First name...' value={firstName} onChange ={e => setFirstName(e.target.value)} />
            </div>

            <div className="form_group mt-4 flex flex-col gap-2 ">
              <label className='font-semibold' htmlFor="lastName">Last name:</label>
              <input className='bg-black focus:bg-black  active:bg-black border border-gray-500 focus:border-gray-500 active:border-gray-500  rounded py-2 px-4 outline-0 text-gray-200 appearance-none' type="text" id="lastName" placeholder='Last name...' value={lastName} onChange ={e => setLastName(e.target.value)} />
            </div>           
            <div className="form_group mt-4 flex flex-col gap-2 ">
              <label className='font-semibold' htmlFor="userName">User name:</label>
              <input className='bg-black focus:bg-black  active:bg-black border border-gray-500 focus:border-gray-500 active:border-gray-500  rounded py-2 px-4 outline-0 text-gray-200 appearance-none' type="text" id="userName" placeholder='Enter user name...' value={username} onChange ={e => setUsername(e.target.value)} />
            </div>           


            <div className="form_group mt-4 flex flex-col gap-2 ">
              <label className='font-semibold' htmlFor="email">Email:</label>
              <input className='bg-black border border-gray-500 focus:border-gray-500 active:border-gray-500  rounded py-2 px-4 outline-0 text-gray-200' type="text" id="email" placeholder='Enter your email...' value={email} onChange ={e => setEmail(e.target.value)} />
            </div>

            <div className="form_group mt-4 flex flex-col gap-2 ">
              <label className='font-semibold' htmlFor="password">Password:</label>
              <input className='bg-black border border-gray-500 focus:border-gray-500 active:border-gray-500  rounded py-2 px-4 outline-0 text-gray-200' type="password" id="password" placeholder='Enter password...' value={password} onChange ={e => setPassword(e.target.value)} />
            </div>

            <button className='bg-gray-700 hover:bg-gray-500 rounded py-2 px-6 cursor-pointer text-white mt-4' type='submit'>Register</button>


          </form>

          <div className="text-center text-base mt-6">
            <Link className='text-blue-400' to="/login">Back to Login</Link>
          </div>


        </div>
      </div>
    </div>
  )
}

export default Register