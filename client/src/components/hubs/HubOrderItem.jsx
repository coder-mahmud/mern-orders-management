import React, { useState,useEffect,useRef } from 'react'
import Loader from '../shared/Loader';
import VerDots from '../../assets/images/ver-dots.svg'
import { Link } from 'react-router-dom';
import { useOrderStatusMutation } from '../../slices/orderApiSclice';
import { toast } from 'react-toastify';
import Close from '../../assets/images/Close.svg'




const HubOrderItem = ({order, users, index}) => {
  // console.log("Order", order)
  // console.log("users", users)

  const [showActions, setShowActions] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const [showDelivered, setShowDelivered] = useState(false)
  const [showCancelled, setShowCancelled] = useState(false)




  const dialogRef = useRef(null)

  const orderUser = users.filter(user => user._id == order.user )
  // console.log("orderUser", orderUser)
  const [orderStatus, {isLoading} ] = useOrderStatusMutation()



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

  const modalCloseHandler = () => {
    document.body.style.overflow = 'auto'
    setShowDelivered(false)
    setShowCancelled(false)
  }


  const deliveryHandler = async () => {
    setShowLoader(true)
    
    const data = {
      status:"Delivered",
      orderId:order._id
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
      orderId:order._id
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



  return (
    <div className='flex justify-between gap-4 py-4 border-b border-gray-500'>
      {showLoader && <Loader />}
      <p className='w-[50px]'>{index+1}.</p>
      <p className='flex-2'><span className="hidden">Customer Details:</span> {order.customerDetails}</p>
      <p className='flex-[.75]'><span className="hidden">Total Bill:</span> {order.finalPrice}</p>
      <p className='flex-[.75]'><span className="hidden">Status:</span> {order.orderStatus}</p>
      <p className='flex-1 flex justify-start'><span className="hidden">Created By:</span> {orderUser[0].firstName}</p>
      <div ref={dialogRef} className='flex-[.75] flex justify-end relative'>
        <span className="hidden">Action:</span>
        <img className='cursor-pointer' onClick={() => setShowActions(!showActions)} src={VerDots} alt="" />
        {showActions && (
          <div  className="action_links_wrap z-30 absolute right-10 top-0 w-[200px] rounded bg-gray-500 py-4">
            <ul>
              <Link to={`/order/${order._id}`} className='border-b border-gray-700 py-2 px-4 text-center block'>Vied Details</Link>
              

              {order.orderStatus == 'Pending' ? <>
                <Link to={`/order/edit/${order._id}`} className='block border-b border-gray-700 py-2 px-4 text-center cursor-pointer'>Edit Order</Link>
                <li onClick={showDeliveredHandler} className='block border-b border-gray-700 py-2 px-4 text-center cursor-pointer'>Mark as Delivered</li>
                <li onClick={showCancelledHandler} className='block border-b border-gray-700 py-2 px-4 text-center cursor-pointer'>Mark as Cancelled</li>
              </> : ""}
              
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
            <div className="modal_inner w-3xl max-w-[90%] bg-red-600  text-white relative p-10 rounded">
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

    </div>
  )
}

export default HubOrderItem