import request from 'supertest';
import { dbConnect } from '../src/utils/db';
import app from '../src/app.js';
let db;
let orderCollection;
let connection;
let sellerCollection;

const sampleSeller = {
	seller_id: '3442f8959a84dea7ee197c632cb2df15',
	seller_zip_code_prefix: '13023',
	seller_city: 'campinas',
	seller_state: 'SP',
};

beforeAll(async () => {
	const response = await dbConnect();
	db = response.db;
	connection = response.connection;
	orderCollection = db.collection('orders');
	sellerCollection = db.collection('sellers');
});

beforeEach(async () => {
	await orderCollection.deleteMany({});
	await sellerCollection.deleteMany({});
});

afterAll(() => {
	connection.close();
});

export async function apiCall(option = {}) {
	const agent = request(app).get('/order_items');
	if (option.auth) {
		const username = option.auth.seller_id;
		const password = option.auth.seller_zip_code_prefix;
		agent.auth(username, password);
	}
	return agent.send();
}

function addUser() {
	sellerCollection.insertOne(sampleSeller);
}

async function addOrders(itemLength) {
	const sampleData = [];
	for (let index = 0; index < itemLength; index++) {
		sampleData.push({
			order_id: '00010242fe8c5a6d1ba2dd792cb16214',
			order_item_id: index + 1,
			product_id: '4244733e0437ecb4' + index + '_' + 'ecb4',
			seller_id: '42447356e06e7ecb4' + index + '_' + 'ecf54',
			shipping_limit_date: '2017-09-19 09:45:35',
			price: 58.9 + index,
			freight_value: '13.29',
		});
	}
	await orderCollection.insertMany(sampleData);
}

describe('Auth', () => {
	it('should return 403 for empty auth data', async () => {
		const response = await apiCall();
		expect(response.status).toBe(403);
	});
	it('should return Authentication failed error for empty auth data', async () => {
		const response = await apiCall();
		expect(response.error.text).toContain('Authentication failed');
	});

	it('should return Authentication failed error for wrong auth data', async () => {
		await addUser();
		const auth = {
			seller_id: sampleSeller.seller_id,
			seller_zip_code_prefix: 'wrong password',
		};
		const response = await apiCall({ auth });

		expect(response.error.text).toContain('Authentication failed');
	});

	it('should return Authentication failed error for wrong auth data', async () => {
		await addUser();
		const auth = {
			seller_id: sampleSeller.seller_id,
			seller_zip_code_prefix: 'wrong password',
		};
		const response = await apiCall({ auth });
		expect(response.status).toBe(403);
	});

	it('should return 200 for correct auth data', async () => {
		await addUser();
		const auth = {
			seller_id: sampleSeller.seller_id,
			seller_zip_code_prefix: sampleSeller.seller_zip_code_prefix,
		};
		const response = await apiCall({ auth });
		expect(response.status).toBe(200);
	});
});

describe('Order Listing', () => {
	let auth = {};

	it('should return data response of length 0', async () => {
		await addUser();
		auth = {
			seller_id: sampleSeller.seller_id,
			seller_zip_code_prefix: sampleSeller.seller_zip_code_prefix,
		};
		const response = await apiCall({ auth });
		expect(response.body.data.length).toBe(0);
	});

	it('should return 20 items when 21 items are created', async () => {
		await addUser();
		auth = {
			seller_id: sampleSeller.seller_id,
			seller_zip_code_prefix: sampleSeller.seller_zip_code_prefix,
		};
		await addOrders(21);
		const response = await apiCall({ auth });
		expect(response.body.data.length).toBe(20);
	});

	it('should return only 1 item and offset value 20 when 21 orders are created and page 2 passed ', async () => {
		await addUser();
		auth = {
			seller_id: sampleSeller.seller_id,
			seller_zip_code_prefix: sampleSeller.seller_zip_code_prefix,
		};
		await addOrders(21);
		const agent = request(app).get('/order_items').query({ page: 2 });
		if (auth) {
			const username = auth.seller_id;
			const password = auth.seller_zip_code_prefix;
			agent.auth(username, password);
		}
		const response = await agent.send();
		expect(response.body.data.length).toBe(1);
		expect(response.body.offset).toBe(20);
	});
	it('should return total of 40 when 40 items are created ', async () => {
		await addUser();
		auth = {
			seller_id: sampleSeller.seller_id,
			seller_zip_code_prefix: sampleSeller.seller_zip_code_prefix,
		};
		await addOrders(40);
		const response = await apiCall({ auth });
		expect(response.body.total).toBe(40);
	});
});
