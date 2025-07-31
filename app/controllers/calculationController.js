import Hub from '../models/hubModel.js';
import Product from '../models/productModel.js';
import Calculation from '../models/calculationModel.js';

// 📌 Create initial entries for all hubs & products
const initializeCalculations = async (req, res) => {
  try {
    const hubs = await Hub.find();
    const products = await Product.find();

    for (const hub of hubs) {
      for (const product of products) {
        const exists = await Calculation.findOne({ hubId: hub._id, productId: product._id });
        if (!exists) {
          await Calculation.create({
            hubId: hub._id,
            productId: product._id,
            initialStock: 0,
            dailyRecords: []
          });
        }
      }
    }

    res.json({ message: 'Initial calculations created successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Add a daily stock record
const addDailyRecord = async (req, res) => {

  try {
    const { hubId, productId, startingStock, dayEndStock, date } = req.body;

    const existing = await Calculation.findOne({ hubId, productId, date });

    if (existing) {
      existing.startingStock = startingStock;
      existing.dayEndStock = dayEndStock;
      await existing.save();
      return res.json({ message: 'Updated successfully', calculation: existing });
    }

    const newCalc = await Calculation.create({ hubId, productId, startingStock, dayEndStock, date });
    res.json({ message: 'Created successfully', calculation: newCalc });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }  




 /*
  try {
    const { hubId, productId, startingStock, dayEndStock } = req.body;

    const difference = dayEndStock - startingStock;

    const updated = await Calculation.findOneAndUpdate(
      { hubId, productId },
      {
        $push: {
          dailyRecords: { date: new Date(), startingStock, dayEndStock, difference }
        }
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Calculation entry not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
*/

};

// 📌 Get all daily records for a hub-product
const getDailyRecords = async (req, res) => {
  try {
    const { hubId, productId } = req.params;
    const calc = await Calculation.findOne({ hubId, productId })
      .populate('hubId productId');

    if (!calc) return res.status(404).json({ message: 'No record found' });

    res.json(calc.dailyRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateDailyRecord = async (req, res) => {
  try {
    const { hubId, productId, recordId, startingStock, dayEndStock } = req.body;

    const difference = dayEndStock - startingStock;

    const updated = await Calculation.findOneAndUpdate(
      { hubId, productId, "dailyRecords._id": recordId },
      {
        $set: {
          "dailyRecords.$.startingStock": startingStock,
          "dailyRecords.$.dayEndStock": dayEndStock,
          "dailyRecords.$.difference": difference
        }
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Record not found to update' });

    res.json({ message: 'Daily record updated successfully', updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Get all product records for a hub on a specific date
const getHubRecordsByDate = async (req, res) => {
  // console.log("Get Hub Calc by Date")
  

  const {hubId,date} = req.params;
  try {
    // Convert string to Date object and normalize to midnight
    const parsedDate = new Date(date);
    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    const calculation = await Calculation.find({
      hubId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate({
      path: 'productId',
      select: 'name'
    }).populate({
      path: 'hubId',
      select: 'name'
    });

    res.status(200).json({ calculation });
  } catch (err) {
    console.error("❌ Error fetching calculation history:", err);
    res.status(500).json({ message: "Error fetching calculation history" });
  }



};






export {initializeCalculations, addDailyRecord, getDailyRecords, updateDailyRecord, getHubRecordsByDate }