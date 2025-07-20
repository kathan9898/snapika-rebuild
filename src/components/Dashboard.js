import React, { useEffect, useState } from "react";
import {
  Box, Typography, Card, Avatar, Button, CircularProgress, Grid, Fade
} from "@mui/material";
import { styled } from "@mui/system";
import { listFilesWithSizeFromFolderSA } from "../utils/googleDrive";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import StorageIcon from "@mui/icons-material/Storage";

const FOLDER_IDS = process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_IDS
  ? process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_IDS.split(",").map(id => id.trim()).filter(Boolean)
  : [];

const driveColors = ["#E94560", "#00B8A9", "#F9D923", "#7e30e1", "#494CA2", "#FFD6E0"];

const CardGlow = styled(Card)(({ color }) => ({
  background: `linear-gradient(135deg, ${color}13 0%, #fff 82%)`,
  borderRadius: 22,
  boxShadow: `0 8px 36px 0 ${color}38`,
  padding: "24px 18px",
  minWidth: 210,
  margin: "8px 0",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  border: `1.7px solid ${color}30`,
  position: "relative"
}));

function formatBytes(bytes = 0) {
  if (!bytes) return "0 B";
  const k = 1024, dm = 1;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function groupUploadsByDay(files) {
  const days = {};
  files.forEach(file => {
    const d = new Date(file.createdTime);
    const key = d.toLocaleDateString();
    days[key] = (days[key] || 0) + 1;
  });
  return Object.entries(days).map(([date, count]) => ({ date, count })).sort((a, b) => new Date(a.date) - new Date(b.date));
}

export default function Dashboard() {
  const [folderStats, setFolderStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const allStats = await Promise.all(
          FOLDER_IDS.map(async (fid, idx) => {
            const files = await listFilesWithSizeFromFolderSA(fid);
            const size = files.reduce((acc, f) => acc + (parseInt(f.size) || 0), 0);
            const uploads = groupUploadsByDay(files);
            return {
              id: fid,
              fileCount: files.length,
              size,
              uploads,
              color: driveColors[idx % driveColors.length],
            };
          })
        );
        setFolderStats(allStats);
      } catch (e) {
        setFolderStats([]);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <Box sx={{
      bgcolor: "linear-gradient(135deg,#f8faff 0%,#f6ecff 55%,#7e30e11a 100%)",
      minHeight: "100vh",
      pt: { xs: 2, md: 5 },
      pb: 10,
      px: { xs: 1, sm: 2, md: 5 }
    }}>
      {/* Greeting */}
      <Typography
        variant="h5"
        fontWeight={900}
        sx={{
          letterSpacing: 1.2,
          fontFamily: "'Montserrat', 'Comic Sans MS', cursive",
          color: "#fdf8f8ff",
          mt: 1.5, mb: 3, textShadow: "0 2px 18px #fff7"
        }}
      >
        👋 Hi, welcome to Snapika!
      </Typography>

      {/* Drive stats */}
      <Grid container spacing={3} justifyContent="center" alignItems="stretch">
        {folderStats.map((f, idx) => (
          <Fade in timeout={700 + idx * 170} key={f.id}>
            <Grid item xs={12} sm={6} md={4}>
              <CardGlow color={f.color}>
                <Avatar
                  sx={{
                    bgcolor: f.color,
                    mb: 1.2,
                    width: 62,
                    height: 62,
                    boxShadow: 2,
                    border: "3.5px solid #fff"
                  }}
                >
                  <StorageIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography fontWeight={700} sx={{ fontSize: 18, color: f.color, letterSpacing: 1.2 }}>
                  Drive {idx + 1}
                </Typography>
                <Typography sx={{ mt: 0.5, color: "#222", fontSize: 15, wordBreak: "break-all" }}>
                  <b>ID:</b> <span style={{ fontFamily: "monospace" }}>{f.id.slice(0, 10)}...{f.id.slice(-6)}</span>
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography fontSize={15} fontWeight={700}>{formatBytes(f.size)}</Typography>
                    <Typography fontSize={13}>Used</Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography fontSize={15} fontWeight={700}>{f.fileCount}</Typography>
                    <Typography fontSize={13}>Files</Typography>
                  </Box>
                </Box>
                <Box sx={{
                  mt: 2.5, width: "100%", minHeight: 90, p: 1.5,
                  bgcolor: "rgba(245,245,255,0.67)",
                  borderRadius: 4
                }}>
                  <Typography fontWeight={700} fontSize={13} sx={{ mb: 1 }}>
                    Uploads (last 2 weeks)
                  </Typography>
                  <ResponsiveContainer width="100%" height={72}>
                    <LineChart data={f.uploads.slice(-14)}>
                      <XAxis dataKey="date" fontSize={9} hide />
                      <Tooltip labelStyle={{ fontSize: 10 }} />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke={f.color}
                        strokeWidth={3}
                        dot={{ r: 2 }}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
                {/* Actions inside card */}
                <Box sx={{
                  mt: 2.8, display: "flex", gap: 2, justifyContent: "center", width: "100%"
                }}>
                  <motion.div whileTap={{ scale: 0.94 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        borderRadius: 3,
                        px: 2.8,
                        fontWeight: 700,
                        fontSize: 16,
                        bgcolor: "#7e30e1",
                        color: "#fff",
                        boxShadow: "0 3px 12px #7e30e122",
                        letterSpacing: 1,
                        transition: "0.16s"
                      }}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setTimeout(() => navigate("/upload"), 210);
                      }}
                    >
                      Upload
                    </Button>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.94 }}>
                    <Button
                      variant="contained"
                      startIcon={<PhotoLibraryIcon />}
                      sx={{
                        borderRadius: 3,
                        px: 2.7,
                        fontWeight: 700,
                        fontSize: 16,
                        bgcolor: "#00B8A9",
                        color: "#fff",
                        boxShadow: "0 3px 12px #00b8a912",
                        letterSpacing: 1,
                        transition: "0.16s"
                      }}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        setTimeout(() => navigate("/gallery"), 210);
                      }}
                    >
                      Gallery
                    </Button>
                  </motion.div>
                </Box>
              </CardGlow>
            </Grid>
          </Fade>
        ))}
      </Grid>

      {loading && (
        <Box sx={{ textAlign: "center", mt: 6, mb: 2 }}>
          <CircularProgress color="secondary" size={56} />
          <Typography mt={2} fontSize={16} color="#7e30e1">Fetching Drive Stats...</Typography>
        </Box>
      )}

      {/* Friendly footer */}
      <Box sx={{
        textAlign: "center",
        color: "#7e30e1",
        fontWeight: 700,
        mt: 6,
        fontSize: 17,
        letterSpacing: 1.1,
        opacity: 0.8,
        fontFamily: "cursive"
      }}>
        Invite your friends to Snapika — file sharing made friendly! 🌈
      </Box>
    </Box>
  );
}
