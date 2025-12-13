import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

// ключ в localStorage
const AUTH_STORAGE_KEY = "isAuthenticated";

// тестовые данные (учебная авторизация)
const TEST_USER = {
  login: "admin",
  password: "1234",
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  });

  // синхронизация с localStorage
  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
  }, [isAuthenticated]);

  /**
   * Логин (учебный)
   */
  const login = useCallback((login, password) => {
    if (
      login === TEST_USER.login &&
      password === TEST_USER.password
    ) {
      setIsAuthenticated(true);
      return { success: true };
    }

    return {
      success: false,
      message: "Invalid login or password",
    };
  }, []);

  /**
   * Выход
   */
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const value = {
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
