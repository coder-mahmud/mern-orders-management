import React,{useEffect, useState} from 'react'
import { Outlet, Link,useNavigate } from "react-router-dom";
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import { useSelector } from 'react-redux';
import verifyUser from '../utils/verifyUser';
import { useVerifyMutation } from "../slices/userApiSlice";
import Loader from '../components/shared/Loader';
import { toast } from 'react-toastify';


const Layout = () => {

  const [appLoading, setAppLoading] = useState(false)


  const userEmail = useSelector(state => state.auth?.userInfo?.email)
  // console.log("userEmail", userEmail)
  const [verify,{isLoading, isError, error}] = useVerifyMutation();
  const navigate = useNavigate();


  useEffect(() => {
    const verifyUser = async () => {
      setAppLoading(true)
      try {
        const apiRes =  await verify({email:userEmail}).unwrap();
        // console.log("apiRes",apiRes)
      } catch (error) {
        console.log(error.data.message)
        navigate('/login')
      }finally{
        setAppLoading(false)
      }
      
    }

    verifyUser();
    

  },[])

  if(appLoading){
    return <Loader />
  }
  
  return (
   <>
    <Header />
    <Outlet /> 
    <Footer />
   </>
  )

}

export default Layout