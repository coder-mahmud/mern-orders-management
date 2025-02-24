import React, { useState,useEffect } from 'react'
import { useResetPassReqMutation } from '../slices/userApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../components/shared/Loader'
import { setCredentials } from '../slices/authSlice'
import Logo from '../assets/images/PremiumLogo.svg'
import Success from '../assets/images/Success.svg'



const Forgot = () => {


  
  const [email, setEmail] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [resetPassReq,{isLoading, isError, error}] = useResetPassReqMutation()
  
  
  
  useEffect(() => {
    
  },[])



  if(isLoading){
    return <Loader/>
  }

  if(isError){
    console.log("Error", error)
    return 'Something went wrong!'
  }


  const formHandler = async (e) => {
    e.preventDefault();
  

    const data = {
      email
    }
    try {
      const apiRes = await resetPassReq(data).unwrap();
      console.log("apiRes:", apiRes)
      setIsSuccess(true)
      toast.success("Please check your email. Password reset link has been sent!")
    } catch (error) {
      console.log(error);
      toast.error(error.data.message)
    }
    
    
  }

  return (
    <>
    <div className='bg-gray-800 flex items-center justify-center text-white h-screen w-screen'>
      <div className="auth_inner max-w-[90%] lg:max-w-lg mx-auto border border-gray-500 rounded-lg p-6 w-full">
        {!isSuccess && (
        <div>
          <img src={Logo} className='w-24 block mx-auto mb-6' alt="" />
          
          <h1 className='text-center text-2xl'>Forgot Password? No worrries!</h1>
          <p className="text-center mt-2 mb-4">Please enter your email to reset password!</p>
          
          <form action="" onSubmit={formHandler}>
            
            <div className="form_group flex flex-col gap-2 ">
              <label className='font-semibold' htmlFor="userName">Email:</label>
              <input className='bg-black focus:bg-black  active:bg-black border border-gray-500 focus:border-gray-500 active:border-gray-500  rounded py-2 px-4 outline-0 text-gray-200 appearance-none' type="email" id="userName" placeholder='Enter user email...' value={email} onChange ={e => setEmail(e.target.value)} required />
            </div>           


            <button className='bg-gray-700 hover:bg-gray-500 rounded py-2 px-6 cursor-pointer text-white mt-4' type='submit'>Send reset link</button>


          </form>

          <div className="forget_pass text-center text-xs mt-6">
            <Link className='' to="/login">Back to Login</Link>.
          </div>

        </div>
        )}

        {isSuccess && (

        <div className="success">
          <img src={Success} className='w-24 block mx-auto mb-6' alt="" />
            <p className='text-center font-semibold'> A password reset link has been sent successfully to your email. Please your email inbox/spambox</p>

          <div className="forget_pass text-center text-xs mt-6">
            <Link className='' to="/login">Back to Login</Link>.
          </div>
        </div>
        )}

      </div>
    </div>


    

    </>
  )
}

export default Forgot