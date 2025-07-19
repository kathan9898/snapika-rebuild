import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Upload from "./components/Upload";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null); // { email, name, picture }
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Load session from localStorage (optional)
    const savedUser = JSON.parse(localStorage.getItem("snapika_user"));
    const savedToken = localStorage.getItem("snapika_token");
    if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
    }
  }, []);

  const handleLogin = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("snapika_user", JSON.stringify(user));
    localStorage.setItem("snapika_token", token);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("snapika_user");
    localStorage.removeItem("snapika_token");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user && token ? <Navigate to="/upload" replace /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute user={user}>
              <Upload user={user} token={token} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            user && token ? <Navigate to="/upload" replace /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
