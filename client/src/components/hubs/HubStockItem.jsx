import React, { useState } from "react";
import Pencil from "../../assets/images/Pencil.svg";
import { useEditHubStockMutation } from "../../slices/hubStockApiSlice";
import Loader from "../shared/Loader";
import {toast} from 'react-toastify'
import { useSelector } from "react-redux";
import dayjs from 'dayjs'



const HubStockItem = ({ item }) => {
  // console.log("Item from single stock item", item)
  const [showUpdate, setShowUpdate] = useState(false);
  const [stockItem,setStockItem] = useState(item)
  const [showLoader,setShowLoader] = useState(false)

  const userRole =  useSelector(state =>  state?.auth?.userInfo?.role);
  const curUser = useSelector(state =>  state?.auth?.userInfo?.id);
  // console.log("userRole",userRole)

  const [editHubStock, {isLoading}] = useEditHubStockMutation();

  const now = dayjs();

  const handleChange = (e) => {
    console.log("Changing data:", e.target.value)
    
    let updated = {...stockItem, quantity:parseFloat(e.target.value, 10) || 0};
    setStockItem(updated);
  };

  const handleSave = async (stockId, quantity) => {
    setShowLoader(true)
    const data = {
      stockId:stockItem._id,
      quantity: stockItem.quantity,
      stockChangeTime:now,
      stockChangedBy:curUser
    }
    console.log("Stock:", stockItem )
    console.log("data:", data )
    try {
      const apiRes = await editHubStock(data).unwrap();
      console.log("apiRes", apiRes)
      setShowUpdate(false)
      toast.success("Stock updated!")
    } catch (err) {
      console.error(err);
      toast.error("Some went wrong!")
      // alert("Update failed.");
    } finally {
      setShowLoader(false)
    }
  };






  return (
    <div className="py-5 border-b border-gray-500 single_stock w-full sm:w-[45%] md:w-[30%] lg:w-[22%]">
      <p className="mb-2 text-xl font-semibold">Item: {item?.productId?.name}</p>
      {showLoader && <Loader />}
      {!showUpdate && (

        <div className="stock_wrapper">
          <div className="">
            <p className="mb-4 text-xl">Quantity: {item.quantity}</p>
            <p className="mb-2 text-lg">{item?.stockChangedBy?.firstName}</p>
            {item?.stockChangeTime ? <p className="mb-4 text-lg">{ dayjs( item.stockChangeTime).format("DD MMM, hh:mm a") }</p> : ''}
            
            
            {userRole == 'admin' || userRole == 'superAdmin' ? <div className="rounded px-6 py-2 bg-amber-600 hover:bg-amber-800 cursor-pointer font-semibold inline-flex items-center gap-2" onClick={() => setShowUpdate(true)} >
              <img className="h-4" src={Pencil} />
              Edit Stock
            </div>: ''}
            
          </div>
        </div>
      )}
      
      {showUpdate && (
        <div className="change flex flex-col gap-4 ">
          <p className="text-xl">Input New Quantity:</p>
          <input
            className="border rounded border-white py-2 px-4 w-[200px]"
            type="number"
            value={stockItem.quantity}
            onChange={(e) => handleChange(e)}
          />
          <div className="cta_wrap flex gap-6 items-center">
            <div className="cancel rounded px-6 py-2 bg-red-600 hover:bg-red-800 cursor-pointer font-semibold inline-block items-center" onClick={() => setShowUpdate(false)}>Cancel</div>
            <div className="w-[160px] rounded px-6 py-2 bg-amber-600 hover:bg-amber-800 cursor-pointer font-semibold inline-block items-center gap-2 text-center" onClick={handleSave}>
              Update
            </div>
          </div>
        </div>
      )}
      


    </div>
  );
};

export default HubStockItem;
