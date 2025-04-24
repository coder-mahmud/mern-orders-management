import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetOrderByIdQuery, useEditOrderMutation } from '../../slices/orderApiSclice';
import { useGetAllProductQuery } from '../../slices/productApiSlice';
import Loader from '../shared/Loader';
import Button from '../Button';
import {toast} from 'react-toastify'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditOrder = () => {
  const params = useParams();
  const orderId = params.id;

  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [customerDetails, setCustomerDetails] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState();
  const [orderType, setOrderType] = useState();

  const { data, isLoading } = useGetOrderByIdQuery(orderId);
  const [editOrder, { isLoading: isEditOrderLoading }] = useEditOrderMutation();
  const {data:productsData, isLoading:isProductLoading} = useGetAllProductQuery()

  // Fetch order details & set initial state
  useEffect(() => {
    if (data) {
      setDeliveryCharge(data.order.deliveryCharge);
      setSelectedProducts(data.order.orderItems);
      setTotalBill(data.order.finalPrice);
      setDiscount(data.order.discount)
      setCustomerDetails(data.order.customerDetails)
      setDeliveryDate(data.order.deliveryDate)
      setOrderType(data.order.orderType)
    }
  }, [data]);

  // Calculate total bill whenever selectedProducts or deliveryCharge changes
  useEffect(() => {
    const selectedItemsPrice = selectedProducts.reduce((prev, cur) => cur.totalPrice + prev, 0);
    setTotalBill(Number(selectedItemsPrice) + Number(deliveryCharge || 0) - Number(discount));
  }, [selectedProducts, deliveryCharge,discount]);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (Number(newQuantity) < 0.5) return;

    setSelectedProducts(prevItems =>
      prevItems.map(item =>
        item._id === itemId
          ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
          : item
      )
    );
  };

  const removeItemHandler = (itemId) => {
    setSelectedProducts(prevItems => prevItems.filter(item => item._id !== itemId));
  };

  if (isLoading || isProductLoading) return <Loader />;

  console.log("Orders data",data)
  // console.log("productsData",productsData)
  const allProducts = productsData.products;
  const orderProducts = data.order.orderItems.map(item => item.name);
  // console.log("orderProducts",orderProducts)
  // console.log("allProducts",allProducts)
  //const toAddProducts = allProducts.filter(product => product.name !=="")
  // const toAddProducts = allProducts.filter(item => !orderProducts.includes(item.name));
  // console.log("toAddProducts",toAddProducts)

  const updateOrderHandler = async () => {
    
    const UpdateOrderdata = {
      orderId: data.order._id,
      orderItems: selectedProducts,
      finalPrice:totalBill,
      discount,
      customerDetails,
      deliveryDate,
      orderType

    };
    // console.log("Updated Order Data:", data);
    
    try {
      const apiRes = await editOrder(UpdateOrderdata).unwrap();
      // console.log("apiRes data:", apiRes)
      toast.success("Order updated successfully!")

    } catch (error) {
      // console.log("Error:", error)
      toast.error("Something went wrong! Plese try again.")
    }

    



  };

  const handleCheckboxChange = (e,productName,price) => {
    const { value, checked } = e.target;
    
    if (checked) {
      setSelectedProducts([...selectedProducts, {name:productName, productId:value, quantity:1, price, totalPrice:(1 * price)}])
    } else {
      setSelectedProducts(selectedProducts.filter(item => item.productId !== value ));
    }
  };


  return (
    <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
      {isEditOrderLoading && <Loader />}

      <div className="container">
        <p className='mb-4'><label className='mb-1 block'>Customer Details: </label>
        <textarea className='w-full border border-gray-500 rounded p-4 min-h-32' name="" id="" value={customerDetails} onChange={(e) => setCustomerDetails(e.target.value)} ></textarea>
        </p>
        <p className='mb-2'><b>Bill: </b>{totalBill}</p>

        <div className="single_input flex flex-col gap-2 mb-2">
          <label htmlFor="deliveryCharge">Delivery Charge:</label>
          <select
            name="deliveryCharge"
            id="deliveryCharge"
            value={deliveryCharge}
            onChange={(e) => setDeliveryCharge(e.target.value)}
            className="border rounded border-gray-500 h-11 px-4"
          >
            <option value="70">70tk</option>
            <option value="120">120tk</option>
          </select>
        </div>
        <div className="single_input flex flex-col gap-2 mb-2">
          <label htmlFor="deliveryCharge">Discount:</label>
          <input className='border border-gray-500 rounded p-4' type="text" value={discount} onChange={(e) => setDiscount( e.target.value)} />
        </div>

        <div className="single_input flex flex-col gap-2 mb-2">
          <label htmlFor="deliveryCharge">Delivery Date:</label>
          <DatePicker className='date_input mb-6 h-11 flex items-center border border-gray-500 rounded px-4' selected={deliveryDate} onChange={(date) => setDeliveryDate(date)} dateFormat="dd/MM/yyyy" />
        </div>

        <div className="single_input flex flex-col gap-2 mb-2">
          <label htmlFor="deliveryCharge">Order Type:</label>
          <select
            name="orderType"
            id="orderType"
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="border rounded border-gray-500 h-11 px-4"
          >
            <option value="New">New</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {selectedProducts.length > 0 ? (
          <>
            <p className="mb-2 mt-6 ">Products:</p>
            <ul>
              {selectedProducts.map((item, index) => (
                <li key={item._id} className='flex flex-col md:flex-row gap-3 items-center py-4 border-b border-gray-500 '>
                  <div><span className="inline-block md:hidden">SL No. </span> {index + 1}</div>
                  <div><span className="inline-block md:hidden">Name: </span> {item.name}</div>
                  <div className='flex gap-1'>
                    <button onClick={() => handleQuantityChange(item._id, Math.max(0.5, item.quantity - 0.5))} className="px-2 py-1 bg-gray-300 rounded text-black">-</button>
                    <span className='w-14 text-center'>{item.quantity.toFixed(1)}</span>
                    <button onClick={() => handleQuantityChange(item._id, item.quantity + 0.5)} className="px-2 py-1 bg-gray-300 rounded text-black">+</button>
                  </div>
                  <div><span className="inline-block md:hidden">Unit Price: </span>  {item.price}</div>
                  <div><span className="inline-block md:hidden">Total: </span>  {item.totalPrice}</div>
                  <div onClick={() => removeItemHandler(item._id)}><Button text="Remove" /></div>
                </li>
              ))}
            </ul>
          </>
        ) : "No product found for this order!"}

            <div className="form_row flex flex-col gap-2 mb-6 mt-6">
              <label htmlFor="">Add Products:</label>
              <div className="products_wrap flex flex-col sm:flex-row gap-4 flex-wrap">
                
                {allProducts.map(product => <div className='single_prodcut_select flex gap-1' key={product._id}>
                  <input  type="checkbox" value={product._id} id={product.name} checked={selectedProducts.some(item => item.productId === product._id)} onChange={(e) => handleCheckboxChange(e,product.name, product.price)} /> 
                  <label htmlFor={product.name}>{product.name}</label>
                </div> )}
                
              </div>
            </div> 

        <div onClick={updateOrderHandler} className='my-10 max-w-[250px] mx-auto md:mr-auto'><Button classNames="text-center" text="Update Order" /></div>
      </div>
    </div>
  );
};

export default EditOrder;
