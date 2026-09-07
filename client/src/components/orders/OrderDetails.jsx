import React from 'react';
import { useParams, Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useGetOrderByIdQuery } from '../../slices/orderApiSclice';
import Loader from '../shared/Loader';

const OrderDetails = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetOrderByIdQuery(id);

  if (isLoading) {
    return <Loader />;
  }

  console.log("data:",data)

  if (error || !data?.order) {
    return (
      <div className="bg-gray-800 text-white min-h-[95vh] py-14">
        <div className="container mx-auto px-4">
          <p className="text-rose-400 font-semibold">Error loading order details or order not found.</p>
          <Link to="/" className="text-blue-400 hover:underline mt-4 inline-block">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const order = data.order;

  // Helper function to colorize status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-900/60 text-green-300 border-green-500';
      case 'Pending':
        return 'bg-yellow-900/60 text-yellow-300 border-yellow-500';
      case 'Cancelled':
        return 'bg-rose-900/60 text-rose-300 border-rose-500';
      default:
        return 'bg-gray-700 text-gray-300 border-gray-500';
    }
  };

  return (
    <div className="bg-gray-800 text-white min-h-[95vh] py-14">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 border-b border-gray-700 pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3 flex flex-col md:flex-row gap-3">
              Order #{order.websiteOrderId || order._id}
              <span
                className={`text-xs px-2.5 py-1 rounded-full border uppercase tracking-wider font-semibold ${getStatusBadge(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </span>
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Placed on {dayjs(order.createdAt).format('DD MMM, YYYY - hh:mm A')}
            </p>
          </div>

          <button
            onClick={() => window.history.back()}
            className="self-start md:self-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-semibold transition-colors"
          >
            &larr; Back
          </button>
        </div>

        {/* Top Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Customer & Shipping Info */}
          <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-purple-400 mb-3">
              Customer Details
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-400 font-medium">Name / Details:</span>{' '}
                {order.customerDetails || 'N/A'}
              </p>
              <p>
                <span className="text-gray-400 font-medium">Phone:</span>{' '}
                {order.phoneNumber || 'N/A'}
              </p>
              <p>
                <span className="text-gray-400 font-medium">Order Source:</span>{' '}
                {order.orderSource || 'N/A'}
              </p>
            </div>
          </div>

          {/* Logistics & Hub Info */}
          <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-purple-400 mb-3">
              Fulfillment & Hub
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-400 font-medium">Hub Name:</span>{' '}
                <span className="font-semibold text-amber-400">
                  {order.hub?.name || (typeof order.hub === 'string' ? order.hub : 'N/A')}
                </span>
              </p>
              <p>
                <span className="text-gray-400 font-medium">Assigned Rider:</span>{' '}
                {order.rider
                  ? `${order.rider.firstName || ''} ${order.rider.lastName || ''}`
                  : 'Unassigned'}
              </p>
              <p>
                <span className="text-gray-400 font-medium">Delivery Status (Rider):</span>{' '}
                <span className="font-medium">{order.deliveryStatusByRider || 'Pending'}</span>
              </p>
              {order.deliveryDate && (
                <p>
                  <span className="text-gray-400 font-medium">Delivery Date:</span>{' '}
                  {dayjs(order.deliveryDate).format('DD MMM, YYYY')}
                </p>
              )}
            </div>
          </div>

          {/* Verification & Staff Info */}
          <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-purple-400 mb-3">
              Verification & Audit
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-400 font-medium">Verification Status:</span>{' '}
                <span className="font-semibold">{order.verifyStatus || 'Pending'}</span>
              </p>
              <p>
                <span className="text-gray-400 font-medium">Created By:</span>{' '}
                {order.user?.firstName
                  ? `${order.user.firstName} ${order.user.lastName || ''}`
                  : 'System'}
              </p>
              {order.verifiedBy && (
                <p>
                  <span className="text-gray-400 font-medium">Verified By:</span>{' '}
                  {order.verifiedBy.firstName ? `${order.verifiedBy.firstName} ${order.verifiedBy.lastName || ''}` : 'Staff'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-5 mb-6">
          <h2 className="text-lg font-semibold text-purple-400 mb-4">Ordered Items</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-sm">
                  <th className="py-3 px-2">#</th>
                  <th className="py-3 px-2">Item Name</th>
                  <th className="py-3 px-2 text-center">Quantity (kg)</th>
                  <th className="py-3 px-2 text-right">Unit Price</th>
                  <th className="py-3 px-2 text-right">Total Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-sm">
                {order.orderItems?.map((item, index) => (
                  <tr key={item.productId?._id || item.productId || index}>
                    <td className="py-3 px-2 text-gray-400">{index + 1}</td>
                    <td className="py-3 px-2 font-medium">{item.name}</td>
                    <td className="py-3 px-2 text-center">{item.quantity} kg</td>
                    <td className="py-3 px-2 text-right">{Number(item.price || 0).toFixed(2)} tk</td>
                    <td className="py-3 px-2 text-right font-semibold">
                      {Number(item.totalPrice || 0).toFixed(2)} tk
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="flex justify-end">
          <div className="w-full md:w-80 bg-gray-900/60 border border-gray-700 rounded-lg p-5 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-purple-400 border-b border-gray-700 pb-2">
              Payment Summary
            </h2>

            <div className="flex justify-between text-sm text-gray-300">
              <span>Subtotal (Products):</span>
              <span>{Number(order.orderPrice || 0).toFixed(2)} tk</span>
            </div>

            <div className="flex justify-between text-sm text-gray-300">
              <span>Delivery Charge:</span>
              <span>{Number(order.deliveryCharge || 0).toFixed(2)} tk</span>
            </div>

            <div className="flex justify-between text-sm text-rose-400">
              <span>Discount:</span>
              <span>- {Number(order.discount || 0).toFixed(2)} tk</span>
            </div>

            <div className="border-t border-gray-700 pt-3 flex justify-between font-bold text-lg text-white">
              <span>Grand Total:</span>
              <span className="text-green-400">{Number(order.finalPrice || 0).toFixed(2)} tk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;