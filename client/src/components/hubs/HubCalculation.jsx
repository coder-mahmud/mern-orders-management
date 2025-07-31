import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import { useHubCalcByDateQuery } from '../../slices/calculationApiSlice';
import Loader from '../shared/Loader';
import { useGetAllProductQuery } from '../../slices/productApiSlice';
import SingleHubCalculation from './SingleHubCalculation';
import { useGetHubByIdQuery } from '../../slices/hubApiSlice';

const HubCalculation = () => {
  const { id } = useParams('id');
  const today = dayjs(new Date()).format('YYYY-MM-DD');
  const [stockDate, setStockDate] = useState(today);
  const [calcData, setCalcData] = useState([])


  const { data: calcApiData = [], isLoading, isError } = useHubCalcByDateQuery({ hub: id, date: stockDate });
  const { data: productsData, isLoading: productsLoading } = useGetAllProductQuery();
  const {data:hubData , isLoading:isHubLoading} = useGetHubByIdQuery(id)



  useEffect(() => {
    if(calcApiData){
      setCalcData(calcApiData)
    }
    
  },[calcApiData])





  if (isLoading || productsLoading || isHubLoading ) return <Loader />;
  if (isError) return <div className="text-red-500 p-4">Failed to load calculation data.</div>;

  console.log("calcData",calcData)
  console.log("hubData",hubData)

  const mergedData = productsData.products.map(product => {
    const calc = calcData.calculation?.find(c => c.productId._id === product._id);
    return {
      ...product,
      calculation: calc || null,
    };
  });

  // const calcArray = Array.isArray(calcData) ? calcData : calcData.calculation || [];

  // const mergedData = productsData.products.map(product => {
  //   const calc = calcArray.find(c => c.productId._id === product._id);
  //   return {
  //     ...product,
  //     calculation: calc || null,
  //   };
  // });




  console.log("mergedData",mergedData)
  console.log("stockDate",stockDate)

  return (
    <div className="bg-gray-800 text-white min-h-[95vh] py-14">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-medium mb-4">{ hubData.hub.name }</h2>
        
        <div className="flex gap-2 items-center mb-6">
          <p className='mb-2'>Date:</p>
          <DatePicker className='date_input mb-6 h-11 flex items-center border border-gray-500 rounded px-4' selected={stockDate} onChange={(date) => setStockDate(dayjs(date).format("YYYY-MM-DD"))} dateFormat="dd/MM/yyyy" />
        </div>




        <div className="flex gap-6 flex-wrap">
          {mergedData.map(item => (
            <SingleHubCalculation
              key={item._id}
              product={item}
              hubId={id}
              stockDate={stockDate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HubCalculation;
