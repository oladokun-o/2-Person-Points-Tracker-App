import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY,
} from "$env/static/public";
import { env } from "$env/dynamic/private";

if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
	throw new Error('Supabase environment variables are not set');
}

let supabaseClient: SupabaseClient;
let supabaseAdminClient: SupabaseClient;

export function getSupabaseClient(): SupabaseClient {
	if (!supabaseClient) {
		supabaseClient = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
	}
	return supabaseClient;
}

// Admin client with service role key - bypasses RLS
export function getSupabaseAdminClient(): SupabaseClient {
	if (!env.SUPABASE_SERVICE_KEY) {
		throw new Error('SUPABASE_SERVICE_KEY is not set');
	}
	if (!supabaseAdminClient) {
		supabaseAdminClient = createClient(PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_KEY, {
			auth: {
				autoRefreshToken: false,
				persistSession: false
			}
		});
	}
	return supabaseAdminClient;
}

// Database types
export interface Database {
	public: {
		Tables: {
			users: {
				Row: DbUser;
				Insert: Omit<DbUser, 'id' | 'created_at' | 'updated_at' | 'last_login'>;
				Update: Partial<Omit<DbUser, 'id' | 'created_at'>>;
			};
			actions: {
				Row: DbAction;
				Insert: Omit<DbAction, 'id' | 'created_at' | 'updated_at'>;
				Update: Partial<Omit<DbAction, 'id' | 'created_at'>>;
			};
			rewards: {
				Row: DbReward;
				Insert: Omit<DbReward, 'id' | 'created_at' | 'updated_at'>;
				Update: Partial<Omit<DbReward, 'id' | 'created_at'>>;
			};
			transactions: {
				Row: DbTransaction;
				Insert: Omit<DbTransaction, 'id' | 'created_at'>;
				Update: never;
			};
		};
	};
}

export interface DbUser {
	id: string;
	auth_id: string;
	email: string;
	name: string;
	emoji: string;
	points: number;
	total_earned: number;
	total_lost: number;
	max_points: number;
	avatar_url: string | null;
	provider: 'google' | 'apple' | 'email';
	is_allowed: boolean;
	created_at: string;
	updated_at: string;
	last_login: string;
}

export interface DbAction {
	id: string;
	title: string;
	emoji: string;
	points: number;
	category: string | null;
	created_by: string;
	is_active: boolean;
	use_count: number;
	created_at: string;
	updated_at: string;
}

export interface DbReward {
	id: string;
	title: string;
	description: string | null;
	emoji: string;
	required_points: number;
	category: string | null;
	order: number;
	is_active: boolean;
	created_at: string;
	updated_at: string;
}

export interface DbTransaction {
	id: string;
	awarded_to: string;
	awarded_by: string;
	action_id: string | null;
	points: number;
	note: string | null;
	created_at: string;
}