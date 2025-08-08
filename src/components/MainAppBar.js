import React, { useState } from "react";
import {
  AppBar, Toolbar, Box, Button, IconButton, Divider, Drawer, List, ListItemButton, ListItemText
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useNavigate, useLocation } from "react-router-dom";
import SnapikaLogo from "../assets/SnapikaLogo";
import "../heavenly_roasts.css";

const LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/upload",    label: "Upload" },
  { to: "/gallery",   label: "Gallery" },
];

export default function MainAppBar({ user, onLogout }) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const LinkBtn = ({ to, children }) => {
    const active = pathname === to;
    return (
      <Button
        onClick={() => nav(to)}
        className={"nav-pill" + (active ? " active" : "")}
        size="small"
      >
        <span className="nav-label">{children}</span>
        <span className="nav-underline" />
      </Button>
    );
  };

  return (
    <>
      <AppBar position="sticky" elevation={0} className="appbar-pro">
        <Toolbar className="appbar-toolbar">
          {/* Left: Brand */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, cursor: "pointer" }} onClick={() => nav("/")}>
            <SnapikaLogo size={28} animated={false} />
            <span className="brand-text">Snapika</span>
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Desktop links */}
          <Box className="nav-right">
            <Box className="nav-center">
              {LINKS.map((l) => (
                <LinkBtn key={l.to} to={l.to}>{l.label}</LinkBtn>
              ))}
            </Box>

            <IconButton
              className="gh-icon"
              size="small"
              onClick={() => window.open("https://github.com/kathan9898", "_blank")}
              aria-label="GitHub"
            >
              <GitHubIcon fontSize="small" />
            </IconButton>

            {user ? (
              <Button onClick={onLogout} className="btn-quiet" size="small">
                Logout
              </Button>
            ) : null}

            {/* Mobile menu button */}
            <IconButton
              className="menu-btn"
              size="small"
              onClick={() => setOpen(true)}
              aria-label="Menu"
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ className: "drawer-pro" }}
      >
        <Box sx={{ width: 260, p: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SnapikaLogo size={22} animated={false} />
            <span className="brand-text">Snapika</span>
          </Box>
          <Divider sx={{ my: 1, borderColor: "var(--glass-brd)" }} />
          <List>
            {LINKS.map((l) => (
              <ListItemButton
                key={l.to}
                selected={pathname === l.to}
                onClick={() => { setOpen(false); nav(l.to); }}
                className="drawer-item"
              >
                <ListItemText primary={l.label} />
              </ListItemButton>
            ))}
          </List>
          <Divider sx={{ my: 1, borderColor: "var(--glass-brd)" }} />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              fullWidth
              className="btn-quiet"
              startIcon={<GitHubIcon />}
              onClick={() => window.open("https://github.com/kathan9898", "_blank")}
            >
              GitHub
            </Button>
            {user && (
              <Button fullWidth className="btn-quiet" onClick={onLogout}>
                Logout
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
