import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import Loader from '../components/shared/Loader';
import {
  useGetAllProductQuery,
} from '../slices/productApiSlice';
import {
  useGetAllUsersQuery,
} from '../slices/userApiSlice';
import {
  useCreateOrUpdateRiderStockMutation,
  useGetRiderStockByDateQuery,
} from '../slices/riderStockApiSlice';

const EditRiderStockPage = () => {
  const navigate = useNavigate();
  const { riderId } = useParams();





  const userId = useSelector((state) => state?.auth?.userInfo?.id);
  const userRole = useSelector((state) => state?.auth?.userInfo?.role);

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  if (userRole === 'user' || userRole === 'userAdmin' || userRole === 'rider') {
    return <Navigate to="/hubs" replace />;
  }

  const [showLoader, setShowLoader] = useState(false);
  const [stockDate, setStockDate] = useState(new Date());
  const [productStocks, setProductStocks] = useState([]);
  const [exchangedNote, setExchangedNote] = useState('');

  const formattedDate = dayjs(stockDate).format('YYYY-MM-DD');

  const { data: productsData, isLoading: isProductsLoading } = useGetAllProductQuery();
  const { data: usersData, isLoading: isUsersLoading } = useGetAllUsersQuery();

  const {
    data: stockByDateData,
    isLoading: isStockLoading,
    error: stockByDateError,
  } = useGetRiderStockByDateQuery({
    riderId,
    date: formattedDate,
  });

  const [createOrUpdateRiderStock, { isLoading: isSaving }] =
    useCreateOrUpdateRiderStockMutation();

  const riderStock = stockByDateData?.riderStock;

  const rider = useMemo(() => {
    return usersData?.users?.find((user) => user._id === riderId);
  }, [usersData, riderId]);

  useEffect(() => {
    if (!isProductsLoading && productsData?.products) {
      const initialStocks = productsData.products.map((product) => ({
        productId: product._id,
        name: product.name,
        assignedQty: '',
      }));

      setProductStocks(initialStocks);
    }
  }, [isProductsLoading, productsData]);

  useEffect(() => {
    if (!productsData?.products) return;

    const stockItems = riderStock?.items || [];

    const updatedStocks = productsData.products.map((product) => {
      const matchedItem = stockItems.find((item) => {
        const itemProductId = item?.productId?._id || item?.productId;
        return String(itemProductId) === String(product._id);
      });

      return {
        productId: product._id,
        name: product.name,
        assignedQty: matchedItem ? matchedItem.assignedQty : '',
      };
    });

    setProductStocks(updatedStocks);
    setExchangedNote(riderStock?.exchangedProductsNote || '');
  }, [productsData, riderStock, formattedDate]);

  const handleQuantityChange = (productId, value) => {
    setProductStocks((prevStocks) =>
      prevStocks.map((item) =>
        item.productId === productId
          ? { ...item, assignedQty: value }
          : item
      )
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const items = productStocks
      .map((item) => ({
        productId: item.productId,
        assignedQty: Number(item.assignedQty || 0),
      }))
      .filter((item) => item.assignedQty > 0);

    if (items.length === 0) {
      toast.error('Please enter stock for at least one product');
      return;
    }

    const payload = {
      riderId,
      date: stockDate,
      items,
      exchangedProductsNote: exchangedNote,
    };

    try {
      setShowLoader(true);

      const apiRes = await createOrUpdateRiderStock(payload).unwrap();

      toast.success(apiRes?.message || 'Rider stock updated successfully');

      navigate(`/riders/${riderId}`);
    } catch (error) {
      console.log('error', error);
      toast.error(error?.data?.message || 'Failed to update rider stock');
    } finally {
      setShowLoader(false);
    }
  };

  if (isProductsLoading || isUsersLoading || isStockLoading) {
    return <Loader />;
  }

  return (
    <>
      {(showLoader || isSaving) && <Loader />}

      <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
        <div className="container">
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
            <h1 className='text-xl font-semibold'>Edit Rider Stock</h1>

            <button
              type='button'
              onClick={() => navigate(-1)}
              className='text-center rounded px-6 py-2 bg-gray-600 hover:bg-gray-700 cursor-pointer font-semibold'
            >
              Back
            </button>
          </div>

          <form onSubmit={submitHandler}>
            <div className="form_row flex flex-col gap-2 mb-6">
              <label>Selected Rider:</label>
              <input
                type="text"
                readOnly
                className='border rounded border-gray-500 h-11 flex items-center px-4 bg-gray-700'
                value={
                  rider
                    ? `${rider.firstName} ${rider.lastName} (${rider.username})`
                    : riderStock?.rider
                    ? `${riderStock.rider.firstName} ${riderStock.rider.lastName} (${riderStock.rider.username})`
                    : 'Rider not found'
                }
              />
            </div>

            <div className="form_row flex flex-col gap-2 relative w-xl max-w-[180px] mb-6">
              <label>Stock Date:</label>
              <DatePicker
                className='date_input h-11 flex items-center border border-gray-500 rounded px-4'
                selected={stockDate}
                onChange={(date) => setStockDate(date)}
                dateFormat="dd/MM/yyyy"
              />
            </div>

            {stockByDateError ? (
              <div className='mb-6 rounded border border-yellow-600 bg-yellow-900/20 p-4 text-yellow-300'>
                No stock found for this rider on {formattedDate}. You can enter new values and save.
              </div>
            ) : (
              <div className='mb-6 rounded border border-green-700 bg-green-900/20 p-4 text-green-300'>
                Stock loaded for {formattedDate}. Update quantities and save.
              </div>
            )}

            <div className="form_row flex flex-col gap-2 mb-6 mt-6">
              <label>Product Stocks:</label>

              <div className="flex flex-col gap-4">
                {productStocks.map((product) => (
                  <div
                    key={product.productId}
                    className='flex flex-col sm:flex-row sm:items-center gap-3 border-b border-gray-600 pb-3'
                  >
                    <div className='w-full sm:w-[300px]'>
                      {product.name}
                    </div>

                    <div className='w-full sm:w-[180px]'>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder='Enter quantity'
                        className='border rounded border-gray-500 py-2 px-4 w-full'
                        value={product.assignedQty}
                        onChange={(e) =>
                          handleQuantityChange(product.productId, e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form_row flex flex-col gap-2 mb-6 mt-6">
              <label>Exchanged Products Note:</label>
              <textarea
                rows={4}
                placeholder='Write notes about exchanged products...'
                className='border border-gray-500 rounded px-4 py-2 bg-gray-800 text-white'
                value={exchangedNote}
                onChange={(e) => setExchangedNote(e.target.value)}
              />
            </div>

            <div className='mt-8 flex gap-4'>
              <button className='text-center rounded px-6 py-2 bg-amber-700 hover:bg-amber-800 cursor-pointer font-semibold'>
                Save Rider Stock
              </button>

              <button
                type='button'
                onClick={() => navigate(-1)}
                className='text-center rounded px-6 py-2 bg-gray-600 hover:bg-gray-700 cursor-pointer font-semibold'
              >
                Cancel
              </button>
            </div>
          </form>

          <div className='mt-8 text-sm text-gray-300'>
            <p>
              <span className='font-semibold'>Selected Date:</span>{' '}
              {dayjs(stockDate).format("DD-MM-YYYY")}
            </p>

            {riderStock?.updatedAt && (
              <p className='mt-2'>
                <span className='font-semibold'>Last Updated:</span>{' '}
                {dayjs(riderStock.updatedAt).format("DD-MM-YYYY hh:mm A")}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditRiderStockPage;