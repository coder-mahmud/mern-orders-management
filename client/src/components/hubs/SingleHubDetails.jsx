import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';

import Loader from '../shared/Loader';
import HubOrderItem from './HubOrderItem';
import Kalpurush from '../../components/kalpurush-normal';
import { useGetHubByIdQuery, useAddProductToHubMutation } from '../../slices/hubApiSlice';
import { useGetAllProductQuery } from '../../slices/productApiSlice';
import { useGetHubOrderQuery } from '../../slices/orderApiSclice';
import { useGetAllUsersQuery } from '../../slices/userApiSlice';

const DELIVERED_STATUSES = ['Delivered', 'Offline Delivery'];
const ADMIN_ROLES = ['admin', 'superAdmin'];
const ORDER_TYPES = ['All', 'New', 'Pending'];

const normalize = (value = '') => String(value).toLowerCase().trim();

const sumDeliveryCharge = (orders = []) =>
  orders.reduce((total, order) => total + Number(order.deliveryCharge || 0), 0);

const buildPriceMap = (products = []) =>
  products.reduce((map, product) => {
    map[product.name] = Number(product.price || 0);
    return map;
  }, {});

const buildItemSummary = (orders = [], priceMap = {}) => {
  const summaryMap = orders.reduce((map, order) => {
    order.orderItems?.forEach((item) => {
      const name = item.name;
      const quantity = Number(item.quantity || 0);
      const current = map[name] || { name, quantity: 0, price: priceMap[name] || 0 };

      current.quantity += quantity;
      current.totalPrice = current.quantity * current.price;
      map[name] = current;
    });

    return map;
  }, {});

  return Object.values(summaryMap)
    .filter((item) => item.quantity > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
};

const getItemsTotal = (items = []) =>
  items.reduce((total, item) => total + Number(item.quantity || 0), 0);

const getItemsPriceTotal = (items = []) =>
  items.reduce((total, item) => total + Number(item.totalPrice || 0), 0);

const SummaryList = ({ title, items, emptyText, showAdminTotals, deliveryCharge }) => {
  const totalItems = getItemsTotal(items);
  const totalPrice = getItemsPriceTotal(items);

  return (
    <div className="product_count">
      <p className="section_title text-lg font-semibold mt-6">{title}</p>

      {items.length ? (
        <>
          {items.map((item) => (
            <p key={item.name} className="mb-1">
              {item.name}: {item.quantity}
            </p>
          ))}

          <div className="h-[1px] w-[100px] bg-amber-600 my-4" />

          {showAdminTotals && (
            <>
              <p>Total Items: {totalItems} kg</p>
              <p>Total Price: {totalPrice}</p>
              <p>Total Delivery Charge: {deliveryCharge}</p>
            </>
          )}
        </>
      ) : (
        emptyText
      )}
    </div>
  );
};

const SingleHubDetails = () => {
  const { id } = useParams();
  const userRole = useSelector((state) => state?.auth?.userInfo?.role);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [showType, setShowType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError, error } = useGetHubByIdQuery(id);
  const { data: productData, isLoading: isProductLoading } = useGetAllProductQuery();
  const [addProductToHub, { isLoading: isAddProductLoading }] = useAddProductToHubMutation();
  const { data: hubOrder, isLoading: isHubOrderLoading } = useGetHubOrderQuery({
    id,
    date: dayjs(deliveryDate).format('YYYY-MM-DD'),
  });
  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUserError,
    error: userError,
  } = useGetAllUsersQuery();

  if (isError) console.log('Hub Error', error);
  if (isUserError) console.log('User Error', userError);

  const orders = hubOrder?.orders || [];
  const products = productData?.products || [];
  const users = usersData?.users || [];
  const showAdminTotals = ADMIN_ROLES.includes(userRole);

  const priceMap = useMemo(() => buildPriceMap(products), [products]);

  const orderGroups = useMemo(() => {
    const pending = orders.filter((order) => order.orderStatus === 'Pending');
    const delivered = orders.filter((order) => DELIVERED_STATUSES.includes(order.orderStatus));
    const cancelled = orders.filter((order) => order.orderStatus === 'Cancelled');
    const offline = orders.filter((order) => order.orderStatus === 'Offline Delivery');
    const verified = orders.filter((order) => order.verifyStatus === 'Verified');

    return { pending, delivered, cancelled, offline, verified };
  }, [orders]);

  const itemSummaries = useMemo(
    () => ({
      all: buildItemSummary(orders, priceMap),
      delivered: buildItemSummary(orderGroups.delivered, priceMap),
      pending: buildItemSummary(orderGroups.pending, priceMap),
    }),
    [orders, orderGroups.delivered, orderGroups.pending, priceMap]
  );

  const visibleOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesType = showType === 'All' || order.orderType === showType;
      const matchesSearch = normalize(order.customerDetails).includes(normalize(searchTerm));
      return matchesType && matchesSearch;
    });
  }, [orders, showType, searchTerm]);

  const handleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productsData = selectedProducts.map((productId) => ({ productId, stock: 0 }));

    try {
      await addProductToHub({ id, productsData }).unwrap();
      setSelectedProducts([]);
    } catch (err) {
      console.log(err);
    }
  };

  const exportCSV = (ordersToExport) => {
    if (!ordersToExport.length) {
      alert('No orders to export!');
      return;
    }

    const csvHeaders = ['Customer', 'Status', 'Delivery Charge', 'Final Price', 'Delivery Date'];
    const csvData = ordersToExport.map((order) => ({
      Customer: order.customerDetails?.replace(/\n/g, ' ') || '',
      Status: order.orderStatus,
      'Delivery Charge': order.deliveryCharge,
      'Final Price': order.finalPrice,
      'Delivery Date': new Date(order.deliveryDate).toLocaleString(),
    }));

    csvData.push({
      Customer: `Total Orders: ${ordersToExport.length}`,
      Status: '',
      'Delivery Charge': '',
      'Final Price': '',
      'Delivery Date': '',
    });

    const csvString = Papa.unparse({ fields: csvHeaders, data: csvData });
    const csvBlob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    saveAs(csvBlob, 'orders.csv');
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.addFileToVFS('Kalpurush.ttf', Kalpurush);
    doc.addFont('Kalpurush.ttf', 'Kalpurush', 'normal');
    doc.setFont('Kalpurush');

    let y = 10;
    const margin = 10;
    const maxY = 280;

    orders.forEach((order, index) => {
      const cleanedText = `${index + 1}. ${order.customerDetails?.replace(/\n+/g, ' ').trim()}`;
      const lines = doc.splitTextToSize(cleanedText, 180);
      const blockHeight = lines.length * 7 + 3;

      if (y + blockHeight > maxY) {
        doc.addPage();
        y = margin;
      }

      doc.text(lines, margin, y);
      y += blockHeight;
    });

    doc.save('customer-details.pdf');
  };

  if (isLoading || isProductLoading || isHubOrderLoading || isUsersLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-800 text-white min-h-[95vh] py-14">
      <div className="container">
        <h1 className="text-xl font-semibold mb-6">{data?.hub?.name}</h1>

        <div className="hub_header flex flex-col md:flex-row gap-8 items-start md:items-center mb-6">
          <div className="flex gap-2 items-center">
            <p className="mb-2">Date:</p>
            <DatePicker
              className="date_input mb-6 h-11 flex items-center border border-gray-500 rounded px-4"
              selected={deliveryDate}
              onChange={setDeliveryDate}
              dateFormat="dd/MM/yyyy"
            />
          </div>

          <Link className="rounded px-6 py-2 bg-amber-700 hover:bg-amber-800 cursor-pointer font-semibold" to={`/hubs/${id}/stock`}>
            Hub Stock
          </Link>
          <Link className="rounded px-6 py-2 bg-amber-700 hover:bg-amber-800 cursor-pointer font-semibold" to={`/hubs/${id}/calculation`}>
            Hub Daily Calculation
          </Link>
        </div>

        {orders.length > 0 && (
          <button className="border rounded border-gray-500 p-4 cursor-pointer" onClick={generatePDF}>
            Download Report
          </button>
        )}

        {orders.length === 0 ? (
          'No order for selected day yet!'
        ) : (
          <div className="mb-20">
            <div className="hubOrderInfo my-4 text-lg">
              <p className="section_title text-lg font-semibold">Hub Orders Summary:</p>
              <p>Total Orders : {orders.length}</p>
              <p>Verified Orders : {orderGroups.verified.length}</p>
              <p>Total Pending: {orderGroups.pending.length}</p>
              <p>Total Delivered: {orderGroups.delivered.length}</p>
              <p>Offline Delivery: {orderGroups.offline.length}</p>
              <p>Total Cancelled: {orderGroups.cancelled.length}</p>

              <div className="products_count_wrap">
                <SummaryList
                  title="Orders Items:"
                  items={itemSummaries.all}
                  emptyText="No ordered product found."
                  showAdminTotals={showAdminTotals}
                  deliveryCharge={sumDeliveryCharge(orders)}
                />

                <SummaryList
                  title="Delivered Items:"
                  items={itemSummaries.delivered}
                  emptyText="No delivered product found."
                  showAdminTotals={showAdminTotals}
                  deliveryCharge={sumDeliveryCharge(orderGroups.delivered)}
                />

                <SummaryList
                  title="Pending Items:"
                  items={itemSummaries.pending}
                  emptyText="No pending product found."
                  showAdminTotals={showAdminTotals}
                  deliveryCharge={sumDeliveryCharge(orderGroups.pending)}
                />
              </div>
            </div>

            <p className="text-xl font-semibold mt-10 border-b border-gray-500 mb-4">Orders:</p>

            <div className="types_wrap flex gap-5">
              {ORDER_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setShowType(type)}
                  className={`rounded px-6 py-2 hover:bg-amber-800 cursor-pointer font-semibold ${
                    showType === type ? 'bg-amber-700' : 'bg-gray-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="order_count mt-4">
              <p className="text-lg font-medium">Count: {visibleOrders.length}</p>
            </div>

            <div className="search my-4">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                className="py-2 px-4 border border-gray-500"
                placeholder="Search"
              />
            </div>

            <div className="hidden md:flex justify-between gap-4 py-4 border-b border-gray-500">
              <p className="w-[50px]">SL No.</p>
              <p className="flex-2">Customer Details</p>
              <p className="flex-1">Phone Number</p>
              <p className="flex-[1.5]">Order Details</p>
              <p className="flex-[.75]">Type</p>
              <p className="flex-[.75]">Status</p>
              <p className="flex-[.75]">Verified</p>
              <p className="flex-1 flex justify-start">Created By</p>
              <p className="flex-[.75] flex justify-end">Action</p>
            </div>

            {visibleOrders.map((order, index) => (
              <HubOrderItem index={index} key={order._id} order={order} users={users} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleHubDetails;
