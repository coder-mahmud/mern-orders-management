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
import calculationRoutes from './routes/calculationRoutes.js';
import activityRoutes from './routes/activityLogsRoute.js';
import "./cron/recordStockHistory.js";
import riderReportRoutes from './routes/riderReportRoutes.js';
import internalReportRoutes from './routes/internalReportsRoutes.js';
import riderStockReportRoutes from './routes/riderStockRoutes.js';


dotenv.config();


const app = express();
connect();

const whitelist = ['http://localhost:3000', 'https://portal.foodulogybd.com', 'https://portal.foodulogybd.com/', 'https://krishipanda.com'];

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if(!origin){
      return callback(null, true);
    }
    if(whitelist.includes(origin))
      return callback(null, true)
      callback(new Error('Not allowed by CORS'));
  }, 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.get('/',(req,res) => res.status(200).json({message:"App is running"}))




app.use('/user', userRoutes);
app.use('/hub', hubRoutes);
app.use('/product', productRoutes);
app.use('/order', orderRoutes);
app.use('/hubstock', hubStockRoutes);
app.use('/stockhistory', stockHistoryRoutes);
app.use('/riderreport', riderReportRoutes);
app.use('/internalreport', internalReportRoutes);
app.use('/calculation', calculationRoutes);
app.use('/activity', activityRoutes);
app.use('/riderstock', riderStockReportRoutes);




app.listen(3004, () => {console.log("server running")} )