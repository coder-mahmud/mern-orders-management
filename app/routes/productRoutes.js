import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import { createProduct, editProduct, getProducts } from '../controllers/productController.js';
const productRoutes = express();

productRoutes.get("/", getProducts);
productRoutes.post("/create", createProduct);
productRoutes.post("/edit", editProduct);


export default productRoutes;