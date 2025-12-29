# Changelog - Archive System Update

## What Changed

### 🐛 Bug Fixes
- **Fixed "Create Archive" button routing**: The button now correctly routes to archive creation (`/archive/new`) instead of the registration page
- **Improved auth state detection**: The landing page now properly detects logged-in users and shows appropriate CTAs

### ✨ New Features
- **Archive System**: Implemented a proper archive container model for organizing journal entries
  - Archives are containers that hold multiple journal entries
  - Users can create multiple archives to organize different aspects of their life
  - Each archive has a title and optional description

- **New Routes**:
  - `/archive/new` - Create a new archive
  - `/archive/[archiveId]` - View an archive and its entries
  - `/archive/[archiveId]/new-entry` - Create a new entry within an archive

- **Updated Dashboard**: Now shows archives instead of entries directly
  - Click an archive to view its entries
  - Create new archives from the dashboard

### 🗄️ Database Changes

**New Firestore Collection: `archives`**
```javascript
{
  archiveId: string,
  uid: string,           // owner user ID
  username: string,
  title: string,
  description: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Updated `entries` Collection**
- Added `archiveId` field to link entries to their parent archive
- Entries are now created within archives instead of standalone

### 🔒 Security Rules Updated
- Added rules for the `archives` collection
- Archives are private to their owner
- Entries must belong to an archive

### 🎨 UI Changes
- Navigation now shows "Create Archive" button when logged in
- Dashboard lists archives instead of entries
- Landing page adapts based on auth state
- Better error messages for Firestore permission issues

## Migration Notes

**For existing installations:**
1. Deploy the updated `firestore.rules` to Firebase Console
2. Existing entries without an `archiveId` will need to be migrated or won't be visible in the new UI
3. Users should create at least one archive to start using the new system

**Fresh installations:**
- Follow the setup instructions in README.md
- The new archive system will be the primary way to organize journal entries

## How to Use

1. **Create an Archive**: Click "Create Archive" in the navigation
2. **Add Entries**: Navigate to your archive and click "New Entry"
3. **Organize**: Create multiple archives for different topics or time periods
4. **View**: All entries are organized chronologically within their archives

## Technical Details

### Entry Creation Flow
Old flow: Dashboard → New Entry → Entry created
New flow: Dashboard → Select/Create Archive → New Entry → Entry created in archive

### Archive Benefits
- Better organization of journal entries
- Ability to have multiple distinct journals
- Clearer mental model (container → entries)
- Easier to manage privacy settings per archive
- More scalable as entry count grows

## Deployment Checklist

Before deploying to Netlify:
- [ ] Update firestore.rules in Firebase Console
- [ ] Verify environment variables are set in Netlify
- [ ] Test archive creation in production
- [ ] Test entry creation within archives
- [ ] Verify auth state detection works
- [ ] Check that "Create Archive" button routes correctly

## Support

If you encounter issues:
- Check Firestore rules are properly deployed
- Verify `.env.local` (or Netlify env vars) are correct
- Check browser console for detailed error messages
- Ensure you're logged in before creating archives
