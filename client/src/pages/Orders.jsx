import React,{useState} from 'react'
import DatePicker from "react-datepicker";
import { useGetAllOrdersByDateQuery } from '../slices/orderApiSclice';
import Loader from '../components/shared/Loader';
import dayjs from 'dayjs';


const Orders = () => {
  const [deliveryDate, setDeliveryDate] = useState(new Date());

  const {data, isLoading, isError, error} = useGetAllOrdersByDateQuery(dayjs(deliveryDate).format('YYYY-MM-DD'))

  if(isLoading){
    return <Loader />
  }

  if(isError){
    console.log("error:", error)
  }

  // console.log("data",data)

  const orders = data.orders;

  const pendingOrders = orders.filter(order => order.orderStatus == 'Pending')
  const deliveredOrders = orders.filter(order => order.orderStatus == 'Delivered')
  const cancelledOrders = orders.filter(order => order.orderStatus == 'Cancelled')
  // const totalBallRequired = orders.reduce((prev,cur) => prev.)

  const totalChickenBallQuantity = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Chicken Ball");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);

  const totalChickenNuggetsQuantity = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Chicken Nuggets");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);

  const totalChickenSausageQuantity = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Chicken Sausage");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);

  const totalChickenParotaQuantity = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Chicken Porota");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);


  const totalSupremeMayonnaiseQuantity = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Supreme Mayonnaise");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);


  const totalSalamiQuantity = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Salami");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);


  const totalSamuchaQuantity = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Samucha");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);

  const totalChickenMerinationQuantity = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Chicken Merination");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);

  const totalBurgerPettyQuantity = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Burger Petty");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);


  const totalSpringRollQuantity = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Spring Roll");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);

  const totalChickenChaapQuantity = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Chicken Chaap");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);


  const totalFriedChickenQuantity = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Fried Chicken");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);

  const totalMomoQuantity = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Momo");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);

  const totalKaragiChickenQuantity = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Karagi Chicken");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);


  const totalBotiKababQuantity = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Boti Kabab");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);



  const totalMojorellaCheeseQuantity = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Mojorella Cheese");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);

  const totalAtarRuti20piece = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Atar Ruti 20 piece");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);

  const totalAtarruti = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Atar ruti");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);

  const totalFrenchFry = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "French fry");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);





  return (
    <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
      <div className="container">

          <div className="flex gap-2 items-center mb-6">
            <p className='mb-2'>Date:</p>
            <DatePicker className='date_input mb-6 h-11 flex items-center border border-gray-500 rounded px-4' selected={deliveryDate} onChange={(date) => setDeliveryDate(date)} dateFormat="dd/MM/yyyy" />
          </div>

          {orders.length > 0 ? <>

          <div className="hubOrderInfo my-4 text-lg">
              <p className="section_title text-lg font-semibold">Total Orders Summary:</p>
              <p className=''>Total Orders : {orders.length}</p>
              {/* <p className=''>Total Bill : {orders.reduce((prev,cur) => prev + cur.finalPrice,0)}</p> */}
              
              <p className="t">Total Pending: {pendingOrders.length}</p>
              <p className="t">Total Delivered: {deliveredOrders.length}</p>
              <p className="t">Total Cancelled: {cancelledOrders.length}</p>
              
              <p className="section_title text-lg font-semibold mt-6">Orders Items:</p>
              {totalChickenBallQuantity > 0 ? <p class="mb-1">Chicken Ball: {totalChickenBallQuantity}</p> : ""}
              {totalChickenNuggetsQuantity > 0 ? <p class="mb-1">Chicken Nuggets: {totalChickenNuggetsQuantity}</p> : ""}
              {totalChickenSausageQuantity > 0 ? <p class="mb-1">Chicken Sausage: {totalChickenSausageQuantity}</p> : ""}
              {totalChickenParotaQuantity > 0 ? <p class="mb-1">Chicken Parota: {totalChickenParotaQuantity}</p> : ""}
              {totalSupremeMayonnaiseQuantity > 0 ? <p class="mb-1">Supreme Mayonnaise: {totalSupremeMayonnaiseQuantity}</p> : ""}
              {totalSalamiQuantity > 0 ? <p class="mb-1">Salami: {totalSalamiQuantity}</p> : ""}
              {totalSamuchaQuantity > 0 ? <p class="mb-1">Samucha: {totalSamuchaQuantity}</p> : ""}
              {totalChickenMerinationQuantity > 0 ? <p class="mb-1">Chicken Merination: {totalChickenMerinationQuantity}</p> : ""}
              {totalBurgerPettyQuantity > 0 ? <p class="mb-1">Burger Petty: {totalBurgerPettyQuantity}</p> : ""}
              {totalSpringRollQuantity > 0 ? <p class="mb-1">Spring Roll: {totalSpringRollQuantity}</p> : ""}
              {totalChickenChaapQuantity > 0 ? <p class="mb-1">Chicken Chaap: {totalChickenChaapQuantity}</p> : ""}
              {totalFriedChickenQuantity > 0 ? <p class="mb-1">Fried Chicken: {totalFriedChickenQuantity}</p> : ""}
              {totalMomoQuantity > 0 ? <p class="mb-1">Momo: {totalMomoQuantity}</p> : ""}
              {totalKaragiChickenQuantity > 0 ? <p class="mb-1">Karagi Chicken: {totalKaragiChickenQuantity}</p> : ""}
              {totalBotiKababQuantity > 0 ? <p class="mb-1">Boti Kabab: {totalBotiKababQuantity}</p> : ""}
              
              {totalMojorellaCheeseQuantity > 0 ? <p class="mb-1">Mojorella Cheese: {totalMojorellaCheeseQuantity}</p> : ""}

              {totalAtarRuti20piece > 0 ? <p class="mb-1">Atar Ruti 20 piece: {totalAtarRuti20piece}</p> : ""}

              {totalAtarruti > 0 ? <p class="mb-1">Atar ruti: {totalAtarruti}</p> : ""}

              {totalFrenchFry > 0 ? <p class="mb-1">French Fry: {totalFrenchFry}</p> : ""}

            </div>



          
          
          </> : "No order found for the date"}



      </div>
    </div>
  )
}

export default Orders