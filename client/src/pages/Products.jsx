import React, { useEffect, useState } from "react";
import { useGetAllProductQuery, useCreateProductMutation } from "../slices/productApiSlice";
import Loader from "../components/shared/Loader";
import ProductCard from "../components/products/ProductCard";
import Button from "../components/Button";
import Close from '../assets/images/Close.svg'
import {toast} from 'react-toastify'


const Products = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [productLoaded, setProductLoaded] = useState(false);
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [productName, setProductName] = useState('')
  const [price, setPrice] = useState('')

  const { data, isLoading, isError } = useGetAllProductQuery();
  const [createProduct,{isLoading:createProductLoading}] = useCreateProductMutation()
  
  
  useEffect(() => {

    if (!isLoading) {
      setShowLoader(false);
      setProductLoaded(true);
    }

  },[isLoading])
  
  

  const addProduct = () => {
    setShowCreateProduct(true)
    document.body.style.overflow = 'hidden';
  }



  const closeModalHandler = () => {
    setShowCreateProduct(false)
    document.body.style.overflow = 'auto';
  }
  
  const createProductHandler = async () => {
    console.log("Adding product...")
    if(!productName || !price ){
      return toast.error("Please add both Name and Price.")
    }
    setShowLoader(true)

    // console.log("Name", productName)
    // console.log("Price", price)

    const data = {
      name:productName, price
    }

    try {
      const apiRes = await createProduct(data).unwrap();
      console.log("apiRes", apiRes)
      toast.success(`${productName} created successfully!`)
      setShowCreateProduct(false)
    } catch (error) {
      console.log("Error", error)
      toast.error(error.message)
    }finally{
      document.body.style.overflow = 'auto';
      setShowLoader(false)
    }




  }
  


  return (
    <>
      {showLoader && <Loader />}

      {productLoaded && (
        <div className="bg-gray-800 text-white min-h-[95vh] py-14">
          <div className="container">
            <div className="product_list_container  max-w-[100%] mx-auto px-0 md:px-4">
              <div className="products_header flex flex-col gap-4 sm:flex-row justify-between items-center">
                <h1 className="text-2xl">Available Product List:</h1>
                <Button onclickHandler={addProduct} text="Add new product" />
              </div>
              
              
              <div className="product_card hidden xs:flex flex-col xs:flex-row justify-between gap-1 sm:gap-4 border-b border-gray-700 py-4 mt-6">
                <p className="name font-semibold min-w-[300px]">Product Name</p>
                <p className="price">Price</p>
              </div>

              <div className="products_wrap ">
                {data.products.map( product => <ProductCard key={product._id} product={product} />  )}
              </div>

            </div>
            
          </div>
        </div>
        
      )}

      {showCreateProduct && <>
        <div className="fixed top-0 left-0 w-[100vw]  h-[100vh] flex items-center justify-center py-32 backdrop-blur-sm ">
          <div className="modal_inner w-[560px] max-w-[90%] mx-auto bg-gray-600 text-white rounded-lg py-10 px-6 relative">
            <img onClick= {closeModalHandler} className="w-12 absolute right-6 top-6 cursor-pointer" src={Close} alt="" />
            
            <p className="font-semibold">Create a new product:</p>
            
            <form className="pt-6" action="">

              <div className="form_group mb-6 flex flex-col gap-2">
                <label htmlFor="">Product Name:</label>
                <input className="p-2 border border-gray-500" type="text" placeholder="Product Name" value={productName} onChange= {(e) => {setProductName(e.target.value)}} />
              </div>

              <div className="form_group mb-6 flex flex-col gap-2">
                <label htmlFor="">Price:</label>
                <input className="p-2 border border-gray-500" type="number" placeholder="Price" value={price} onChange= {(e) => {setPrice(e.target.value)}} />
              </div>

              <Button onclickHandler={createProductHandler} classNames="text-center" text="Add Product" />


            </form>
          </div>
        </div>
        
      
      </> }
      
    </>
  );
};

export default Products;
