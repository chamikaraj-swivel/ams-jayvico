import { UserRole } from '../types/auth';
import { FirebaseAuthService } from './firebaseAuth';
import { updateProfile } from 'firebase/auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    isActive: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
}

class AuthService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Authenticate with Firebase
      const firebaseUser = await FirebaseAuthService.signIn(credentials.email, credentials.password);
      
      // Convert Firebase user to our User interface
      const user: User = {
        id: firebaseUser.user.uid,
        email: firebaseUser.user.email || '',
        firstName: firebaseUser.user.displayName?.split(' ')[0] || '',
        lastName: firebaseUser.user.displayName?.split(' ')[1] || '',
        role: UserRole.FIELD_STAFF, // Default role, can be updated later
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      // Store Firebase token for API calls
      const idToken = await firebaseUser.user.getIdToken();
      localStorage.setItem('firebaseToken', idToken);
      
      return {
        accessToken: idToken,
        refreshToken: '', // Not needed with Firebase
        user,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Create Firebase user
      const firebaseUser = await FirebaseAuthService.signUp(userData.email, userData.password);
      
      // Update Firebase user profile with display name
      await updateProfile(firebaseUser.user, {
        displayName: `${userData.firstName} ${userData.lastName}`,
      });
      
      // Convert Firebase user to our User interface
      const user: User = {
        id: firebaseUser.user.uid,
        email: firebaseUser.user.email || '',
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Store Firebase token for API calls
      const idToken = await firebaseUser.user.getIdToken();
      localStorage.setItem('firebaseToken', idToken);
      
      return {
        accessToken: idToken,
        refreshToken: '', // Not needed with Firebase
        user,
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    try {
      const currentUser = FirebaseAuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      // Get fresh Firebase token
      const idToken = await currentUser.getIdToken(true); // Force refresh
      localStorage.setItem('firebaseToken', idToken);
      
      return { accessToken: idToken };
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      throw new Error('Token refresh failed');
    }
  }

  async getProfile(): Promise<User> {
    try {
      const currentUser = FirebaseAuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      // Convert Firebase user to our User interface
      const user: User = {
        id: currentUser.uid,
        email: currentUser.email || '',
        firstName: currentUser.displayName?.split(' ')[0] || '',
        lastName: currentUser.displayName?.split(' ')[1] || '',
        role: UserRole.FIELD_STAFF, // Default role, can be stored in custom claims later
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      return user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  async updateProfile(profileData: UpdateProfileRequest): Promise<User> {
    try {
      const currentUser = FirebaseAuthService.getCurrentUser();
      if (!currentUser) {
        throw new Error('No authenticated user');
      }

      // Update Firebase user profile
      if (profileData.firstName || profileData.lastName) {
        const displayName = `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim();
        await updateProfile(currentUser, {
          displayName: displayName || currentUser.displayName,
        });
      }

      // Return updated user profile
      return this.getProfile();
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Note: User management methods (getAllUsers, createUser, updateUser, deactivateUser)
  // would require backend integration with Firebase Admin SDK for full functionality.
  // For now, these are simplified to work with Firebase Auth only.
  
  async getAllUsers(): Promise<User[]> {
    // This would require Firebase Admin SDK on backend
    throw new Error('User management requires backend integration');
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    // This would require Firebase Admin SDK on backend
    throw new Error('User management requires backend integration');
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
    // This would require Firebase Admin SDK on backend
    throw new Error('User management requires backend integration');
  }

  async deactivateUser(userId: string): Promise<void> {
    // This would require Firebase Admin SDK on backend
    throw new Error('User management requires backend integration');
  }

  async logout(): Promise<void> {
    try {
      // Sign out from Firebase
      await FirebaseAuthService.signOut();
    } catch (error) {
      console.error('Firebase logout error:', error);
    }
    
    // Clear local storage
    localStorage.removeItem('firebaseToken');
  }

  isAuthenticated(): boolean {
    return FirebaseAuthService.getCurrentUser() !== null;
  }

  getToken(): string | null {
    return localStorage.getItem('firebaseToken');
  }

  /**
   * Initialize Firebase auth state listener
   * This should be called when the app starts
   */
  initializeAuthStateListener(): void {
    FirebaseAuthService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          const idToken = await firebaseUser.getIdToken();
          localStorage.setItem('firebaseToken', idToken);
          console.log('User authenticated:', firebaseUser.email);
        } catch (error) {
          console.error('Error getting Firebase token:', error);
          this.logout();
        }
      } else {
        // User is signed out
        console.log('User signed out');
        this.logout();
      }
    });
  }
}

export const authService = new AuthService();
