# After The Doll

A calm, retro-inspired social platform designed as a personal archive rather than a live feed. Journaling first, conversation second.

## Features

- **Personal Archive**: Write editorial-style journal entries with Markdown support
- **Privacy Controls**: Public, friends-only, or private visibility for each entry
- **Thoughtful Discussion**: Comments and questions on journal entries
- **Friends System**: Simple friend requests and connections
- **Classic Forums**: Traditional forum categories, threads, and replies
- **Theme Presets**: Choose from vintage, ocean, forest, or sunset themes
- **No Engagement Metrics**: No likes, reactions, or algorithms

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Firebase Authentication
- Firestore Database
- Tailwind CSS
- React Markdown

## Prerequisites

- Node.js 18+ and npm
- A Firebase account (free tier is sufficient)

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "after-the-doll")
4. Disable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firebase Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click "Get started"
3. Click on "Email/Password" under Sign-in providers
4. Enable "Email/Password" (leave Email link disabled)
5. Click "Save"

### 3. Create Firestore Database

1. In Firebase Console, go to **Build > Firestore Database**
2. Click "Create database"
3. Select "Start in production mode" (we'll add rules next)
4. Choose a location (pick one close to your users)
5. Click "Enable"

### 4. Deploy Firestore Security Rules

1. In Firebase Console, go to **Firestore Database > Rules**
2. Copy the entire contents of `firestore.rules` from this project
3. Paste into the rules editor
4. Click "Publish"

### 5. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Enter app nickname (e.g., "After The Doll Web")
5. Do NOT enable Firebase Hosting
6. Click "Register app"
7. Copy the configuration values (apiKey, authDomain, etc.)

### 6. Create Forum Categories (Optional but Recommended)

Since forum categories can only be created by admins, you'll need to add them manually:

1. In Firebase Console, go to **Firestore Database**
2. Click "Start collection"
3. Collection ID: `forumCategories`
4. Document ID: Click "Auto-ID"
5. Add these fields:
   - `categoryId` (string): Copy the auto-generated document ID
   - `name` (string): "General Discussion"
   - `description` (string): "Talk about anything and everything"
   - `sortOrder` (number): 1
6. Click "Save"
7. Repeat to create more categories (e.g., "Introductions", "Creative Writing", etc.)

Example categories to create:

```
Category 1:
- categoryId: [auto-generated ID]
- name: "General Discussion"
- description: "Talk about anything and everything"
- sortOrder: 1

Category 2:
- categoryId: [auto-generated ID]
- name: "Introductions"
- description: "Introduce yourself to the community"
- sortOrder: 2

Category 3:
- categoryId: [auto-generated ID]
- name: "Creative Writing"
- description: "Share your stories, poems, and creative works"
- sortOrder: 3
```

## Local Setup

### 1. Clone or Download the Project

If you have the project files, navigate to the project directory:

```bash
cd after-the-doll
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Firebase configuration values from step 5 above:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Using the Application

### First Steps

1. **Register an account**: Click "Register" and create your account
2. **Set up your profile**: Go to Settings to add a bio and choose a theme
3. **Create your first entry**: Click "New Entry" to write your first journal entry
4. **Explore the forum**: Visit the forum to see public discussions

### Journal Entries

- Write in Markdown for formatting (headers, lists, bold, italic, etc.)
- Tag your entries for easy filtering later
- Choose visibility:
  - **Public**: Anyone can read
  - **Friends**: Only your friends can read
  - **Private**: Only you can read

### Friends System

- Send friend requests by username from the Friends page
- Accept or decline incoming requests
- Friends can view your "friends-only" journal entries

### Forum

- Browse categories and threads
- Create new threads and post replies
- All forum content is public

## Project Structure

```
after-the-doll/
├── src/
│   ├── app/              # Next.js pages and routes
│   ├── components/       # Reusable React components
│   ├── lib/             # Firebase config and utilities
│   └── types/           # TypeScript type definitions
├── firestore.rules      # Firestore security rules
├── .env.example         # Environment variables template
└── package.json         # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Troubleshooting

### "Permission denied" errors

- Make sure you've deployed the Firestore security rules from `firestore.rules`
- Verify that you're logged in when trying to access protected features

### Firebase configuration errors

- Double-check that all environment variables in `.env.local` are correct
- Make sure the `.env.local` file is in the root directory
- Restart the development server after changing `.env.local`

### Can't create forum threads

- Make sure you've created at least one forum category in Firestore
- Verify you're logged in

### Theme not applying

- Theme changes require a page reload
- Make sure you saved your settings

## Security Notes

- Never commit your `.env.local` file to version control
- The provided Firestore rules are production-ready and follow security best practices
- Users can only edit their own content
- Friend-only entries are only visible to actual friends

## Future Enhancements

Some ideas for extending the platform:

- Avatar upload support using Firebase Storage
- Search functionality for entries and forum posts
- Email notifications for friend requests and comments
- Export your archive as a PDF or ebook
- Dark mode theme option
- Rich text editor option (alternative to Markdown)

## Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Verify your Firebase configuration
3. Check the browser console for error messages
4. Ensure Firestore rules are properly deployed

## License

This project is provided as-is for personal use and learning.
