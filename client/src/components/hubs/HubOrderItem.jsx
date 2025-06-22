import React, { useState,useEffect,useRef } from 'react'
import Loader from '../shared/Loader';
import VerDots from '../../assets/images/ver-dots.svg'
import { Link } from 'react-router-dom';
import { useOrderStatusMutation, useDeleteOrderMutation, useOrderVerifyStatusMutation } from '../../slices/orderApiSclice';
import { toast } from 'react-toastify';
import Close from '../../assets/images/Close.svg'
import { useSelector } from 'react-redux';
import dayjs from 'dayjs'



const HubOrderItem = ({order, users, index}) => {
  // console.log("Order from HubOrderItem", order)
  // console.log("users", users)
  const userRole =  useSelector(state =>  state?.auth?.userInfo?.role);
  const curUser = useSelector(state =>  state?.auth?.userInfo?.id);

  const [showActions, setShowActions] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [showDelivered, setShowDelivered] = useState(false)
  const [showCancelled, setShowCancelled] = useState(false)
  const [showOffline, setShowOffline] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const now = dayjs();
  const formattedDateTime = now.format("DD-MM-YY HH:mm a"); // e.g. "2025-06-18 13:45"
  // console.log("formattedDateTime",formattedDateTime)

  const dialogRef = useRef(null)

  const orderUser = users.filter(user => user._id == order.user )
  // console.log("orderUser", orderUser)
  const [orderStatus, {isLoading} ] = useOrderStatusMutation()
  const [deleteOrder, {isLoading:deleteLoading}] = useDeleteOrderMutation()
  const [orderVerifyStatus, {isLoading:verifyLoading}] = useOrderVerifyStatusMutation();



  useEffect(() => {

    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showActions]);


  const showDeliveredHandler = () => {
    document.body.style.overflow = 'hidden'
    setShowActions(false)
    setShowDelivered(true)
  } 

  const showCancelledHandler = () => {
    document.body.style.overflow = 'hidden'
    setShowActions(false)
    setShowCancelled(true)
  }


  const showOfflineHandler = () => {
    document.body.style.overflow = 'hidden'
    setShowActions(false)
    setShowOffline(true)
  }


  const showDeleteHandler = () => {
    document.body.style.overflow = 'hidden'
    setShowActions(false)
    setShowDelete(true)
  }

  const modalCloseHandler = () => {
    document.body.style.overflow = 'auto'
    setShowDelivered(false)
    setShowCancelled(false)
    setShowDelete(false)
  }


  const deliveryHandler = async () => {
    setShowLoader(true)
    
    const data = {
      status:"Delivered",
      orderId:order._id,
      statusChangeTime:now,
      statusChangedBy:curUser
    }
    // console.log("data",data)
      
    try {
      const apiRes = await orderStatus(data).unwrap();
      console.log("apiRes", apiRes)
      toast.success("Order marked as Delivered!")
    } catch (error) {
      console.log("Error", error)
      toast.error("Something went wrong!")
    }finally{
      document.body.style.overflow = 'auto'
      setShowDelivered(false)
      setShowCancelled(false)
      setShowLoader(false)
    }
  }


  const cancelledHandler = async () => {
    setShowLoader(true)
    const data = {
      status:"Cancelled",
      orderId:order._id,
      statusChangeTime:now,
      statusChangedBy:curUser
    }
    // console.log("data",data)
    try {
      const apiRes = await orderStatus(data).unwrap();
      console.log("apiRes", apiRes)
      toast.success("Order marked as Cancelled!")
    } catch (error) {
      console.log("Error", error)
      toast.error("Something went wrong!")
    } finally {
      document.body.style.overflow = 'auto'
      setShowDelivered(false)
      setShowCancelled(false)
      setShowLoader(false)
    }
  }

  const offlineHandler = async () => {
    setShowLoader(true)
    const data = {
      status:"Offline Delivery",
      orderId:order._id,
      statusChangeTime:now,
      statusChangedBy:curUser
    }
    // console.log("data",data)
    try {
      const apiRes = await orderStatus(data).unwrap();
      console.log("apiRes", apiRes)
      toast.success("Order marked as Offline Delivery!")
    } catch (error) {
      console.log("Error", error)
      toast.error("Something went wrong!")
    } finally {
      document.body.style.overflow = 'auto'
      setShowDelivered(false)
      setShowOffline(false)
      setShowLoader(false)
    }
  }

  const verifiedHandler = async (verifyStatus) => {
    setShowLoader(true)
    const data = {
      verifyStatus,
      orderId:order._id,
      verifyTime:now,
      verifiedBy:curUser
    }
    console.log("verify data",data)
    try {
      const apiRes = await orderVerifyStatus(data).unwrap();
      console.log("apiRes", apiRes)
      toast.success(`Order marked as ${verifyStatus}.`)
    } catch (error) {
      console.log("Error", error)
      toast.error("Something went wrong!")
    } finally {
      setShowLoader(false)
      setShowActions(false)
    }
  }


  const deleteHandler = async () => {
    setShowLoader(true)
    const data = {
      orderId:order._id
    }
    // console.log("data",data)
    try {
      const apiRes = await deleteOrder(data).unwrap();
      console.log("Delete apiRes", apiRes)
      toast.success("Order DELETED successfully!")
    } catch (error) {
      console.log("Error", error)
      toast.error("Something went wrong!")
    } finally {
      document.body.style.overflow = 'auto'
      setShowDelivered(false)
      setShowCancelled(false)
      setShowDelete(false)
      setShowLoader(false)
    }
  }





  return (
    <div className='flex flex-col md:flex-row justify-between gap-4 py-4 border-b border-gray-500 lg:items-center '>
      {showLoader && <Loader />}
      <p className='w-[50px]'>{index+1}.</p>
      <p className='flex-2'><span className="inline-block md:hidden">Customer Details :</span> {order.customerDetails}</p>
      <p className='flex-[.75]'><span className="inline-block md:hidden">Total Bill :</span> {order.finalPrice}</p>
      <p className='flex-[.75]'><span className="inline-block md:hidden">Type : </span> {order.orderType}</p>
      <p className='flex-[.75]'>
        <span className="inline-block md:hidden">Status :</span> {order.orderStatus} {order.orderStatus !=='Pending' ? order?.statusChangedBy?.firstName + '-' + dayjs(order?.statusChangeTime).format("DD MMM, hh:mm a")  : ''}
      </p>
      <p className='flex-[.75]'><span className="inline-block md:hidden">Verified :</span> {order.verifyStatus}  { (order.verifyStatus == 'Verified' &&  order?.verifiedBy?.firstName) ? '-' + order?.verifiedBy?.firstName : ''} { order.verifyTime ? '-' + dayjs(order?.verifyTime).format("DD MMM, hh:mm a") : ''}</p>
      <p className='flex-1 flex justify-start'>
        <span className="inline-block md:hidden">Created By: &nbsp;</span>  {orderUser[0]?.firstName} - {  dayjs(order.createdAt).format("DD MMM, hh:mm a")}</p>
      <div ref={dialogRef} className='flex-[.75] flex justify-start md:justify-end relative items-center'>
        <span className="inline-block md:hidden">Actions:  </span>
        <img className='cursor-pointer' onClick={() => setShowActions(!showActions)} src={VerDots} alt="" />
        {showActions && (
          <div  className="action_links_wrap z-30 absolute right-20 md:right-10 -top-24 md:top-0  w-[200px] rounded bg-gray-500 py-4">
            <ul>
              <Link to={`/order/${order._id}`} className='border-b border-gray-700 py-2 px-4 text-center block'>View Details</Link>
              {(userRole !=='user' && userRole !=='userAdmin') &&  <Link to={`/order/edit/${order._id}`} className='block border-b border-gray-700 py-2 px-4 text-center cursor-pointer '>Edit Order</Link> }
              
              {order.orderStatus == 'Delivered' ? <li className='block border-b border-gray-700 py-2 px-4 text-center cursor-not-allowed'>Already Delivered</li> : <li onClick={showDeliveredHandler} className='block border-b border-gray-700 py-2 px-4 text-center cursor-pointer'>Mark as Delivered</li>}

              {order.orderStatus == 'Offline Delivery' ? <li className='block border-b border-gray-700 py-2 px-4 text-center cursor-not-allowed'>Already Offline Delivery</li> : <li onClick={showOfflineHandler} className='block border-b border-gray-700 py-2 px-4 text-center cursor-pointer'>Offline Delivery</li>}
              

              <li onClick={showCancelledHandler} className='block border-b border-gray-700 py-2 px-4 text-center cursor-pointer'>Mark as Cancelled</li>

              <li onClick={() => verifiedHandler('Verified')} className='block border-b border-gray-700 py-2 px-4 text-center cursor-pointer'>Mark as Verified</li>
              {/* <li onClick={() => verifiedHandler('Pending')} className='block border-b border-gray-700 py-2 px-4 text-center cursor-pointer'>Mark as Pending</li> */}
              <li onClick={() => verifiedHandler('Not Found')} className='block border-b border-gray-700 py-2 px-4 text-center cursor-pointer'>Mark as NOT Found</li>

              {(userRole !=='user' && userRole !=='userAdmin') &&  <li onClick={showDeleteHandler} className='block border-b border-gray-700 py-2 px-4 text-center cursor-pointer'>Delete Order</li> }
                            

              {/* {order.orderStatus == 'Pending' ? <>
                <Link to={`/order/edit/${order._id}`} className='block border-b border-gray-700 py-2 px-4 text-center cursor-pointer'>Edit Order</Link>
                <li onClick={showDeliveredHandler} className='block border-b border-gray-700 py-2 px-4 text-center cursor-pointer'>Mark as Delivered</li>
                <li onClick={showCancelledHandler} className='block border-b border-gray-700 py-2 px-4 text-center cursor-pointer'>Mark as Cancelled</li>
                <li onClick={showDeleteHandler} className='block border-b border-gray-700 py-2 px-4 text-center cursor-pointer'>Delete Order</li>
              </> : ""} */}
              
            </ul>
          </div>
        )}
        
      </div>

      { showDelivered && (
        <div className="modal fixed top-0 left-0 w-screen h-screen z-20  backdrop-blur-xs block pt-20 lg:pt-[150px] pb-24 overflow-auto">
          <div className="flex justify-center items-center">
            <div className="modal_inner w-3xl max-w-[90%] bg-green-600  text-white relative p-10 rounded">
              <img onClick={modalCloseHandler}  className='absolute w-12 cursor-pointer -top-14 right-0' src={Close} alt="" />
              <h2 className='text-green text-xl'>Do you want to make this order as "Delivered"? Be careful, you can't undo this action.</h2>
              <div className="cta_wrap flex gap-6 my-6">
                <button onClick={deliveryHandler} className='cursor-pointer  bg-black p-4 rounded '>Yes, mark as Delivered</button>
                <button onClick={modalCloseHandler} className='cursor-pointer  bg-black p-4 rounded '>Cancel</button>
              </div>

            </div>
          </div>

        </div>


      )}


      { showCancelled && (
        <div className="modal fixed top-0 left-0 w-screen h-screen z-20  backdrop-blur-xs block pt-20 lg:pt-[150px] pb-24 overflow-auto">
          <div className="flex justify-center items-center">
            <div className="modal_inner w-3xl max-w-[90%] bg-yellow-600  text-white relative p-10 rounded">
              <img onClick={modalCloseHandler}  className='absolute w-12 cursor-pointer -top-14 right-0' src={Close} alt="" />
              <h2 className='text-green text-xl'>Do you want to make this order as "Cancelled"? Be careful, you can't undo this action.</h2>
              <div className="cta_wrap flex gap-6 my-6">
                <button onClick={cancelledHandler} className='cursor-pointer  bg-black p-4 rounded '>Yes, mark as Cancelled</button>
                <button onClick={modalCloseHandler} className='cursor-pointer  bg-black p-4 rounded '>Cancel</button>
              </div>

            </div>
          </div>

        </div>


      )}

      { showOffline && (
        <div className="modal fixed top-0 left-0 w-screen h-screen z-20  backdrop-blur-xs block pt-20 lg:pt-[150px] pb-24 overflow-auto">
          <div className="flex justify-center items-center">
            <div className="modal_inner w-3xl max-w-[90%] bg-yellow-600  text-white relative p-10 rounded">
              <img onClick={modalCloseHandler}  className='absolute w-12 cursor-pointer -top-14 right-0' src={Close} alt="" />
              <h2 className='text-green text-xl'>Do you want to make this order as "Offline Delivery"?</h2>
              <div className="cta_wrap flex gap-6 my-6">
                <button onClick={offlineHandler} className='cursor-pointer  bg-black p-4 rounded '>Yes, mark as Offline Delivery</button>
                <button onClick={modalCloseHandler} className='cursor-pointer  bg-black p-4 rounded '>Cancel</button>
              </div>

            </div>
          </div>

        </div>


      )}


      { showDelete && (
        <div className="modal fixed top-0 left-0 w-screen h-screen z-20  backdrop-blur-xs block pt-20 lg:pt-[150px] pb-24 overflow-auto">
          <div className="flex justify-center items-center">
            <div className="modal_inner w-3xl max-w-[90%] bg-red-600  text-white relative p-10 rounded">
              <img onClick={modalCloseHandler}  className='absolute w-12 cursor-pointer -top-14 right-0' src={Close} alt="" />
              <h2 className='text-green text-xl'>Do you want to DELETE this order? Be careful, you can't undo this action.</h2>
              <div className="cta_wrap flex gap-6 my-6">
                <button onClick={deleteHandler} className='cursor-pointer  bg-black p-4 rounded '>Yes, DELETE</button>
                <button onClick={modalCloseHandler} className='cursor-pointer  bg-black p-4 rounded '>Cancel</button>
              </div>

            </div>
          </div>

        </div>


      )}

    </div>
  )
}

export default HubOrderItem