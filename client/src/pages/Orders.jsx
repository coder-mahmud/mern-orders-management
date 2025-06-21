import React,{useState} from 'react'
import DatePicker from "react-datepicker";
import { useGetAllOrdersByDateQuery } from '../slices/orderApiSclice';
import Loader from '../components/shared/Loader';
import dayjs from 'dayjs';
import { useGetAllProductQuery } from '../slices/productApiSlice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


const Orders = () => {
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const userRole =  useSelector(state =>  state?.auth?.userInfo?.role);

  const [hubType, setHubType] = useState('insideDhaka')


  const {data, isLoading, isError, error} = useGetAllOrdersByDateQuery(dayjs(deliveryDate).format('YYYY-MM-DD'))
  const {data:productData, isLoading:isProductLoading} = useGetAllProductQuery()

  if(isLoading || isProductLoading){
    return <Loader />
  }

  if(isError){
    console.log("error:", error)
  }

  console.log("Orders data",data)

  const insidOrders = data.orders.filter(order => order.hub.type == 'insideDhaka')

  const orders = insidOrders;

  const pendingOrders = orders.filter(order => order.orderStatus == 'Pending')
  const deliveredOrders = orders.filter(order => order.orderStatus == 'Delivered')
  const cancelledOrders = orders.filter(order => order.orderStatus == 'Cancelled')
  const offlineOrders = orders.filter(order => order.orderStatus == 'Offline Delivery')
  // const totalBallRequired = orders.reduce((prev,cur) => prev.)

  const getItemPrice = (itemName) => {
    const prodItem =  productData.products.filter(product => product.name == itemName  )[0];
    if(prodItem) return prodItem.price;
    return 0;
 }

 let ballPrice = getItemPrice('Chicken Ball');
 let nuggetsPrice = getItemPrice('Chicken Nuggets');
 let sausagePrice = getItemPrice('Chicken Sausage');
 let porotaPrice = getItemPrice('Chicken Porota');
 let mayonnaisePrice = getItemPrice('Supreme Mayonnaise');
 let salamiPrice = getItemPrice('Salami');
 let samuchaPrice = getItemPrice('Samucha');
 let merinationPrice = getItemPrice('Chicken Merination');
 let burgerPettyPrice = getItemPrice('Burger Petty');
 let springRollPrice = getItemPrice('Spring Roll');
 let chickenChaapPrice = getItemPrice('Chicken Chaap');
 let friedChickenPrice = getItemPrice('Fried Chicken');
 let momoPrice = getItemPrice('Momo');
 let karagiChickenPrice = getItemPrice('Karagi Chicken');
 let botiKababPrice = getItemPrice('Boti Kabab');
 let mojorellaCheesePrice = getItemPrice('Mojorella Cheese');
 let rutiPrice = getItemPrice('Atar ruti');
 let frenchFryPrice = getItemPrice('French fry');
 let pizzaSaucePrice = getItemPrice('Pizza Sauce');
 let cheeseBallPrice = getItemPrice('Cheese ball');
 let chickenPopcornPrice = getItemPrice('Chicken popcorn');
 let chickenStripesPrice = getItemPrice('Chicken stripes');







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

  const totalPizzaSauce = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Pizza Sauce");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);

  const totalCheeseBall = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Cheese ball");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);
  const totalChickenPopcorn = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Chicken popcorn");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);
  const totalChickenStripes = orders.reduce((total, order) => {
    const chickenBallItem = order.orderItems.find(item => item.name === "Chicken stripes");
    return total + (chickenBallItem ? chickenBallItem.quantity : 0);
  }, 0);






  const totalOrderedItems = totalChickenBallQuantity + totalChickenNuggetsQuantity + totalChickenSausageQuantity + totalChickenParotaQuantity + totalSupremeMayonnaiseQuantity + totalSalamiQuantity + totalSamuchaQuantity + totalChickenMerinationQuantity + totalBurgerPettyQuantity + totalSpringRollQuantity +  totalChickenChaapQuantity + totalFriedChickenQuantity + totalMomoQuantity + totalKaragiChickenQuantity +  totalBotiKababQuantity + totalMojorellaCheeseQuantity + totalAtarruti + totalFrenchFry + totalPizzaSauce + totalCheeseBall + totalChickenPopcorn + totalChickenStripes; 

  const totalOrderedPrice = totalChickenBallQuantity * ballPrice  + totalChickenNuggetsQuantity *  nuggetsPrice + totalChickenSausageQuantity * sausagePrice  + totalChickenParotaQuantity * porotaPrice  + totalSupremeMayonnaiseQuantity * mayonnaisePrice  + totalSalamiQuantity * salamiPrice  + totalSamuchaQuantity * samuchaPrice  + totalChickenMerinationQuantity * merinationPrice + totalBurgerPettyQuantity * burgerPettyPrice  + totalSpringRollQuantity * springRollPrice  +  totalChickenChaapQuantity * chickenChaapPrice  + totalFriedChickenQuantity * friedChickenPrice  + totalMomoQuantity * momoPrice  + totalKaragiChickenQuantity * karagiChickenPrice +  totalBotiKababQuantity * botiKababPrice + totalMojorellaCheeseQuantity * mojorellaCheesePrice + totalAtarruti * rutiPrice + totalFrenchFry * frenchFryPrice + totalPizzaSauce * pizzaSaucePrice + totalCheeseBall * cheeseBallPrice + totalChickenPopcorn * chickenPopcornPrice + totalChickenStripes * chickenStripesPrice ;

  const getDeliveryCharge = (orders) => {
    return orders.reduce((prev, cur) => prev + cur.deliveryCharge ,0)
  };

  const totalOrderDeliveryCharge = getDeliveryCharge(orders);


  return (
    <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
      <div className="container">

          <div className="flex gap-2 items-center mb-6">
            <p className='mb-2'>Date:</p>
            <DatePicker className='date_input mb-6 h-11 flex items-center border border-gray-500 rounded px-4' selected={deliveryDate} onChange={(date) => setDeliveryDate(date)} dateFormat="dd/MM/yyyy" />
          </div>

          {orders.length > 0 ? <>

          <div className="hubOrderInfo my-4 text-lg">

            <div className="hubTypeSwitch mb-10">
              {hubType == 'insideDhaka' ? <Link to="/sub-orders" className="rounded px-6 py-2 bg-amber-700 hover:bg-amber-800 cursor-pointer font-semibold">Show Sub Dhaka</Link> : <button className="rounded px-6 py-2 bg-amber-700 hover:bg-amber-800 cursor-pointer font-semibold">Show Inside Dhaka</button> }
            </div>



              <p className="section_title text-xl font-bold mb-2">Inside Dhaka:</p>
              <p className="section_title text-lg font-semibold">Total Orders Summary:</p>
              
              <p className=''>Total Orders : {orders.length}</p>
              {/* <p className=''>Total Bill : {orders.reduce((prev,cur) => prev + cur.finalPrice,0)}</p> */}
              
              <p className="t">Total Pending: {pendingOrders.length}</p>
              <p className="t">Total Delivered: {deliveredOrders.length}</p>
              <p className="t">Offline Delivery: {offlineOrders.length}</p>
              <p className="t">Total Cancelled: {cancelledOrders.length}</p>
              
              <p className="section_title text-lg font-semibold mt-6">Orders Items:</p>
              {totalChickenBallQuantity > 0 ? <p className="mb-1">Chicken Ball: {totalChickenBallQuantity}</p> : ""}
              {totalChickenNuggetsQuantity > 0 ? <p className="mb-1">Chicken Nuggets: {totalChickenNuggetsQuantity}</p> : ""}
              {totalChickenSausageQuantity > 0 ? <p className="mb-1">Chicken Sausage: {totalChickenSausageQuantity}</p> : ""}
              {totalChickenParotaQuantity > 0 ? <p className="mb-1">Chicken Parota: {totalChickenParotaQuantity}</p> : ""}
              {totalSupremeMayonnaiseQuantity > 0 ? <p className="mb-1">Supreme Mayonnaise: {totalSupremeMayonnaiseQuantity}</p> : ""}
              {totalSalamiQuantity > 0 ? <p className="mb-1">Salami: {totalSalamiQuantity}</p> : ""}
              {totalSamuchaQuantity > 0 ? <p className="mb-1">Samucha: {totalSamuchaQuantity}</p> : ""}
              {totalChickenMerinationQuantity > 0 ? <p className="mb-1">Chicken Merination: {totalChickenMerinationQuantity}</p> : ""}
              {totalBurgerPettyQuantity > 0 ? <p className="mb-1">Burger Petty: {totalBurgerPettyQuantity}</p> : ""}
              {totalSpringRollQuantity > 0 ? <p className="mb-1">Spring Roll: {totalSpringRollQuantity}</p> : ""}
              {totalChickenChaapQuantity > 0 ? <p className="mb-1">Chicken Chaap: {totalChickenChaapQuantity}</p> : ""}
              {totalFriedChickenQuantity > 0 ? <p className="mb-1">Fried Chicken: {totalFriedChickenQuantity}</p> : ""}
              {totalMomoQuantity > 0 ? <p className="mb-1">Momo: {totalMomoQuantity}</p> : ""}
              {totalKaragiChickenQuantity > 0 ? <p className="mb-1">Karagi Chicken: {totalKaragiChickenQuantity}</p> : ""}
              {totalBotiKababQuantity > 0 ? <p className="mb-1">Boti Kabab: {totalBotiKababQuantity}</p> : ""}
              
              {totalMojorellaCheeseQuantity > 0 ? <p className="mb-1">Mojorella Cheese: {totalMojorellaCheeseQuantity}</p> : ""}

              {totalAtarRuti20piece > 0 ? <p className="mb-1">Atar Ruti 20 piece: {totalAtarRuti20piece}</p> : ""}

              {totalAtarruti > 0 ? <p className="mb-1">Atar ruti: {totalAtarruti}</p> : ""}

              {totalFrenchFry > 0 ? <p className="mb-1">French Fry: {totalFrenchFry}</p> : ""}
              {totalPizzaSauce > 0 ? <p className="mb-1">Pizza Sauce: {totalPizzaSauce}</p> : ""}
              {totalCheeseBall > 0 ? <p className="mb-1">Cheese Ball: {totalCheeseBall}</p> : ""}
              {totalChickenPopcorn > 0 ? <p className="mb-1">Chicken popcorn: {totalChickenPopcorn}</p> : ""}
              {totalChickenStripes > 0 ? <p className="mb-1">Chicken stripes: {totalChickenStripes}</p> : ""}

              <div className='mt-4 '>
                {userRole == 'admin' || userRole == 'superAdmin' ? <p>Total Ordered Items: {totalOrderedItems} kg</p> : ""}
                {userRole == 'admin' || userRole == 'superAdmin' ? <p>Total Ordered Price: {totalOrderedPrice}</p> : ""}
                {userRole == 'admin' || userRole == 'superAdmin' ? <p>Total Delivery Charge: {totalOrderDeliveryCharge}</p> : ""}
              </div>



            </div>



          
          
          </> : "No order found for the date"}



      </div>
    </div>
  )
}

export default Orders