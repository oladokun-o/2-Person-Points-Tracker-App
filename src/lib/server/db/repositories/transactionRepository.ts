import { getSupabaseAdminClient, type DbTransaction } from '../supabase';
import type { TransactionDTO } from '$lib/types';

export class TransactionRepository {
	private get adminClient() {
		return getSupabaseAdminClient();
	}

	private toDTO(transaction: DbTransaction): TransactionDTO {
		return {
			_id: transaction.id,
			awarded_to: transaction.awarded_to,
			awarded_by: transaction.awarded_by,
			action_id: transaction.action_id ?? undefined,
			points: transaction.points,
			note: transaction.note ?? undefined,
			created_at: transaction.created_at
		};
	}

	async create(transactionData: {
		awarded_to: string;
		awarded_by: string;
		action_id?: string;
		points: number;
		note?: string;
	}): Promise<TransactionDTO> {
		const { data, error } = await this.adminClient
			.from('transactions')
			.insert({
				awarded_to: transactionData.awarded_to,
				awarded_by: transactionData.awarded_by,
				action_id: transactionData.action_id ?? null,
				points: transactionData.points,
				note: transactionData.note ?? null
			})
			.select()
			.single();

		if (error || !data) {
			throw new Error(`Failed to create transaction: ${error?.message}`);
		}

		return this.toDTO(data);
	}

	async findRecent(limit = 50, userId?: string): Promise<TransactionDTO[]> {
		let query = this.adminClient
			.from('transactions')
			.select('*')
			.order('created_at', { ascending: false })
			.limit(limit);

		if (userId) {
			query = query.or(`awarded_to.eq.${userId},awarded_by.eq.${userId}`);
		}

		const { data, error } = await query;

		if (error || !data) {
			console.error('Error fetching transactions:', error);
			return [];
		}
		return data.map((t) => this.toDTO(t));
	}

	async findById(id: string): Promise<TransactionDTO | null> {
		const { data, error } = await this.adminClient
			.from('transactions')
			.select('*')
			.eq('id', id)
			.single();

		if (error || !data) return null;
		return this.toDTO(data);
	}

	async findByUser(userId: string, limit = 50): Promise<TransactionDTO[]> {
		const { data, error } = await this.adminClient
			.from('transactions')
			.select('*')
			.or(`awarded_to.eq.${userId},awarded_by.eq.${userId}`)
			.order('created_at', { ascending: false })
			.limit(limit);

		if (error || !data) return [];
		return data.map((t) => this.toDTO(t));
	}

	async getStats(userId: string): Promise<{
		total_transactions: number;
		points_received: number;
		points_given: number;
	}> {
		// Get received points
		const { data: received } = await this.adminClient
			.from('transactions')
			.select('points')
			.eq('awarded_to', userId);

		// Get given points
		const { data: given } = await this.adminClient
			.from('transactions')
			.select('points')
			.eq('awarded_by', userId);

		const receivedCount = received?.length || 0;
		const givenCount = given?.length || 0;
		const receivedTotal = received?.reduce((sum, t) => sum + t.points, 0) || 0;
		const givenTotal = given?.reduce((sum, t) => sum + t.points, 0) || 0;

		return {
			total_transactions: receivedCount + givenCount,
			points_received: receivedTotal,
			points_given: givenTotal
		};
	}
}

export const transactionRepository = new TransactionRepository();
