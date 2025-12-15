import { ObjectId } from 'mongodb';
import { getDatabase, COLLECTIONS } from '../mongodb';
import type { Action, ActionDTO } from '$lib/types';

export class ActionRepository {
	private get collection() {
		return getDatabase().collection<Action>(COLLECTIONS.ACTIONS);
	}

	private toDTO(action: Action): ActionDTO {
		return {
			_id: action._id.toString(),
			title: action.title,
			emoji: action.emoji,
			points: action.points,
			category: action.category,
			created_by: action.created_by.toString(),
			is_active: action.is_active,
			use_count: action.use_count,
			metadata: {
				created_at: action.metadata.created_at.toISOString(),
				updated_at: action.metadata.updated_at.toISOString()
			}
		};
	}

	async findAll(activeOnly = true): Promise<ActionDTO[]> {
		const filter = activeOnly ? { is_active: true } : {};
		const actions = await this.collection.find(filter).sort({ use_count: -1 }).toArray();
		return actions.map((action) => this.toDTO(action));
	}

	async findById(id: string): Promise<ActionDTO | null> {
		const action = await this.collection.findOne({ _id: new ObjectId(id) });
		return action ? this.toDTO(action) : null;
	}

	async create(actionData: {
		title: string;
		emoji: string;
		points: number;
		category?: string;
		created_by: string;
	}): Promise<ActionDTO> {
		const now = new Date();
		const action: Omit<Action, '_id'> = {
			title: actionData.title,
			emoji: actionData.emoji,
			points: actionData.points,
			category: actionData.category,
			created_by: new ObjectId(actionData.created_by),
			is_active: true,
			use_count: 0,
			metadata: {
				created_at: now,
				updated_at: now
			}
		};

		const result = await this.collection.insertOne(action as Action);
		const created = await this.collection.findOne({ _id: result.insertedId });

		if (!created) {
			throw new Error('Failed to create action');
		}

		return this.toDTO(created);
	}

	async update(
		id: string,
		updates: Partial<Pick<Action, 'title' | 'emoji' | 'points' | 'category' | 'is_active'>>
	): Promise<ActionDTO | null> {
		const updated = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(id) },
			{ $set: { ...updates, 'metadata.updated_at': new Date() } },
			{ returnDocument: 'after' }
		);

		return updated ? this.toDTO(updated) : null;
	}

	async incrementUseCount(id: string): Promise<void> {
		await this.collection.updateOne({ _id: new ObjectId(id) }, { $inc: { use_count: 1 } });
	}

	async delete(id: string): Promise<boolean> {
		// Soft delete by setting is_active to false
		const result = await this.collection.updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { is_active: false } }
		);

		return result.modifiedCount > 0;
	}
}

export const actionRepository = new ActionRepository();
