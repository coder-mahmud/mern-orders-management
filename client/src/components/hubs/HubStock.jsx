import React,{useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { useGetHubStockQuery } from '../../slices/hubStockApiSlice';
import Loader from '../shared/Loader';
import HubStockItem from './HubStockItem';
import { useGetHubStockHistoryQuery } from '../../slices/stockHistoryApiSlice';
import dayjs from 'dayjs'

const HubStock = () => {
  const {id} = useParams('id');
  // console.log("Hub Id:", id)
  const [stocks, setStocks] = useState([]);
  const today = dayjs(new Date()).format('YYYY-MM-DD');
  console.log("today",today)

  const {data:historyData, isLoading:historyLoading } = useGetHubStockHistoryQuery({hubId:id, date:today })




  const {data,isLoading } = useGetHubStockQuery({id});
  
  useEffect(()=>{
    if(data){
      console.log("setting data")
      setStocks(data.hubStock)
    }

  },[isLoading,data])

  if(isLoading || historyLoading){
    return <Loader />
  }



  console.log("Hub stock data",data)
  console.log("Hub stock history Data",historyData)
  
  // console.log("Name", stocks[0]?.hubId?.name)

  
  

  return (
    <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
        
      <div className="container">
        <h1 className='text-4xl font-medium mb-6'>{stocks[0]?.hubId?.name}</h1>

        <div className="starting_stock">
          <h2 className="text-2xl font-medium mb-4">Day Starting Stock:</h2>
          <div className="stocks_wrapper flex gap-6 flex-wrap">
            {historyData.stock.map(stock => <div className='flex gap-2'>
                <p className="text-lg">{stock.productId.name} : </p>
                <p className="text-lg">{stock.closingStock}</p>

            </div>)}

          </div>
          
        </div>

        <div className="current_stock mt-16">
          <h2 className="text-2xl font-medium">Current Stock:</h2>
          <div className="stocks_wrapper flex gap-6 flex-wrap">

            {stocks.map((item,index) => (
              <HubStockItem key={item._id} item={item} />
            ))}

          </div>
        </div>
        



      </div>
    </div>
  )
}

export default HubStock