import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/points-tracker';

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

	const client = new MongoClient(MONGODB_URI);

	try {
		await client.connect();
		console.log('✅ Connected to MongoDB');

		const db = client.db('points-tracker');

		// Clear existing data (optional - comment out if you don't want to clear)
		console.log('🗑️  Clearing existing data...');
		await db.collection('actions').deleteMany({});
		await db.collection('rewards').deleteMany({});

		// Seed actions
		console.log('📝 Seeding actions...');
		const actionsToInsert = sampleActions.map((action) => ({
			...action,
			created_by: null, // Will be set when users create custom actions
			is_active: true,
			use_count: 0,
			metadata: {
				created_at: new Date(),
				updated_at: new Date()
			}
		}));

		const actionsResult = await db.collection('actions').insertMany(actionsToInsert);
		console.log(`✅ Inserted ${actionsResult.insertedCount} actions`);

		// Seed rewards
		console.log('🎁 Seeding rewards...');
		const rewardsToInsert = sampleRewards.map((reward) => ({
			...reward,
			is_active: true,
			metadata: {
				created_at: new Date(),
				updated_at: new Date()
			}
		}));

		const rewardsResult = await db.collection('rewards').insertMany(rewardsToInsert);
		console.log(`✅ Inserted ${rewardsResult.insertedCount} rewards`);

		console.log('');
		console.log('🎉 Database seeded successfully!');
		console.log('');
		console.log('Next steps:');
		console.log('1. Configure your Supabase credentials in .env');
		console.log('2. Add your allowed emails to ALLOWED_EMAILS in .env');
		console.log('3. Run: npm run dev');
		console.log('4. Visit: http://localhost:5173');
	} catch (error) {
		console.error('❌ Seed failed:', error);
		throw error;
	} finally {
		await client.close();
		console.log('👋 Disconnected from MongoDB');
	}
}

seed().catch(console.error);
