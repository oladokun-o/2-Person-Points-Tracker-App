import { getSupabaseClient, getSupabaseAdminClient, type DbAction } from '../supabase';
import type { ActionDTO } from '$lib/types';

export class ActionRepository {
	private get client() {
		return getSupabaseClient();
	}

	private get adminClient() {
		return getSupabaseAdminClient();
	}

	private toDTO(action: DbAction): ActionDTO {
		return {
			_id: action.id,
			title: action.title,
			emoji: action.emoji,
			points: action.points,
			category: action.category ?? undefined,
			created_by: action.created_by,
			is_active: action.is_active,
			use_count: action.use_count,
			metadata: {
				created_at: action.created_at,
				updated_at: action.updated_at
			}
		};
	}

	async findAll(activeOnly = true): Promise<ActionDTO[]> {
		let query = this.client.from('actions').select('*').order('use_count', { ascending: false });

		if (activeOnly) {
			query = query.eq('is_active', true);
		}

		const { data, error } = await query;

		if (error || !data) return [];
		return data.map((action) => this.toDTO(action));
	}

	async findById(id: string): Promise<ActionDTO | null> {
		const { data, error } = await this.client
			.from('actions')
			.select('*')
			.eq('id', id)
			.single();

		if (error || !data) return null;
		return this.toDTO(data);
	}

	async create(actionData: {
		title: string;
		emoji: string;
		points: number;
		category?: string;
		created_by: string;
	}): Promise<ActionDTO> {
		const { data, error } = await this.adminClient
			.from('actions')
			.insert({
				title: actionData.title,
				emoji: actionData.emoji,
				points: actionData.points,
				category: actionData.category ?? null,
				created_by: actionData.created_by,
				is_active: true,
				use_count: 0
			})
			.select()
			.single();

		if (error || !data) {
			throw new Error(`Failed to create action: ${error?.message}`);
		}

		return this.toDTO(data);
	}

	async update(
		id: string,
		updates: Partial<Pick<DbAction, 'title' | 'emoji' | 'points' | 'category' | 'is_active'>>
	): Promise<ActionDTO | null> {
		const { data, error } = await this.adminClient
			.from('actions')
			.update(updates)
			.eq('id', id)
			.select()
			.single();

		if (error || !data) return null;
		return this.toDTO(data);
	}

	async incrementUseCount(id: string): Promise<void> {
		// Get current use_count
		const { data: current } = await this.adminClient
			.from('actions')
			.select('use_count')
			.eq('id', id)
			.single();

		if (current) {
			await this.adminClient
				.from('actions')
				.update({ use_count: current.use_count + 1 })
				.eq('id', id);
		}
	}

	async delete(id: string): Promise<boolean> {
		// Soft delete by setting is_active to false
		const { error } = await this.adminClient
			.from('actions')
			.update({ is_active: false })
			.eq('id', id);

		return !error;
	}
}

export const actionRepository = new ActionRepository();
