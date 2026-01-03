import { getSupabaseClient, getSupabaseAdminClient, type DbReward } from '../supabase';
import type { RewardDTO, RewardWithStatus } from '$lib/types';

export class RewardRepository {
	private get client() {
		return getSupabaseClient();
	}

	private get adminClient() {
		return getSupabaseAdminClient();
	}

	private toDTO(reward: DbReward): RewardDTO {
		return {
			_id: reward.id,
			title: reward.title,
			description: reward.description ?? undefined,
			emoji: reward.emoji,
			required_points: reward.required_points,
			category: reward.category ?? undefined,
			order: reward.order,
			is_active: reward.is_active,
			metadata: {
				created_at: reward.created_at,
				updated_at: reward.updated_at
			}
		};
	}

	async findAll(activeOnly = true): Promise<RewardDTO[]> {
		let query = this.client.from('rewards').select('*').order('order', { ascending: true });

		if (activeOnly) {
			query = query.eq('is_active', true);
		}

		const { data, error } = await query;

		if (error || !data) return [];
		return data.map((reward) => this.toDTO(reward));
	}

	async findAllWithStatus(userPoints: number, activeOnly = true): Promise<RewardWithStatus[]> {
		const rewards = await this.findAll(activeOnly);
		return rewards.map((reward) => ({
			...reward,
			is_unlocked: userPoints >= reward.required_points,
			points_needed: Math.max(0, reward.required_points - userPoints)
		}));
	}

	async findById(id: string): Promise<RewardDTO | null> {
		const { data, error } = await this.client
			.from('rewards')
			.select('*')
			.eq('id', id)
			.single();

		if (error || !data) return null;
		return this.toDTO(data);
	}

	async create(rewardData: {
		title: string;
		description?: string;
		emoji: string;
		required_points: number;
		category?: string;
		order: number;
	}): Promise<RewardDTO> {
		const { data, error } = await this.adminClient
			.from('rewards')
			.insert({
				title: rewardData.title,
				description: rewardData.description ?? null,
				emoji: rewardData.emoji,
				required_points: rewardData.required_points,
				category: rewardData.category ?? null,
				order: rewardData.order,
				is_active: true
			})
			.select()
			.single();

		if (error || !data) {
			throw new Error(`Failed to create reward: ${error?.message}`);
		}

		return this.toDTO(data);
	}

	async update(
		id: string,
		updates: Partial<
			Pick<DbReward, 'title' | 'description' | 'emoji' | 'required_points' | 'category' | 'order' | 'is_active'>
		>
	): Promise<RewardDTO | null> {
		const { data, error } = await this.adminClient
			.from('rewards')
			.update(updates)
			.eq('id', id)
			.select()
			.single();

		if (error || !data) return null;
		return this.toDTO(data);
	}

	async delete(id: string): Promise<boolean> {
		// Soft delete
		const { error } = await this.adminClient
			.from('rewards')
			.update({ is_active: false })
			.eq('id', id);

		return !error;
	}

	async getNextUnlockedReward(currentPoints: number, newPoints: number): Promise<RewardDTO | null> {
		// Find rewards that were locked but are now unlocked
		const { data, error } = await this.client
			.from('rewards')
			.select('*')
			.eq('is_active', true)
			.gt('required_points', currentPoints)
			.lte('required_points', newPoints)
			.order('required_points', { ascending: true })
			.limit(1)
			.single();

		if (error || !data) return null;
		return this.toDTO(data);
	}
}

export const rewardRepository = new RewardRepository();
