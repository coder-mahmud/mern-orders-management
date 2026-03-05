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
  const [productIds, setProductIds] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(1); // Pagination

  const { data: productData, isLoading: productLoading } =
    useGetAllProductQuery();

  const [triggerSearch, { data: orders, isLoading, error }] =
    useLazySearchOrdersQuery();

  // Handle search
  const handleSearch = async (e, pageNumber = 1) => {
    if (e) e.preventDefault();
    setPage(pageNumber);

    try {
      const result = await triggerSearch({
        phone,
        productIds,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : "",
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
        page: pageNumber,
      });
      console.log("RTK Query result:", result);
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

          {/* Products (checkboxes) */}
          <div className="form_row flex flex-col gap-2 mb-6">
            <label>Select Product(s) (optional)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto border rounded border-gray-500 p-2">
              {productData.products.map((p) => (
                <label key={p._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={p._id}
                    checked={productIds.includes(p._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProductIds([...productIds, p._id]);
                      } else {
                        setProductIds(productIds.filter((id) => id !== p._id));
                      }
                    }}
                    className="w-4 h-4 accent-amber-600"
                  />
                  <span>{p.name}</span>
                </label>
              ))}
            </div>
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
          {error && <p className="text-red-400 mt-4">Failed to load orders</p>}
          {orders && orders.data.length === 0 && (
            <p className="text-gray-400 mt-4">No orders found</p>
          )}

          {orders?.data && orders.data.length > 0 && (
            <>
              <div className="overflow-x-auto flex-wrap">
                <table className="w-full mt-6 border border-gray-600">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="p-3 text-left border-b border-gray-600">
                        Delivery Date
                      </th>
                      <th className="p-3 text-left border-b border-gray-600">
                        Phone
                      </th>
                      {/* <th className="p-3 text-left border-b border-gray-600">
                        Products
                      </th> */}
                      <th className="p-3 border-b border-gray-600">
                        Customer Details
                      </th>
                      {/* <th className="p-3 text-left border-b border-gray-600">
                        Status
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.data.map((order) => (
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
                        {/* <td className="p-3 border-b border-gray-700">
                          {order.orderItems.map((i) => i.name).join(", ")}
                        </td> */}
                        <td className="p-3 border-b border-gray-700">
                          {order.customerDetails}
                        </td>
                        {/* <td className="p-3 border-b border-gray-700">
                          {order.orderStatus}
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              {orders.pages > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                  <button
                    className="px-3 py-1 border rounded bg-gray-700 hover:bg-gray-600"
                    disabled={page === 1}
                    onClick={() => handleSearch(null, page - 1)}
                  >
                    Previous
                  </button>

                  {Array.from({ length: orders.pages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        className={`px-3 py-1 border rounded ${
                          p === page
                            ? "bg-amber-600"
                            : "bg-gray-700 hover:bg-gray-600"
                        }`}
                        onClick={() => handleSearch(null, p)}
                      >
                        {p}
                      </button>
                    )
                  )}

                  <button
                    className="px-3 py-1 border rounded bg-gray-700 hover:bg-gray-600"
                    disabled={page === orders.pages}
                    onClick={() => handleSearch(null, page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOrders;