export enum UserRole {
  ADMIN = 'Admin',
  OPERATIONS_MANAGER = 'OperationsManager',
  CUSTOMER_SERVICE = 'CustomerService',
  FINANCE = 'Finance',
  FIELD_STAFF = 'FieldStaff',
}

export interface User {
  userId: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  mustChangePassword: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  temporaryPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
