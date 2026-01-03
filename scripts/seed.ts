import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
	console.error('❌ Missing required environment variables:');
	console.error('   - PUBLIC_SUPABASE_URL');
	console.error('   - SUPABASE_SERVICE_KEY');
	console.error('');
	console.error('Please add these to your .env file');
	process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const sampleActions = [
	{ title: 'Made me smile', emoji: '☺️', points: 1, category: 'positive' },
	{ title: 'Cooked a meal', emoji: '👩‍🍳', points: 2, category: 'positive' },
	{ title: 'Sent a sweet text', emoji: '💬', points: 1, category: 'positive' },
	{ title: 'Planned a date', emoji: '📅', points: 3, category: 'positive' },
	{ title: 'Listened to me vent', emoji: '👂', points: 2, category: 'positive' },
	{ title: 'Gave a thoughtful gift', emoji: '🎁', points: 3, category: 'positive' },
	{ title: 'Helped with chores', emoji: '🧹', points: 2, category: 'positive' },
	{ title: 'Cancelled plans', emoji: '😔', points: -2, category: 'negative' },
	{ title: 'Forgot something important', emoji: '🤦', points: -1, category: 'negative' }
];

const sampleRewards = [
	{ title: 'Send a voice note', emoji: '🎙️', required_points: 2, order: 1, category: 'communication' },
	{ title: 'Share a playlist', emoji: '🎵', required_points: 3, order: 2, category: 'sharing' },
	{ title: 'Cook together', emoji: '👩‍🍳', required_points: 5, order: 3, category: 'date' },
	{ title: 'Plan a weekend trip', emoji: '✈️', required_points: 7, order: 4, category: 'adventure' },
	{ title: 'Meet the friends', emoji: '👥', required_points: 10, order: 5, category: 'social' }
];

async function seed() {
	console.log('🌱 Starting database seed...');
	console.log('');

	try {
		// Get a system user to use as created_by (we'll use the first user in the database)
		// If no users exist, we'll create actions without a created_by
		const { data: users } = await supabase.from('users').select('id').limit(1);
		const systemUserId = users && users.length > 0 ? users[0].id : null;

		// Clear existing data (optional - comment out if you don't want to clear)
		console.log('🗑️  Clearing existing actions and rewards...');
		await supabase.from('actions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
		await supabase.from('rewards').delete().neq('id', '00000000-0000-0000-0000-000000000000');
		console.log('✅ Cleared existing data');
		console.log('');

		// Seed actions
		console.log('📝 Seeding actions...');
		const actionsToInsert = sampleActions.map((action) => ({
			title: action.title,
			emoji: action.emoji,
			points: action.points,
			category: action.category,
			created_by: systemUserId,
			is_active: true,
			use_count: 0
		}));

		const { data: insertedActions, error: actionsError } = await supabase
			.from('actions')
			.insert(actionsToInsert)
			.select();

		if (actionsError) {
			console.error('❌ Error seeding actions:', actionsError);
			throw actionsError;
		}

		console.log(`✅ Inserted ${insertedActions?.length || 0} actions`);
		console.log('');

		// Seed rewards
		console.log('🎁 Seeding rewards...');
		const rewardsToInsert = sampleRewards.map((reward) => ({
			title: reward.title,
			emoji: reward.emoji,
			required_points: reward.required_points,
			order: reward.order,
			category: reward.category,
			is_active: true
		}));

		const { data: insertedRewards, error: rewardsError } = await supabase
			.from('rewards')
			.insert(rewardsToInsert)
			.select();

		if (rewardsError) {
			console.error('❌ Error seeding rewards:', rewardsError);
			throw rewardsError;
		}

		console.log(`✅ Inserted ${insertedRewards?.length || 0} rewards`);
		console.log('');

		console.log('🎉 Database seeded successfully!');
		console.log('');
		console.log('Seeded data:');
		console.log(`  - ${insertedActions?.length || 0} actions`);
		console.log(`  - ${insertedRewards?.length || 0} rewards`);
		console.log('');
		console.log('Next steps:');
		console.log('1. Make sure your Supabase credentials are configured in .env');
		console.log('2. Add your allowed emails to ALLOWED_EMAILS in .env');
		console.log('3. Run: npm run dev');
		console.log('4. Visit: http://localhost:5173');
	} catch (error) {
		console.error('❌ Seed failed:', error);
		process.exit(1);
	}
}

seed();
