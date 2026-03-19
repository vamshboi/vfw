import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Role checks
  const isUser = user?.role === "USER";
  const isVolunteer = user?.role === "VOLUNTEER";
  const isAdmin = user?.role === "ADMIN";
  const isLoggedIn = !!user;

  // Can do everything a user can
  const canOrder = isLoggedIn;
  const canDonate = isLoggedIn;

  // Volunteer and above
  const canApplyForEvents = isVolunteer || isAdmin;

  // Admin only
  const canAddProducts = isAdmin;
  const canAddEvents = isAdmin;
  const canWriteReports = isAdmin;
  const canManageVolunteers = isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isLoggedIn,
        isUser,
        isVolunteer,
        isAdmin,
        canOrder,
        canDonate,
        canApplyForEvents,
        canAddProducts,
        canAddEvents,
        canWriteReports,
        canManageVolunteers,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}