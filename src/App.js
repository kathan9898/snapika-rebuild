// App.js
import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Upload from "./components/Upload";
import Gallery from "./components/Gallery";
import ProtectedRoute from "./components/ProtectedRoute";
import MainAppBar from "./components/MainAppBar";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

function AppRoutes({ user, token, onLogout, onLogin }) {
  const location = useLocation();
  const tab = ["/upload", "/gallery"].includes(location.pathname)
    ? location.pathname
    : false;

  const [currentTab, setCurrentTab] = useState(tab || "/upload");

  useEffect(() => {
    setCurrentTab(tab || "/upload");
  }, [tab]);

  if (!user || !token) return <Login onLogin={onLogin} />;

  return (
    <>
      <MainAppBar user={user} onLogout={onLogout} tab={currentTab} onTabChange={setCurrentTab} />
      <Routes>
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
        <Route path="*" element={<Upload user={user} token={token} onLogout={onLogout} />} />
      </Routes>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
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
      <AppRoutes user={user} token={token} onLogout={handleLogout} onLogin={handleLogin} />
    </BrowserRouter>
  );
}
