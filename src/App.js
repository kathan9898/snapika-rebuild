import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Upload from "./components/Upload";

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
    <div style={{ minHeight: "100vh", background: "#171923" }}>
      {!user || !token ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Upload user={user} token={token} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
