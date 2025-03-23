import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetOrderByIdQuery, useEditOrderMutation } from '../../slices/orderApiSclice';
import Loader from '../shared/Loader';
import Button from '../Button';

const EditOrder = () => {
  const params = useParams();
  const orderId = params.id;

  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [discount, setDiscount] = useState(0);

  const { data, isLoading } = useGetOrderByIdQuery(orderId);
  const [editOrder, { isLoading: isEditOrderLoading }] = useEditOrderMutation();

  // Fetch order details & set initial state
  useEffect(() => {
    if (data) {
      setDeliveryCharge(data.order.deliveryCharge);
      setSelectedProducts(data.order.orderItems);
      setTotalBill(data.order.finalPrice);
      setDiscount(data.order.discount)
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

  if (isLoading) return <Loader />;

  console.log("data",data)

  const updateOrderHandler = async () => {
    
    const UpdateOrderdata = {
      orderId: data.order._id,
      orderItems: selectedProducts,
      finalPrice:totalBill,
      discount,

    };
    // console.log("Updated Order Data:", data);
    
    try {
      const apiRes = await editOrder(UpdateOrderdata).unwrap();
      console.log("apiRes data:", apiRes)
    } catch (error) {
      console.log("Error:", error)
    }

    



  };

  return (
    <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
      {isEditOrderLoading && <Loader />}

      <div className="container">
        <p><b>Customer Details: </b>{data.order.customerDetails}</p>
        <p><b>Bill: </b>{totalBill}</p>

        <div className="single_input flex flex-col gap-2">
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
        <div className="single_input flex flex-col gap-2">
          <label htmlFor="deliveryCharge">Discount:</label>
          <input type="text" value={discount} onChange={(e) => setDiscount( e.target.value)} />
        </div>

        {selectedProducts.length > 0 ? (
          <>
            <p className="my-2">Products:</p>
            <ul>
              {selectedProducts.map((item, index) => (
                <li key={item._id} className='flex gap-3 items-center'>
                  <div>{index + 1}</div>
                  <div>{item.name}</div>
                  <div>
                    <button onClick={() => handleQuantityChange(item._id, Math.max(0.5, item.quantity - 0.5))} className="px-2 py-1 bg-gray-300 rounded text-black">-</button>
                    <span className='w-14 text-center'>{item.quantity.toFixed(1)}</span>
                    <button onClick={() => handleQuantityChange(item._id, item.quantity + 0.5)} className="px-2 py-1 bg-gray-300 rounded text-black">+</button>
                  </div>
                  <div>{item.price}</div>
                  <div>{item.totalPrice}</div>
                  <div onClick={() => removeItemHandler(item._id)}><Button text="Remove" /></div>
                </li>
              ))}
            </ul>
          </>
        ) : "No product found for this order!"}

        <div onClick={updateOrderHandler} className='my-10 max-w-[250px]'><Button classNames="text-center" text="Update Order" /></div>
      </div>
    </div>
  );
};

export default EditOrder;
