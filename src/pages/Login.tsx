import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import loginImg from "../assets/login.avif";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("react@test.com");
  const [password, setPassword] = useState("playful009");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-teal-100 to-teal-900 px-4">
      <div className="bg-slate-200 shadow-2xl rounded-2xl flex max-w-4xl w-full overflow-hidden">
        {/* Illustration Section */}
        <div className="w-1/2 bg-gradient-to-br from-purple-500 to-teal-600 text-white p-8 hidden md:flex flex-col justify-center items-center">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg text-center max-w-sm">
            Login to access the Sugary LLC dashboard and explore your control
            panel.
          </p>
          <img src={loginImg} alt="Login Illustration" className="w-64 mt-8" />
        </div>

        {/* Login Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            Login to Sugary
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="you@example.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-500 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg transition duration-300"
            >
              Sign In
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Forgot your password?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Reset here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
