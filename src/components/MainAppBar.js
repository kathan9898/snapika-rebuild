// src/components/MainAppBar.js
import React from "react";
import { AppBar, Toolbar, Typography, Avatar, IconButton, Tabs, Tab, Box, useMediaQuery, BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import SnapikaLogo from "../assets/SnapikaLogo";
import LogoutIcon from "@mui/icons-material/Logout";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { useNavigate } from "react-router-dom";

export default function MainAppBar({ user, onLogout, tab, onTabChange }) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  // For mobile, use bottom navigation
  if (isMobile) {
    return (
      <>
        <AppBar position="sticky" sx={{ bgcolor: "#7e30e1", boxShadow: 4 }}>
          <Toolbar sx={{ justifyContent: "space-between", minHeight: 62 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SnapikaLogo size={32} />
              <Typography
                variant="h6"
                fontWeight={700}
                letterSpacing={2}
                fontFamily="monospace"
                sx={{ cursor: "pointer", fontSize: 21 }}
                onClick={() => navigate("/dashboard")}
              >
                Snapika
              </Typography>
            </Box>
            <Avatar src={user.picture} sx={{ width: 32, height: 32 }} />
          </Toolbar>
        </AppBar>
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1201,
            bgcolor: "#fff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            boxShadow: 12,
          }}
          elevation={8}
        >
          <BottomNavigation
            showLabels
            value={tab}
            onChange={(e, val) => {
              onTabChange(val);
              navigate(val);
            }}
          >
            <BottomNavigationAction
              label="Upload"
              value="/upload"
              icon={<CloudUploadIcon />}
            />
            <BottomNavigationAction
              label="Gallery"
              value="/gallery"
              icon={<PhotoLibraryIcon />}
            />
            <BottomNavigationAction
              label="Logout"
              value="logout"
              icon={<LogoutIcon />}
              onClick={onLogout}
            />
          </BottomNavigation>
        </Paper>
      </>
    );
  }

  // Desktop/tablet view
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
            onClick={() => navigate("/dashboard")}
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
