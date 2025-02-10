import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Layout from './pages/Layout'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

//import pages
import Home from './pages/Home'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'

function App() {


  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
