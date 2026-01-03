import { getSupabaseClient, getSupabaseAdminClient } from '../supabase';
import type { NoteDTO } from '$lib/types';

interface DbNote {
	id: string;
	content: string;
	created_by: string;
	is_pinned: boolean;
	created_at: string;
	updated_at: string;
}

export class NoteRepository {
	private get client() {
		return getSupabaseClient();
	}

	private get adminClient() {
		return getSupabaseAdminClient();
	}

	private toDTO(note: DbNote): NoteDTO {
		return {
			_id: note.id,
			content: note.content,
			created_by: note.created_by,
			is_pinned: note.is_pinned,
			created_at: note.created_at,
			updated_at: note.updated_at
		};
	}

	async findAll(limit = 50): Promise<NoteDTO[]> {
		const { data, error } = await this.client
			.from('notes')
			.select('*')
			.order('is_pinned', { ascending: false })
			.order('created_at', { ascending: false })
			.limit(limit);

		if (error || !data) return [];
		return data.map((note) => this.toDTO(note));
	}

	async findById(id: string): Promise<NoteDTO | null> {
		const { data, error } = await this.client.from('notes').select('*').eq('id', id).single();

		if (error || !data) return null;
		return this.toDTO(data);
	}

	async create(noteData: { content: string; created_by: string }): Promise<NoteDTO> {
		const { data, error } = await this.adminClient
			.from('notes')
			.insert({
				content: noteData.content,
				created_by: noteData.created_by,
				is_pinned: false
			})
			.select()
			.single();

		if (error || !data) {
			throw new Error(`Failed to create note: ${error?.message}`);
		}

		return this.toDTO(data);
	}

	async update(id: string, updates: { content?: string; is_pinned?: boolean }): Promise<NoteDTO | null> {
		const { data, error} = await this.adminClient
			.from('notes')
			.update(updates)
			.eq('id', id)
			.select()
			.single();

		if (error || !data) return null;
		return this.toDTO(data);
	}

	async delete(id: string): Promise<boolean> {
		const { error } = await this.adminClient.from('notes').delete().eq('id', id);
		return !error;
	}

	async togglePin(id: string): Promise<NoteDTO | null> {
		// Get current pinned state
		const note = await this.findById(id);
		if (!note) return null;

		return this.update(id, { is_pinned: !note.is_pinned });
	}
}

export const noteRepository = new NoteRepository();
