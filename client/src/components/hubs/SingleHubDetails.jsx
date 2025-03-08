import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetHubByIdQuery, useAddProductToHubMutation } from '../../slices/hubApiSlice';
import Loader from '../shared/Loader';
import HubProductStockItem from './HubProductStockItem';
import { useGetAllProductQuery, } from '../../slices/productApiSlice';

import Button from '../Button';

const SingleHubDetails = () => {
  const {id} = useParams('id');
  // console.log("hubId",id)
  const [hubProducts, setHubProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);




  const {data, isLoading, isError, error} = useGetHubByIdQuery(id)
  const {data:productData, isLoading:isProductLoading} = useGetAllProductQuery()
  const [addProductToHub, {isLoading:isAddProductLoading}] = useAddProductToHubMutation()

  
  if(isError){
    console.log("Error", error)
  }


  useEffect(() => {

    if(!isLoading){
      setHubProducts(data.hub.stock.map((s) => s.productId));
    }

  },[isLoading])

  if(isLoading || isProductLoading ){
    return <Loader />
  }

  // console.log("data", data)
  // console.log("productData", productData)

  // console.log("Hub Products", hubProducts)

  const toAddProducts =  productData.products.filter(product => 
    !hubProducts.some(hubProduct => hubProduct === product._id)
  );

  // console.log("To add", toAddProducts)

  // Handle product selection
  const handleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId) // Remove if already selected
        : [...prev, productId] // Add if not selected
    );
  };


  // Handle form submission
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




  return (
    <>
      <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
        
        <div className="container">

          <h1 className="text-xl font-semibold mb-6">{data.hub.name}</h1>
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





        </div>

      </div>
    
    </>
  )
}

export default SingleHubDetails