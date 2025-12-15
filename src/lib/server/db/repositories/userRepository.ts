import { ObjectId } from 'mongodb';
import { getDatabase, COLLECTIONS } from '../mongodb';
import type { User, UserDTO } from '$lib/types';

export class UserRepository {
	private get collection() {
		return getDatabase().collection<User>(COLLECTIONS.USERS);
	}

	// Convert DB user to DTO (client-safe)
	private toDTO(user: User): UserDTO {
		return {
			_id: user._id.toString(),
			auth_id: user.auth_id,
			email: user.email,
			name: user.name,
			emoji: user.emoji,
			points: user.points,
			total_earned: user.total_earned,
			total_lost: user.total_lost,
			max_points: user.max_points,
			avatar_url: user.avatar_url,
			provider: user.provider,
			is_allowed: user.is_allowed,
			metadata: {
				created_at: user.metadata.created_at.toISOString(),
				updated_at: user.metadata.updated_at.toISOString(),
				last_login: user.metadata.last_login.toISOString()
			}
		};
	}

	async findByAuthId(authId: string): Promise<UserDTO | null> {
		const user = await this.collection.findOne({ auth_id: authId });
		return user ? this.toDTO(user) : null;
	}

	async findByEmail(email: string): Promise<UserDTO | null> {
		const user = await this.collection.findOne({ email });
		return user ? this.toDTO(user) : null;
	}

	async findById(id: string): Promise<UserDTO | null> {
		const user = await this.collection.findOne({ _id: new ObjectId(id) });
		return user ? this.toDTO(user) : null;
	}

	async findAll(): Promise<UserDTO[]> {
		const users = await this.collection.find({ is_allowed: true }).toArray();
		return users.map((user) => this.toDTO(user));
	}

	async create(userData: {
		auth_id: string;
		email: string;
		name: string;
		provider: 'google' | 'apple' | 'email';
		avatar_url?: string;
		emoji?: string;
	}): Promise<UserDTO> {
		const now = new Date();
		const user: Omit<User, '_id'> = {
			auth_id: userData.auth_id,
			email: userData.email,
			name: userData.name,
			emoji: userData.emoji || '👤',
			points: 0,
			total_earned: 0,
			total_lost: 0,
			max_points: 10,
			avatar_url: userData.avatar_url,
			provider: userData.provider,
			is_allowed: false, // Will be checked against whitelist
			metadata: {
				created_at: now,
				updated_at: now,
				last_login: now
			}
		};

		const result = await this.collection.insertOne(user as User);
		const createdUser = await this.collection.findOne({ _id: result.insertedId });

		if (!createdUser) {
			throw new Error('Failed to create user');
		}

		return this.toDTO(createdUser);
	}

	async updatePoints(
		userId: string,
		pointsChange: number
	): Promise<UserDTO | null> {
		const user = await this.collection.findOne({ _id: new ObjectId(userId) });
		if (!user) return null;

		const newPoints = Math.max(0, Math.min(user.points + pointsChange, user.max_points));
		const updateData: any = {
			points: newPoints,
			'metadata.updated_at': new Date()
		};

		if (pointsChange > 0) {
			updateData.total_earned = user.total_earned + pointsChange;
		} else {
			updateData.total_lost = user.total_lost + Math.abs(pointsChange);
		}

		const updated = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(userId) },
			{ $set: updateData },
			{ returnDocument: 'after' }
		);

		return updated ? this.toDTO(updated) : null;
	}

	async updateLastLogin(userId: string): Promise<void> {
		await this.collection.updateOne(
			{ _id: new ObjectId(userId) },
			{ $set: { 'metadata.last_login': new Date() } }
		);
	}

	async updateProfile(
		userId: string,
		updates: Partial<Pick<User, 'name' | 'emoji' | 'max_points'>>
	): Promise<UserDTO | null> {
		const updated = await this.collection.findOneAndUpdate(
			{ _id: new ObjectId(userId) },
			{ $set: { ...updates, 'metadata.updated_at': new Date() } },
			{ returnDocument: 'after' }
		);

		return updated ? this.toDTO(updated) : null;
	}

	async setAllowed(userId: string, isAllowed: boolean): Promise<void> {
		await this.collection.updateOne(
			{ _id: new ObjectId(userId) },
			{ $set: { is_allowed: isAllowed } }
		);
	}
}

export const userRepository = new UserRepository();
