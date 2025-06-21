import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connect from "./config/db.js";
import cookieParser from 'cookie-parser';

import userRoutes from './routes/userRoutes.js';
import hubRoutes from './routes/hubRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import hubStockRoutes from './routes/hubStockRoutes.js';
import stockHistoryRoutes from './routes/stockHistoryRoutes.js';




dotenv.config();


const app = express();
connect();

const whitelist = ['http://localhost:3000', 'https://portal.foodulogybd.com', 'https://portal.foodulogybd.com/', 'http://datu.mahmud1.xyz/'];

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if(!origin){
      return callback(null, true);
    }
    if(whitelist.includes(origin))
      return callback(null, true)
      callback(new Error('Not allowed by CORS'));
  }
}

app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.get('/',(req,res) => res.status(200).json({message:"App is running"}))

import "./cron/recordStockHistory.js";
import riderReportRoutes from './routes/riderReportRoutes.js';
import internalReportRoutes from './routes/internalReportsRoutes.js';



app.use('/user', userRoutes);
app.use('/hub', hubRoutes);
app.use('/product', productRoutes);
app.use('/order', orderRoutes);
app.use('/hubstock', hubStockRoutes);
app.use('/stockhistory', stockHistoryRoutes);
app.use('/riderreport', riderReportRoutes);
app.use('/internalreport', internalReportRoutes);


app.listen(5000, () => {console.log("server running")} )