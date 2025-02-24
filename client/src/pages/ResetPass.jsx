import React, { useState,useEffect } from 'react'
import { useResetPassMutation } from '../slices/userApiSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from '../components/shared/Loader'
import { setCredentials } from '../slices/authSlice'
import Logo from '../assets/images/PremiumLogo.svg'
import Success from '../assets/images/Success.svg'



const ResetPass = () => {

  const {token} = useParams()
  
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [resetPass,{isLoading, isError, error}] = useResetPassMutation()
  
  
  
  useEffect(() => {
    console.log("Token", token);
    
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
    if(newPassword !== confirmNewPassword ){
      toast.error("New Password and Confirm New Password should be same!")
      return;
    }

    const data = {
      token,
      newPassword
    }
    try {
      const apiRes = await resetPass(data).unwrap();
      console.log("apiRes:", apiRes)
      setIsSuccess(true)
      toast.success("Password changed successfully!")
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
          
          <h1 className='text-center text-2xl'>Please enter your New Password below!</h1>
          
          <form action="" onSubmit={formHandler}>
            
            <div className="form_group flex flex-col gap-2 ">
              <label className='font-semibold' htmlFor="newpass">New Password:</label>
              <input className='bg-black focus:bg-black  active:bg-black border border-gray-500 focus:border-gray-500 active:border-gray-500  rounded py-2 px-4 outline-0 text-gray-200 appearance-none' type="password" id="newpass" placeholder='Enter new password...' value={newPassword} onChange ={e => setNewPassword(e.target.value)} required />
            </div>

            <div className="form_group flex flex-col gap-2 ">
              <label className='font-semibold' htmlFor="newpass2">Confirm New Password:</label>
              <input className='bg-black focus:bg-black  active:bg-black border border-gray-500 focus:border-gray-500 active:border-gray-500  rounded py-2 px-4 outline-0 text-gray-200 appearance-none' type="password" id="newpass2" placeholder='Confirm new password...' value={confirmNewPassword} onChange ={e => setConfirmNewPassword(e.target.value)} required />
            </div>           


            <button className='bg-gray-700 hover:bg-gray-500 rounded py-2 px-6 cursor-pointer text-white mt-4' type='submit'>Reset Password</button>


          </form>

          <div className="forget_pass text-center text-xs mt-6">
            <Link className='' to="/login">Back to Login</Link>.
          </div>

        </div>
        )}

        {isSuccess && (

        <div className="success">
          <img src={Success} className='w-24 block mx-auto mb-6' alt="" />
            <p className='text-center font-semibold'> Password Changed successfully!</p>

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

export default ResetPass