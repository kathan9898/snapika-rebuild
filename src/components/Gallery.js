import React, { useEffect, useState } from "react";
import {
  Box, Typography, Card, CardMedia, CardActions, Button, CircularProgress,
  Grid, Snackbar, Alert, Chip, Fade, useMediaQuery
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import MovieIcon from "@mui/icons-material/Movie";
import ImageIcon from "@mui/icons-material/Image";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { listFilesFromFoldersSA } from "../utils/googleDrive";

const FOLDER_IDS = process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_IDS
  ? process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_IDS.split(",").map(id => id.trim()).filter(Boolean)
  : [];

function fileType(file) {
  if (!file.mimeType) return "file";
  if (file.mimeType.startsWith("image/")) return "image";
  if (file.mimeType.startsWith("video/")) return "video";
  return "file";
}

function monthYear(dateStr) {
  const d = new Date(dateStr);
  return `${d.toLocaleString("default", { month: "long" })} ${d.getFullYear()}`;
}

const FILTERS = [
  { key: "all", label: "All", icon: <InsertDriveFileIcon /> },
  { key: "image", label: "Images", icon: <ImageIcon /> },
  { key: "video", label: "Videos", icon: <MovieIcon /> },
  { key: "file", label: "Files", icon: <InsertDriveFileIcon /> },
];

const INITIAL_FILES_PER_MONTH = 6;

export default function Gallery() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", severity: "info" });
  const [filter, setFilter] = useState("all");
  const [showMoreState, setShowMoreState] = useState({}); // month => true/false
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const allFilesArr = await Promise.all(
          FOLDER_IDS.map(folderId => listFilesFromFoldersSA(folderId))
        );
        let allFiles = allFilesArr.flat();
        const fileMap = {};
        allFiles.forEach((file) => { fileMap[file.id] = file; });
        allFiles = Object.values(fileMap);
        allFiles.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
        setFiles(allFiles);
      } catch (e) {
        setFiles([]);
      }
      setLoading(false);
    })();
  }, []);

  const filesByMonth = {};
  files.forEach((file) => {
    if (filter !== "all" && fileType(file) !== filter) return;
    const key = monthYear(file.createdTime);
    if (!filesByMonth[key]) filesByMonth[key] = [];
    filesByMonth[key].push(file);
  });

  const handleDownload = (file) => {
    window.open(`https://drive.google.com/uc?id=${file.id}&export=download`, "_blank");
    setSnackbar({ open: true, msg: `Downloading: ${file.name}`, severity: "info" });
  };

  const handleOpenInDrive = (file) => {
    window.open(`https://drive.google.com/file/d/${file.id}/view`, "_blank");
  };

  const handleShowMore = (monthKey) => {
    setShowMoreState((prev) => ({ ...prev, [monthKey]: true }));
  };

  // Dynamic columns based on screen size
  // const gridCols = isMobile ? 3 : 6;

  return (
    <Box sx={{ bgcolor: "#ede7f6", minHeight: "100vh", px: { xs: 0.5, md: 3 }, pt: 3, pb: 10 }}>
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap", justifyContent: "center" }}>
        {FILTERS.map((f) => (
          <Chip
            key={f.key}
            icon={f.icon}
            label={f.label}
            color={filter === f.key ? "secondary" : "default"}
            onClick={() => setFilter(f.key)}
            sx={{
              fontWeight: 600,
              fontSize: 16,
              px: 2,
              borderRadius: 2,
              boxShadow: filter === f.key ? 2 : 0,
            }}
          />
        ))}
      </Box>

      {loading ? (
        <Box sx={{ textAlign: "center", py: 7 }}>
          <CircularProgress color="secondary" size={60} />
        </Box>
      ) : (
        Object.entries(filesByMonth).map(([month, monthFiles]) => {
          const showAll = showMoreState[month];
          const filesToShow = showAll ? monthFiles : monthFiles.slice(0, INITIAL_FILES_PER_MONTH);

          return (
            <Fade in key={month}>
              <Box sx={{ my: 4 }}>
                <Typography variant="h6" fontWeight={800} sx={{ color: "#7e30e1", mb: 1, fontFamily: "monospace" }}>
                  {month}
                </Typography>
                <Grid container spacing={isMobile ? 1 : 2}>
                  {filesToShow.map((file) => (
                    <Grid
                      item
                      xs={4}
                      sm={3}
                      md={2}
                      key={file.id}
                      sx={{
                        display: "flex",
                        alignItems: "stretch"
                      }}
                    >
                      <Card
                        sx={{
                          p: 1,
                          borderRadius: 3,
                          minHeight: isMobile ? 130 : 180,
                          boxShadow: 3,
                          bgcolor: "#fff",
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          transition: "transform .12s",
                          "&:hover": { transform: "scale(1.04)", boxShadow: 8 },
                          width: "100%",
                        }}
                        elevation={4}
                      >
                        {fileType(file) === "image" ? (
                          <CardMedia
                            component="img"
                            height={isMobile ? "60" : "90"}
                            image={`https://drive.google.com/thumbnail?id=${file.id}&sz=w200-h150`}
                            alt={file.name}
                            sx={{
                              objectFit: "cover",
                              borderRadius: 2,
                              mb: 1,
                              width: "95%",
                              aspectRatio: "1/1"
                            }}
                          />
                        ) : fileType(file) === "video" ? (
                          <Box
                            sx={{
                              width: "100%",
                              minHeight: isMobile ? 50 : 90,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mb: 1,
                            }}
                          >
                            <MovieIcon color="primary" sx={{ fontSize: isMobile ? 30 : 50, opacity: 0.8 }} />
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              width: "100%",
                              minHeight: isMobile ? 50 : 90,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mb: 1,
                            }}
                          >
                            <InsertDriveFileIcon color="action" sx={{ fontSize: isMobile ? 26 : 44, opacity: 0.7 }} />
                          </Box>
                        )}

                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: isMobile ? 10.5 : 13.5,
                            color: "#222",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "100%",
                            textAlign: "center",
                            mb: 0.4,
                          }}
                          title={file.name}
                        >
                          {file.name.length > (isMobile ? 12 : 22) ? file.name.slice(0, isMobile ? 12 : 22) + "..." : file.name}
                        </Typography>
                        <CardActions sx={{ justifyContent: "center", width: "100%", mt: 0.5, gap: 0.5, p: 0 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              minWidth: 0,
                              px: 1,
                              fontWeight: 600,
                              fontSize: isMobile ? 10 : 14
                            }}
                            startIcon={<DownloadIcon sx={{ fontSize: isMobile ? 14 : 20 }} />}
                            onClick={() => handleDownload(file)}
                          >
                            Download
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              minWidth: 0,
                              px: 1,
                              fontWeight: 600,
                              fontSize: isMobile ? 10 : 14
                            }}
                            startIcon={<OpenInNewIcon sx={{ fontSize: isMobile ? 14 : 20 }} />}
                            onClick={() => handleOpenInDrive(file)}
                          >
                            Preview
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                {!showAll && monthFiles.length > INITIAL_FILES_PER_MONTH && (
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Button
                      variant="text"
                      color="secondary"
                      onClick={() => handleShowMore(month)}
                      sx={{ fontWeight: 700, fontSize: 17 }}
                    >
                      Show more for {month}
                    </Button>
                  </Box>
                )}
              </Box>
            </Fade>
          );
        })
      )}

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
  );
}
