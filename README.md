# Points Tracker

A private, intimate web app for two people to track their relationship comfort/trust level through a point system.

## Features

- **Points System**: Track comfort/trust through points (0-10 by default, adjustable)
- **Mutual Awards**: Each person awards points to the OTHER person only
- **Rewards**: Unlock rewards at specific point thresholds
- **Transaction History**: See all point exchanges over time
- **Actions**: Pre-defined and custom actions for awarding/deducting points
- **Whitelist Auth**: Only 2 specific users can access (via Google/Apple OAuth)

## Tech Stack

- **Frontend**: SvelteKit + TypeScript + Tailwind CSS
- **Backend**: SvelteKit server routes + MongoDB
- **Auth**: Supabase (Google OAuth, Apple OAuth, Email)
- **Database**: MongoDB (local or Atlas)

## Getting Started

### 1. Prerequisites

- Node.js 20.19+ (use nvm to switch: `nvm use 20.19.0`)
- MongoDB running locally OR MongoDB Atlas account
- Supabase account (for authentication)

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example env file:

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/points-tracker
# OR for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/points-tracker

# Supabase Auth (from your Supabase project settings)
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Whitelist (comma-separated emails - ONLY these users can access)
ALLOWED_EMAILS=person1@gmail.com,person2@gmail.com

NODE_ENV=development
```

### 4. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Authentication > Providers**
3. Enable **Google** and **Apple** (optional) OAuth providers
4. Configure redirect URLs:
   - Development: `http://localhost:5173/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`
5. Copy your project URL and anon key to `.env`

### 5. Seed the Database

Run the seed script to populate initial actions and rewards:

```bash
npm run seed
```

This will add:
- 9 sample actions (e.g., "Made me smile", "Cooked a meal", "Cancelled plans")
- 5 sample rewards at different point thresholds

### 6. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

## First Time Setup

1. Click "Continue with Google" (or Apple)
2. Sign in with one of the whitelisted emails
3. If successful, you'll see the dashboard
4. Have the second person log in with their whitelisted email
5. Now you can award points to each other!

## Usage

### Awarding Points

1. Click "Award Points" button
2. Select the other user
3. Choose an action (or enter custom points)
4. Add an optional personal note
5. Confirm!

### Viewing Rewards

Rewards are displayed on the dashboard and show:
- ✅ **Unlocked** (green) - You have enough points!
- 🔒 **Locked** (gray) - Shows how many more points needed

### Managing Actions

You can create custom actions via the actions API endpoint (UI coming in Phase 2).

## Project Structure

```
points-tracker/
├── src/
│   ├── lib/
│   │   ├── types/              # TypeScript interfaces
│   │   ├── components/         # Svelte components
│   │   └── server/
│   │       ├── db/            # MongoDB connection & repositories
│   │       └── auth/          # Supabase auth & whitelist
│   ├── routes/
│   │   ├── auth/              # Login, callback, signout
│   │   ├── api/               # API endpoints
│   │   └── +page.svelte       # Dashboard
│   └── app.css                # Tailwind styles
├── scripts/
│   └── seed.ts                # Database seed script
└── .env                       # Environment variables
```

## API Endpoints

### Authentication
- `POST /auth/callback` - OAuth callback
- `POST /auth/signout` - Sign out

### Users
- `GET /api/users` - Get all users

### Points
- `POST /api/award-points` - Award or deduct points

### Actions
- `GET /api/actions` - Get all actions
- `POST /api/actions` - Create action

### Rewards
- `GET /api/rewards?user_id={id}` - Get rewards with unlock status

### History
- `GET /api/history?limit=50` - Get transaction history

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

Don't forget to:
- Update Supabase redirect URLs to production domain
- Use MongoDB Atlas for production database
- Test OAuth flow on production

## Development Roadmap

### ✅ Phase 1: MVP (Complete)
- [x] Project setup
- [x] MongoDB & Supabase integration
- [x] Authentication with whitelist
- [x] Basic dashboard
- [x] Award points functionality
- [x] Rewards list

### 🔄 Phase 2: Core Features
- [ ] Actions CRUD UI
- [ ] Rewards CRUD UI
- [ ] Transaction history page
- [ ] Points animations
- [ ] Personal notes on transactions
- [ ] Mobile-responsive improvements

### 📋 Phase 3: Polish
- [ ] Apple OAuth
- [ ] Email magic link auth
- [ ] Settings page
- [ ] Celebration animations
- [ ] Toast notifications
- [ ] Better error handling
- [ ] Loading states

### 💭 Phase 4: Nice-to-Haves
- [ ] Push notifications
- [ ] Export data
- [ ] Statistics/charts
- [ ] Streaks & achievements
- [ ] Custom themes
- [ ] PWA support

## Troubleshooting

### "Unauthorized" when logging in
- Check that your email is in `ALLOWED_EMAILS` in `.env`
- Emails are case-insensitive and trimmed

### Database connection errors
- Make sure MongoDB is running locally
- Or check your MongoDB Atlas connection string
- Verify network access in Atlas (IP whitelist)

### OAuth not working
- Check Supabase redirect URLs match your domain
- Verify provider is enabled in Supabase dashboard
- Check browser console for errors

### Build errors about Node version
- Use Node 20.19+: `nvm use 20.19.0`
- Run `npm install` again

## License

Private project - not for redistribution.

## Credits

Built with SvelteKit, MongoDB, Supabase, and Tailwind CSS.
