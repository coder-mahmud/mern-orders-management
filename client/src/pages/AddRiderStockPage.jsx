import React, { useEffect, useState } from 'react';
import { useGetAllProductQuery } from '../slices/productApiSlice';
import { useGetAllUsersQuery } from '../slices/userApiSlice';
import { useCreateOrUpdateRiderStockMutation } from '../slices/riderStockApiSlice';
import Loader from '../components/shared/Loader';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Button from '../components/Button';

const AddRiderStockPage = () => {
  const userId = useSelector(state => state?.auth?.userInfo?.id);
  const userRole = useSelector(state => state?.auth?.userInfo?.role);

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  if (userRole === 'user' || userRole === 'userAdmin' || userRole === 'rider') {
    return <Navigate to="/hubs" replace />;
  }

  const [showLoader, setShowLoader] = useState(false);
  const [selectedRider, setSelectedRider] = useState('');
  const [stockDate, setStockDate] = useState(new Date());
  const [productStocks, setProductStocks] = useState([]);

  const { data, isLoading } = useGetAllProductQuery();
  const { data: usersData, isLoading: isUsersLoading } = useGetAllUsersQuery();
  const [createOrUpdateRiderStock, { isLoading: isSaving }] =
    useCreateOrUpdateRiderStockMutation();

  useEffect(() => {
    if (!isLoading && data?.products) {
      const initialStocks = data.products.map((product) => ({
        productId: product._id,
        name: product.name,
        assignedQty: '',
      }));

      setProductStocks(initialStocks);
    }
  }, [isLoading, data]);

  if (isLoading || isUsersLoading) {
    return <Loader />;
  }

  const riders =
    usersData?.users?.filter((user) => {
      if (Array.isArray(user.role)) {
        return user.role.includes('rider');
      }
      return user.role === 'rider';
    }) || [];

    // console.log("usersData:",usersData)
    // console.log("Riders:",riders)

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
    console.log("Form submitted!")

    if (!selectedRider) {
      toast.error('Please select a rider');
      return;
    }

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
      riderId: selectedRider,
      date: stockDate,
      items,
    };

    try {
      setShowLoader(true);
      const apiRes = await createOrUpdateRiderStock(payload).unwrap();
      console.log('apiRes', apiRes);

      toast.success(apiRes?.message || 'Rider stock saved successfully');

      setSelectedRider('');
      setStockDate(new Date());
      setProductStocks((prev) =>
        prev.map((item) => ({
          ...item,
          assignedQty: '',
        }))
      );
    } catch (error) {
      console.log('error', error);
      toast.error(error?.data?.message || 'Failed to save rider stock');
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <>
      {(showLoader || isSaving) && <Loader />}

      <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
        <div className="container">
          <h1 className='text-xl font-semibold mb-6'>Rider Stock Entry:</h1>

          <form onSubmit={submitHandler}>
            <div className="form_row flex flex-col gap-2 mb-6">
              <label htmlFor="">Select Rider:</label>
              <select
                className='border rounded border-gray-500 h-11 flex items-center px-4'
                value={selectedRider}
                onChange={(e) => setSelectedRider(e.target.value)}
              >
                <option value="">Select one:</option>
                {riders.map((rider) => (
                  <option key={rider._id} value={rider._id}>
                    {rider.firstName} {rider.lastName} ({rider.username})
                  </option>
                ))}
              </select>
            </div>

            <div className="form_row flex flex-col gap-2 relative w-xl max-w-[180px] mb-6">
              <label htmlFor="">Stock Date:</label>
              <DatePicker
                className='date_input h-11 flex items-center border border-gray-500 rounded px-4'
                selected={stockDate}
                onChange={(date) => setStockDate(date)}
                dateFormat="dd/MM/yyyy"
              />
            </div>

            <div className="form_row flex flex-col gap-2 mb-6 mt-6">
              <label htmlFor="">Product Stocks:</label>

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
                        step="1"
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

            <div className="mt-8">
              <button className='text-center rounded px-6 py-2 bg-amber-700  hover:bg-amber-800 cursor-pointer font-semibold'>Save Rider Stock</button>
            </div>
          </form>

          <div className='mt-8 text-sm text-gray-300'>
            <p>
              <span className='font-semibold'>Selected Date:</span>{' '}
              {dayjs(stockDate).format("DD-MM-YYYY")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRiderStockPage;