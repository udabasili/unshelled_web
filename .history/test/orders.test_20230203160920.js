import request from 'supertest';
import { dbConnect } from '../src/utils/db';
import app from '../src/app.js';
let db;
let collection;

beforeAll(async () => {
	db = await dbConnect();
	collection = db.collection('orders');
});

beforeEach(() => {
	collection.deleteMany({});
});

export async function apiCall() {
	const res = request(app).get('/order_items');
	return res;
}

describe('User Listing', () => {
	it('should get a limit of 20 items', async () => {
		const response = await apiCall();
		expect(response.body.data).toBe(0);
	});
});
