import { MongoClient } from 'mongodb';
import config from 'config';

const mongoURI = config.get('dbConfig.url');

const mongoClient = new MongoClient(mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const dbName = 'unshelled_assignment';
let db;

export async function dbConnect() {
	await mongoClient.connect();
	console.log('Connected successfully to mongodb');
	db = mongoClient.db(dbName);
	
	return db;
}

export function getDb() {
	return db;
}
