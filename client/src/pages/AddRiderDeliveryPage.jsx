import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import Loader from "../components/shared/Loader";
import { useGetAllProductQuery } from "../slices/productApiSlice";
import { useGetAllUsersQuery } from "../slices/userApiSlice";
import {
  useCreateOrUpdateRiderInputByAdminMutation,
  useGetRiderInputByRiderAndDateForAdminQuery,
} from "../slices/riderInputApiSlice";

const hasRole = (userRole, roleName) => {
  if (Array.isArray(userRole)) {
    return userRole.includes(roleName);
  }

  return userRole === roleName;
};

const AddDelivery = () => {
  const userInfo = useSelector((state) => state?.auth?.userInfo);

  const userId = userInfo?._id || userInfo?.id;
  const userRole = userInfo?.role;

  const isBlockedRole =
    hasRole(userRole, "user") ||
    hasRole(userRole, "userAdmin") ||
    hasRole(userRole, "rider");

  const [selectedRider, setSelectedRider] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [productInputs, setProductInputs] = useState([]);
  const [extraNote, setExtraNote] = useState("");

  const formattedDate = dayjs(deliveryDate).format("YYYY-MM-DD");

  const { data: productData, isLoading: isProductsLoading } =
    useGetAllProductQuery(undefined, {
      skip: !userId || isBlockedRole,
    });

  const { data: usersData, isLoading: isUsersLoading } = useGetAllUsersQuery(
    undefined,
    {
      skip: !userId || isBlockedRole,
    }
  );

  const {
    data: existingInput,
    isLoading: isExistingInputLoading,
    isFetching: isExistingInputFetching,
  } = useGetRiderInputByRiderAndDateForAdminQuery(
    {
      riderId: selectedRider,
      date: formattedDate,
    },
    {
      skip: !userId || isBlockedRole || !selectedRider || !formattedDate,
    }
  );

  const [createOrUpdateRiderInputByAdmin, { isLoading: isSaving }] =
    useCreateOrUpdateRiderInputByAdminMutation();

  const riders =
    usersData?.users?.filter((user) => {
      if (Array.isArray(user.role)) {
        return user.role.includes("rider");
      }

      return user.role === "rider";
    }) || [];

  useEffect(() => {
    if (!productData?.products) return;

    const productsWithDeliveredQty = productData.products.map((product) => {
      const existingItem = existingInput?.items?.find(
        (item) =>
          item.product === product._id || item.product?._id === product._id
      );

      return {
        productId: product._id,
        name: product.name,
        deliveredQty: existingItem ? existingItem.quantity : "",
      };
    });

    setProductInputs(productsWithDeliveredQty);
    setExtraNote(existingInput?.extraNote || "");
  }, [productData, existingInput, selectedRider, formattedDate]);

  const handleQuantityChange = (productId, value) => {
    setProductInputs((prevInputs) =>
      prevInputs.map((item) =>
        item.productId === productId
          ? {
              ...item,
              deliveredQty: value,
            }
          : item
      )
    );
  };

  const handleMinus = (productId, currentValue) => {
    const newValue = Math.max(0, Number(currentValue || 0) - 1);
    handleQuantityChange(productId, newValue);
  };

  const handlePlus = (productId, currentValue) => {
    const newValue = Number(currentValue || 0) + 1;
    handleQuantityChange(productId, newValue);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!selectedRider) {
      toast.error("Please select a rider");
      return;
    }

    const items = productInputs
      .map((item) => ({
        product: item.productId,
        name: item.name,
        quantity: Number(item.deliveredQty || 0),
      }))
      .filter((item) => item.quantity > 0);

    if (items.length === 0) {
      toast.error("Please enter delivered quantity for at least one product");
      return;
    }

    const payload = {
      riderId: selectedRider,
      deliveryDate: formattedDate,
      items,
      extraNote,
    };

    try {
      const apiRes = await createOrUpdateRiderInputByAdmin(payload).unwrap();

      toast.success(
        apiRes?.message || "Rider delivered input saved successfully"
      );
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to save rider delivered input"
      );
    }
  };

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  if (isBlockedRole) {
    return <Navigate to="/hubs" replace />;
  }

  if (isProductsLoading || isUsersLoading) {
    return <Loader />;
  }

  return (
    <>
      {(isSaving || isExistingInputLoading) && <Loader />}

      <div className="bg-gray-800 text-white min-h-[95vh] py-14">
        <div className="container">
          <h1 className="text-xl font-semibold mb-6">
            Rider Delivered Product Entry:
          </h1>

          <form onSubmit={submitHandler}>
            <div className="form_row flex flex-col gap-2 mb-6">
              <label>Select Rider:</label>

              <select
                className="border rounded border-gray-500 h-11 flex items-center px-4 bg-gray-800 text-white"
                value={selectedRider}
                onChange={(e) => setSelectedRider(e.target.value)}
              >
                <option value="">Select one:</option>

                {riders.map((rider) => {
                  const riderName =
                    `${rider.firstName || ""} ${rider.lastName || ""}`.trim() ||
                    rider.name ||
                    rider.username;

                  return (
                    <option key={rider._id} value={rider._id}>
                      {riderName} ({rider.username})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="form_row flex flex-col gap-2 relative w-xl max-w-[180px] mb-6">
              <label>Delivery Date:</label>

              <DatePicker
                className="date_input h-11 flex items-center border border-gray-500 rounded px-4 bg-gray-800 text-white"
                selected={deliveryDate}
                onChange={(date) => setDeliveryDate(date)}
                dateFormat="dd/MM/yyyy"
              />
            </div>

            {selectedRider && existingInput?._id && (
              <div className="bg-yellow-600 text-white rounded p-4 mb-6">
                Existing delivery entry found for this rider and date. Saving
                again will update the previous entry.
              </div>
            )}

            {selectedRider && isExistingInputFetching && (
              <div className="bg-gray-700 text-white rounded p-4 mb-6">
                Checking existing delivery entry...
              </div>
            )}

            <div className="form_row flex flex-col gap-2 mb-6 mt-6">
              <label>Delivered Product Quantities:</label>

              <div className="flex flex-col gap-4">
                {productInputs.map((product) => (
                  <div
                    key={product.productId}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-gray-600 pb-3"
                  >
                    <div className="w-full sm:w-[300px]">{product.name}</div>

                    <div className="flex gap-3 items-center w-full sm:w-[260px]">
                      <button
                        type="button"
                        onClick={() =>
                          handleMinus(product.productId, product.deliveredQty)
                        }
                        className="px-3 py-1 bg-gray-300 rounded text-black"
                      >
                        -
                      </button>

                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="0"
                        className="border rounded border-gray-500 py-2 px-4 w-24 text-center bg-gray-800 text-white"
                        value={product.deliveredQty}
                        onChange={(e) =>
                          handleQuantityChange(
                            product.productId,
                            e.target.value
                          )
                        }
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handlePlus(product.productId, product.deliveredQty)
                        }
                        className="px-3 py-1 bg-gray-300 rounded text-black"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="form_row flex flex-col gap-2 mb-6 mt-6">
              <label>Extra Note:</label>

              <textarea
                rows={4}
                placeholder="Write note about this delivery entry..."
                className="border border-gray-500 rounded px-4 py-2 bg-gray-800 text-white"
                value={extraNote}
                onChange={(e) => setExtraNote(e.target.value)}
              />
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isSaving || !selectedRider}
                className="text-center rounded px-6 py-2 bg-amber-700 hover:bg-amber-800 cursor-pointer font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isSaving
                  ? "Saving..."
                  : existingInput?._id
                  ? "Update Delivered Entry"
                  : "Save Delivered Entry"}
              </button>
            </div>
          </form>

          <div className="mt-8 text-sm text-gray-300">
            <p>
              <span className="font-semibold">Selected Date:</span>{" "}
              {dayjs(deliveryDate).format("DD-MM-YYYY")}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDelivery;