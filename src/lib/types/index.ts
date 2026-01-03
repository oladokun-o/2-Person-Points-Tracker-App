// Note: These base interfaces are no longer used since we migrated to Supabase.
// The DTO types are what's actually used throughout the application.

// Client-safe user
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
