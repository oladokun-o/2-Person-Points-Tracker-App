import type { ObjectId } from 'mongodb';

// User
export interface User {
	_id: ObjectId;
	auth_id: string;
	email: string;
	name: string;
	emoji: string;
	points: number;
	total_earned: number;
	total_lost: number;
	max_points: number;
	avatar_url?: string;
	provider: 'google' | 'apple' | 'email';
	is_allowed: boolean;
	metadata: {
		created_at: Date;
		updated_at: Date;
		last_login: Date;
	};
}

// Client-safe user (without _id as ObjectId)
export interface UserDTO {
	_id: string;
	auth_id: string;
	email: string;
	name: string;
	emoji: string;
	points: number;
	total_earned: number;
	total_lost: number;
	max_points: number;
	avatar_url?: string;
	provider: 'google' | 'apple' | 'email';
	is_allowed: boolean;
	metadata: {
		created_at: string;
		updated_at: string;
		last_login: string;
	};
}

// Action
export interface Action {
	_id: ObjectId;
	title: string;
	emoji: string;
	points: number;
	category?: string;
	created_by: ObjectId;
	is_active: boolean;
	use_count: number;
	metadata: {
		created_at: Date;
		updated_at: Date;
	};
}

// Client-safe action
export interface ActionDTO {
	_id: string;
	title: string;
	emoji: string;
	points: number;
	category?: string;
	created_by: string;
	is_active: boolean;
	use_count: number;
	metadata: {
		created_at: string;
		updated_at: string;
	};
}

// Reward
export interface Reward {
	_id: ObjectId;
	title: string;
	description?: string;
	emoji: string;
	required_points: number;
	category?: string;
	order: number;
	is_active: boolean;
	metadata: {
		created_at: Date;
		updated_at: Date;
	};
}

// Client-safe reward
export interface RewardDTO {
	_id: string;
	title: string;
	description?: string;
	emoji: string;
	required_points: number;
	category?: string;
	order: number;
	is_active: boolean;
	metadata: {
		created_at: string;
		updated_at: string;
	};
}

// Reward with unlock status (computed)
export interface RewardWithStatus extends RewardDTO {
	is_unlocked: boolean;
	points_needed: number;
}

// Transaction
export interface Transaction {
	_id: ObjectId;
	awarded_to: ObjectId;
	awarded_by: ObjectId;
	action_id?: ObjectId;
	points: number;
	note?: string;
	created_at: Date;
}

// Client-safe transaction
export interface TransactionDTO {
	_id: string;
	awarded_to: string;
	awarded_by: string;
	action_id?: string;
	points: number;
	note?: string;
	created_at: string;
	// Populated fields
	action?: ActionDTO;
	to_user?: UserDTO;
	by_user?: UserDTO;
}

// Settings
export interface Settings {
	_id: ObjectId;
	max_points: number;
	updated_by: ObjectId;
	updated_at: Date;
}

// API Request/Response types
export interface AwardPointsRequest {
	awarded_to: string;
	points: number;
	action_id?: string;
	note?: string;
}

export interface AwardPointsResponse {
	success: boolean;
	transaction: TransactionDTO;
	updated_user: UserDTO;
	reward_unlocked?: RewardDTO;
}

export interface CreateActionRequest {
	title: string;
	emoji: string;
	points: number;
	category?: string;
}

export interface CreateRewardRequest {
	title: string;
	description?: string;
	emoji: string;
	required_points: number;
	category?: string;
	order: number;
}

// Helper type for converting DB documents to DTOs
export type WithId<T> = T & { _id: ObjectId };
