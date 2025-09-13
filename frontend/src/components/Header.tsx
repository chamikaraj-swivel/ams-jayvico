import React from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signOut } from "../store/slices/authSlice";
import { UserRole } from "../types/auth";
import JayvicoLogo from "./JayvicoLogo";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(signOut()).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "Administrator";
      case UserRole.OPERATIONS_MANAGER:
        return "Operations Manager";
      case UserRole.CUSTOMER_SERVICE:
        return "Customer Service";
      case UserRole.FINANCE:
        return "Finance";
      case UserRole.FIELD_STAFF:
        return "Field Staff";
      default:
        return role;
    }
  };

  return (
    <header className="bg-primary-900 text-white shadow-lg">
      <div className="flex items-center justify-between py-4 px-6">
        <div className="flex items-center space-x-4">
          <JayvicoLogo size="md" variant="light" showText={false} />
          <div>
            <p className="text-sm text-primary-200">Jayvico Automobile</p>
          </div>
        </div>

        {/* User Section */}
        {user && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-800 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {getInitials(user.firstName, user.lastName)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-primary-200">
                  {getRoleDisplayName(user.role)}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-primary-200 hover:text-white transition-colors duration-200"
              title="Sign Out"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
