#!/usr/bin/env node

// Setup script to create the first admin user profile
// This script helps resolve the "permission denied" error when creating users

const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAs9DUF2Sm8JlHA05J3c_UDmv2SLJzzpm0",
  authDomain: "jayvico-ams.firebaseapp.com",
  projectId: "jayvico-ams",
  storageBucket: "jayvico-ams.firebasestorage.app",
  messagingSenderId: "887968234312",
  appId: "1:887968234312:web:dae1a9f1b401165f46d17d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function setupAdminUser() {
  try {
    console.log('🔧 Admin User Setup Script');
    console.log('==========================');
    console.log('');
    
    // Get credentials from user input
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

    const email = await question('Enter your admin email: ');
    const password = await question('Enter your admin password: ');
    const firstName = await question('Enter your first name: ');
    const lastName = await question('Enter your last name: ');
    
    rl.close();

    if (!email || !password || !firstName || !lastName) {
      console.log('❌ All fields are required. Please run the script again.');
      return;
    }

    console.log('');
    console.log('🔐 Signing in to Firebase Auth...');
    
    // Sign in to Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('✅ Successfully signed in to Firebase Auth');
    console.log(`   User ID: ${user.uid}`);
    console.log(`   Email: ${user.email}`);
    
    // Check if user profile already exists
    console.log('');
    console.log('🔍 Checking if user profile already exists...');
    
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const existingProfile = userDoc.data();
      console.log('⚠️  User profile already exists:');
      console.log(`   Role: ${existingProfile.role}`);
      console.log(`   Name: ${existingProfile.firstName} ${existingProfile.lastName}`);
      console.log(`   Created: ${existingProfile.createdAt}`);
      
      if (existingProfile.role === 'Admin') {
        console.log('✅ Admin profile is already set up correctly!');
        return;
      } else {
        console.log('🔄 Updating existing profile to Admin role...');
      }
    } else {
      console.log('📝 Creating new admin user profile...');
    }
    
    // Create or update user profile
    const userProfile = {
      userId: user.uid,
      email: user.email,
      role: "Admin",
      firstName: firstName,
      lastName: lastName,
      mustChangePassword: false,
      isActive: true,
      createdAt: userDoc.exists() ? userDoc.data().createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null,
    };
    
    await setDoc(userDocRef, userProfile);
    
    console.log('');
    console.log('🎉 Admin user profile created/updated successfully!');
    console.log('==================================================');
    console.log(`User ID: ${user.uid}`);
    console.log(`Email: ${user.email}`);
    console.log(`Name: ${firstName} ${lastName}`);
    console.log(`Role: Admin`);
    console.log('');
    console.log('✅ You can now create new users from the User Management page.');
    console.log('   Make sure to refresh your browser if you have the app open.');
    
  } catch (error) {
    console.log('');
    console.log('❌ Error setting up admin user:');
    console.log(`   ${error.message}`);
    console.log('');
    
    if (error.code === 'auth/user-not-found') {
      console.log('💡 Solution: Make sure you have created a Firebase Auth user first.');
      console.log('   You can create one at: https://console.firebase.google.com/project/jayvico-ams/authentication/users');
    } else if (error.code === 'auth/wrong-password') {
      console.log('💡 Solution: Check your password and try again.');
    } else if (error.code === 'permission-denied') {
      console.log('💡 Solution: The Firestore security rules need to be deployed.');
      console.log('   Run: npx firebase deploy --only firestore:rules --project jayvico-ams');
    }
  }
}

// Run the setup
setupAdminUser();
