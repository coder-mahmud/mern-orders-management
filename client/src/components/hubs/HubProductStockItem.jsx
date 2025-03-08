import React, { useState } from 'react'
import Button from '../Button';
import Close from '../../assets/images/Close.svg'
import { useEditHubMutation } from '../../slices/hubApiSlice';
import Loader from '../shared/Loader';
import {toast} from 'react-toastify'





const HubProductStockItem = ({stock, products, hubId}) => {

  const [showLoader, setShowLoader] = useState(false)
  const [showEditStock, setShowEditStock] = useState(false)
  const [stockAmount, setStockAmount] = useState('')

  
  const product = products.filter(product => product._id == stock.productId);
  // console.log("Product", product)
  // console.log("stock", stock)
  const [productName, setProductName] = useState(product[0].name)

  const [editHub, isLoading] = useEditHubMutation(); 


  const editStockHandler = () => {
    console.log("Edit stock clicked! - ", product[0].name )
    document.body.style.overflow = 'hidden'
    setShowEditStock(true)
  }

  const hideEditStockForm = () => {
    setShowEditStock(false)
    document.body.style.overflow = 'auto'
  }

  


  const updateHandler = async(type) => {
    setShowLoader(true)
    
    const data = {
      hubId,
      stockData:{
        productId: product[0]._id,
        type,
        amount:stockAmount
      }
    }

    console.log("data",data)

    
    try {
      const apiRes = await editHub(data).unwrap();
      console.log('apiRes', apiRes);
      hideEditStockForm();
      toast.success("Stock updated successfully")
    } catch (error) {
      console.log("Error", error)
      toast.error("Something went wrong!")
    }finally{
      setShowLoader(false)
      setStockAmount('')
    }

    

    
    

  }

 


  return (
    
    <div className='flex justify-start gap-4 items-center  border-b border-gray-500 py-4'>
      {showLoader && <Loader />}

      <div className="flex justify-between w-full items-center">
        <div className='flex gap-4'>
          <p>{product[0].name} - </p>
          <p>{stock.stock}</p>
        </div>
        <div onClick={editStockHandler}><Button text="Edit Stock" /></div>
      </div>
      
      

      { showEditStock && (
        <div className="modal fixed top-0 left-0 w-screen h-screen z-20  backdrop-blur-xs block pt-20 lg:pt-[150px] pb-24 overflow-auto">
          <div className="flex justify-center items-center">
            <div className="modal_inner w-3xl max-w-[90%] bg-gray-600 text-white relative p-10 rounded">
              <img onClick={hideEditStockForm} className='absolute w-12 cursor-pointer -top-14 right-0' src={Close} alt="" />
              
              
              <form  action="">
                
                <div className="input_group">
                  <label className="block mb-2 font-semibold text-xl">{productName}:</label>
                  <input type="number" value={stockAmount} onChange={(e) => setStockAmount(e.target.value)}
                    className="border rounded p-2 w-full mb-4" />
                </div>

                <div className="flex gap-6">
                    <div className=""><Button onclickHandler={() => {updateHandler('increase')}} text="Increase Amount" /></div>
                    <div className=""><Button onclickHandler={() => {updateHandler('decrease')}} text="Decrease Amount" /></div>
                </div>


              </form>
            </div>
          </div>

        </div>


      )}

    </div>
  )
}

export default HubProductStockItem