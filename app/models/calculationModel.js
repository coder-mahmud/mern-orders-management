import mongoose from 'mongoose';

const dailyStockSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startingStock: { type: Number, },   // you will input this manually
  dayEndStock: { type: Number, },     // you will input this manually
  difference: { type: Number,  },      // calculated: dayEndStock - startingStock
}, { _id: false });

const CalculationSchema = new mongoose.Schema({
  hubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hub', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  startingStock: { type: Number, },    // one-time initial input for setup
  dayEndStock: { type: Number, },
  date: { type: Date, required: true },             // daily inputs (starting + end)

}, { timestamps: true });

export default mongoose.model('Calculation', CalculationSchema);
