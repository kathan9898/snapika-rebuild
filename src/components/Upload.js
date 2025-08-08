import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Chip,
  LinearProgress,
  Snackbar,
  Alert,
  Avatar,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ReplayIcon from "@mui/icons-material/Replay";
import ImageIcon from "@mui/icons-material/Image";
import MovieIcon from "@mui/icons-material/Movie";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import DescriptionIcon from "@mui/icons-material/Description";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { motion, AnimatePresence } from "framer-motion";

import FolderPicker from "./FolderPicker";
import { uploadFileToDrive } from "../utils/googleDrive";
import AnimatedCard from "./AnimatedCard";
import "../heavenly_roasts.css";

function bucket(mime) {
  if (!mime) return "doc";
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (mime === "application/pdf") return "pdf";
  if (mime.startsWith("application/")) return "doc";
  return "doc";
}
function iconFor(mime) {
  const b = bucket(mime);
  if (b === "image") return <ImageIcon />;
  if (b === "video") return <MovieIcon />;
  if (b === "audio") return <AudioFileIcon />;
  if (b === "pdf" || b === "doc") return <DescriptionIcon />;
  return <InsertDriveFileIcon />;
}
function fmtBytes(bytes = 0) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const v = bytes / Math.pow(k, i);
  return `${v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2)} ${sizes[i]}`;
}

