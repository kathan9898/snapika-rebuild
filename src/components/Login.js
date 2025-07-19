import React, { useEffect, useRef, useState } from "react";
import AnimatedCard from "./AnimatedCard";
import SnapikaLogo from "../assets/SnapikaLogo";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

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
      setLoading(true);
      tokenClientRef.current.requestAccessToken();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#ede7f6",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <motion.div
          initial={{ scale: 0.7, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.35 }}
        >
          <SnapikaLogo size={90} />
        </motion.div>
        <Typography variant="h3" fontWeight={800} color="#7e30e1" mt={2} fontFamily="monospace" letterSpacing={2}>
          Snapika
        </Typography>
        <Typography variant="subtitle1" color="#222" mt={1}>
          Secure Drive Uploader
        </Typography>
      </Box>
      <AnimatedCard>
        <Typography
          variant="h5"
          fontWeight={700}
          color="#7e30e1"
          sx={{ mb: 2, textAlign: "center", fontFamily: "monospace" }}
        >
          Login to Continue
        </Typography>
        <Typography
          sx={{
            color: "#444",
            fontSize: 16,
            textAlign: "center",
            mb: 3,
            fontFamily: "inherit",
          }}
        >
          Sign in with Google to securely upload files to Snapika’s Drive folders. <br /> We do not see or store your files.
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            onClick={handleLogin}
            variant="contained"
            color="secondary"
            size="large"
            sx={{
              bgcolor: "#7e30e1",
              px: 5,
              py: 1.2,
              fontWeight: 600,
              fontSize: 18,
              borderRadius: 8,
              boxShadow: "0 2px 12px #7e30e188",
              "&:hover": { bgcolor: "#5f24a6" },
            }}
            startIcon={
              <SnapikaLogo size={30} />
            }
            disabled={loading}
          >
            {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Sign in with Google"}
          </Button>
        </Box>
      </AnimatedCard>
      <Typography sx={{ textAlign: "center", mt: 6, color: "#7e30e1", fontSize: 13, fontFamily: "monospace" }}>
        © {new Date().getFullYear()} Snapika
      </Typography>
    </Box>
  );
}
