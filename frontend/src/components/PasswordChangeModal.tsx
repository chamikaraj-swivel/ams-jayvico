import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { changePassword } from "../store/slices/authSlice";
import { ChangePasswordData } from "../types/auth";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (passwordData: ChangePasswordData) => void;
  loading?: boolean;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [validationErrors, setValidationErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation errors when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    // Validate new password
    if (formData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])/.test(formData.newPassword)) {
      errors.newPassword =
        "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
      errors.newPassword =
        "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(formData.newPassword)) {
      errors.newPassword = "Password must contain at least one number";
    } else if (!/(?=.*[!@#$%^&*])/.test(formData.newPassword)) {
      errors.newPassword =
        "Password must contain at least one special character (!@#$%^&*)";
    }

    // Validate password confirmation
    if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(changePassword(formData)).unwrap();
      onSubmit(formData);
      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setValidationErrors({});
    } catch (error) {
      // Error is handled by the slice
      console.error("Password change failed:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Change Password Required
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      You must change your password before accessing the system.
                    </p>
                  </div>

                  {error && (
                    <div className="mt-4 rounded-md bg-red-50 p-4">
                      <div className="text-sm text-red-700">{error}</div>
                    </div>
                  )}

                  <div className="mt-4 space-y-4">
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        required
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                          validationErrors.newPassword
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                      {validationErrors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {validationErrors.newPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        required
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                          validationErrors.confirmPassword
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={loading}
                      />
                      {validationErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {validationErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={
                  loading ||
                  !formData.currentPassword ||
                  !formData.newPassword ||
                  !formData.confirmPassword
                }
                className="btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Changing Password..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeModal;
