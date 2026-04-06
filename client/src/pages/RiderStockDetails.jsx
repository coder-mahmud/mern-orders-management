import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';
import Loader from '../components/shared/Loader';
import {
  useGetRiderStockByDateQuery,
  useGetRiderRemainingStockQuery,
} from '../slices/riderStockApiSlice';

//import { useGetUserByIdQuery } from '../slices/userApiSlice';

const RiderStockDetails = () => {
  const { riderId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('current'); // current | assigned
  //const {data:userData, isLoading:userDataLoading} = useGetUserByIdQuery({userId:riderId})

  const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');

  const {
    data: assignedData,
    isLoading: assignedLoading,
    error: assignedError,
  } = useGetRiderStockByDateQuery(
    {
      riderId,
      date: formattedDate,
    },
    {
      skip: viewMode !== 'assigned',
    }
  );

  const {
    data: currentData,
    isLoading: currentLoading,
    error: currentError,
  } = useGetRiderRemainingStockQuery(
    {
      riderId,
      date: formattedDate,
    },
    {
      skip: viewMode !== 'current',
    }
  );

  const isLoading = assignedLoading || currentLoading;
  const error = assignedError || currentError;

  const riderStock = assignedData?.riderStock;
  const currentStock = currentData;



  return (
    <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
      <div className='container'>
        <h1 className='text-xl font-semibold mb-6'>Rider Stock Details</h1>
        <h2></h2>

        <div className="form_row flex flex-col gap-2 relative w-xl max-w-[180px] mb-6">
          <label htmlFor="">Select Date:</label>
          <DatePicker
            className='date_input h-11 flex items-center border border-gray-500 rounded px-4'
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
          />
        </div>

        {/* <div className='flex gap-4 mb-6'>
          <button
            onClick={() => setViewMode('current')}
            className={`rounded px-6 py-2 cursor-pointer font-semibold ${
              viewMode === 'current'
                ? 'bg-green-700 hover:bg-green-800'
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            See Current Stock
          </button>

          <button
            onClick={() => setViewMode('assigned')}
            className={`rounded px-6 py-2 cursor-pointer font-semibold ${
              viewMode === 'assigned'
                ? 'bg-amber-700 hover:bg-amber-800'
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
          >
            See Assigned Stock
          </button>
        </div> */}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <p>
            No {viewMode === 'current' ? 'current stock' : 'assigned stock'} found
            for this rider on {formattedDate}
          </p>
        ) : viewMode === 'current' && currentStock ? (
          <div className='border border-gray-600 rounded-lg p-4'>
            <h2 className='text-lg font-semibold mb-2'>
              {currentStock?.rider?.firstName} {currentStock?.rider?.lastName}
            </h2>

            <p className='text-sm text-gray-300 mb-2'>
              Date: {dayjs(currentStock?.date).format('DD-MM-YYYY')}
            </p>

            <p className='text-sm text-gray-300 mb-4'>
              Total Delivered Orders: {currentStock?.totalDeliveredOrders || 0}
            </p>

            <div className='flex flex-col gap-3'>
              <div className='hidden sm:flex justify-between border-b border-gray-500 pb-2 font-semibold'>
                <span className='w-[35%]'>Product</span>
                <span className='w-[20%] text-center'>Assigned</span>
                <span className='w-[20%] text-center'>Delivered</span>
                <span className='w-[25%] text-center'>Remaining</span>
              </div>

              {currentStock?.remainingItems?.map((item) => (
                <div
                  key={item.productId}
                  className='flex flex-col sm:flex-row justify-between border-b border-gray-600 pb-2 gap-2'
                >
                  <span className='w-full sm:w-[35%]'>
                    <span className='sm:hidden font-semibold'>Product: </span>
                    {item.productName}
                  </span>

                  <span className='w-full sm:w-[20%] text-left sm:text-center'>
                    <span className='sm:hidden font-semibold'>Assigned: </span>
                    {item.assignedQty}
                  </span>

                  <span className='w-full sm:w-[20%] text-left sm:text-center'>
                    <span className='sm:hidden font-semibold'>Delivered: </span>
                    {item.deliveredQty}
                  </span>

                  <span className='w-full sm:w-[25%] text-left sm:text-center font-semibold'>
                    <span className='sm:hidden font-semibold'>Remaining: </span>
                    {item.remainingQty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : viewMode === 'assigned' && riderStock ? (
          <div className='border border-gray-600 rounded-lg p-4'>
            <h2 className='text-lg font-semibold mb-2'>
              {riderStock?.rider?.firstName} {riderStock?.rider?.lastName}
            </h2>

            <p className='text-sm text-gray-300 mb-4'>
              Date: {dayjs(riderStock?.date).format('DD-MM-YYYY')}
            </p>

            <div className='flex flex-col gap-3'>
              <div className='hidden sm:flex justify-between border-b border-gray-500 pb-2 font-semibold'>
                <span className='w-[70%]'>Product</span>
                <span className='w-[30%] text-center'>Assigned Qty</span>
              </div>

              {riderStock?.items?.map((item) => (
                <div
                  key={item.productId?._id || item.productId}
                  className='flex flex-col sm:flex-row justify-between border-b border-gray-600 pb-2 gap-2'
                >
                  <span className='w-full sm:w-[70%]'>
                    <span className='sm:hidden font-semibold'>Product: </span>
                    {item.productId?.name || 'Unknown Product'}
                  </span>

                  <span className='w-full sm:w-[30%] text-left sm:text-center'>
                    <span className='sm:hidden font-semibold'>Assigned Qty: </span>
                    {item.assignedQty}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>No stock data available.</p>
        )}
      </div>
    </div>
  );
};

export default RiderStockDetails;