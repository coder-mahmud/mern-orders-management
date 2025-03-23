import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetHubByIdQuery, useAddProductToHubMutation } from '../../slices/hubApiSlice';
import Loader from '../shared/Loader';
import HubProductStockItem from './HubProductStockItem';
import { useGetAllProductQuery, } from '../../slices/productApiSlice';
import DatePicker from "react-datepicker";
import { useGetHubOrderQuery } from '../../slices/orderApiSclice';
import dayjs from 'dayjs';
import HubOrderItem from './HubOrderItem';
import { useGetAllUsersQuery } from '../../slices/userApiSlice';
import { saveAs } from "file-saver";
import Papa from "papaparse";
import Button from '../Button';

const SingleHubDetails = () => {
  const {id} = useParams('id');
  
  // console.log("hubId",id)
  const [hubProducts, setHubProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showHubEdit, setShowHubEdit] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState(new Date());


  const {data, isLoading, isError, error} = useGetHubByIdQuery(id)
  const {data:productData, isLoading:isProductLoading} = useGetAllProductQuery()
  const [addProductToHub, {isLoading:isAddProductLoading}] = useAddProductToHubMutation()
  const {data:hubOrder, isLoading:isHubOrderLoading} = useGetHubOrderQuery({id,date:dayjs(deliveryDate).format('YYYY-MM-DD')})
  const {data:usersData, isLoading:isUsersLoading, isError:isUserError, error:userError} = useGetAllUsersQuery()

  
  if(isError){
    console.log("Error", error)
  }
  
  if(isUserError){
    console.log("User Error", userError)
  }


  useEffect(() => {

    if(!isLoading){
      setHubProducts(data.hub.stock.map((s) => s.productId));
    }

  },[isLoading, deliveryDate])

  if(isLoading || isProductLoading || isHubOrderLoading || isUsersLoading ){
    return <Loader />
  }

  // console.log("data", data)
  // console.log("productData", productData)
  // console.log("deliveryDate",deliveryDate)
  // console.log("hubOrder", hubOrder)
  console.log("usersData", usersData)
  // console.log("Hub Products", hubProducts)
  //console.log("customerDetails", hubOrder.orders[1].customerDetails)

  

  const toAddProducts =  productData.products.filter(product => 
    !hubProducts.some(hubProduct => hubProduct === product._id)
  );



  // Handle product selection
  const handleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId) // Remove if already selected
        : [...prev, productId] // Add if not selected
    );
  };


  // Handle edit form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // console.log("selectedProducts", selectedProducts)

    const productsData = selectedProducts.map(product => ({productId:product ,stock:  0}))
    
    // console.log("productsData",productsData)
    const data = {
      id,
      productsData
    }

    try {
      const apiRes = await addProductToHub(data).unwrap();
      console.log("apiRes", apiRes)
      setHubProducts(apiRes.hub.stock.map((s) => s.productId));
    } catch (error) {
      console.log(error)
    }

  };

  const exportCSVManual = (orders) => {
    if (!orders.length) return;
  
    // Define headers
    const csvHeaders = "Customer, Status,  Delivery Charge, Final Price, Delivery Date, \n";
  
    // Convert data to CSV format
    const csvRows = orders.map(order =>
      `${order.customerDetails}, ${order.orderStatus},  ${order.deliveryCharge}, ${order.finalPrice}, ${new Date(order.deliveryDate).toLocaleString()}}`
    );
  
    // Join headers and rows
    const csvString = csvHeaders + csvRows.join("\n");
  
    // Create a Blob and trigger download
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  

  const exportCSV = (orders) => {
    if (!orders.length) {
      alert("No orders to export!");
      return;
    }
  
    // Define CSV headers
    const csvHeaders = [
      "Customer",
      "Status",
      "Delivery Charge",
      "Final Price",
      "Delivery Date",
    ];
  
    // Convert order data to CSV format
    const csvData = orders.map((order) => ({
      "Customer": order.customerDetails.replace(/\n/g, " "),
      "Status": order.orderStatus,
      "Delivery Charge": order.deliveryCharge,
      "Final Price": order.finalPrice,
      "Delivery Date": new Date(order.deliveryDate).toLocaleString(),
    }));

    csvData.push({
      Customer: "Total Orders: " + orders.length, // Custom text
      Status: "",  
      "Delivery Charge": "",
      "Final Price": "",
      "Delivery Date": "", 
    });
  
    // Convert JSON to CSV
    const csvString = Papa.unparse({
      fields: csvHeaders,
      data: csvData,
    });
  
    // Convert CSV string to Blob
    const csvBlob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  
    // Trigger download
    saveAs(csvBlob, "orders.csv");
  };  





  return (
    <>
      <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
        
        <div className="container">

          <h1 className="text-xl font-semibold mb-6">{data.hub.name}</h1>
          
          <div className="flex gap-2 items-center mb-6">
            <p className='mb-2'>Date:</p>
            <DatePicker className='date_input mb-6 h-11 flex items-center border border-gray-500 rounded px-4' selected={deliveryDate} onChange={(date) => setDeliveryDate(date)} dateFormat="dd/MM/yyyy" />
          </div>

          <button onClick={() => exportCSV(hubOrder.orders)}>Generate CSV</button>

          { hubOrder.orders.length == 0 ? "No order for selected day yet!" : (<>
            
            <div className="hubOrderInfo my-4 text-lg">
              <p className=''>Total Orders : {hubOrder.orders.length}</p>
              <p className=''>Total Bill : {hubOrder.orders.reduce((prev,cur) => prev + cur.finalPrice,0)}</p>
            </div>

            <div className='flex justify-between gap-4 py-4 border-b border-gray-500'>
              <p className='w-[50px]'>SL no.</p>
              <p className='flex-2'>Customer Details</p>
              <p className='flex-[.75]'>Bill</p>
              <p className='flex-[.75]'>Status</p>
              <p className='flex-1 flex justify-start'>Created By</p>
              <p className='flex-[.75] flex justify-end'>Action </p>

            </div>
            {hubOrder.orders.map((order,index) => <HubOrderItem index={index} key={order._id} order={order} users={usersData.users} />)}
          </>) }
          

          {showHubEdit && (<>
            <p className="mb-4">Current Product Stock:</p>
            {data.hub.stock.map(stock => <HubProductStockItem key={stock._id} products={productData.products} stock={stock} hubId={data.hub._id} />)}

            {toAddProducts.length > 0 ? (
              <>
                <h2 className="text-xl font-bold mb-4 mt-8">Add Products to Hub</h2>

                <form onSubmit={handleSubmit}>

                  <h3 className="font-semibold mb-2">Select Products to Add:</h3>
                  {toAddProducts.map((product) => (
                    <label key={product._id} className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={hubProducts.includes(product._id) || selectedProducts.includes(product._id)}
                        onChange={() => handleProductSelection(product._id)}
                        disabled={hubProducts.includes(product._id)} // Disable if already in hub
                      />
                      <span>{product.name}</span>
                    </label>
                  ))}


                  {selectedProducts.length > 0 ? (

                    <button type="submit" className="cursor-pointer mt-4 px-6 py-2 bg-amber-700 text-white font-semibold rounded hover:bg-green-600">Add Selected Products</button>
                  ) : ""}
                  

                </form>
              </>

            ) : ""}
          
          
          </>)}
          
        </div>

      </div>
    
    </>
  )
}

export default SingleHubDetails