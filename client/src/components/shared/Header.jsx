import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
    </>
  )
}

export default Header