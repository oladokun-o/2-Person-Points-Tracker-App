import { ObjectId } from 'mongodb';
import { getDatabase, COLLECTIONS } from '../mongodb';
import type { Reward, RewardDTO, RewardWithStatus } from '$lib/types';

export class RewardRepository {
	private get collection() {
		return getDatabase().collection<Reward>(COLLECTIONS.REWARDS);
	}

	private toDTO(reward: Reward): RewardDTO {
		return {
			_id: reward._id.toString(),
			title: reward.title,
			description: reward.description,
			emoji: reward.emoji,
			required_points: reward.required_points,
			category: reward.category,
			order: reward.order,
			is_active: reward.is_active,
			metadata: {
				created_at: reward.metadata.created_at.toISOString(),
				updated_at: reward.metadata.updated_at.toISOString()
			}
		};
	}

	async findAll(activeOnly = true): Promise<RewardDTO[]> {
		const filter = activeOnly ? { is_active: true } : {};
		const rewards = await this.collection.find(filter).sort({ order: 1 }).toArray();
		return rewards.map((reward) => this.toDTO(reward));
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
		const reward = await this.collection.findOne({ _id: new ObjectId(id) });
		return reward ? this.toDTO(reward) : null;
	}

	async create(rewardData: {
		title: string;
		description?: string;
		emoji: string;
		required_points: number;
		category?: string;
		order: number;
	}): Promise<RewardDTO> {
		const now = new Date();
		const reward: Omit<Reward, '_id'> = {
			title: rewardData.title,
			description: rewardData.description,
			emoji: rewardData.emoji,
			required_points: rewardData.required_points,
			category: rewardData.category,
			order: rewardData.order,
			is_active: true,
			metadata: {
				created_at: now,
				updated_at: now
			}
		};

		const result = await this.collection.insertOne(reward as Reward);
		const created = await this.collection.findOne({ _id: result.insertedId });

		if (!created) {
			throw new Error('Failed to create reward');
		}

		return this.toDTO(created);
	}

	async update(
		id: string,
		updates: Partial<
			Pick<Reward, 'title' | 'description' | 'emoji' | 'required_points' | 'category' | 'order' | 'is_active'>
		>
	): Promise<RewardDTO | null> {
		const updated = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{ $set: { ...updates, 'metadata.updated_at': new Date() } },
			{ returnDocument: 'after' }
		);

		return updated ? this.toDTO(updated) : null;
	}

	async delete(id: string): Promise<boolean> {
		// Soft delete
		const result = await this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { is_active: false } }
		);

		return result.modifiedCount > 0;
	}

	async getNextUnlockedReward(currentPoints: number, newPoints: number): Promise<RewardDTO | null> {
		// Find rewards that were locked but are now unlocked
		const reward = await this.collection.findOne({
			is_active: true,
			required_points: { $gt: currentPoints, $lte: newPoints }
		}, { sort: { required_points: 1 } });

		return reward ? this.toDTO(reward) : null;
	}
}

export const rewardRepository = new RewardRepository();
