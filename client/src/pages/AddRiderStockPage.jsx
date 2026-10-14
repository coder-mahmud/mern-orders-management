import React, { useEffect, useState } from 'react';
import { useGetAllProductQuery } from '../slices/productApiSlice';
import { useGetAllUsersQuery } from '../slices/userApiSlice';
import { 
  useCreateOrUpdateRiderStockMutation, 
  useLazyGetRiderStockByDateQuery 
} from '../slices/riderStockApiSlice';
import Loader from '../components/shared/Loader';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AddRiderStockPage = () => {
  const userId = useSelector(state => state?.auth?.userInfo?.id);
  const userRole = useSelector(state => state?.auth?.userInfo?.role);

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  if (userRole === 'user' || userRole === 'rider') {
    return <Navigate to="/hubs" replace />;
  }

  const [showLoader, setShowLoader] = useState(false);
  const [selectedRider, setSelectedRider] = useState('');
  const [stockDate, setStockDate] = useState(new Date());
  const [productStocks, setProductStocks] = useState([]);
  const [exchangedNote, setExchangedNote] = useState('');

  const { data, isLoading } = useGetAllProductQuery();
  const { data: usersData, isLoading: isUsersLoading } = useGetAllUsersQuery();
  const [createOrUpdateRiderStock, { isLoading: isSaving }] =
    useCreateOrUpdateRiderStockMutation();
  
  const [fetchStockByDate, { isFetching: isFetchingStock }] = useLazyGetRiderStockByDateQuery();

  // Initialize empty product stock structure with assignedQty and remainingQty[cite: 16]
  useEffect(() => {
    if (!isLoading && data?.products) {
      const initialStocks = data.products.map((product) => ({
        productId: product._id,
        name: product.name,
        assignedQty: '',
        remainingQty: '',
      }));
      setProductStocks(initialStocks);
    }
  }, [isLoading, data]);

  // Fetch and populate stock whenever selectedRider or stockDate changes[cite: 16]
  useEffect(() => {
    const loadExistingStock = async () => {
      if (!selectedRider || !stockDate || !data?.products) return;

      try {
        const formattedDate = dayjs(stockDate).format('YYYY-MM-DD');
        const res = await fetchStockByDate({ 
          riderId: selectedRider, 
          date: formattedDate 
        }).unwrap();

        if (res?.riderStock) {
          const existingAssignedMap = {};
          const existingRemainingMap = {};

          res.riderStock.items.forEach(item => {
            const prodId = item.productId?._id || item.productId;
            existingAssignedMap[prodId] = item.assignedQty;
            existingRemainingMap[prodId] = item.remainingQty;
          });

          setProductStocks(data.products.map((product) => ({
            productId: product._id,
            name: product.name,
            assignedQty: existingAssignedMap[product._id] !== undefined ? existingAssignedMap[product._id] : '',
            remainingQty: existingRemainingMap[product._id] !== undefined ? existingRemainingMap[product._id] : '',
          })));

          setExchangedNote(res.riderStock.exchangedProductsNote || '');
          toast.info("Loaded existing stock for this date");
        }
      } catch (err) {
        // If 404 (no stock found for this date), reset fields to blank for a new entry[cite: 16]
        const initialStocks = data.products.map((product) => ({
          productId: product._id,
          name: product.name,
          assignedQty: '',
          remainingQty: '',
        }));
        setProductStocks(initialStocks);
        setExchangedNote('');
      }
    };

    loadExistingStock();
  }, [selectedRider, stockDate, data, fetchStockByDate]);

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

  const handleQuantityChange = (productId, field, value) => {
    setProductStocks((prevStocks) =>
      prevStocks.map((item) =>
        item.productId === productId
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!selectedRider) {
      toast.error('Please select a rider');
      return;
    }

    const items = productStocks
      .map((item) => ({
        productId: item.productId,
        assignedQty: Number(item.assignedQty || 0),
        remainingQty: Number(item.remainingQty || 0),
      }))
      .filter((item) => item.assignedQty > 0 || item.remainingQty > 0);

    if (items.length === 0) {
      toast.error('Please enter stock for at least one product');
      return;
    }

    const payload = {
      riderId: selectedRider,
      date: stockDate,
      items,
      exchangedProductsNote: exchangedNote,
    };

    try {
      setShowLoader(true);
      const apiRes = await createOrUpdateRiderStock(payload).unwrap();
      toast.success(apiRes?.message || 'Rider stock saved successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save rider stock');
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <>
      {(showLoader || isSaving || isFetchingStock) && <Loader />}

      <div className='bg-gray-800 text-white min-h-[95vh] py-14'>
        <div className="container">
          <h1 className='text-xl font-semibold mb-6'>Rider Stock Entry:</h1>

          <form onSubmit={submitHandler}>
            <div className="form_row flex flex-col gap-2 mb-6">
              <label>Select Rider:</label>
              <select
                className='border rounded border-gray-500 h-11 flex items-center px-4 bg-gray-700'
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
              <label>Stock Date:</label>
              <DatePicker
                className='date_input h-11 flex items-center border border-gray-500 rounded px-4 bg-gray-700'
                selected={stockDate}
                onChange={(date) => setStockDate(date)}
                dateFormat="dd/MM/yyyy"
              />
            </div>

            <div className="form_row flex flex-col gap-2 mb-6 mt-6">
              <label className="font-semibold text-lg">Product Stocks:</label>

              {/* Column Headings */}
              <div className='hidden sm:flex items-center gap-3 font-semibold text-gray-400 text-sm border-b border-gray-600 pb-2 mt-2'>
                <div className='w-[250px]'>Product Name</div>
                <div className='w-[180px]'>Assigned qty</div>
                <div className='w-[180px]'>Remaining qty by Rider</div>
              </div>

              <div className="flex flex-col gap-4 mt-2">
                {productStocks.map((product) => (
                  <div
                    key={product.productId}
                    className='flex flex-col sm:flex-row sm:items-center gap-3 border-b border-gray-600 pb-3'
                  >
                    <div className='w-full sm:w-[250px] font-medium'>
                      {product.name}
                    </div>

                    {/* Assigned Qty Input */}
                    <div className='w-full sm:w-[180px]'>
                      <label className='block sm:hidden text-xs text-gray-400 mb-1'>Assigned qty</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder='Assigned Qty'
                        className='border rounded border-gray-500 py-2 px-4 w-full bg-gray-700'
                        value={product.assignedQty}
                        onChange={(e) =>
                          handleQuantityChange(product.productId, 'assignedQty', e.target.value)
                        }
                      />
                    </div>

                    {/* Remaining Qty Input */}
                    <div className='w-full sm:w-[180px]'>
                      <label className='block sm:hidden text-xs text-gray-400 mb-1'>Remaining qty by Rider</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder='Remaining Qty'
                        className='border rounded border-gray-500 py-2 px-4 w-full bg-gray-700'
                        value={product.remainingQty}
                        onChange={(e) =>
                          handleQuantityChange(product.productId, 'remainingQty', e.target.value)
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
                placeholder="Write notes about exchanged products..."
                className="border border-gray-500 rounded px-4 py-2 bg-gray-700 text-white"
                value={exchangedNote}
                onChange={(e) => setExchangedNote(e.target.value)}
              />
            </div>

            <div className="mt-8">
              <button className='text-center rounded px-6 py-2 bg-amber-700 hover:bg-amber-800 cursor-pointer font-semibold'>
                Save Rider Stock
              </button>
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