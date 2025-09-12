import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-center pt-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isLogin
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !isLogin
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Sign Up
          </button>
        </div>
      </div>

      {isLogin ? (
        <LoginForm onSuccess={handleAuthSuccess} />
      ) : (
        <RegisterForm onSuccess={handleAuthSuccess} />
      )}
    </div>
  );
};

export default AuthPage;
