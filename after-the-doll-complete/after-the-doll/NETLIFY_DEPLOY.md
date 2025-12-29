# Netlify Deployment Guide

## Quick Update Steps

If you already have the site deployed on Netlify, follow these steps to deploy the updated version:

### 1. Update Firestore Rules (CRITICAL)

Before deploying the code, update your Firestore security rules:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Rules**
4. Copy the entire contents of `firestore.rules` from this project
5. Paste into the rules editor (replacing existing rules)
6. Click **"Publish"**

**Why this is critical**: The new archive system requires new security rules. Without them, users won't be able to create archives.

### 2. Deploy Updated Code to Netlify

**Option A: Using Netlify CLI**
```bash
# Install Netlify CLI if you haven't
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the project
npm run build

# Deploy
netlify deploy --prod
```

**Option B: Using Git (Recommended)**
```bash
# If connected to Git, just push
git add .
git commit -m "Add archive system and fix Create Archive routing"
git push

# Netlify will auto-deploy
```

**Option C: Manual Drag & Drop**
1. Run `npm run build` locally
2. Go to Netlify dashboard
3. Drag the `.next` folder to the deploy area

### 3. Verify Environment Variables

Make sure these are set in Netlify:
1. Go to your site in Netlify Dashboard
2. Go to **Site settings** → **Environment variables**
3. Verify all Firebase variables are present:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

### 4. Test the Deployment

After deployment:
1. **Test Login**: Make sure you can log in
2. **Test "Create Archive" Button**: 
   - When logged out: Should show "Create Your Archive" → routes to /register
   - When logged in: Should show "Create Archive" → routes to /archive/new
3. **Create an Archive**: Try creating a new archive
4. **Create an Entry**: Create an entry within the archive
5. **View Dashboard**: Should show archives list

## First-Time Netlify Deployment

If this is your first time deploying to Netlify:

### 1. Build the Project Locally First

```bash
npm install
npm run build
```

Make sure it builds without errors.

### 2. Deploy to Netlify

**Option A: Using Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize (first time only)
netlify init

# Deploy
netlify deploy --prod
```

**Option B: Connect Git Repository**
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://app.netlify.com/)
3. Click "New site from Git"
4. Connect your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Framework preset**: Next.js

**Option C: Manual Deploy**
1. Run `npm run build`
2. Go to Netlify Dashboard
3. Drag `.next` folder to deploy

### 3. Configure Environment Variables in Netlify

1. In Netlify Dashboard, go to **Site settings**
2. Go to **Environment variables**
3. Add all Firebase configuration variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-value
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-value
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-value
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-value
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-value
NEXT_PUBLIC_FIREBASE_APP_ID=your-value
```

4. **Trigger Redeploy** to apply the environment variables

## Troubleshooting

### "Create Archive" still goes to register page
- **Solution**: Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Netlify might be serving cached assets

### "Permission denied" when creating archives
- **Solution**: Make sure you deployed the updated `firestore.rules` to Firebase
- Check Firebase Console → Firestore Database → Rules

### Env variables not working
- **Solution**: After adding env vars in Netlify, you MUST redeploy
- Go to Deploys tab → Trigger deploy → Clear cache and deploy site

### Build fails on Netlify
- Check build logs for specific errors
- Most common: Missing dependencies
- **Solution**: Make sure `package.json` is up to date

### Site shows old version
- **Solution**: Clear Netlify cache
  - Go to Deploys → Trigger deploy → Clear cache and deploy site
- Or add `?v=2` to URL to bypass cache

## Performance Tips for Netlify

1. **Enable Branch Deploys**: Test changes before production
2. **Set up Deploy Previews**: Preview PRs automatically
3. **Configure Build Plugins**: 
   - Cache Next.js plugin for faster builds
4. **Custom Domain**: Set up your custom domain in Site settings

## Monitoring

After deployment, monitor:
- **Deploy logs**: Check for any warnings
- **Function logs**: (if using Netlify Functions later)
- **Analytics**: Enable Netlify Analytics to track usage

## Rollback

If something goes wrong:
1. Go to **Deploys** in Netlify Dashboard
2. Find a previous working deploy
3. Click the three dots → **Publish deploy**
4. The site will rollback to that version

## Support

If you encounter deployment issues:
1. Check Netlify build logs
2. Check Firebase Console for permission errors
3. Verify all environment variables are set
4. Try clearing Netlify cache and redeploying
