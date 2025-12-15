import { ObjectId } from 'mongodb';
import { getDatabase, COLLECTIONS } from '../mongodb';
import type { Transaction, TransactionDTO } from '$lib/types';

export class TransactionRepository {
	private get collection() {
		return getDatabase().collection<Transaction>(COLLECTIONS.TRANSACTIONS);
	}

	private toDTO(transaction: Transaction): TransactionDTO {
		return {
			_id: transaction._id.toString(),
			awarded_to: transaction.awarded_to.toString(),
			awarded_by: transaction.awarded_by.toString(),
			action_id: transaction.action_id?.toString(),
			points: transaction.points,
			note: transaction.note,
			created_at: transaction.created_at.toISOString()
		};
	}

	async create(transactionData: {
		awarded_to: string;
		awarded_by: string;
		action_id?: string;
		points: number;
		note?: string;
	}): Promise<TransactionDTO> {
		const transaction: Omit<Transaction, '_id'> = {
			awarded_to: new ObjectId(transactionData.awarded_to),
			awarded_by: new ObjectId(transactionData.awarded_by),
			action_id: transactionData.action_id ? new ObjectId(transactionData.action_id) : undefined,
			points: transactionData.points,
			note: transactionData.note,
			created_at: new Date()
		};

		const result = await this.collection.insertOne(transaction as Transaction);
		const created = await this.collection.findOne({ _id: result.insertedId });

		if (!created) {
			throw new Error('Failed to create transaction');
		}

		return this.toDTO(created);
	}

	async findRecent(limit = 50, userId?: string): Promise<TransactionDTO[]> {
		const filter = userId
			? {
					$or: [
						{ awarded_to: new ObjectId(userId) },
						{ awarded_by: new ObjectId(userId) }
					]
			  }
			: {};

		const transactions = await this.collection
			.find(filter)
			.sort({ created_at: -1 })
			.limit(limit)
			.toArray();

		return transactions.map((t) => this.toDTO(t));
	}

	async findById(id: string): Promise<TransactionDTO | null> {
		const transaction = await this.collection.findOne({ _id: new ObjectId(id) });
		return transaction ? this.toDTO(transaction) : null;
	}

	async findByUser(userId: string, limit = 50): Promise<TransactionDTO[]> {
		const transactions = await this.collection
			.find({
				$or: [
					{ awarded_to: new ObjectId(userId) },
					{ awarded_by: new ObjectId(userId) }
				]
			})
			.sort({ created_at: -1 })
			.limit(limit)
			.toArray();

		return transactions.map((t) => this.toDTO(t));
	}

	async getStats(userId: string): Promise<{
		total_transactions: number;
		points_received: number;
		points_given: number;
	}> {
		const received = await this.collection
			.aggregate([
				{ $match: { awarded_to: new ObjectId(userId) } },
				{ $group: { _id: null, total: { $sum: '$points' }, count: { $sum: 1 } } }
			])
			.toArray();

		const given = await this.collection
			.aggregate([
				{ $match: { awarded_by: new ObjectId(userId) } },
				{ $group: { _id: null, total: { $sum: '$points' }, count: { $sum: 1 } } }
			])
			.toArray();

		return {
			total_transactions: (received[0]?.count || 0) + (given[0]?.count || 0),
			points_received: received[0]?.total || 0,
			points_given: given[0]?.total || 0
		};
	}
}

export const transactionRepository = new TransactionRepository();
