import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetHubByIdQuery } from '../../slices/hubApiSlice';
import Loader from '../shared/Loader';
import HubProductStockItem from './HubProductStockItem';
import { useGetAllProductQuery } from '../../slices/productApiSlice';

const SingleHubDetails = () => {
  const {id} = useParams('id');
  // console.log("hubId",id)
  const {data, isLoading, isError, error} = useGetHubByIdQuery(id)
  const {data:productData, isLoading:isProductLoading} = useGetAllProductQuery()

  if(isLoading || isProductLoading ){
    return <Loader />
  }
  if(isError){
    console.log("Error", error)
  }

  // console.log("data", data)
  // console.log("productData", productData)


  return (
    <>
      <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
        
        <div className="container">
          <h1 className="text-xl font-semibold mb-6">{data.hub.name}</h1>
          <p className="mb-4">Current Product Stock:</p>
          {data.hub.stock.map(stock => <HubProductStockItem key={stock._id} products={productData.products} stock={stock} />)}
        </div>

      </div>
    
    </>
  )
}

export default SingleHubDetails