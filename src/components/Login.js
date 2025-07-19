import React, { useEffect, useRef } from "react";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function Login({ onLogin }) {
  const tokenClientRef = useRef();

  // Load Google Identity Services script on mount
  useEffect(() => {
    const loadScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initTokenClient;
        document.body.appendChild(script);
      } else {
        initTokenClient();
      }
    };

    const initTokenClient = () => {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: "https://www.googleapis.com/auth/drive.file profile email",
        callback: (resp) => {
          if (resp.access_token) {
            // Fetch user profile
            fetch(
              `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${resp.access_token}`
            )
              .then((r) => r.json())
              .then((profile) => {
                onLogin(
                  {
                    email: profile.email,
                    name: profile.name,
                    picture: profile.picture,
                  },
                  resp.access_token
                );
              });
          }
        },
      });
    };

    loadScript();
    // eslint-disable-next-line
  }, [onLogin]);

  const handleLogin = () => {
    if (tokenClientRef.current) {
      tokenClientRef.current.requestAccessToken();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "#171923",
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: 40, fontWeight: 600 }}>
        Welcome to Snapika
      </h2>
      <button
        onClick={handleLogin}
        style={{
          padding: "12px 24px",
          background: "#fff",
          color: "#171923",
          border: "none",
          borderRadius: 8,
          fontSize: 18,
          fontWeight: 600,
          boxShadow: "0 2px 8px #0002",
          cursor: "pointer",
          minWidth: 180,
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default Login;
