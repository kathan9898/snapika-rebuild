import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box, Typography, Chip, Button, CircularProgress, Snackbar, Alert,
  Dialog, IconButton, Tooltip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ImageIcon from "@mui/icons-material/Image";
import MovieIcon from "@mui/icons-material/Movie";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { motion, AnimatePresence } from "framer-motion";

import "../heavenly_roasts.css";
import { listFilesFromFoldersSA } from "../utils/googleDrive";

const FOLDER_IDS = process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_IDS
  ? process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_IDS.split(",").map((id) => id.trim()).filter(Boolean)
  : [];

const FILTERS = [
  { key: "all",   label: "All",    icon: <InsertDriveFileIcon /> },
  { key: "image", label: "Images", icon: <ImageIcon /> },
  { key: "video", label: "Videos", icon: <MovieIcon /> },
  { key: "file",  label: "Files",  icon: <InsertDriveFileIcon /> },
];

const INITIAL_FILES_PER_MONTH = 18;

function fileType(file) {
  const m = file?.mimeType || "";
  if (m.startsWith("image/")) return "image";
  if (m.startsWith("video/")) return "video";
  if (m === "application/pdf") return "pdf";
  return "file";
}
function monthKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.toLocaleString("default", { month: "long" })} ${d.getFullYear()}`;
}
function typeIcon(file) {
  const t = fileType(file);
  if (t === "image") return <ImageIcon fontSize="inherit" />;
  if (t === "video") return <MovieIcon fontSize="inherit" />;
  if (t === "pdf") return <PictureAsPdfIcon fontSize="inherit" />;
  return <InsertDriveFileIcon fontSize="inherit" />;
}

export default function Gallery() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", severity: "info" });
  const [expanded, setExpanded] = useState({});
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const all = (await Promise.all(FOLDER_IDS.map(listFilesFromFoldersSA))).flat();
        const map = {};
        all.forEach((f) => (map[f.id] = f)); // de-dupe
        const unique = Object.values(map).sort(
          (a, b) => new Date(b.createdTime) - new Date(a.createdTime)
        );
        setFiles(unique);
      } catch {
        setFiles([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filesByMonth = useMemo(() => {
    const groups = {};
    files.forEach((f) => {
      if (filter !== "all" && fileType(f) !== filter) return;
      const key = monthKey(f.createdTime);
      (groups[key] ||= []).push(f);
    });
    return groups;
  }, [files, filter]);

  const handleDownload = (file) => {
    window.open(`https://drive.google.com/uc?id=${file.id}&export=download`, "_blank");
    setSnackbar({ open: true, msg: `Downloading: ${file.name}`, severity: "info" });
  };
  const handleOpenInDrive = (file) => {
    window.open(`https://drive.google.com/file/d/${file.id}/view`, "_blank");
  };

  const thumb = useCallback(
    (file, w = 640, h = 640) =>
      file.thumbnailLink
        ? file.thumbnailLink
        : `https://drive.google.com/thumbnail?id=${file.id}&sz=w${w}-h${h}`,
    []
  );

  return (
    <div className="snapika-landing" style={{ minHeight: "100vh" }}>
      <div className="snapika-smoke" aria-hidden="true" />
      <div className="snapika-smoke layer2" aria-hidden="true" />
      <div className="snapika-vignette" aria-hidden="true" />

      <Box className="app-shell" sx={{ position: "relative", zIndex: 2 }}>
        {/* Filters */}
        <Box className="gallery-filterbar">
          {FILTERS.map((f) => (
            <Button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`pill ${filter === f.key ? "active" : ""}`}
              startIcon={f.icon}
              size="small"
            >
              {f.label}
            </Button>
          ))}
        </Box>

        {loading ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <CircularProgress size={44} />
          </Box>
        ) : (
          Object.entries(filesByMonth).map(([month, monthFiles]) => {
            const isOpen = expanded[month];
            const show = isOpen ? monthFiles : monthFiles.slice(0, INITIAL_FILES_PER_MONTH);
            return (
              <section key={month} className="gallery-month">
                <div className="month-sticky">
                  <Typography className="month-title">{month}</Typography>
                  <Chip
                    label={`${monthFiles.length} items`}
                    size="small"
                    sx={{ bgcolor: "rgba(255,255,255,0.06)", border: "1px solid var(--glass-brd)", color: "var(--text)" }}
                  />
                </div>

                <div className="grid">
                  <AnimatePresence initial={false}>
                    {show.map((file) => (
                      <motion.article
                        key={file.id}
                        className="card card--actions"
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        whileHover={{ y: -3 }}
                      >
                        <div className="media">
                          <CardMediaSmart
                            file={file}
                            src={thumb(file)}
                            onClick={() => fileType(file) === "image" && setPreview(file)}
                          />
                          <div className="topbadge">
                            <span className="ftype">{typeIcon(file)}</span>
                          </div>
                          {/* Buttons always visible */}
                          <div className="overlay always-visible">
                            <Tooltip title="Open in Drive">
                              <button className="mini" onClick={() => handleOpenInDrive(file)}>
                                <OpenInNewIcon fontSize="inherit" />
                              </button>
                            </Tooltip>
                            <Tooltip title="Download">
                              <button className="mini" onClick={() => handleDownload(file)}>
                                <DownloadIcon fontSize="inherit" />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                        <div className="meta">
                          <div className="name" title={file.name}>{file.name}</div>
                        </div>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>

                {!isOpen && monthFiles.length > show.length && (
                  <div className="showmore">
                    <Button
                      className="btn-quiet"
                      onClick={() => setExpanded((p) => ({ ...p, [month]: true }))}
                    >
                      Show more for {month}
                    </Button>
                  </div>
                )}
              </section>
            );
          })
        )}

        {/* Lightbox */}
        <Dialog
          open={!!preview}
          onClose={() => setPreview(null)}
          fullWidth
          maxWidth="md"
          PaperProps={{ className: "lightbox" }}
        >
          <div className="lightbox-head">
            <Typography className="lightbox-name" title={preview?.name}>
              {preview?.name}
            </Typography>
            <span style={{ flex: 1 }} />
            {preview && (
              <>
                <Button size="small" className="btn-quiet" onClick={() => handleOpenInDrive(preview)} startIcon={<OpenInNewIcon />}>
                  Open
                </Button>
                <Button size="small" className="btn-quiet" onClick={() => handleDownload(preview)} startIcon={<DownloadIcon />} sx={{ ml: 1 }}>
                  Download
                </Button>
              </>
            )}
            <IconButton onClick={() => setPreview(null)} sx={{ ml: 1 }}>
              <CloseIcon />
            </IconButton>
          </div>
          {preview && (
            <div className="lightbox-body">
              <img src={`https://drive.google.com/uc?id=${preview.id}`} alt={preview.name} />
            </div>
          )}
        </Dialog>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={snackbar.open}
          autoHideDuration={2400}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.msg}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
}

/* ---------- helpers ---------- */
function CardMediaSmart({ file, src, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const [err, setErr] = useState(false);
  const type = fileType(file);

  if (type === "image") {
    return (
      <button className="media-btn" onClick={onClick} title={file.name}>
        {!loaded && <div className="skeleton" />}
        <img
          src={src}
          alt={file.name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setErr(true)}
          style={{ opacity: loaded && !err ? 1 : 0 }}
        />
        {err && (
          <div className="file-shimmer">
            <InsertDriveFileIcon />
          </div>
        )}
      </button>
    );
  }

  return (
    <div className="media-btn" title={file.name} onClick={onClick}>
      <div className={type === "video" ? "video-shimmer" : "file-shimmer"}>
        {type === "video" ? <MovieIcon /> : <InsertDriveFileIcon />}
      </div>
    </div>
  );
}
