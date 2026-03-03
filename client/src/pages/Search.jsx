import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import Loader from "../components/shared/Loader";
import Button from "../components/Button";

import { useGetAllProductQuery } from "../slices/productApiSlice";
import { useLazySearchOrdersQuery } from "../slices/orderApiSclice";

const SearchOrders = () => {
  const [phone, setPhone] = useState("");
  const [productId, setProductId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { data: productData, isLoading: productLoading } =
    useGetAllProductQuery();

  const [
    triggerSearch,
    { data: orders, isLoading, error },
  ] = useLazySearchOrdersQuery();
/*
  const handleSearch = (e) => {
    e.preventDefault();
    console.log("search clicked!")

    triggerSearch({
      phone,
      productId,
      startDate: startDate
        ? dayjs(startDate).format("YYYY-MM-DD")
        : "",
      endDate: endDate
        ? dayjs(endDate).format("YYYY-MM-DD")
        : "",
    });
  };
*/
const handleSearch = async (e) => {
  e.preventDefault();
  // console.log("search clicked!");

  try {
    const result = await triggerSearch({
      phone,
      productId,
      startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : "",
      endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
    });

    console.log("RTK Query result:", result);

    // result structure:
    // result.data => actual data returned
    // result.error => error info if failed
  } catch (err) {
    console.error("Search error:", err);
  }
};


  if (productLoading) return <Loader />;

  return (
    <div className="bg-gray-800 text-white min-h-[95vh] py-14">
      <div className="container">
        <h1 className="text-xl font-semibold mb-6">Search Orders</h1>

        {/* SEARCH FORM */}
        <form onSubmit={handleSearch}>
          {/* Phone */}
          <div className="form_row flex flex-col gap-2 mb-6">
            <label>Customer Mobile (optional)</label>
            <input
              type="tel"
              placeholder="017XXXXXXXX"
              className="border rounded border-gray-500 py-3 px-4"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Product */}
          <div className="form_row flex flex-col gap-2 mb-6">
            <label>Select Product (optional)</label>
            <select
              className="border rounded border-gray-500 h-11 px-4"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">All Products</option>
              {productData.products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label>Start Date</label>
              <DatePicker
                className="h-11 border border-gray-500 rounded px-4"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="From"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>End Date</label>
              <DatePicker
                className="h-11 border border-gray-500 rounded px-4"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="To"
              />
            </div>
          </div>

          {/* <Button type="submit" text="Search Orders" />
           */}

          <button
            type="submit"
            className="rounded px-6 py-2 bg-amber-700 hover:bg-amber-800 cursor-pointer font-semibold"
          >
            Search Orders
          </button>



        </form>

        {/* RESULTS */}
        <div className="mt-10">
          {isLoading && <Loader />}
          {error && (
            <p className="text-red-400 mt-4">
              Failed to load orders
            </p>
          )}

          {orders && orders.length === 0 && (
            <p className="text-gray-400 mt-4">
              No orders found
            </p>
          )}

          {orders && orders.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full mt-6 border border-gray-600">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="p-3 text-left border-b border-gray-600">
                      Delivery Date
                    </th>
                    <th className="p-3 text-left border-b border-gray-600">
                      Phone
                    </th>
                    <th className="p-3 text-left border-b border-gray-600">
                      Products
                    </th>
                    <th className="p-3 text-right border-b border-gray-600">
                      Total
                    </th>
                    <th className="p-3 text-left border-b border-gray-600">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-700 transition"
                    >
                      <td className="p-3 border-b border-gray-700">
                        {dayjs(order.deliveryDate).format("DD-MM-YYYY")}
                      </td>
                      <td className="p-3 border-b border-gray-700">
                        {order.phoneNumber || "—"}
                      </td>
                      <td className="p-3 border-b border-gray-700">
                        {order.orderItems
                          .map((i) => i.name)
                          .join(", ")}
                      </td>
                      <td className="p-3 border-b border-gray-700 text-right">
                        {order.finalPrice}৳
                      </td>
                      <td className="p-3 border-b border-gray-700">
                        {order.orderStatus}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOrders;