# Quick Start Guide - After The Doll

This guide will get you up and running in about 10-15 minutes.

## Step 1: Install Dependencies (2 minutes)

```bash
cd after-the-doll
npm install
```

## Step 2: Set Up Firebase (5-10 minutes)

### Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it "after-the-doll" (or whatever you prefer)
4. Click through the setup (you can disable Analytics)

### Enable Authentication
1. In your Firebase project, click "Authentication" in the sidebar
2. Click "Get started"
3. Click "Email/Password"
4. Toggle it ON
5. Click "Save"

### Create Firestore Database
1. Click "Firestore Database" in the sidebar
2. Click "Create database"
3. Choose "Start in production mode"
4. Pick your location
5. Click "Enable"

### Add Security Rules
1. Still in Firestore, click the "Rules" tab
2. Copy the ENTIRE contents of `firestore.rules` from this project
3. Paste it into the rules editor (replacing what's there)
4. Click "Publish"

### Get Your Config
1. Click the gear icon (Project settings)
2. Scroll to "Your apps"
3. Click the web icon `</>`
4. Register your app with a nickname
5. Copy the config values (you'll need these next)

## Step 3: Configure Environment (2 minutes)

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your Firebase values:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
   ```

## Step 4: Create Forum Categories (Optional, 2 minutes)

This is optional but recommended so you can test the forum:

1. In Firebase Console, go to Firestore Database
2. Click "Start collection"
3. Collection ID: `forumCategories`
4. Click "Auto-ID" for document ID
5. Add these fields:
   - `categoryId` (string): paste the auto-generated document ID
   - `name` (string): "General Discussion"
   - `description` (string): "Talk about anything"
   - `sortOrder` (number): 1
6. Click "Save"

Repeat for a couple more categories if you want (Introductions, Creative Writing, etc.)

## Step 5: Run the App! (30 seconds)

```bash
npm run dev
```

Open http://localhost:3000

## First Steps in the App

1. Click "Register" and create an account
2. Go to Settings and add a bio
3. Create your first journal entry
4. Explore the forum
5. Try different themes in Settings

## That's it!

You now have a fully functional personal archive platform running locally.

## Need Help?

- Check the main README.md for detailed troubleshooting
- Make sure your `.env.local` values are correct
- Verify Firestore rules are published
- Check the browser console for errors

## Common Issues

**"Permission denied"**
→ Make sure you published the Firestore rules

**Firebase errors**
→ Double-check your `.env.local` file

**Can't create threads**
→ Make sure you created at least one forum category

**Theme not changing**
→ Reload the page after changing theme in Settings
