import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

import Loader from "../components/shared/Loader";
import { useGetAllProductQuery } from "../slices/productApiSlice";
import {
  useCreateOrUpdateRiderInputMutation,
  useGetMyRiderInputByDateQuery,
} from "../slices/riderInputApiSlice";

const RiderProductInput = () => {
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [products, setProducts] = useState([]);

  const formattedDate = dayjs(deliveryDate).format("YYYY-MM-DD");

  const { data, isLoading } = useGetAllProductQuery();
  const userInfo = useSelector((state) => state?.auth?.userInfo);
  console.log("userinfo: ", userInfo)

  const {
    data: myInput,
    isLoading: isMyInputLoading,
  } = useGetMyRiderInputByDateQuery(formattedDate);

  const [
    createOrUpdateRiderInput,
    { isLoading: isSubmitting },
  ] = useCreateOrUpdateRiderInputMutation();

  useEffect(() => {
    if (data?.products) {
      const productsWithQuantity = data.products.map((product) => {
        const existingItem = myInput?.items?.find(
          (item) => item.product === product._id || item.product?._id === product._id
        );

        return {
          ...product,
          quantity: existingItem ? existingItem.quantity : 0,
        };
      });

      setProducts(productsWithQuantity);
    }
  }, [data, myInput]);

  const handleQuantityChange = (productId, newQuantity) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId
          ? {
              ...product,
              quantity: Math.max(0, Number(newQuantity)),
            }
          : product
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const items = products
      .filter((product) => Number(product.quantity) > 0)
      .map((product) => ({
        product: product._id,
        name: product.name,
        quantity: Number(product.quantity),
      }));

    if (items.length === 0) {
      toast.error("Please enter quantity for at least one product");
      return;
    }

    try {
      await createOrUpdateRiderInput({
        deliveryDate: formattedDate,
        items,
      }).unwrap();

      toast.success("Product delivery input saved successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  if (isLoading || isMyInputLoading) {
    return <Loader />;
  }

  return (
    <div className="bg-gray-800 text-white min-h-[95vh] py-14">
      <div className="container">
        <div className="flex flex-col sm:flex-row gap-2 justify-between items-center mb-8">
          <h1 className="text-3xl">Rider Product Input</h1>
          <div className="text-lg bg-gray-700 px-4 py-2 rounded">
            Rider: {userInfo?.name}
          </div>
        </div>

        <div className="date my-6">
          <div className="flex gap-2 items-center mb-6">
            <p className="mb-2">Date:</p>
            <DatePicker
              className="date_input mb-6 h-11 flex items-center border border-gray-500 rounded px-4 bg-gray-800"
              selected={deliveryDate}
              onChange={(date) => setDeliveryDate(date)}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-gray-700 rounded p-6">
            <h2 className="text-xl font-semibold mb-6">
              Add Delivered Product Quantities
            </h2>

            {products.map((product) => (
              <div
                key={product._id}
                className="flex flex-col sm:flex-row gap-4 items-center py-3 border-b border-gray-500 justify-start lg:justify-between"
              >
                <div className="w-full sm:w-[300px] flex gap-2">
                  <span className="block sm:hidden">Product:</span>
                  {product.name}
                </div>

                <div className="flex gap-3 items-center w-full sm:w-[260px] sm:justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(
                        product._id,
                        Number(product.quantity || 0) - 1
                      )
                    }
                    className="px-3 py-1 bg-gray-300 rounded text-black"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={product.quantity}
                    onChange={(e) =>
                      handleQuantityChange(product._id, e.target.value)
                    }
                    className="w-24 text-center text-white border rounded py-1"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      handleQuantityChange(
                        product._id,
                        Number(product.quantity || 0) + 1
                      )
                    }
                    className="px-3 py-1 bg-gray-300 rounded text-black"
                  >
                    +
                  </button>
                </div>
                
              </div>
            ))}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSubmitting ? "Saving..." : "Save Input"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RiderProductInput;