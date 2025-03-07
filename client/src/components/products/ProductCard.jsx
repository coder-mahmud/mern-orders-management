import React from 'react'

const ProductCard = ({product}) => {
  return (
    <div className="product_card flex flex-col xs:flex-row justify-between gap-1 sm:gap-4 border-b border-gray-500 py-4">
      <p className="name font-semibold min-w-auto sm:min-w-[300px]"><span className='block xs:hidden'>Prodcut Name: </span>{product.name}</p>
      <p className="price"><span className='block xs:hidden'>Price: </span>{product.price}</p>
    </div>
  )
}

export default ProductCard