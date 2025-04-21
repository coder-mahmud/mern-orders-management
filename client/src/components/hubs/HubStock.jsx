import React,{useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { useGetHubStockQuery } from '../../slices/hubStockApiSlice';
import Loader from '../shared/Loader';
import HubStockItem from './HubStockItem';

const HubStock = () => {
  const {id} = useParams('id');
  // console.log("Hub Id:", id)
  const [stocks, setStocks] = useState([]);





  const {data,isLoading } = useGetHubStockQuery({id});
  
  useEffect(()=>{
    if(data){
      console.log("setting data")
      setStocks(data.hubStock)
    }

  },[isLoading,data])

  if(isLoading){
    return <Loader />
  }



  console.log("data",data)
  
  console.log("Name", stocks[0]?.hubId?.name)

  
  

  return (
    <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
        
      <div className="container">
        <h1 className='text-4xl font-medium mb-6'>{stocks[0]?.hubId?.name}</h1>

        <div className="stocks_wrapper flex gap-6 flex-wrap">

          {stocks.map((item,index) => (
            <HubStockItem key={item._id} item={item} />
          ))}

        </div>



      </div>
    </div>
  )
}

export default HubStock