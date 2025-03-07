import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Close from '../assets/images/Close.svg'
import Button from '../components/Button';
import {Navigate} from 'react-router-dom'
import { useGetAllProductQuery } from '../slices/productApiSlice';
import Loader from '../components/shared/Loader';
import { useCreateHubMutation, useGetAllHubQuery } from '../slices/hubApiSlice';
import { toast } from 'react-toastify'
import SingleHub from '../components/hubs/SingleHubListItem';



const Hubs = () => {

  const [showLoader, setShowLoader] = useState(false)
  const [hubName, setHubName] = useState("");
  const [productStocks, setProductStocks] = useState([]);
  const [allHub, setAllHub] = useState([]);

  const userRole = useSelector(state => state.auth?.userInfo?.role);
  // console.log("userRole", userRole)
  const {data, isLoading, isError} = useGetAllProductQuery();
  const {data:hubData, isLoading:isGetHubLoading} = useGetAllHubQuery();
  const [createHub, {isLoading:hubLoading}] = useCreateHubMutation()



  if(!userRole){
    return <Navigate to="/login" replace />;
  }

  const [showCreateHub, setShowCreateHub] = useState(false)

  const createHubHandler = () => {
    console.log("Create hub clicked!")
    document.body.style.overflow = "hidden";
    setShowCreateHub(true)
  }

  const hideCreateHubForm = () => {
    document.body.style.overflow = "auto";
    setShowCreateHub(false)
  }

  useEffect(() => {
    
    if(!isGetHubLoading){
      setAllHub(hubData.hubs)
    }


    if(!isLoading && !isError){
      setProductStocks(
        data.products.map((product) => ({ productId: product._id, stock: 0 }))
      );
    }
  },[isLoading, isGetHubLoading])

  if(isLoading || isGetHubLoading){
    return <Loader />
  }
  //console.log("getAllProduct", data)
  // console.log("getHubs", hubData)

  

  const handleStockChange = (productId, value) => {
    setProductStocks((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, stock: Number(value) } : item
      )
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setShowLoader(true)
    const hubData = { name: hubName, stock: productStocks };
    
    //console.log("hubData", hubData)

    try {
      const apiRes = await createHub(hubData).unwrap();
      console.log("ApiRes", apiRes)
      toast.success("Hub created successfully!")

    } catch (error) {

      console.log("Error:", error)
      toast.error("Something went wrong! Please try again.")
      
    } finally {
      setShowLoader(false)
      document.body.style.overflow = "auto";
      setShowCreateHub(false)
    }
    
  };






  return (
    <>

      {showLoader && <Loader /> }
      
      <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
        <div className="container">
          
          <div className='hubs-header border-b border-gray-900 pb-4 flex justify-between items-center'>
            
            <p className="text-2xl font-semibold">Hubs</p>
            {(userRole == 'superAdmin' || userRole == 'admin') && (
              <div onClick={createHubHandler}><Button text="Add New Hub"/></div>
            )}
                      
          </div>

          <div className="hubs_content py-6">
            {allHub.map(hub => <SingleHub key={hub._id} hub={hub} /> )}

            {/* <p className="text-xl">Hubs list will be here...</p> */}

            { showCreateHub && (
              <div className="modal fixed top-0 left-0 w-screen h-screen z-20  backdrop-blur-xs block pt-20 lg:pt-[150px] pb-24 overflow-auto">
                <div className="flex justify-center items-center">
                  <div className="modal_inner w-3xl max-w-[90%] bg-gray-600 text-white relative p-10 rounded">
                    <img onClick={hideCreateHubForm} className='absolute w-12 cursor-pointer -top-14 right-0' src={Close} alt="" />
                    
                    
                    <form onSubmit={handleSubmit} action="">
                      
                      <div className="input_group">
                        <label className="block mb-2 font-semibold text-xl">Hub Name:</label>
                        <input type="text" value={hubName} onChange={(e) => setHubName(e.target.value)}
                          className="border rounded p-2 w-full mb-4" required />
                      </div>

                      <div>
                        <p className="text-xl my-4 font-semibold">Please add current stock of the new Hub</p>
                        {data.products.map((product) => (
                          <div key={product._id} className="flex flex-col xs:flex-row gap-4 mb-2">
                            <span className="w-1/2">{product.name}</span>
                            <input
                              type="number"
                              min="0"
                              value={
                                productStocks.find((item) => item.productId === product._id)  ?.stock || 0
                              }
                              onChange={(e) =>
                                handleStockChange(product._id, e.target.value)
                              }
                              className="border rounded p-2 w-full xs:w-1/2"
                            />
                          </div>
                        ))}

                      </div>

                      <button type="submit" className="mt-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600" >Add Hub</button>


                    </form>
                  </div>
                </div>

              </div>


            )}
            




          </div>


        </div>
      </div>
    </>
    
  )
}

export default Hubs