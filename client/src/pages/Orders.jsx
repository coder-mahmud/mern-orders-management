import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';

import Loader from '../components/shared/Loader';
import { useGetAllOrdersByDateQuery } from '../slices/orderApiSclice';
import { useGetAllProductQuery } from '../slices/productApiSlice';

const ADMIN_ROLES = ['admin', 'superAdmin'];
const INSIDE_DHAKA = 'insideDhaka';

const sortByProductOrder = (products = []) => {
  return [...products].sort((a, b) => {
    const sortA = a.sortOrder ?? 999999;
    const sortB = b.sortOrder ?? 999999;

    if (sortA !== sortB) return sortA - sortB;
    return a.name.localeCompare(b.name);
  });
};

const sumDeliveryCharge = (orders = []) => {
  return orders.reduce((total, order) => total + Number(order.deliveryCharge || 0), 0);
};

const buildItemSummary = (orders = [], products = []) => {
  const quantityMap = orders.reduce((map, order) => {
    order.orderItems?.forEach((item) => {
      map[item.name] = (map[item.name] || 0) + Number(item.quantity || 0);
    });

    return map;
  }, {});

  return sortByProductOrder(products)
    .map((product) => {
      const quantity = quantityMap[product.name] || 0;
      const price = Number(product.price || 0);

      return {
        name: product.name,
        quantity,
        price,
        totalPrice: quantity * price,
      };
    })
    .filter((item) => item.quantity > 0);
};

const getItemsTotal = (items = []) => {
  return items.reduce((total, item) => total + Number(item.quantity || 0), 0);
};

const getItemsPriceTotal = (items = []) => {
  return items.reduce((total, item) => total + Number(item.totalPrice || 0), 0);
};

const OrdersItemSummary = ({ items, showAdminTotals, deliveryCharge }) => {
  const totalItems = getItemsTotal(items);
  const totalPrice = getItemsPriceTotal(items);

  return (
    <>
      <p className="section_title text-lg font-semibold mt-6">Orders Items:</p>

      {items.length ? (
        <>
          {items.map((item) => (
            <p key={item.name} className="mb-1">
              {item.name}: {item.quantity}
            </p>
          ))}

          <div className="mt-4">
            {showAdminTotals && (
              <>
                <p>Total Ordered Items: {totalItems} kg</p>
                <p>Total Ordered Price: {totalPrice}</p>
                <p>Total Delivery Charge: {deliveryCharge}</p>
              </>
            )}
          </div>
        </>
      ) : (
        <p>No ordered product found.</p>
      )}
    </>
  );
};

const Orders = () => {
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const userRole = useSelector((state) => state?.auth?.userInfo?.role);

  const { data, isLoading, isError, error } = useGetAllOrdersByDateQuery(
    dayjs(deliveryDate).format('YYYY-MM-DD')
  );
  const { data: productData, isLoading: isProductLoading } = useGetAllProductQuery();

  const allOrders = data?.orders || [];
  const products = productData?.products || [];
  const showAdminTotals = ADMIN_ROLES.includes(userRole);

  const insideDhakaOrders = useMemo(() => {
    return allOrders.filter((order) => order.hub?.type === INSIDE_DHAKA);
  }, [allOrders]);

  const orderGroups = useMemo(() => {
    const pending = insideDhakaOrders.filter((order) => order.orderStatus === 'Pending');
    const delivered = insideDhakaOrders.filter((order) => order.orderStatus === 'Delivered');
    const cancelled = insideDhakaOrders.filter((order) => order.orderStatus === 'Cancelled');
    const offline = insideDhakaOrders.filter((order) => order.orderStatus === 'Offline Delivery');
    const verified = insideDhakaOrders.filter((order) => order.verifyStatus === 'Verified');

    return { pending, delivered, cancelled, offline, verified };
  }, [insideDhakaOrders]);

  const itemSummary = useMemo(() => {
    return buildItemSummary(insideDhakaOrders, products);
  }, [insideDhakaOrders, products]);

  const totalDeliveryCharge = useMemo(() => {
    return sumDeliveryCharge(insideDhakaOrders);
  }, [insideDhakaOrders]);

  if (isLoading || isProductLoading) {
    return <Loader />;
  }

  if (isError) {
    console.log('Orders error:', error);
  }

  return (
    <div className="bg-gray-800 text-white min-h-[95vh] py-14">
      <div className="container">
        <div className="flex gap-2 items-center mb-6">
          <p className="mb-2">Date:</p>
          <DatePicker
            className="date_input mb-6 h-11 flex items-center border border-gray-500 rounded px-4"
            selected={deliveryDate}
            onChange={setDeliveryDate}
            dateFormat="dd/MM/yyyy"
          />
        </div>

        {insideDhakaOrders.length > 0 ? (
          <div className="hubOrderInfo my-4 text-lg">
            <div className="hubTypeSwitch mb-10">
              <Link
                to="/sub-orders"
                className="rounded px-6 py-2 bg-amber-700 hover:bg-amber-800 cursor-pointer font-semibold"
              >
                Show Sub Dhaka
              </Link>
            </div>

            <p className="section_title text-xl font-bold mb-2">Inside Dhaka:</p>
            <p className="section_title text-lg font-semibold">Total Orders Summary:</p>

            <p>Total Orders : {insideDhakaOrders.length}</p>
            <p>Total Verified : {orderGroups.verified.length}</p>
            <p>Total Pending: {orderGroups.pending.length}</p>
            <p>Online Delivery: {orderGroups.delivered.length}</p>
            <p>Offline Delivery: {orderGroups.offline.length}</p>
            <p>Total Cancelled: {orderGroups.cancelled.length}</p>

            <OrdersItemSummary
              items={itemSummary}
              showAdminTotals={showAdminTotals}
              deliveryCharge={totalDeliveryCharge}
            />
          </div>
        ) : (
          'No order found for the date'
        )}
      </div>
    </div>
  );
};

export default Orders;