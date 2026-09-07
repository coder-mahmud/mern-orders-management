import React, { useMemo, useState } from 'react';
import { useParams, Link, Navigate,useSearchParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';
import Loader from '../components/shared/Loader';
import { useGetComparedRiderOrdersQuery } from '../slices/riderStockApiSlice';
import { useSelector } from 'react-redux';

const RiderOrderComparison = () => {
  const { riderId } = useParams();
  const [searchParams] = useSearchParams();
  const [phoneSearch, setPhoneSearch] = useState('');
  const initialDate = searchParams.get('date')
    ? new Date(searchParams.get('date'))
    : new Date();

  const [selectedDate, setSelectedDate] = useState(initialDate);

  
  const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');

  const userId = useSelector((state) => state?.auth?.userInfo?.id);
  const userRole = useSelector((state) => state?.auth?.userInfo?.role);

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  if (userRole === 'user' || userRole === 'userAdmin') {
    return <Navigate to="/hubs" replace />;
  }

  const { data, isLoading, error } = useGetComparedRiderOrdersQuery({
    riderId,
    date: formattedDate,
  });

  const orders = data?.orders || [];

  const filteredOrders = useMemo(() => {
    const searchValue = phoneSearch.trim().toLowerCase();
    if (!searchValue) return orders;

    return orders.filter((order) => {
      const phone =
        order?.phoneNumber ||
        order?.shippingAddress?.phone ||
        '';

      return String(phone).toLowerCase().includes(searchValue);
    });
  }, [orders, phoneSearch]);

  return (
    <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
      <div className='container'>
        <div className='flex justify-between items-center mb-6 flex-col md:flex-row gap-2'>
          <h1 className='text-xl font-semibold'>Rider vs Admin Order Comparison</h1>
          <h2 className='text-xl font-semibold'>
            Rider: {data?.riderInfo?.firstName} {data?.riderInfo?.lastName}
          </h2>

          <Link
            to={`/riders/${riderId}`}
            className='inline-block rounded px-4 py-2 bg-gray-600 hover:bg-gray-700 text-sm font-semibold'
          >
            Back to Rider Stock Details
          </Link>
        </div>

        <div className="flex justify-between items-end mb-6 gap-4">
          <div className="form_row flex flex-col gap-2 relative w-xl max-w-[180px]">
            <label>Select Date:</label>
            <DatePicker
              className='date_input h-11 flex items-center border border-gray-500 rounded px-4 bg-gray-800 text-white'
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
            />
          </div>

          <div className='w-full md:w-[320px]'>
            <input
              type='text'
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              placeholder='Search by phone number'
              className='w-full h-11 border border-gray-500 rounded px-4 bg-gray-800 text-white outline-none'
            />
          </div>
        </div>

        {/* Status Legend Bar */}
        {data && !isLoading && (
          <div className='flex flex-wrap gap-4 mb-6 p-4 border border-gray-700 rounded-lg bg-gray-900/50 text-sm'>
            <div className='flex items-center gap-2'>
              <span className='w-3 h-3 rounded-full bg-green-500'></span>
              <span>Matched ({data.matchedCount || 0})</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='w-3 h-3 rounded-full bg-yellow-500'></span>
              <span>Rider View Only ({data.riderOnlyCount || 0})</span>
            </div>
            <div className='flex items-center gap-2'>
              <span className='w-3 h-3 rounded-full bg-rose-500'></span>
              <span>Admin View Only ({data.adminOnlyCount || 0})</span>
            </div>
          </div>
        )}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <p className='text-rose-400'>No comparison data found for this rider on {formattedDate}.</p>
        ) : (
          <div className='border border-gray-600 rounded-lg p-4'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4'>
              <h3 className='text-lg font-semibold text-purple-400'>
                Comparison List
              </h3>
            </div>

            {filteredOrders.length === 0 ? (
              <p className='text-sm text-gray-300'>
                {phoneSearch ? 'No orders found for this phone number.' : 'No orders found for this date.'}
              </p>
            ) : (
              <div>
                <div className='hidden md:flex justify-between gap-4 py-4 border-b border-gray-500 font-semibold text-sm'>
                  <p className='w-[40px]'>SL.</p>
                  <p className='flex-1'>Hub</p>
                  <p className='flex-2'>Customer Details</p>
                  <p className='flex-1'>Phone Number</p>
                  <p className='flex-[1.5]'>Order Details</p>
                  <p className='flex-1'>Status</p>
                  <p className='flex-1 flex justify-start'>Created By</p>
                  <p className='w-[60px] flex justify-start'>Link</p>
                </div>

                {filteredOrders.map((order, index) => {
                  let statusBg = '';
                  let statusLabel = '';

                  if (order.matchStatus === 'MATCHED') {
                    statusBg = 'bg-green-900/40 border-green-600 text-green-300';
                    statusLabel = 'Matched';
                  } else if (order.matchStatus === 'RIDER_ONLY') {
                    statusBg = 'bg-yellow-900/40 border-yellow-600 text-yellow-300';
                    statusLabel = 'Rider Only';
                  } else {
                    statusBg = 'bg-rose-900/40 border-rose-600 text-rose-300';
                    statusLabel = 'Admin Only';
                  }

                  // Safely retrieve Hub Name whether hub is populated object or string ID
                  const hubName = order?.hub?.name || (typeof order?.hub === 'string' ? order.hub : 'N/A');

                  return (
                    <div
                      key={order._id}
                      className={`flex flex-col md:flex-row justify-between gap-4 py-4 px-3 my-2 border rounded-md lg:items-center text-sm ${statusBg}`}
                    >
                      <p className='w-[40px]'>{index + 1}.</p>

                      <p className='flex-1 font-medium text-amber-300'>
                        <span className='inline-block md:hidden font-semibold text-white'>Hub Name :</span>{' '}
                        {hubName}
                      </p>

                      <p className='flex-2'>
                        <span className='inline-block md:hidden font-semibold'>Customer Details :</span>{' '}
                        {order?.customerDetails ||
                          order?.shippingAddress?.fullName ||
                          'N/A'}
                      </p>

                      <p className='flex-1'>
                        <span className='inline-block md:hidden font-semibold'>Phone Number :</span>{' '}
                        {order?.phoneNumber ||
                          order?.shippingAddress?.phone ||
                          'N/A'}
                      </p>

                      <p className='flex-[1.5]'>
                        <span className='inline-block md:hidden font-semibold'>Order Details :</span>{' '}
                        {order?.orderItems?.map((item, itemIndex) => (
                          <span key={item.productId?._id || item.productId || itemIndex}>
                            {item.productId?.name || item.name} - {item.quantity}kg
                            {itemIndex !== order.orderItems.length - 1 ? ', ' : ''}
                          </span>
                        ))}{' '}
                        | {Number(order?.finalPrice || 0).toFixed(2)}tk
                      </p>

                      <p className='flex-1'>
                        <span className='inline-block md:hidden font-semibold'>Status :</span>{' '}
                        <span className='inline-block px-2 py-1 text-xs rounded font-bold uppercase tracking-wider border border-current'>
                          {statusLabel}
                        </span>
                      </p>

                      <p className='flex-1 flex justify-start'>
                        <span className='inline-block md:hidden font-semibold'>Created By: </span>
                        {order?.user?.firstName
                          ? `${order.user.firstName} - ${dayjs(order.createdAt).format('DD MMM, hh:mm a')}`
                          : dayjs(order.createdAt).format('DD MMM, hh:mm a')}
                      </p>

                      <p className='w-[60px] flex justify-start'>
                        <Link to={`/order/${order._id}`} className='text-blue-400 hover:underline'>Details</Link>
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderOrderComparison;