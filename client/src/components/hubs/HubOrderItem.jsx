import React from 'react'
import Loader from '../shared/Loader';

const HubOrderItem = ({order, users, index}) => {
  console.log("Order", order)
  console.log("users", users)

  const orderUser = users.filter(user => user._id == order.user )
  console.log("orderUser", orderUser)

  return (
    <div className='flex justify-between gap-4 py-4 border-b border-gray-500'>
      <p className='w-[50px]'>{index+1}.</p>
      <p className='flex-2'><span class="hidden">Customer Details:</span> {order.customerDetails}</p>
      <p className='flex-[.75]'><span class="hidden">Total Bill:</span> {order.finalPrice}</p>
      <p className='flex-[.75]'><span class="hidden">Status:</span> {order.orderStatus}</p>
      <p className='flex-1 flex justify-start'><span class="hidden">Created By:</span> {orderUser[0].firstName}</p>
      <p className='flex-[.75] flex justify-end'><span class="hidden">Action:</span> </p>

    </div>
  )
}

export default HubOrderItem