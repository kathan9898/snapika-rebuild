import React, { useEffect, useRef, useState } from "react";
import AnimatedCard from "./AnimatedCard";
import SnapikaLogo from "../assets/SnapikaLogo";
import { Box, Typography, Button, CircularProgress, Chip, Stack } from "@mui/material";
import { motion } from "framer-motion";
import "../heavenly_roasts.css";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function Login({ onLogin }) {
  const tokenClientRef = useRef();
  const [loading, setLoading] = useState(false);

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
            setLoading(true);
            fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${resp.access_token}`)
              .then((r) => r.json())
              .then((profile) => {
                setLoading(false);
                onLogin(
                  {
                    email: profile.email,
                    name: profile.name,
                    picture: profile.picture,
                  },
                  resp.access_token
                );
              })
              .catch(() => setLoading(false));
          }
        },
      });
    };

    loadScript();
    // eslint-disable-next-line
  }, [onLogin]);

  const handleLogin = () => {
    if (tokenClientRef.current) {
      setLoading(true);
      tokenClientRef.current.requestAccessToken();
    }
  };

  return (
    <div className="snapika-landing" style={{ minHeight: "100vh" }}>
      {/* same subtle smoke from the intro page */}
      <div className="snapika-smoke" aria-hidden="true" />
      <div className="snapika-smoke layer2" aria-hidden="true" />
      <div className="snapika-vignette" aria-hidden="true" />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 6,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 520 }}>
          {/* Hero */}
          <Box sx={{ mb: 3, textAlign: "center" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{ display: "inline-block" }}
            >
              <SnapikaLogo size={84} />
            </motion.div>

            <motion.h1
              className="snapika-title"
              style={{ marginTop: 10, marginBottom: 4 }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
            >
              Snapika <span className="sparkle">★</span>
            </motion.h1>

            <motion.p
              className="snapika-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.08 }}
            >
              Unified internal storage across linked Google Drives.
              <br />
              Sign in to continue.
            </motion.p>
          </Box>

          {/* Glass card */}
          <AnimatedCard variant="glass" className="login-card">
            <Typography
              variant="h6"
              sx={{
                mb: 1.25,
                textAlign: "center",
                fontWeight: 800,
                background: "linear-gradient(90deg,#e9f4ff,#ffe0ea)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                letterSpacing: "0.02em",
              }}
            >
              Login to Continue
            </Typography>

            <Typography
              sx={{
                color: "var(--muted)",
                fontSize: 15.5,
                textAlign: "center",
                mb: 2.2,
              }}
            >
              Google OAuth only. We never see or store your files—uploads go
              directly to authorized Snapika folders.
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              sx={{ mb: 2 }}
            >
              <Chip label="OAuth 2.0" size="small" variant="outlined" className="chip-muted" />
              <Chip label="Drive.file scope" size="small" variant="outlined" className="chip-muted" />
              <Chip label="Invite-only" size="small" variant="outlined" className="chip-muted" />
            </Stack>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={handleLogin}
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={<SnapikaLogo size={24} />}
                className="btn-quiet"
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: "#fff" }} />
                ) : (
                  "Sign in with Google"
                )}
              </Button>
            </Box>
          </AnimatedCard>

          <Typography
            sx={{
              textAlign: "center",
              mt: 4,
              color: "#9fb2c9",
              fontSize: 12.5,
            }}
          >
            © {new Date().getFullYear()} Snapika — Internal. Not for sale.
          </Typography>
        </Box>
      </Box>
    </div>
  );
}
