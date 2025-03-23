import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetOrderByIdQuery } from '../../slices/orderApiSclice';
import Loader from '../shared/Loader';
import { useGetHubByIdQuery } from '../../slices/hubApiSlice';



const OrderDetails = () => {

  const {id} = useParams();
  // console.log("Order Id:", id)

  const {data, isLoading} = useGetOrderByIdQuery(id);

  if(isLoading){
    return <Loader />
  }

  console.log("order data",data)
  const order = data.order;


  return (
    <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
        
      <div className="container">
        <h1 className="text-xl font-semibold">Order Details:</h1>
        <div className='flex flex-col gap-4'>
          <p>Customer info: {order.customerDetails}</p>
          {/* <p>Hub: {order.hub}</p> */}
          
          <p>Status: {order.orderStatus}</p>
          <p>Items: </p>
          <div>
            {order.orderItems.map(item => <li key={item.productId}>{item.name} - {item.quantity}kg - {item.totalPrice}tk</li>)}
          </div>
          <p>Delivery Charge: {order.deliveryCharge}</p>
          <p>Bill: {order.finalPrice}</p>
          
        </div>



      </div>
    </div>
  )
}

export default OrderDetails