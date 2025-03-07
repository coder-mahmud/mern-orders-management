import React from 'react'
import Button from '../Button';

const HubProductStockItem = ({stock, products}) => {
  const product = products.filter(product => product._id == stock.productId);
  // console.log("Product", product)


  const editStockHandler = () => {
    console.log("Edit stock clicked! - ", product[0].name )
  }



  return (
    <div className='flex justify-start gap-4 items-center  border-b border-gray-500 py-4'>
      <p >{product[0].name} - </p>
      <p >{stock.stock}</p>
      <div onClick={editStockHandler}><Button text="Edit Stock" /></div>

    </div>
  )
}

export default HubProductStockItem