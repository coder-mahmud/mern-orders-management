import React, { useState, useEffect } from 'react'
import { useGetAllProductQuery } from '../slices/productApiSlice';
import { useGetAllHubQuery } from '../slices/hubApiSlice';
import Loader from '../components/shared/Loader';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs'
import Close from '../assets/images/Close.svg'
import Button from '../components/Button';
import { useSelector } from 'react-redux';
import { useCreateOrderMutation } from '../slices/orderApiSclice';
import {toast} from 'react-toastify'






const Home = () => {

  const userName = useSelector(state =>  state.auth.userInfo.name);
  const userId = useSelector(state =>  state.auth.userInfo.id);

  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Add 1 day
    return tomorrow;
  };

  const [ showLoader, setShowLoader ] = useState(false)
  const [customerDetails, setCustomerDetails] = useState();
  const [hub, setHub] = useState();
  const [selectedHub, setSelectedHub] = useState();
  const [deliveryCharge, setDeliveryCharge] = useState(70);
  const [deliveryDate, setDeliveryDate] = useState(getTomorrow());
  const [selectedProducts, setSelectedProducts] = useState([]);
  // const [orderDetails, setOrderDetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [orderPrice, setOrderPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);




  const {data, isLoading } = useGetAllProductQuery()
  const {data:hubData, isLoading:isHubLoading } = useGetAllHubQuery()
  const [createOrder,{isLoading:isOrderLoading, isError}] = useCreateOrderMutation()

  useEffect(() => {

    setOrderPrice(selectedProducts.reduce((prev, cur) => prev + cur.totalPrice, 0));
    setFinalPrice(orderPrice - discount +deliveryCharge)
    if(!isHubLoading){
      setSelectedHub ( hubData.hubs.filter(hubItem => hubItem._id == hub))
    }
    
  }, [isHubLoading, selectedProducts,orderPrice, discount, hub, deliveryCharge]); 



  if(isLoading || isHubLoading ){
    return <Loader />
  }

  // console.log('Data', data)
  // console.log('hubData', hubData)

  

  const handleCheckboxChange = (e,productName,price) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setSelectedProducts([...selectedProducts, {name:productName, productId:value, quantity:1, price, totalPrice:(1 * price)}])
    } else {
      setSelectedProducts(selectedProducts.filter(item => item.productId !== value ));
    }
  };


  const showOverviewHandler = (e) => {
    e.preventDefault();
    // console.log("Overview hitted!");
    // console.log("Selected Proudcts", selectedProducts)
    // console.log("selectedHub", selectedHub)
    document.body.style.overflow = 'hidden'
    setShowModal(true)
  }

  const closeModalHandler = () => {
    document.body.style.overflow = 'auto'
    setShowModal(false)
  }

  const handleQuantityChange = (productId, newQuantity) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.productId === productId
          ? { ...product, quantity: newQuantity, totalPrice: (newQuantity * product.price) }
          : product
      )
    );
  };

  const confirmOrderHandler = async () => {
    setShowLoader(true)
    console.log("Confirm clicked!")
    console.log("Products", selectedProducts)
    console.log("orderPrice", orderPrice)
    console.log("finalPrice", finalPrice)
    console.log("discount", discount)
    console.log("deliveryDate", deliveryDate)

    const data = {
      orderItems:selectedProducts,
      customerDetails,
      orderPrice,
      deliveryCharge,
      discount,
      finalPrice,
      // deliveryDate: dayjs(deliveryDate).format('DD-MM-YYYY'),
      deliveryDate: deliveryDate,
      user: userId,
      hub,
    }

    console.log("data",data)

    try {
      const apiRes = await createOrder(data).unwrap();
      console.log(apiRes)
      toast.success("Order created!")
      

    } catch (error) {
      console.log("error: ",error)
      toast.error('Failed, please try again.')
    }finally{
      setShowLoader(false)
      setShowModal(false)
      setCustomerDetails('')
      setHub('')
      setSelectedHub('')
      setDeliveryCharge(70)
      setDeliveryDate()
      setSelectedProducts([])
      setOrderPrice(0)
      setDiscount(0)
      setFinalPrice(0)
      document.body.style.overflow= 'auto'





    }
  }

 

  return (
    <>

      { showLoader && <Loader /> }
      
      <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
        <div className="container">
          <h1 className='text-xl font-semibold mb-6'>Create Order:</h1>
          
          <form onSubmit={showOverviewHandler} action="">
            
            <div className="form_row flex flex-col gap-2 mb-6">
              <label htmlFor="">Customer Details:</label>
              <textarea type="text" placeholder='Customer Details:' className='border rounded border-gray-500 py-3 px-4' value={customerDetails} onChange = {(e) => setCustomerDetails(e.target.value)} />
            </div>            

            <div className="form_row flex flex-col gap-2 mb-6">
              <label htmlFor="">Select Hub:</label>
              <select className='border rounded border-gray-500 h-11 flex items-center px-4 ' name="" id="" value={hub} onChange = {(e) => setHub(e.target.value)}>
                <option value="">Select one:</option>
                {hubData.hubs.map(hub => <option key={hub._id} value={hub._id}>{hub.name}</option>)}
               
              </select>
            </div>

            <div className="form_row flex flex-col gap-2 mb-6">
              <label htmlFor="">Delivery Charge:</label>
              <select className='border rounded border-gray-500 h-11 flex items-center px-4 ' name="" id="" value={deliveryCharge} onChange = {(e) => setDeliveryCharge(+(e.target.value))} >
                <option value="70">70tk</option>
                <option value="120">120tk</option>
              </select>
            </div>
            <div className="form_row flex flex-col gap-2  relative w-xl max-w-[180px]">
              <label htmlFor="">Delivery Date:</label>
              <DatePicker className='date_input mb-6 h-11 flex items-center border border-gray-500 rounded px-4' selected={deliveryDate} onChange={(date) => setDeliveryDate(date)} dateFormat="dd/MM/yyyy" />
            </div>

            {/* <div className="form_row flex flex-col gap-2 mb-6">
              <label htmlFor="">Delivery Date:</label>
              <input type="text" placeholder='Customer Details:' className='border rounded border-gray-500 h-11 flex items-center px-4' value={mobile} onChange = {(e) => setMobile(e.target.value)} />
            </div> */}

            <div className="form_row flex flex-col gap-2 mb-6 mt-6">
              <label htmlFor="">Products:</label>
              <div className="products_wrap flex flex-col sm:flex-row gap-4">
                
                {data.products.map(product => <div className='flex gap-1' key={product._id}>
                  <input  type="checkbox" value={product._id} id={product.name} checked={selectedProducts.some(item => item.productId === product._id)} onChange={(e) => handleCheckboxChange(e,product.name, product.price)} /> 
                  <label htmlFor={product.name}>{product.name}</label>
                </div> )}
                
              </div>
            </div>  

            <button className={`rounded px-6 py-2 bg-amber-700 hover:bg-amber-800 cursor-pointer font-semibold`}> See order details:</button>
            

          </form>

        </div>
      </div>

      {showModal && (
        <div className="overlay fixed w-screen h-screen left-0 top-0 backdrop-blur-sm flex items-center justify-center pt-[100px]">
          
          <div className="overlay_content relative w-3xl max-w-[90%] mx-auto bg-black text-white px-4 py-8 rounded-lg h-[90vh]">
            <img className='absolute -top-14 right-0 w-12 cursor-pointer' onClick={closeModalHandler} src={Close} alt="" />
            <div className="overlay_content_inner  overflow-y-auto h-full flex flex-col gap-4 scrollbar-thin">
              <h2 className='text-xl mb-4'>Here is the order details:</h2>
              <p><span className='font-semibold'>Customer Details: </span> {customerDetails}</p>
              <p><span className='font-semibold'>Hub: </span>{selectedHub[0].name}</p>
              <p className=""><span className='font-semibold'>Delivery Charge: </span> {deliveryCharge}</p>
              <p className=""><span className='font-semibold'>Delivery Date: </span> {dayjs(deliveryDate).format("DD-MM-YYYY")}</p>
              <div className="order_items">
                <ul className='flex flex-col gap-4 my-8'>
                  
                  <li className='hidden sm:flex gap-4 justify-between' >
                    <div className='w-[250px] font-semibold'>Product name:</div>
                    <div className='flex gap-6 w-[300px] justify-between'>
                      <div className='font-semibold flex justify-end w-[90px]'>Quantity:</div>
                      <div className='font-semibold flex justify-end w-[90px]'>Unit Price:</div>
                      <div className='font-semibold flex justify-end w-[90px]'>Total Price:</div>
                    </div>
                    
                  </li>
                  
                  {selectedProducts.map(product => <li className='flex flex-col sm:flex-row gap-4 items-center py-2 border-b border-gray-500 justify-between' key={product.productId}>
                    <div className='w-full sm:w-[250px] flex gap-2' ><span className='block sm:hidden'>Product:</span>{product.name}</div>
    
                    <div className='flex flex-col sm:flex-row gap-6 w-full sm:w-[300px] justify-between'>

                      <div className='flex gap-2'>
                        <span className='block sm:hidden'>Quanity:</span>
                        <div className='flex  '>

                          <button onClick={() => handleQuantityChange(product.productId, Math.max(0, product.quantity - 0.5))} className="px-2 py-1 bg-gray-300 rounded text-black" > - 
                          </button>
                          <span className='w-14 text-center'>{product.quantity.toFixed(1)}</span> 
                          <button 
                            onClick={() => handleQuantityChange(product.productId, product.quantity + 0.5)}
                            className="px-2 py-1 bg-gray-300 rounded text-black"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      

                      <div className="unitPrice w-full sm:w-[90px] flex justify-start sm:justify-center gap-2"><span className='block sm:hidden'>Unit Price:</span>{product.price}</div>
                      <div className="totalPrice w-full sm:w-[90px] flex justify-start sm:justify-center gap-2"><span className='block sm:hidden'>Total Price:</span>{product.price * product.quantity}</div>
                    </div>




                  </li> )}

                  <li className='flex gap-4 items-center py-2 border-b border-gray-500 justify-between'>
                    <div className='font-semibold'>Order Price:</div>
                    <div className='font-semibold w-[75px] flex justify-center'>{orderPrice}</div>
                  </li>

                  <li className='flex gap-4 items-center py-2 border-b border-gray-500 justify-between'>
                    <div className='font-semibold'>Discount:</div>
                    <div className='font-semibold w-[75px] flex justify-center'>
                      <input className='w-[75px] border p-1 rounded border-gray-500' type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                    </div>
                  </li>
                  <li className='flex gap-4 items-center py-2 border-b border-gray-500 justify-between'>
                    <div className='font-semibold'>Delivery Charge:</div>
                    <div className='font-semibold w-[75px] flex justify-center'>{deliveryCharge}</div>
                  </li>


                  <li className='flex gap-4 items-center py-2 border-b border-gray-500 justify-between'>
                    <div className='font-semibold'>Final Price:</div>
                    <div className='font-semibold w-[75px] flex justify-center'>
                      {finalPrice}
                    </div>
                  </li>

                  


                </ul>
              </div>
              
              <div onClick={confirmOrderHandler}> <Button classNames='text-center' text="Confirm Order" /> </div>
              <button ></button>
            </div>
          </div>


        </div>

      )}
      




    </>
  )
}

export default Home