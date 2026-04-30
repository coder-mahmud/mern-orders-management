import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import Loader from "../components/shared/Loader";
import { useGetAllRiderInputComparisonByDateQuery } from "../slices/riderInputApiSlice";

const AllRiderProductComparison = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

  const { data, isLoading, isError, error } =
    useGetAllRiderInputComparisonByDateQuery(formattedDate);

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
                    <h2 className="text-2xl font-semibold">
                      {rider?.firstName} {rider?.lastName}
                    </h2>

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
                      className={`rounded px-4 py-2 font-semibold  flex items-center ${
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



                {/* <div className="overflow-x-auto">
                  <table className="w-full border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-900">
                        <th className="border border-gray-500 p-3 text-left">
                          Product
                        </th>
                        <th className="border border-gray-500 p-3 text-center">
                          Assigned Stock
                        </th>
                        <th className="border border-gray-500 p-3 text-center">
                          System Delivered
                        </th>
                        <th className="border border-gray-500 p-3 text-center">
                          Rider Input
                        </th>
                        <th className="border border-gray-500 p-3 text-center">
                          Remaining
                        </th>
                        <th className="border border-gray-500 p-3 text-center">
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
                          <td className="border border-gray-500 p-3">
                            {item.productName}
                          </td>

                          <td className="border border-gray-500 p-3 text-center">
                            {item.assignedQty}
                          </td>

                          <td className="border border-gray-500 p-3 text-center font-semibold">
                            {item.systemDeliveredQty}
                          </td>

                          <td className="border border-gray-500 p-3 text-center font-semibold">
                            {item.riderInputQty}
                          </td>

                          <td className="border border-gray-500 p-3 text-center">
                            {item.remainingQty}
                          </td>

                          <td className="border border-gray-500 p-3 text-center">
                            {item.isMatched ? "Matched" : "Mismatch"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div> */}




              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllRiderProductComparison;