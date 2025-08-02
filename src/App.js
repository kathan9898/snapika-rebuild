import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Upload from "./components/Upload";
import Gallery from "./components/Gallery";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import MainAppBar from "./components/MainAppBar";
import Intro from "./components/Intro";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { isGoogleTokenValid } from "./utils/checkGoogleToken";

function AppRoutes({ user, token, onLogout, onLogin }) {
  const location = useLocation();
  const isIntro = location.pathname === "/";
  const tab = ["/upload", "/gallery", "/dashboard"].includes(location.pathname)
    ? location.pathname
    : false;

  const [currentTab, setCurrentTab] = useState(tab || "/dashboard");

  useEffect(() => {
    setCurrentTab(tab || "/dashboard");
  }, [tab]);

  if (isIntro) return <Intro />;
  if (!user || !token) return <Login onLogin={onLogin} />;

  return (
    <>
      <MainAppBar
        user={user}
        onLogout={onLogout}
        tab={currentTab}
        onTabChange={setCurrentTab}
      />
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute user={user}>
              <Upload user={user} token={token} onLogout={onLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <ProtectedRoute user={user}>
              <Gallery token={token} />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={user && token ? <Navigate to="/dashboard" /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function checkStoredLogin() {
      const savedUser = JSON.parse(localStorage.getItem("snapika_user"));
      const savedToken = localStorage.getItem("snapika_token");
      if (savedUser && savedToken) {
        // Check token validity on load
        const valid = await isGoogleTokenValid(savedToken);
        if (valid) {
          setUser(savedUser);
          setToken(savedToken);
        } else {
          setUser(null);
          setToken(null);
          localStorage.removeItem("snapika_user");
          localStorage.removeItem("snapika_token");
        }
      }
    }
    checkStoredLogin();
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
      <AppRoutes
        user={user}
        token={token}
        onLogout={handleLogout}
        onLogin={handleLogin}
      />
    </BrowserRouter>
  );
}
