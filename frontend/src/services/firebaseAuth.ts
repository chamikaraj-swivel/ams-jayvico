import {
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, UserRole, LoginCredentials, CreateUserData, ChangePasswordData } from '../types/auth';

export class FirebaseAuthService {
  private authStateListener: (() => void) | null = null;

  // Initialize auth state listener
  initializeAuthStateListener(callback: (user: User | null) => void) {
    this.authStateListener = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Try to get user profile - if it doesn't exist, sign out
          const user = await this.getUserProfile(firebaseUser.uid);
          callback(user);
        } catch (error: any) {
          console.error('Error fetching user profile:', error);
          // Sign out the user if we can't get their profile
          await this.signOut();
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  // Clean up auth state listener
  cleanup() {
    if (this.authStateListener) {
      this.authStateListener();
      this.authStateListener = null;
    }
  }

  // Sign in with email and password
  async signIn(credentials: LoginCredentials): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      
      // Get user profile - if it doesn't exist, throw an error
      const user = await this.getUserProfile(userCredential.user.uid);
      
      // Update last login time
      await this.updateLastLogin(userCredential.user.uid);
      
      return user;
    } catch (error: any) {
      // If it's a profile not found error, provide a specific message
      if (error.message === 'User profile not found') {
        await this.signOut();
        throw new Error('Your account exists but no profile has been created. Please contact your administrator to set up your account.');
      }
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error('Failed to sign out');
    }
  }

  // Create new user (admin only)
  async createUser(userData: CreateUserData): Promise<{ userId: string; temporaryPassword: string }> {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.temporaryPassword
      );

      const userId = userCredential.user.uid;

      // Create user profile in Firestore
      const userProfile: User = {
        userId,
        email: userData.email,
        role: userData.role,
        firstName: userData.firstName,
        lastName: userData.lastName,
        mustChangePassword: true,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: null,
      };

      await setDoc(doc(db, 'users', userId), userProfile);

      return {
        userId,
        temporaryPassword: userData.temporaryPassword,
      };
    } catch (error: any) {
      console.error('Detailed error creating user:', {
        error: error,
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // Handle specific Firestore errors
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied: You must be logged in as an admin to create new users. Please ensure you are logged in with an admin account and that your admin profile exists in the system.');
      }
      
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Get user profile from Firestore
  async getUserProfile(userId: string): Promise<User> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      return userDoc.data() as User;
    } catch (error: any) {
      console.error('Error in getUserProfile:', error);
      
      // Handle specific Firestore errors
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied: Firestore security rules need to be configured. Please contact your administrator.');
      }
      
      if (error.message === 'User profile not found') {
        throw error; // Re-throw the specific error
      }
      
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      throw new Error('Failed to update user profile');
    }
  }

  // Change password
  async changePassword(passwordData: ChangePasswordData): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Update password in Firebase Auth
      await updatePassword(user, passwordData.newPassword);

      // Update mustChangePassword flag in Firestore
      await this.updateUserProfile(user.uid, { mustChangePassword: false });
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Update last login time
  private async updateLastLogin(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        lastLoginAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to update last login time:', error);
    }
  }

  // Get all users (admin only)
  async getAllUsers(): Promise<User[]> {
    try {
      const usersQuery = query(collection(db, 'users'));
      const querySnapshot = await getDocs(usersQuery);
      
      return querySnapshot.docs.map(doc => doc.data() as User);
    } catch (error: any) {
      throw new Error('Failed to fetch users');
    }
  }

  // Check if user profile exists
  async userProfileExists(userId: string): Promise<boolean> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists();
    } catch (error) {
      return false;
    }
  }

  // Create user profile for existing Firebase user
  async createUserProfileForExistingUser(firebaseUser: FirebaseUser, role: UserRole = UserRole.FIELD_STAFF): Promise<User> {
    try {
      const now = new Date().toISOString();
      
      // Validate required fields
      if (!firebaseUser.uid) {
        throw new Error('User ID is required');
      }
      
      if (!firebaseUser.email) {
        throw new Error('User email is required');
      }

      const userProfile = {
        userId: firebaseUser.uid,
        email: firebaseUser.email,
        role: role,
        firstName: firebaseUser.displayName?.split(' ')[0] || 'User',
        lastName: firebaseUser.displayName?.split(' ')[1] || '',
        mustChangePassword: true,
        isActive: true,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: null,
      };

      console.log('Creating user profile:', userProfile);

      // Try creating a minimal profile first
      const docRef = doc(db, 'users', firebaseUser.uid);
      
      // Create minimal profile first
      const minimalProfile = {
        userId: firebaseUser.uid,
        email: firebaseUser.email,
        role: role,
        firstName: 'User',
        lastName: '',
        mustChangePassword: true,
        isActive: true,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: null,
      };
      
      await setDoc(docRef, minimalProfile);
      
      console.log('User profile created successfully');
      
      // Return the profile with proper typing
      return userProfile as User;
    } catch (error: any) {
      console.error('Detailed error creating user profile:', {
        error: error,
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw new Error(`Failed to create user profile: ${error.message}`);
    }
  }

  // Generate temporary password
  generateTemporaryPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    
    // Ensure at least one character from each required type
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
    password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]; // Special char
    
    // Fill the rest randomly
    for (let i = 4; i < 12; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  // Check if current user is admin
  async isCurrentUserAdmin(): Promise<boolean> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        return false;
      }
      
      const userProfile = await this.getUserProfile(currentUser.uid);
      return userProfile.role === 'Admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  // Get user-friendly error messages
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No user found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This user account has been disabled';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/requires-recent-login':
        return 'Please sign in again to change your password';
      default:
        return 'An error occurred during authentication';
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService();
