import React from 'react'
import Button from '../Button'
import { Link } from 'react-router-dom'

const SingleHub = ({hub}) => {
  return (
    <div className="flex justify-between items-center py-4 border-b border-gray-500">
      <div className='text-xl font-semibold'>{hub.name}</div>
      <Link to={`/hubs/${hub._id}`}><Button text="See Details" bgColor="bg-amber-600" /></Link>
    </div>
    
  )
}

export default SingleHub