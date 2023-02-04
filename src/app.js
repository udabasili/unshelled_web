import { fileURLToPath } from 'url';
import express from 'express';
import orderRoute from './orders/OrdersRouter.js';
import sellerRoute from './seller/SellerRouter.js';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(orderRoute);
app.use(sellerRoute);
app.use(function (_req, _res, next) {
	next({ status: 404 });
});

app.use(function (error, req, res, next) {
	return res.status(error.status || 500).json({
		success: false,
		message: error.message,
	});
});

app.use(express.static(path.resolve('./public/build')));

export default app;
