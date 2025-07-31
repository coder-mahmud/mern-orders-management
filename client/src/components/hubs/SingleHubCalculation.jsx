import React, { useState, useEffect } from 'react';
import { useCreateCalculationMutation } from '../../slices/calculationApiSlice';

const SingleHubCalculation = ({ product, hubId, stockDate }) => {

  console.log("Proudct from single calculation", product)

  const [startingStock, setStartingStock] = useState(product.calculation?.startingStock || '');
  const [dayEndStock, setDayEndStock] = useState(product.calculation?.dayEndStock || '');


  useEffect(() => {
    setStartingStock(product.calculation?.startingStock || '');
    setDayEndStock(product.calculation?.dayEndStock || '');
  }, [product.calculation]);

  
  const difference = startingStock && dayEndStock ? startingStock - dayEndStock  : '--';

  const [createCalculation, { isLoading }] = useCreateCalculationMutation();

  const handleSave = async () => {
    try {
      const apiRes  = await createCalculation({
        hubId,
        productId: product._id,
        startingStock: Number(startingStock),
        dayEndStock: Number(dayEndStock),
        date: stockDate,
      }).unwrap();
      console.log("apiRes",apiRes)
      // alert(`Saved calculation for ${product.name}`);
    } catch (err) {
      console.error(err);
      // alert('Error saving calculation');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg w-72 shadow">
      <h3 className="text-lg font-semibold mb-2 text-black">{product.name}</h3>

      <input
        type="number"
        className="w-full mb-2 p-2 rounded border text-black"
        placeholder="Starting Stock"
        value={startingStock}
        onChange={(e) => setStartingStock(e.target.value)}
      />

      <input
        type="number"
        className="w-full mb-2 p-2 rounded border text-black"
        placeholder="Day End Stock"
        value={dayEndStock}
        onChange={(e) => setDayEndStock(e.target.value)}
      />

      <p className="mb-2 text-black">Difference: <span className="font-bold">{difference}</span></p>

      <button
        onClick={handleSave}
        disabled={isLoading}
        className="w-full bg-black  hover:bg-green-600  text-white py-2 rounded"
      >
        
        {isLoading ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};

export default SingleHubCalculation;
