import React from 'react'
import { Link } from 'react-router-dom'
import { useLogoutMutation  } from '../../slices/userApiSlice'
import { toast } from 'react-toastify'
import Loader from './Loader'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearCredential } from '../../slices/authSlice'
import Logo from '../../assets/images/PremiumLogo.svg'

const Header = () => {

  const [logout,{isLoading}] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const apiRes = await logout({}).unwrap();
      console.log("apiRes",apiRes);
      toast.success("Logout successful!");
      dispatch(clearCredential())

      navigate("/login");
    } catch (error) {
      toast.error("Something went wrong!");
    }
    
  }

  return (
    <div className=' bg-gray-800 text-white border-b border-gray-500'>
      <div className="container flex justify-between items-center py-3">
        <Link to="/"><img className='w-12' src={Logo} alt="" /></Link>
        <ul className='flex gap-2'>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><button onClick={logoutHandler} className='cursor-pointer'>Logout</button></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </div>
    </div>
  )
}

export default Header