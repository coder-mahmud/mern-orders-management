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
import Hubs from './pages/Hubs'
import Forgot from './pages/Forgot'
import ResetPass from './pages/ResetPass'
import Products from './pages/Products'
import SingleHubDetails from './components/hubs/SingleHubDetails'

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
            <Route path="hubs" element={<Hubs />} />
            <Route path="hubs/:id" element={<SingleHubDetails />} />
            <Route path="products" element={<Products />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset-password/:token" element={<ResetPass />} />

          


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
