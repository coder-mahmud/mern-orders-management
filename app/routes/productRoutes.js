import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import { createProduct, editProduct, getProducts } from '../controllers/productController.js';
const productRoutes = express();

productRoutes.get("/",protect, getProducts);
productRoutes.post("/create",protect, createProduct);
productRoutes.post("/edit",protect, editProduct);


export default productRoutes;