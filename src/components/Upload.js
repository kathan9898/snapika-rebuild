import React, { useState } from "react";
import FolderPicker from "./FolderPicker";
import { uploadFileToDrive } from "../utils/googleDrive";
import { Snackbar, Alert, LinearProgress, Button, Card, Typography, Box, Avatar, IconButton } from "@mui/material";
import LogoutIcon from '@mui/icons-material/LogoutOutlined';

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
    <Box sx={{ minHeight: "100vh", bgcolor: "#171923", py: 4 }}>
      <Card
        sx={{
          maxWidth: 430,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          py: 3,
          borderRadius: 3,
          boxShadow: 6,
        }}
      >
        {/* User Info */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar src={user.picture} sx={{ width: 50, height: 50, mr: 2 }} />
          <Box>
            <Typography sx={{ fontWeight: 600, color: "#222" }}>{user.name}</Typography>
            <Typography sx={{ fontSize: 14, opacity: 0.7 }}>{user.email}</Typography>
          </Box>
          <IconButton
            onClick={onLogout}
            sx={{ marginLeft: "auto", color: "#e53935" }}
            aria-label="logout"
          >
            <LogoutIcon />
          </IconButton>
        </Box>

        {/* Folder Picker */}
        <FolderPicker value={folderId} onChange={setFolderId} />

        {/* File Picker */}
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ mt: 2, mb: 2 }}
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
        {files.length > 0 && (
          <Box>
            {files.map((f, idx) => (
              <Box
                key={idx}
                sx={{
                  my: 1,
                  py: 1,
                  px: 1,
                  borderRadius: 1,
                  bgcolor: "#e3e7ee",
                  color: "#333",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
                  {f.file.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <LinearProgress
                    variant="determinate"
                    value={f.progress}
                    sx={{
                      flex: 1,
                      height: 8,
                      borderRadius: 5,
                      bgcolor: "#ddd",
                      mr: 1,
                    }}
                  />
                  <Typography sx={{ width: 45, fontSize: 14, color: "#33691e" }}>
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
              </Box>
            ))}
            <Box sx={{ display: "flex", mt: 2, gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={
                  !folderId || uploading || files.length === 0 || files.every((f) => f.status === "done")
                }
                fullWidth
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
          </Box>
        )}
      </Card>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={3000}
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
