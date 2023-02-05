import express from 'express';
import orderRoute from './orders/OrdersRouter.js';
import sellerRoute from './seller/SellerRouter.js';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(orderRoute);
app.use(sellerRoute);

app.use(express.static(path.join(__dirname, '../public/build')));
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/build/index.html'));
});

app.use(function (_req, _res, next) {
	next({ status: 404 });
});

app.use(function (error, req, res, next) {
	return res.status(error.status || 500).json({
		success: false,
		message: error.message,
	});
});

export default app;
