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
import OrderDetails from './components/orders/OrderDetails'
import EditOrder from './components/orders/EditOrder'
import Orders from './pages/Orders'
import SubOrders from './pages/SubOrders'
import HubStock from './components/hubs/HubStock'
import RiderOrder from './pages/RiderReport'
import InternalReport from './pages/InternalReport'





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
            <Route path="internal-report" element={<InternalReport />} />
            <Route path="rider-report" element={<RiderOrder />} />
            <Route path="hubs/:id" element={<SingleHubDetails />} />
            <Route path="hubs/:id/stock" element={<HubStock />} />
            <Route path="products" element={<Products />} />
            <Route path="order/:id" element={<OrderDetails />} />
            <Route path="orders" element={<Orders />} />
            <Route path="sub-orders" element={<SubOrders />} />
            <Route path="order/edit/:id" element={<EditOrder />} />
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
