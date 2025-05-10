/* eslint-disable react-refresh/only-export-components */
// src/auth/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://sugarytestapi.azurewebsites.net";

export interface User {
  Username: string;
  FullName: string;
  Email: string;
  Avatar: string;
  Role: { Id: number; Title: string };
  GiftingCountry: { Id: string; Name: string };
  Currency: { Id: string; Symbol: string };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );

  const isAuthenticated = !!token;

  const login = async (username: string, password: string) => {
    const response = await axios.post(`${BASE_URL}/AdminAccount/Login`, {
      UserName: username,
      Password: password,
    });
    console.log("response", response);
    if (response.data.Success) {
      const { Token, RefreshToken, User } = response.data;
      localStorage.setItem("token", Token);
      localStorage.setItem("refreshToken", RefreshToken);
      setToken(Token);
      setRefreshToken(RefreshToken);
      setUser(User);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshResponse = await axios.post(
              `${BASE_URL}/Account/RefreshToken`,
              {
                AccessToken: token,
                RefreshToken: refreshToken,
              }
            );
            const {
              Token: newAccessToken,
              RefreshToken: newRefreshToken,
              User,
            } = refreshResponse.data;
            localStorage.setItem("token", newAccessToken);
            localStorage.setItem("refreshToken", newRefreshToken);
            setToken(newAccessToken);
            setRefreshToken(newRefreshToken);
            setUser(User);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
          } catch (refreshError) {
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [token, refreshToken]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
