import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import Loader from '../components/shared/Loader';
import { useGetAllRidersSummaryByDateQuery } from '../slices/riderStockApiSlice';

const AllRidersSummary = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');

  const {
    data,
    isLoading,
    error,
  } = useGetAllRidersSummaryByDateQuery({ date: formattedDate });
  
  console.log("data:",data, isLoading, error)

  const riders = data?.riders || [];

  return (
    <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
      <div className='container'>
        <h1 className='text-xl font-semibold mb-6'>All Riders Summary</h1>

        <div className='form_row flex flex-col gap-2 relative w-xl max-w-[180px] mb-6'>
          <label>Select Date:</label>
          <DatePicker
            className='date_input h-11 flex items-center border border-gray-500 rounded px-4 bg-gray-800 text-white'
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat='dd/MM/yyyy'
          />
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <p>No rider summary found for {formattedDate}</p>
        ) : riders.length === 0 ? (
          <p>No rider summary available for this date.</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'>
            {riders.map((rider, index) => (
              <div
                key={rider.riderId || index}
                className='border border-gray-600 rounded-lg p-5 bg-gray-900'
              >
                <h2 className='text-lg font-semibold mb-3 text-green-400'>
                  {rider.rider.firstName} {rider.rider.lastName}
                </h2>

                <p className='text-sm text-gray-300 mb-2'>
                  Total Delivered Orders: {rider.totalDeliveredOrders || 0}
                </p>

                <p className='text-sm text-gray-300 mb-2'>
                  Total Delivered Quantity: {Number(rider.totalDeliveredQty || 0).toFixed(1)} kg
                </p>

                <p className='text-sm text-gray-300 mb-2'>
                  Total Order Price: {Number(rider.totalOrderPrice || 0).toFixed(2)} tk
                </p>

                <p className='text-sm text-gray-300 mb-2'>
                  Total Delivery Charge: {Number(rider.totalDeliveryCharge || 0).toFixed(2)} tk
                </p>

                <p className='text-sm text-gray-300 mb-2'>
                  Total Discount: {Number(rider.totalDiscount || 0).toFixed(2)} tk
                </p>

                <p className='text-sm text-gray-300 font-semibold'>
                  Grand Total Final Price: {Number(rider.grandTotalFinalPrice || 0).toFixed(2)} tk
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRidersSummary;