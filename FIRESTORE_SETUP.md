# Firestore Security Rules Setup

## Problem

The authentication system is failing with "Missing or insufficient permissions" errors because Firestore security rules are not configured to allow users to read their own profiles.

## Solution

Deploy the provided Firestore security rules to your Firebase project.

## Steps to Deploy

### 1. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase in your project (if not already done)

```bash
firebase init firestore
```

- Select your Firebase project: `jayvico-ams`
- Use the existing `firestore.rules` file
- Use the existing `firestore.indexes.json` file

### 4. Deploy the rules

```bash
firebase deploy --only firestore:rules
```

## Security Rules Explanation

The rules allow:

1. **Users to read their own profile**: `request.auth.uid == userId`
2. **Users to update their own profile** (except protected fields like role, isActive, userId, email, createdAt)
3. **Admins to read all user profiles**: Checks if the requesting user has Admin role
4. **Admins to create new users**: Only admins can create new user documents
5. **Admins to update any user profile**: Including role and status changes

## Testing the Rules

After deploying, test the authentication flow:

1. Try to sign in with an existing user
2. The user should be able to read their own profile
3. Admins should be able to access the User Management page

## Troubleshooting

If you still get permission errors:

1. Verify the rules were deployed: Check Firebase Console > Firestore > Rules
2. Check that the user document exists in Firestore
3. Verify the user's role field is set correctly
4. Check the Firebase Console logs for detailed error messages
