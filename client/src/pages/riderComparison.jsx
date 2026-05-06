import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import Loader from "../components/shared/Loader";
import {
  useGetAllRiderInputComparisonByDateQuery,
  useUpdateRiderInputByAdminMutation,
} from "../slices/riderInputApiSlice";

const AllRiderProductComparison = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingReport, setEditingReport] = useState(null);
  const [editItems, setEditItems] = useState([]);

  const userRole = useSelector((state) => state?.auth?.userInfo?.role);

  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

  const { data, isLoading, isError, error } =
    useGetAllRiderInputComparisonByDateQuery(formattedDate);

  const [updateRiderInputByAdmin, { isLoading: isUpdating }] =
    useUpdateRiderInputByAdminMutation();

  const openEditModal = (riderReport) => {
    if (!riderReport.riderInputId) {
      toast.error("This rider has not submitted input yet.");
      return;
    }

    setEditingReport(riderReport);

    setEditItems(
      riderReport.items.map((item) => ({
        product: item.productId,
        name: item.productName,
        quantity: Number(item.riderInputQty || 0),
      }))
    );
  };

  const closeEditModal = () => {
    setEditingReport(null);
    setEditItems([]);
  };

  const handleEditQuantityChange = (productId, value) => {
    setEditItems((prev) =>
      prev.map((item) =>
        item.product === productId
          ? { ...item, quantity: Math.max(0, Number(value)) }
          : item
      )
    );
  };

  const handleAdminUpdate = async (e) => {
    e.preventDefault();

    if (!editingReport?.riderInputId) {
      toast.error("Rider input ID missing.");
      return;
    }

    try {
      await updateRiderInputByAdmin({
        id: editingReport.riderInputId,
        items: editItems,
      }).unwrap();

      toast.success("Rider input updated successfully!");
      closeEditModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update rider input.");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-800 text-white min-h-[95vh] py-14">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <h1 className="text-3xl">All Riders Product Comparison</h1>

          <div className="flex gap-2 items-center">
            <p>Date:</p>
            <DatePicker
              className="date_input h-11 border border-gray-500 rounded px-4 bg-gray-800 text-white"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>

        {isError && (
          <div className="bg-red-700 text-white rounded p-4 mb-6">
            {error?.data?.message ||
              error?.data?.error ||
              "Something went wrong"}
          </div>
        )}

        {!data?.riders?.length && !isError && (
          <div className="bg-gray-700 rounded p-6">
            No rider report found for this date.
          </div>
        )}

        <div className="flex flex-col gap-8">
          {data?.riders?.map((riderReport) => {
            const rider = riderReport.rider;

            return (
              <div
                key={rider?._id}
                className={`rounded p-6 border ${
                  riderReport.hasMismatch
                    ? "bg-red-950 border-red-500"
                    : "bg-gray-600 border-gray-500"
                }`}
              >
                <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-2xl font-semibold">
                        {rider?.firstName} {rider?.lastName}
                      </h2>

                      {userRole === "admin" && (
                        <button
                          type="button"
                          onClick={() => openEditModal(riderReport)}
                          disabled={!riderReport.hasRiderInput}
                          className="rounded px-4 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-sm font-semibold"
                        >
                          Edit Rider Input
                        </button>
                      )}
                    </div>

                    <p className="text-gray-300">
                      Phone: {rider?.phone || "N/A"}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="bg-gray-800 rounded px-4 py-2 flex items-center">
                      System Total:{" "}
                      <span className="font-semibold">
                        {riderReport.totalSystemDeliveredQty}
                      </span>
                    </div>

                    <div className="bg-gray-800 rounded px-4 py-2 flex items-center">
                      Rider Input Total:{" "}
                      <span className="font-semibold">
                        {riderReport.totalRiderInputQty}
                      </span>
                    </div>

                    <div
                      className={`rounded px-4 py-2 font-semibold flex items-center ${
                        riderReport.hasMismatch
                          ? "bg-red-600"
                          : "bg-green-600"
                      }`}
                    >
                      {riderReport.hasMismatch ? "Mismatch" : "Matched"}
                    </div>
                  </div>
                </div>

                {!riderReport.hasRiderInput && (
                  <div className="bg-yellow-600 text-white rounded p-3 mb-4">
                    This rider has not submitted product input for this date.
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[520px] md:min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-900">
                        <th className="border border-gray-500 p-2 md:p-3 text-left">
                          Product
                        </th>

                        <th className="hidden md:table-cell border border-gray-500 p-3 text-center">
                          Assigned Stock
                        </th>

                        <th className="border border-gray-500 p-2 md:p-3 text-center">
                          System Delivered
                        </th>

                        <th className="border border-gray-500 p-2 md:p-3 text-center">
                          Rider Input
                        </th>

                        <th className="hidden md:table-cell border border-gray-500 p-3 text-center">
                          Remaining
                        </th>

                        <th className="border border-gray-500 p-2 md:p-3 text-center">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {riderReport.items.map((item) => (
                        <tr
                          key={item.productId}
                          className={
                            item.isMatched
                              ? "bg-gray-700"
                              : "bg-red-700 text-white"
                          }
                        >
                          <td className="border border-gray-500 p-2 md:p-3 text-sm md:text-base">
                            {item.productName}
                          </td>

                          <td className="hidden md:table-cell border border-gray-500 p-3 text-center">
                            {item.assignedQty}
                          </td>

                          <td className="border border-gray-500 p-2 md:p-3 text-center font-semibold">
                            {item.systemDeliveredQty}
                          </td>

                          <td className="border border-gray-500 p-2 md:p-3 text-center font-semibold">
                            {item.riderInputQty}
                          </td>

                          <td className="hidden md:table-cell border border-gray-500 p-3 text-center">
                            {item.remainingQty}
                          </td>

                          <td className="border border-gray-500 p-2 md:p-3 text-center text-xs md:text-base">
                            {item.isMatched ? "Matched" : "Mismatch"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        {editingReport && (
          <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm flex justify-center items-start pt-16 pb-10 overflow-auto">
            <div className="bg-gray-700 text-white rounded p-6 w-[95%] max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">
                  Edit Rider Input - {editingReport.rider?.firstName}{" "}
                  {editingReport.rider?.lastName}
                </h2>

                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-red-600 hover:bg-red-700 rounded px-3 py-1"
                >
                  X
                </button>
              </div>

              <form onSubmit={handleAdminUpdate}>
                <div className="flex flex-col gap-3">
                  {editItems.map((item) => (
                    <div
                      key={item.product}
                      className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between border-b border-gray-500 pb-3"
                    >
                      <div className="font-semibold">{item.name}</div>

                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={item.quantity}
                        onChange={(e) =>
                          handleEditQuantityChange(item.product, e.target.value)
                        }
                        className="w-28 border rounded px-3 py-2 bg-gray-800 text-white"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 justify-end mt-6">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="rounded px-5 py-2 bg-gray-500 hover:bg-gray-600 font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="rounded px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 font-semibold"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRiderProductComparison;