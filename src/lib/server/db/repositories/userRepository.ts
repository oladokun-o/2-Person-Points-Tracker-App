import { getSupabaseClient, getSupabaseAdminClient, type DbUser } from '../supabase';
import type { UserDTO } from '$lib/types';

export class UserRepository {
	private get client() {
		return getSupabaseClient();
	}

	private get adminClient() {
		return getSupabaseAdminClient();
	}

	// Convert DB user to DTO (client-safe)
	private toDTO(user: DbUser): UserDTO {
		return {
			_id: user.id,
			auth_id: user.auth_id,
			email: user.email,
			name: user.name,
			emoji: user.emoji,
			points: user.points,
			total_earned: user.total_earned,
			total_lost: user.total_lost,
			max_points: user.max_points,
			avatar_url: user.avatar_url ?? undefined,
			provider: user.provider,
			is_allowed: user.is_allowed,
			metadata: {
				created_at: user.created_at,
				updated_at: user.updated_at,
				last_login: user.last_login
			}
		};
	}

	async findByAuthId(authId: string): Promise<UserDTO | null> {
		const { data, error } = await this.client
			.from('users')
			.select('*')
			.eq('auth_id', authId)
			.single();

		if (error || !data) return null;
		return this.toDTO(data);
	}

	async findByEmail(email: string): Promise<UserDTO | null> {
		const { data, error } = await this.client
			.from('users')
			.select('*')
			.eq('email', email)
			.single();

		if (error || !data) return null;
		return this.toDTO(data);
	}

	async findById(id: string): Promise<UserDTO | null> {
		const { data, error } = await this.client
			.from('users')
			.select('*')
			.eq('id', id)
			.single();

		if (error || !data) return null;
		return this.toDTO(data);
	}

	async findAll(): Promise<UserDTO[]> {
		const { data, error } = await this.client
			.from('users')
			.select('*')
			.eq('is_allowed', true);

		if (error || !data) return [];
		return data.map((user) => this.toDTO(user));
	}

	async create(userData: {
		auth_id: string;
		email: string;
		name: string;
		provider: 'google' | 'apple' | 'email';
		avatar_url?: string;
		emoji?: string;
		is_allowed?: boolean;
	}): Promise<UserDTO> {
		const { data, error } = await this.adminClient
			.from('users')
			.insert({
				auth_id: userData.auth_id,
				email: userData.email,
				name: userData.name,
				emoji: userData.emoji || '👤',
				provider: userData.provider,
				avatar_url: userData.avatar_url ?? null,
				points: 0,
				total_earned: 0,
				total_lost: 0,
				max_points: 10,
				is_allowed: userData.is_allowed ?? false
			})
			.select()
			.single();

		if (error || !data) {
			throw new Error(`Failed to create user: ${error?.message}`);
		}

		return this.toDTO(data);
	}

	async updatePoints(userId: string, pointsChange: number): Promise<UserDTO | null> {
		// First get current user
		const user = await this.findById(userId);
		if (!user) return null;

		const newPoints = Math.max(0, Math.min(user.points + pointsChange, user.max_points));

		const updateData: Partial<DbUser> = {
			points: newPoints
		};

		if (pointsChange > 0) {
			updateData.total_earned = user.total_earned + pointsChange;
		} else {
			updateData.total_lost = user.total_lost + Math.abs(pointsChange);
		}

		const { data, error } = await this.adminClient
			.from('users')
			.update(updateData)
			.eq('id', userId)
			.select()
			.single();

		if (error || !data) return null;
		return this.toDTO(data);
	}

	async updateLastLogin(userId: string): Promise<void> {
		await this.adminClient
			.from('users')
			.update({ last_login: new Date().toISOString() })
			.eq('id', userId);
	}

	async updateProfile(
		userId: string,
		updates: Partial<Pick<DbUser, 'name' | 'emoji' | 'max_points'>>
	): Promise<UserDTO | null> {
		const { data, error } = await this.adminClient
			.from('users')
			.update(updates)
			.eq('id', userId)
			.select()
			.single();

		if (error || !data) return null;
		return this.toDTO(data);
	}

	async setAllowed(userId: string, isAllowed: boolean): Promise<void> {
		await this.adminClient
			.from('users')
			.update({ is_allowed: isAllowed })
			.eq('id', userId);
	}
}

export const userRepository = new UserRepository();
