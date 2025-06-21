import React,{useState, useEffect} from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Close from '../assets/images/Close.svg'
import { useGetAllProductQuery } from '../slices/productApiSlice';
import { useGetAllHubQuery } from '../slices/hubApiSlice';
import Loader from '../components/shared/Loader';
import dayjs from 'dayjs'
import {toast} from 'react-toastify'
import { Navigate } from 'react-router-dom';
import { useCreateRiderReportMutation } from '../slices/riderReportApiSlice';
import { useGetRiderReportsByDateQuery } from '../slices/riderReportApiSlice';
import { useSelector } from 'react-redux';




const RiderOrder = () => {
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [showDate, setShowDate] = useState(new Date());
  const [showCreateHub, setShowCreateHub] = useState(false)
  const [hub, setHub] = useState();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showLoader, setShowLoader] = useState(false)
  const [onlineDelivery, setOnlineDelivery] = useState(0);
  const [offlineDelivery, setOfflineDelivery] = useState(0);
  const [reportType, setReportType] = useState([]);
  const [orderCount, setOrderCount] = useState(0);



  const {data, isLoading } = useGetAllProductQuery()
  const {data:hubData, isLoading:isHubLoading } = useGetAllHubQuery()
  const [ createRiderReport,{isLoading:isRiderReportLoading}] = useCreateRiderReportMutation()
  const {data:riderReportData, isLoading:riderReportLoaading} = useGetRiderReportsByDateQuery(dayjs(showDate).format('YYYY-MM-DD'))

  const user = useSelector(state => state?.auth?.userInfo?.id)

  const createHubHandler = () => {
    // console.log("Create hub clicked!")
    document.body.style.overflow = "hidden";
    setShowCreateHub(true)
  }

  const hideCreateHubForm = () => {
    document.body.style.overflow = "auto";
    setShowCreateHub(false)
  }

  const handleQuantityChange = (productId, newQuantity) => {
    console.log("clicked", productId, newQuantity)
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId
          ? { ...product, quantity: newQuantity, totalPrice: (newQuantity * product.price) }
          : product
      )
    );
  };


  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setShowLoader(true)

    console.log("Hub", hub)
    if(!hub){
      alert("Please select Hub");
      return;
    }
    const selectedProducts = products.filter(product => product.quantity > 0 )
    const formattedProducts = selectedProducts.map(product => ({productId:product._id, name:product.name, quantity:product.quantity}))
    // console.log("formattedProducts",formattedProducts)
    // console.log("user",user)



    const reportData = {
      hub,
      user,
      orderItems:formattedProducts,
      deliveryDate,
      // onlineDelivery,
      // offlineDelivery
      orderCount,
      reportType
    }
    
    
    try {
      const apiRes = await createRiderReport(reportData).unwrap();
      console.log("ApiRes", apiRes)
      toast.success("Rider Report created successfully!")
      const productsWithQuantity = data.products.map(product => ({
        ...product,
        quantity: 0,
      }));
      setProducts(productsWithQuantity);
      setReportType('')
      setOrderCount(0)
      setHub()




    } catch (error) {

      console.log("Error:", error)
      toast.error("Something went wrong! Please try again.")
      
    } finally {
      setShowLoader(false)
      document.body.style.overflow = "auto";
      setShowCreateHub(false)
    }

    
    
  };
  


  useEffect(() =>{


    if(data){
      const productsWithQuantity = data.products.map(product => ({
        ...product,
        quantity: 0,
      }));
      setProducts(productsWithQuantity);

    }



  },[data] )


  const handleTypeChange = (event) => {
    setReportType(event.target.value);
  };


  if(isLoading || isHubLoading || riderReportLoaading ){
    return <Loader />
  }

  // console.log("Products:",data)
  // console.log("Hubs:",hubData)
  // console.log("deliveryDate:",deliveryDate)
  console.log("riderReportData:",riderReportData)

  return (
    <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
      <div className="container">
        <div className="flex justify-between items-center">
          <h1 className='text-3xl'>Rider Reports!</h1>
          <div onClick={createHubHandler} className="undefined rounded px-6 py-2 bg-amber-700  hover:bg-amber-800 cursor-pointer font-semibold">Add New Report</div>
        </div>
        
        
        <div className="date my-6">
          <div className="flex gap-2 items-center mb-6">
            <p className='mb-2'>Date:</p>
            <DatePicker className='date_input mb-6 h-11 flex items-center border border-gray-500 rounded px-4' selected={showDate} onChange={(date) => setShowDate(date)} dateFormat="dd/MM/yyyy" />
          </div>

        </div>



         {riderReportData.reports.map(report => <li className='border-b pb-4 mb-4 list-none ' key={report._id}>
          <div className="flex gap-4 mb-6"><span>Hub: {report.hub.name}</span><span>User: {report?.user?.firstName}</span></div>

          <div className="flex gap-4">
            <p className="t">Report Type: {report.reportType}</p>
            <p className="t">Count: {report.orderCount}</p>
          </div>

          
          <div className='mb-2'>Items:</div>

           {report.orderItems.map(item => <div className='list-none' key={item._id}>
            <div className="flex gap-4"><span>Name: {item.name}</span><span>Quantity: {item.quantity}</span></div>
            
          </div>) }

         </li>)}
        
        
        { showCreateHub && (
              <div className="modal fixed top-0 left-0 w-screen h-screen z-20  backdrop-blur-xs block pt-20 lg:pt-[150px] pb-24 overflow-auto">
                <div className="flex justify-center items-center">
                  <div className="modal_inner w-3xl max-w-[90%] bg-gray-600 text-white relative p-10 rounded">
                    <img onClick={hideCreateHubForm} className='absolute w-12 cursor-pointer -top-14 right-0' src={Close} alt="" />
                    
                    
                    <div>
                      
                      <div className="input_group">
                        <label className="block mb-2 font-semibold text-xl">Add Delivery Report:</label>
                        
                      </div>
                      
                      <div className="form_row flex flex-col gap-2 mb-6">
                        <label htmlFor="">Select Hub:</label>
                        <select className='border rounded border-gray-500 h-11 flex items-center px-4 ' name="" id="" value={hub} onChange = {(e) => setHub(e.target.value)}>
                          <option value="">Select one:</option>
                          {hubData.hubs.map(hub => <option key={hub._id} value={hub._id}>{hub.name}</option>)}
                        
                        </select>
                      </div>

                      <div className="date my-6 flex gap-4 flex-col md:flex-row justify-between md:items-center">
                        
                        <div className="flex flex-col sm:flex-row gap-1 md:items-center">
                          <p className='mb-0'>Date:</p>
                          <DatePicker className='date_input mb-6 h-11 flex items-center border border-gray-500 rounded px-4' selected={deliveryDate} onChange={(date) => setDeliveryDate(date)} dateFormat="dd/MM/yyyy" />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 md:items-center w-full">
                          <p className="">Report Type</p>
                          <select onChange={handleTypeChange} name="" id="" className='border rounded p-2'>
                            <option value="">Select One</option>
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                          </select>
                        </div>

                      </div>


                      <div className="number flex justify-between items-center mb-6">

                      <div className="online">
                          <p className="mb-1">Number Orders</p>
                          <div className="flex gap-4">
                            <button onClick={() => setOrderCount(prev => prev - 1)} className="px-2 py-1 bg-gray-300 rounded text-black" > - </button>
                            <span>{orderCount}</span>
                            <button onClick={() => setOrderCount(prev => prev + 1)} className="px-2 py-1 bg-gray-300 rounded text-black" > + </button>
                          </div>
                        </div>


                      </div>

                    <div>
                        


                  {products.map(product => <li key={product._id} className='flex flex-col sm:flex-row gap-4 items-center py-2 border-b border-gray-500 justify-between' >
                    <div className='w-full sm:w-[250px] flex gap-2' ><span className='block sm:hidden'>Product:</span>{product.name}</div>
    
                    <div className='flex flex-col sm:flex-row gap-6 w-full sm:w-[300px] justify-end'>

                      <div className='flex gap-2'>
                        <span className='block sm:hidden'>Quanity:</span>
                        <div className='flex  '>

                          <button onClick={() => handleQuantityChange(product._id, Math.max(0, product.quantity - 0.5))} className="px-2 py-1 bg-gray-300 rounded text-black" > - 
                          </button>
                          <span className='w-14 text-center'>{product.quantity.toFixed(1)}</span> 
                          <button 
                            onClick={() => handleQuantityChange(product._id, product.quantity + 0.5)}
                            className="px-2 py-1 bg-gray-300 rounded text-black"
                          >
                            +
                          </button>
                        </div>

                        
                      </div>
                    
                    </div>




                    </li> 
                  )}


                        

                      </div>

                      <button onClick={handleSubmit} type="submit" className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600" >Add Report</button>


                    </div>
                  </div>
                </div>

              </div>


            )}

      </div>
    </div>
  )
}

export default RiderOrder