export default function Upload({ user, token }) {
  const [folderId, setFolderId] = useState("");
  const [queue, setQueue] = useState([]); // [{file, progress, status, id}]
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", severity: "success" });
  const inputRef = useRef(null);
  const uploadingRef = useRef(false);

  const totalBytes = useMemo(() => queue.reduce((a, q) => a + (q.file.size || 0), 0), [queue]);
  const doneBytes = useMemo(
    () => queue.reduce((a, q) => a + ((q.progress || 0) / 100) * (q.file.size || 0), 0),
    [queue]
  );

  const pickFiles = () => inputRef.current?.click();

  const onFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    const items = selected.map((file, idx) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${idx}`,
      file,
      progress: 0,
      status: "pending", // "pending" | "uploading" | "done" | "error"
    }));
    setQueue((prev) => [...prev, ...items]);
  };

  // Drag & Drop
  const onDrop = useCallback((e) => {
    e.preventDefault();
    const selected = Array.from(e.dataTransfer.files || []);
    if (!selected.length) return;
    const items = selected.map((file, idx) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${idx}`,
      file,
      progress: 0,
      status: "pending",
    }));
    setQueue((prev) => [...prev, ...items]);
  }, []);
  const prevent = (e) => { e.preventDefault(); e.stopPropagation(); };

  const clearQueue = () => setQueue([]);
  const removeItem = (id) => setQueue((prev) => prev.filter((q) => q.id !== id));

  const uploadOne = async (idx) => {
    const q = queue[idx];
    if (!q) return;
    setQueue((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], status: "uploading", progress: 0 };
      return next;
    });
    try {
      await uploadFileToDrive(token, folderId, q.file, (p) => {
        setQueue((prev) => {
          const next = [...prev];
          next[idx] = { ...next[idx], progress: p };
          return next;
        });
      });
      setQueue((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], status: "done", progress: 100 };
        return next;
      });
      setSnackbar({ open: true, msg: `Uploaded: ${q.file.name}`, severity: "success" });
    } catch (err) {
      setQueue((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], status: "error" };
        return next;
      });
      setSnackbar({ open: true, msg: `Failed: ${q.file.name}`, severity: "error" });
    }
  };

  const handleUploadAll = async () => {
    if (uploadingRef.current) return;
    uploadingRef.current = true;
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].status === "done") continue;
      await uploadOne(i);
    }
    uploadingRef.current = false;
  };

  const retryOne = async (id) => {
    const idx = queue.findIndex((q) => q.id === id);
    if (idx >= 0) await uploadOne(idx);
  };

  /* ---------- UI ---------- */
  return (
    <div className="snapika-landing" style={{ minHeight: "100vh" }}>
      <div className="snapika-smoke" aria-hidden="true" />
      <div className="snapika-smoke layer2" aria-hidden="true" />
      <div className="snapika-vignette" aria-hidden="true" />

      <Box className="app-shell" sx={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography className="snapika-title" sx={{ m: 0, fontSize: 28, fontWeight: 800 }}>
            Upload
          </Typography>
          <Chip
            label={user?.name || "Internal"}
            size="small"
            sx={{ ml: 1, bgcolor: "rgba(122,215,255,0.12)", color: "var(--text)", border: "1px solid var(--glass-brd)" }}
          />
          <Box sx={{ flex: 1 }} />
          <QuietButton icon={<DeleteOutlineIcon />} onClick={clearQueue} disabled={!queue.length}>
            Clear
          </QuietButton>
        </Box>

        <AnimatedCard variant="glass" sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography sx={{ fontWeight: 800, mb: 1.25, fontSize: 18, letterSpacing: "0.01em" }}>
            Choose destination
          </Typography>
          <FolderPicker value={folderId} onChange={setFolderId} />

          {/* Drop zone + select */}
          <Box
            onDrop={onDrop}
            onDragOver={prevent}
            onDragEnter={prevent}
            onDragLeave={prevent}
            sx={{
              mt: 2,
              p: 2,
              border: "1px dashed var(--glass-brd)",
              borderRadius: 14,
              background: "rgba(255,255,255,0.02)",
              display: "grid",
              placeItems: "center",
              textAlign: "center",
            }}
          >
            <Typography sx={{ color: "var(--muted)", mb: 1 }}>
              Drag & drop files here
            </Typography>
            <Button onClick={pickFiles} className="btn-quiet" startIcon={<CloudUploadIcon />}>
              Select files
            </Button>
            <input
              ref={inputRef}
              hidden
              type="file"
              multiple
              onChange={onFileSelect}
            />
          </Box>

          {/* Queue header */}
          <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              label={`${queue.length} in queue`}
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-brd)", color: "var(--text)" }}
            />
            <Box sx={{ flex: 1 }} />
            <Typography sx={{ fontSize: 12.5, color: "var(--muted)" }}>
              {fmtBytes(doneBytes)} / {fmtBytes(totalBytes)}
            </Typography>
          </Box>

          {/* Upload button with mini-mascots */}
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <HighFiveButton
              disabled={!folderId || !queue.length}
              onClick={handleUploadAll}
              uploading={queue.some((q) => q.status === "uploading")}
            />
            <QuietButton onClick={clearQueue} disabled={!queue.length} icon={<DeleteOutlineIcon />}>
              Clear
            </QuietButton>
          </Box>

          {/* Queue list */}
          <Box sx={{ mt: 2 }}>
            <AnimatePresence initial={false}>
              {queue.map((q) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card
                    className="tile"
                    sx={{
                      p: 1.25,
                      mb: 1,
                      borderRadius: 12,
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <Avatar sx={{ bgcolor: "rgba(122,215,255,0.18)", border: "1px solid var(--glass-brd)" }}>
                      {iconFor(q.file.type)}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {q.file.name}
                      </Typography>
                      <Typography sx={{ color: "var(--muted)", fontSize: 12 }}>
                        {bucket(q.file.type)} · {fmtBytes(q.file.size)}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={q.progress}
                        sx={{
                          mt: 1,
                          height: 10,
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.05)",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 999,
                            backgroundImage:
                              q.status === "error"
                                ? "linear-gradient(90deg,#ff7a9e,#ff436f)"
                                : "linear-gradient(90deg,#7AD7FF,#A887FF)",
                            animation: q.status === "uploading" ? "snapika-stripes 1.2s linear infinite" : "none",
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      {q.status === "done" && (
                        <Chip size="small" icon={<DoneAllIcon />} label="Done" sx={{ color: "#c8ffd6", border: "1px solid var(--glass-brd)", bgcolor: "rgba(0,255,150,0.06)" }} />
                      )}
                      {q.status === "error" && (
                        <Chip size="small" icon={<ErrorOutlineIcon />} label="Error" sx={{ color: "#ffd1dc", border: "1px solid var(--glass-brd)", bgcolor: "rgba(255,0,66,0.06)" }} />
                      )}
                      {q.status === "pending" && (
                        <Chip size="small" label="Pending" sx={{ color: "#b7c5d8", border: "1px solid var(--glass-brd)", bgcolor: "rgba(255,255,255,0.04)" }} />
                      )}
                      {q.status === "error" ? (
                        <IconButton size="small" onClick={() => retryOne(q.id)} title="Retry" sx={{ ml: 0.5 }}>
                          <ReplayIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <IconButton size="small" onClick={() => removeItem(q.id)} title="Remove" sx={{ ml: 0.5 }}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {!queue.length && (
              <Typography sx={{ color: "var(--muted)", textAlign: "center", mt: 1 }}>
                No files selected yet.
              </Typography>
            )}
          </Box>
        </AnimatedCard>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={2600}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        sx={{ mt: 3 }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ fontWeight: 500, fontSize: 15 }}
        >
          {snackbar.msg}
        </Alert>
      </Snackbar>
    </div>
  );
}

/* ----------------- Small components ----------------- */

function QuietButton({ children, icon, ...props }) {
  return (
    <Button className="btn-quiet" startIcon={icon} {...props}>
      {children}
    </Button>
  );
}

/** High-five Upload button:
 * two tiny mascots glide in to high-five when pressed,
 * then bounce subtly while uploading.
 */
function HighFiveButton({ onClick, disabled, uploading }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="btn-highfive"
      initial={false}
      animate={uploading ? "uploading" : "idle"}
      variants={{
        idle: { scale: 1 },
        uploading: { scale: 0.98 },
      }}
      whileTap={!disabled ? { scale: 0.96 } : {}}
    >
      <div className="hf-stage" aria-hidden="true">
        {/* left buddy */}
        <motion.div
          className="hf-buddy left"
          variants={{
            idle: { x: -10 },
            uploading: { x: -2, transition: { yoyo: Infinity, duration: 1.2 } },
          }}
        >
          <span className="face">◕‿◕</span>
        </motion.div>
        {/* right buddy */}
        <motion.div
          className="hf-buddy right"
          variants={{
            idle: { x: 10 },
            uploading: { x: 2, transition: { yoyo: Infinity, duration: 1.2 } },
          }}
        >
          <span className="face">◕‿◕</span>
        </motion.div>
        {/* hands meet */}
        <motion.div
          className="hf-hands"
          variants={{
            idle: { scale: 0, opacity: 0 },
            uploading: {
              scale: [0, 1, 0.9, 1],
              opacity: 1,
              transition: { repeat: Infinity, repeatDelay: 0.8, duration: 0.6 },
            },
          }}
        >
          ✋🤚
        </motion.div>
      </div>
      <CloudUploadIcon style={{ marginRight: 8 }} />
      {uploading ? "Uploading…" : "Start Upload"}
    </motion.button>
  );
}
