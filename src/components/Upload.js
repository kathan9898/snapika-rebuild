import React, { useState } from "react";
import FolderPicker from "./FolderPicker";
import { uploadFileToDrive } from "../utils/googleDrive";
import { Snackbar, Alert, LinearProgress, Button, Card, Typography, Box, Fade } from "@mui/material";
// import LogoutIcon from '@mui/icons-material/Logout';
// import SnapikaLogo from "../assets/SnapikaLogo";
import { motion, AnimatePresence } from "framer-motion";

// Reuse AnimatedCard from above!
import AnimatedCard from "./AnimatedCard";

function Upload({ user, token, onLogout }) {
  const [folderId, setFolderId] = useState("");
  const [files, setFiles] = useState([]); // [{file, progress, status}]
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", severity: "success" });

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(
      selected.map((file) => ({
        file,
        progress: 0,
        status: "pending", // "pending" | "uploading" | "done" | "error"
      }))
    );
  };

  const handleUpload = async () => {
    setUploading(true);
    const updatedFiles = [...files];
    for (let i = 0; i < files.length; i++) {
      updatedFiles[i].status = "uploading";
      setFiles([...updatedFiles]);
      try {
        await uploadFileToDrive(
          token,
          folderId,
          files[i].file,
          (percent) => {
            updatedFiles[i].progress = percent;
            setFiles([...updatedFiles]);
          }
        );
        updatedFiles[i].status = "done";
        updatedFiles[i].progress = 100;
        setSnackbar({
          open: true,
          msg: `Uploaded: ${files[i].file.name}`,
          severity: "success",
        });
      } catch {
        updatedFiles[i].status = "error";
        setSnackbar({
          open: true,
          msg: `Failed: ${files[i].file.name}`,
          severity: "error",
        });
      }
      setFiles([...updatedFiles]);
    }
    setUploading(false);
  };

  const clearFiles = () => setFiles([]);

  return (
    <Box sx={{ bgcolor: "#0f0b1504", minHeight: "100vh", pb: 5 }}>
      {/* Animated AppBar */}
      {/* <AppBar position="sticky" sx={{ bgcolor: "#7e30e1", boxShadow: 4 }}>
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 62 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SnapikaLogo size={38} />
            <Typography variant="h6" fontWeight={700} letterSpacing={2} fontFamily="monospace">
              Snapika
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar src={user.picture} sx={{ width: 34, height: 34 }} />
            <Typography sx={{ color: "#fff", fontWeight: 600 }}>{user.name}</Typography>
            <IconButton onClick={onLogout} sx={{ color: "#fff" }}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar> */}

      <Fade in timeout={500}>
        <Box sx={{ mt: { xs: 2, md: 5 }, px: { xs: 1, sm: 0 } }}>
          <AnimatedCard sx={{ my: { xs: 2, md: 5 } }}>
            <Typography variant="h5" fontWeight={700} color="#7e30e1" sx={{ mb: 2, textAlign: "center" }}>
              Upload Files to Drive
            </Typography>
            <FolderPicker value={folderId} onChange={setFolderId} />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 2, mb: 2, borderColor: "#7e30e1", color: "#7e30e1", fontWeight: 600 }}
              disabled={uploading}
            >
              Select Files
              <input
                type="file"
                hidden
                multiple
                onChange={handleFileChange}
                disabled={uploading}
              />
            </Button>

            {/* File List with Progress */}
            <Box sx={{ mt: 2 }}>
              <AnimatePresence>
                {files.map((f, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: 24, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -24, opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", bounce: 0.32, duration: 0.48 }}
                  >
                    <Card
                      variant="outlined"
                      sx={{
                        my: 1,
                        py: 1,
                        px: 1.5,
                        borderRadius: 2,
                        bgcolor: "#f8f7fc",
                        color: "#333",
                        boxShadow: "0 4px 16px #7e30e119",
                        borderColor:
                          f.status === "done"
                            ? "#66bb6a"
                            : f.status === "error"
                            ? "#e57373"
                            : "#7e30e133",
                      }}
                    >
                      <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
                        {f.file.name}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", mt: 0.8 }}>
                        <LinearProgress
                          variant="determinate"
                          value={f.progress}
                          sx={{
                            flex: 1,
                            height: 8,
                            borderRadius: 5,
                            bgcolor: "#ede7f6",
                            mr: 1,
                          }}
                        />
                        <Typography sx={{ width: 45, fontSize: 14, color: "#7e30e1" }}>
                          {f.progress}%
                        </Typography>
                        <Typography sx={{ width: 60, textAlign: "right", fontSize: 13 }}>
                          {f.status === "done"
                            ? "✅"
                            : f.status === "error"
                            ? "❌"
                            : f.status === "uploading"
                            ? "⬆️"
                            : ""}
                        </Typography>
                      </Box>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>
            <Box sx={{ display: "flex", mt: 2, gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={
                  !folderId || uploading || files.length === 0 || files.every((f) => f.status === "done")
                }
                fullWidth
                sx={{
                  bgcolor: "#7e30e1",
                  color: "#fff",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#5f24a6" },
                }}
              >
                Upload
              </Button>
              <Button
                variant="text"
                color="secondary"
                onClick={clearFiles}
                disabled={uploading}
                fullWidth
              >
                Clear
              </Button>
            </Box>
          </AnimatedCard>
        </Box>
      </Fade>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        sx={{ mt: 3 }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ fontWeight: 500, fontSize: 16 }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Upload;

