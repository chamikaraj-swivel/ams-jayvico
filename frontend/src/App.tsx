import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import PasswordChangeModal from "./components/PasswordChangeModal";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/Dashboard";
import VehicleRecords from "./pages/VehicleRecords";
import CustomerManagement from "./pages/CustomerManagement";
import ProfilePage from "./pages/ProfilePage";
import UserManagementPage from "./pages/UserManagementPage";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setUser } from "./store/slices/authSlice";
import { changePassword } from "./store/slices/authSlice";
import { UserRole, ChangePasswordData } from "./types/auth";
import { firebaseAuthService } from "./services/firebaseAuth";

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, user } = useAppSelector(
    (state) => state.auth
  );
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);

  useEffect(() => {
    // Initialize Firebase auth state listener
    firebaseAuthService.initializeAuthStateListener((user) => {
      dispatch(setUser(user));
    });

    return () => {
      firebaseAuthService.cleanup();
    };
  }, [dispatch]);

  // Check if user needs to change password
  useEffect(() => {
    if (user && user.mustChangePassword && isAuthenticated) {
      setShowPasswordChangeModal(true);
    } else {
      setShowPasswordChangeModal(false);
    }
  }, [user, isAuthenticated]);

  const handlePasswordChange = async (passwordData: ChangePasswordData) => {
    try {
      await dispatch(changePassword(passwordData)).unwrap();
      setShowPasswordChangeModal(false);
    } catch (error) {
      // Error is handled by the slice
      console.error("Password change failed:", error);
    }
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-8 w-8 text-primary-900"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-lg text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Show main app if authenticated
  return (
    <div className="App h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <Header />

      {/* Main Layout Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Fixed Sidebar */}
        <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vehicles"
                element={
                  <ProtectedRoute>
                    <VehicleRecords />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute>
                    <CustomerManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRoles={[UserRole.ADMIN]}>
                    <UserManagementPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={showPasswordChangeModal}
        onClose={() => setShowPasswordChangeModal(false)}
        onSubmit={handlePasswordChange}
        loading={loading}
      />
    </div>
  );
}

export default App;
