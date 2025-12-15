import { MongoClient, type Db } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

if (!MONGODB_URI) {
	throw new Error('MONGODB_URI environment variable is not set');
}

let client: MongoClient;
let db: Db;

export async function connectToDatabase(): Promise<Db> {
	if (db) {
		return db;
	}

	try {
		client = new MongoClient(MONGODB_URI);
		await client.connect();
		console.log('✅ Connected to MongoDB');

		db = client.db('points-tracker');
		return db;
	} catch (error) {
		console.error('❌ MongoDB connection error:', error);
		throw error;
	}
}

export function getDatabase(): Db {
	if (!db) {
		throw new Error('Database not connected. Call connectToDatabase() first.');
	}
	return db;
}

export async function closeDatabase(): Promise<void> {
	if (client) {
		await client.close();
		console.log('MongoDB connection closed');
	}
}

// Collection names
export const COLLECTIONS = {
	USERS: 'users',
	ACTIONS: 'actions',
	REWARDS: 'rewards',
	TRANSACTIONS: 'transactions',
	SETTINGS: 'settings'
} as const;
