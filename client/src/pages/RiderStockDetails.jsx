import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';
import Loader from '../components/shared/Loader';
import {
  useGetRiderStockByDateQuery,
  useGetRiderRemainingStockQuery,
  useGetRiderDeliverySummaryQuery,
} from '../slices/riderStockApiSlice';
import { useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';




const RiderStockDetails = () => {
  const { riderId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('current');
  const [phoneSearch, setPhoneSearch] = useState('');

  const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');

  const userId = useSelector((state) => state?.auth?.userInfo?.id);
  const userRole = useSelector((state) => state?.auth?.userInfo?.role);

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  if (userRole === 'user' || userRole === 'userAdmin') {
    return <Navigate to="/hubs" replace />;
  }  

  const {
    data: assignedData,
    isLoading: assignedLoading,
    error: assignedError,
  } = useGetRiderStockByDateQuery(
    {
      riderId,
      date: formattedDate,
    },
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

  const {
    data: deliverySummaryData,
    isLoading: deliverySummaryLoading,
    error: deliverySummaryError,
  } = useGetRiderDeliverySummaryQuery(
    {
      riderId,
      date: formattedDate,
    }
  );

  const isLoading =
    assignedLoading || currentLoading || deliverySummaryLoading;

  const error =
    assignedError || currentError || deliverySummaryError;

  const riderStock = assignedData?.riderStock;
  const currentStock = currentData;
  const deliveredOrders = deliverySummaryData?.orders || [];

  const filteredDeliveredOrders = useMemo(() => {
    const searchValue = phoneSearch.trim().toLowerCase();

    if (!searchValue) return deliveredOrders;

    return deliveredOrders.filter((order) => {
      const phone =
        order?.phoneNumber ||
        order?.shippingAddress?.phone ||
        '';

      return String(phone).toLowerCase().includes(searchValue);
    });
  }, [deliveredOrders, phoneSearch]);

console.log("assignedData",assignedData)

  return (
    <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
      <div className='container'>
        <h1 className='text-xl font-semibold mb-6'>Rider Stock Details</h1>

        <div className="flex justify-between">
          <div className="form_row flex flex-col gap-2 relative w-xl max-w-[180px] mb-6">
            <label>Select Date:</label>
            <DatePicker
              className='date_input h-11 flex items-center border border-gray-500 rounded px-4'
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
            />
          </div>

          <div className="">
          {(userRole === 'staff' || userRole === 'admin' || userRole === 'superAdmin') ? (
            <Link to={`/riders/${riderId}/edit`} className='inline-block rounded px-6 py-2 bg-amber-700 hover:bg-amber-800 cursor-pointer font-semibold'>Edit riders Stock</Link>
          ) : ''}
          </div>

        </div>

        {/* 
        <div className='flex gap-4 mb-6'>
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
        </div>
        */}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <p>
            No {viewMode === 'current' ? 'current stock / delivered orders' : 'assigned stock'} found
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

            <p className='text-sm text-gray-300 mb-2'>
              Total Delivered Orders: {currentStock?.totalDeliveredOrders || 0}
            </p>

            <p className='text-sm text-gray-300 mb-2'>
              Total Delivered Quantity: {currentStock?.totalDeliveredQty || 0} kg
            </p>

            <p className='text-sm text-gray-300 mb-2'>
              Total Order Price: {Number(currentStock?.totalOrderPrice || 0).toFixed(2)} tk
            </p>

            <p className='text-sm text-gray-300 mb-2'>
              Total Delivery Charge: {Number(currentStock?.totalDeliveryCharge || 0).toFixed(2)} tk
            </p>

            <p className='text-sm text-gray-300 mb-2'>
              Total Discount: {Number(currentStock?.totalDiscount || 0).toFixed(2)} tk
            </p>

            <p className='text-sm text-gray-300 mb-6'>
              Grand Total Final Price: {Number(currentStock?.grandTotalFinalPrice || 0).toFixed(2)} tk
            </p>

            {/* DELIVERED ITEM TOTALS */}
            <div className='border border-gray-700 rounded-lg p-4 mb-6'>
              <h3 className='text-lg font-semibold mb-3 text-green-400'>
                Delivered Item Totals
              </h3>

              <div className='flex flex-col gap-3'>
                <div className='hidden sm:flex justify-between border-b border-gray-500 pb-2 font-semibold'>
                  <span className='w-[70%]'>Product</span>
                  <span className='w-[30%] text-center'>Delivered Qty</span>
                </div>

                {currentStock?.deliveredSummary?.map((item) => (
                  <div
                    key={item.productId}
                    className='flex flex-col sm:flex-row justify-between border-b border-gray-600 pb-2 gap-2'
                  >
                    <span className='w-full sm:w-[70%]'>
                      <span className='sm:hidden font-semibold'>Product: </span>
                      {item.productName}
                    </span>

                    <span className='w-full sm:w-[30%] text-left sm:text-center'>
                      <span className='sm:hidden font-semibold'>Delivered Qty: </span>
                      {item.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* REMAINING ITEM TOTALS */}
            <div className='border border-gray-700 rounded-lg p-4 mb-6'>
              <h3 className='text-lg font-semibold mb-3 text-yellow-400'>
                Remaining Item Totals
              </h3>

              <div className='flex flex-col gap-3'>
                <div className='hidden sm:flex justify-between border-b border-gray-500 pb-2 font-semibold'>
                  <span className='w-[70%]'>Product</span>
                  <span className='w-[30%] text-center'>Remaining Qty</span>
                </div>

                {currentStock?.remainingSummary?.map((item) => (
                  <div
                    key={item.productId}
                    className='flex flex-col sm:flex-row justify-between border-b border-gray-600 pb-2 gap-2'
                  >
                    <span className='w-full sm:w-[70%]'>
                      <span className='sm:hidden font-semibold'>Product: </span>
                      {item.productName}
                    </span>

                    <span className='w-full sm:w-[30%] text-left sm:text-center'>
                      <span className='sm:hidden font-semibold'>Remaining Qty: </span>
                      {item.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* FULL DETAILS TABLE */}
            <div className='border border-gray-700 rounded-lg p-4 mb-6'>
              <h3 className='text-lg font-semibold mb-3 text-blue-400'>
                Full Stock Details
              </h3>

              <div className='flex flex-col gap-3'>
                <div className='hidden sm:flex justify-between border-b border-gray-500 pb-2 font-semibold'>
                  <span className='w-[22%]'>Product</span>
                  <span className='w-[12%] text-center'>Assigned</span>
                  <span className='w-[12%] text-center'>Delivered</span>
                  <span className='w-[16%] text-center'>Order Price</span>
                  <span className='w-[12%] text-center'>Remaining</span>
                </div>

                {currentStock?.remainingItems?.map((item) => (
                  <div
                    key={item.productId}
                    className='flex flex-col sm:flex-row justify-between border-b border-gray-600 pb-2 gap-2'
                  >
                    <span className='w-full sm:w-[22%]'>
                      <span className='sm:hidden font-semibold'>Product: </span>
                      {item.productName}
                    </span>

                    <span className='w-full sm:w-[12%] text-left sm:text-center'>
                      <span className='sm:hidden font-semibold'>Assigned: </span>
                      {item.assignedQty}
                    </span>

                    <span className='w-full sm:w-[12%] text-left sm:text-center'>
                      <span className='sm:hidden font-semibold'>Delivered: </span>
                      {item.deliveredQty}
                    </span>

                    <span className='w-full sm:w-[16%] text-left sm:text-center'>
                      <span className='sm:hidden font-semibold'>Order Price: </span>
                      ৳{Number(item.totalOrderPrice || 0).toFixed(2)}
                    </span>

                    <span className='w-full sm:w-[12%] text-left sm:text-center font-semibold'>
                      <span className='sm:hidden font-semibold'>Remaining: </span>
                      {item.remainingQty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* DELIVERED ORDERS LIST - LAST SECTION */}
            <div className='border border-gray-700 rounded-lg p-4'>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4'>
                <h3 className='text-lg font-semibold text-purple-400'>
                  Delivered Orders List
                </h3>

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

              {filteredDeliveredOrders.length === 0 ? (
                <p className='text-sm text-gray-300'>
                  {phoneSearch ? 'No orders found for this phone number.' : 'No delivered orders found for this date.'}
                </p>
              ) : (
                <>
                <div>
                  <div className='hidden md:flex justify-between gap-4 py-4 border-b border-gray-500 font-semibold'>
                    <p className='w-[50px]'>SL No.</p>
                    <p className='flex-2'>Customer Details</p>
                    <p className='flex-1'>Phone Number</p>
                    <p className='flex-[1.5]'>Order Details</p>
                    <p className='flex-[.75]'>Type</p>
                    <p className='flex-[.75]'>Status</p>
                    <p className='flex-[.75]'>Verified</p>
                    <p className='flex-1 flex justify-start'>Created By</p>
                  </div>

                  {filteredDeliveredOrders.map((order, index) => (
                    <div
                      key={order._id}
                      className='flex flex-col md:flex-row justify-between gap-4 py-4 border-b border-gray-500 lg:items-center'
                    >
                      <p className='w-[50px]'>{index + 1}.</p>

                      <p className='flex-2'>
                        <span className='inline-block md:hidden'>Customer Details :</span>{' '}
                        {order?.customerDetails ||
                          order?.shippingAddress?.fullName ||
                          'N/A'}
                      </p>

                      <p className='flex-1'>
                        <span className='inline-block md:hidden'>Phone Number :</span>{' '}
                        {order?.phoneNumber ||
                          order?.shippingAddress?.phone ||
                          'N/A'}
                      </p>

                      <p className='flex-[1.5]'>
                        <span className='inline-block md:hidden'>Order Details :</span>{' '}
                        {order?.orderItems?.map((item, itemIndex) => (
                          <span key={item.productId?._id || item.productId || itemIndex}>
                            {item.productId?.name || item.name} - {item.quantity}kg
                            {itemIndex !== order.orderItems.length - 1 ? ', ' : ''}
                          </span>
                        ))}{' '}
                        | {Number(order?.finalPrice || 0).toFixed(2)}tk
                      </p>

                      <p className='flex-[.75]'>
                        <span className='inline-block md:hidden'>Type :</span>{' '}
                        {order?.orderType || '-'}
                      </p>

                      <p className='flex-[.75]'>
                        <span className='inline-block md:hidden'>Status :</span>{' '}
                        {order?.orderStatus || (order?.isDelivered ? 'Delivered' : '-')}
                      </p>

                      <p className='flex-[.75]'>
                        <span className='inline-block md:hidden'>Verified :</span>{' '}
                        {order?.verifyStatus || '-'}
                        {order?.verifyStatus === 'Verified' && order?.verifiedBy?.firstName
                          ? ` - ${order.verifiedBy.firstName}`
                          : ''}
                        {order?.verifyTime
                          ? ` - ${dayjs(order.verifyTime).format('DD MMM, hh:mm a')}`
                          : ''}
                      </p>

                      <p className='flex-1 flex justify-start'>
                        <span className='inline-block md:hidden'>Created By: </span>
                        {order?.user?.firstName
                          ? `${order.user.firstName} - ${dayjs(order.createdAt).format('DD MMM, hh:mm a')}`
                          : dayjs(order.createdAt).format('DD MMM, hh:mm a')}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-300 mt-4">
                  <span className="font-semibold">Exchange Note:</span> {assignedData?.riderStock.exchangedProductsNote}
                </p>
                </>
                
              )}

              
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