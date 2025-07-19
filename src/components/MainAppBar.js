// src/components/MainAppBar.js
import React from "react";
import { AppBar, Toolbar, Typography, Avatar, IconButton, Tabs, Tab, Box } from "@mui/material";
import SnapikaLogo from "../assets/SnapikaLogo";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

export default function MainAppBar({ user, onLogout, tab, onTabChange }) {
  const navigate = useNavigate();
  return (
    <AppBar position="sticky" sx={{ bgcolor: "#7e30e1", boxShadow: 4 }}>
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 62 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SnapikaLogo size={38} />
          <Typography
            variant="h6"
            fontWeight={700}
            letterSpacing={2}
            fontFamily="monospace"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/upload")}
          >
            Snapika
          </Typography>
        </Box>
        <Tabs
          value={tab}
          onChange={(e, val) => {
            onTabChange(val);
            navigate(val);
          }}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{ minHeight: 45 }}
        >
          <Tab label="Upload" value="/upload" sx={{ fontWeight: 600 }} />
          <Tab label="Gallery" value="/gallery" sx={{ fontWeight: 600 }} />
        </Tabs>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar src={user.picture} sx={{ width: 34, height: 34 }} />
          <Typography sx={{ color: "#fff", fontWeight: 600 }}>{user.name}</Typography>
          <IconButton onClick={onLogout} sx={{ color: "#fff" }}>
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
