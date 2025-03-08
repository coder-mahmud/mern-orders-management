import React, { useState, useEffect } from 'react'
import { useGetAllProductQuery } from '../slices/productApiSlice';
import Loader from '../components/shared/Loader';

const Home = () => {

  const [ showLoader, setShowLoader ] = useState(false)
  const [mobile, setMobile] = useState();


  const {data, isLoading } = useGetAllProductQuery()


  if(isLoading){
    return <Loader />
  }

  console.log('Data', data)

  const onClickHandler = () => {

  }

  return (
    <>

      { showLoader && <Loader /> }
      
      <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
        <div className="container">
          <h1 className='text-xl font-semibold mb-6'>Create Order:</h1>
          
          <form action="">
            
            <div className="form_row flex flex-col gap-2 mb-6">
              <label htmlFor="">Customer Details:</label>
              <textarea type="text" placeholder='Customer Details:' className='border rounded border-gray-500 py-3 px-4' value={mobile} onChange = {(e) => setMobile(e.target.value)} />
            </div>            
            <div className="form_row flex flex-col gap-2 mb-6">
              <label htmlFor="">Customer Details:</label>
              <input type="text" placeholder='Customer Details:' className='border rounded border-gray-500 h-11 flex items-center px-4' value={mobile} onChange = {(e) => setMobile(e.target.value)} />
            </div>

            <div className="form_row flex flex-col gap-2 mb-6">
              <label htmlFor="">Select Hub:</label>
              <select className='border rounded border-gray-500 h-11 flex items-center px-4 ' name="" id="">
                <option value="">Select one:</option>
                <option value="">Dania</option>
                <option value="">Dania 2</option>
              </select>
            </div>




          </form>

        </div>
      </div>
    </>
  )
}

export default Home