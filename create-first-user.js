// Temporary script to create the first user profile
// Run this once to create your admin user profile

const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

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

async function createFirstUser() {
  try {
    // Replace these with your actual credentials
    const email = "your-email@example.com"; // Replace with your email
    const password = "your-password"; // Replace with your password
    
    console.log("Signing in...");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log("Creating user profile...");
    const userProfile = {
      userId: user.uid,
      email: user.email,
      role: "Admin",
      firstName: "Admin", // Replace with your name
      lastName: "User",    // Replace with your name
      mustChangePassword: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null,
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    
    console.log("✅ User profile created successfully!");
    console.log("User ID:", user.uid);
    console.log("Email:", user.email);
    console.log("Role: Admin");
    
  } catch (error) {
    console.error("❌ Error creating user profile:", error.message);
  }
}

createFirstUser();
