import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  Chip,
  Button,
  CircularProgress,
  Avatar,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import StorageIcon from "@mui/icons-material/Storage";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import FolderIcon from "@mui/icons-material/Folder";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import "../heavenly_roasts.css";
import { listFilesWithSizeFromFolderSA } from "../utils/googleDrive";

/* ===== CONFIG ===== */
const FOLDER_IDS = process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_IDS
  ? process.env.REACT_APP_GOOGLE_DRIVE_FOLDER_IDS.split(",")
      .map((id) => id.trim())
      .filter(Boolean)
  : [];

const COLORS = ["#7AD7FF", "#A887FF", "#FF4D85", "#00B8A9", "#F9D923", "#FFD6E0"];

/* ===== Styled bits (glass card) ===== */
const GlassCard = styled(Card)({
  background: "var(--glass)",
  border: "1px solid var(--glass-brd)",
  backdropFilter: "blur(18px) saturate(160%)",
  borderRadius: 16,
  boxShadow: "var(--shadow)",
  color: "var(--text)",
  padding: 16,
});

/* ===== Utils ===== */
function fmtBytes(bytes = 0) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const v = bytes / Math.pow(k, i);
  return `${v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2)} ${sizes[i]}`;
}
const dayKey = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString().slice(0, 10);
};
const lastNDays = (n = 14) => {
  const t = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    t.push(d.toISOString().slice(0, 10));
  }
  return t;
};
const bucket = (m) =>
  m?.startsWith("image/")
    ? "image"
    : m?.startsWith("video/")
    ? "video"
    : m === "application/pdf"
    ? "pdf"
    : m?.startsWith("audio/")
    ? "audio"
    : m?.startsWith("application/vnd.google-apps")
    ? "gdoc"
    : m?.startsWith("application/")
    ? "doc"
    : "other";

/* ===== Page ===== */
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [drives, setDrives] = useState([]); // [{ id, files, size, fileCount, uploadsByDay, color }]
  const [error, setError] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    let stop = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const rows = await Promise.all(
          FOLDER_IDS.map(async (id, idx) => {
            const files = await listFilesWithSizeFromFolderSA(id);
            const size = files.reduce((a, f) => a + (parseInt(f.size || "0") || 0), 0);

            const map = {};
            files.forEach((f) => {
              const k = dayKey(f.createdTime);
              map[k] = (map[k] || 0) + 1;
            });
            const days = lastNDays(14);
            const uploadsByDay = days.map((d) => ({ date: d, count: map[d] || 0 }));

            return {
              id,
              files,
              size,
              fileCount: files.length,
              uploadsByDay,
              color: COLORS[idx % COLORS.length],
            };
          })
        );
        if (!stop) setDrives(rows);
      } catch (e) {
        if (!stop) {
          setError(e?.message || String(e));
          setDrives([]);
        }
      } finally {
        if (!stop) setLoading(false);
      }
    })();
    return () => {
      stop = true;
    };
  }, []);

  /* ----- Derived Globals ----- */
  const global = useMemo(() => {
    const files = drives.flatMap((d) => d.files);
    const size = drives.reduce((a, d) => a + d.size, 0);
    const count = files.length;
    const avg = count ? size / count : 0;

    const days = lastNDays(14);
    const map = {};
    drives.forEach((d) =>
      d.uploadsByDay.forEach((p) => (map[p.date] = (map[p.date] || 0) + p.count))
    );
    const series = days.map((d) => ({ date: d, count: map[d] || 0 }));
    const sum14 = series.reduce((a, b) => a + b.count, 0);

    const mime = {};
    files.forEach((f) => {
      const b = bucket(f.mimeType);
      mime[b] = (mime[b] || 0) + 1;
    });
    const mimeData = Object.entries(mime)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const top = [...files]
      .filter((f) => f.size)
      .sort((a, b) => parseInt(b.size || "0") - parseInt(a.size || "0"))
      .slice(0, 6);
    const recent = [...files]
      .sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime))
      .slice(0, 10);

    return { size, count, avg, series, sum14, mimeData, top, recent };
  }, [drives]);

  return (
    <div className="snapika-landing" style={{ minHeight: "100vh" }}>
      <div className="snapika-smoke" aria-hidden="true" />
      <div className="snapika-smoke layer2" aria-hidden="true" />
      <div className="snapika-vignette" aria-hidden="true" />

      <Box className="app-shell" sx={{ position: "relative", zIndex: 2 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography
            className="snapika-title"
            sx={{ m: 0, fontSize: 28, lineHeight: 1, fontWeight: 800 }}
          >
            Dashboard
          </Typography>
          <Chip
            label="Live"
            size="small"
            sx={{
              ml: 1,
              bgcolor: "rgba(122,215,255,0.12)",
              color: "var(--text)",
              border: "1px solid var(--glass-brd)",
            }}
          />
          <Box sx={{ flex: 1 }} />
          <Button
            onClick={() => nav("/upload")}
            startIcon={<CloudUploadIcon />}
            className="btn-quiet"
            size="small"
          >
            Upload
          </Button>
          <Button
            onClick={() => nav("/gallery")}
            startIcon={<PhotoLibraryIcon />}
            className="btn-quiet"
            size="small"
            sx={{ ml: 1 }}
          >
            Gallery
          </Button>
        </Box>

        {/* Stat tiles */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <StatTile
            icon={<StorageIcon />}
            label="Total Storage"
            value={fmtBytes(global.size)}
            iconBg="rgba(122,215,255,0.22)"
          />
          <StatTile
            icon={<InsertDriveFileIcon />}
            label="Files"
            value={global.count}
            iconBg="rgba(168,135,255,0.22)"
          />
          <StatTile
            icon={<QueryStatsIcon />}
            label="Avg File Size"
            value={fmtBytes(global.avg)}
            iconBg="rgba(255,77,133,0.22)"
          />
          <StatTile
            icon={<QueryBuilderIcon />}
            label="Uploads (14d)"
            value={global.sum14}
            iconBg="rgba(0,184,169,0.22)"
          />
        </Grid>

        {/* Charts row */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid item xs={12} md={8}>
            <GlassCard>
              <Typography sx={{ fontWeight: 800, mb: 1 }}>
                Upload Activity — last 14 days
              </Typography>
              <Box sx={{ height: 230 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={global.series}>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: "#b7c5d8" }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: "#b7c5d8" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(0,0,0,0.6)",
                        border: "1px solid var(--glass-brd)",
                        borderRadius: 8,
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#7AD7FF"
                      strokeWidth={3}
                      dot={{ r: 2 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </GlassCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <GlassCard>
              <Typography sx={{ fontWeight: 800, mb: 1 }}>Types</Typography>
              <Box sx={{ height: 230 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={global.mimeData}
                      innerRadius={45}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {global.mimeData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(0,0,0,0.6)",
                        border: "1px solid var(--glass-brd)",
                        borderRadius: 8,
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Divider sx={{ my: 1.25, borderColor: "var(--glass-brd)" }} />
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {global.mimeData.map((m) => (
                  <Chip
                    key={m.name}
                    label={`${m.name} · ${m.value}`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--glass-brd)",
                      color: "var(--text)",
                    }}
                  />
                ))}
              </Box>
            </GlassCard>
          </Grid>
        </Grid>

        {/* Per-drive panels */}
        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          {drives.map((d, idx) => (
            <Grid item xs={12} md={6} key={d.id}>
              <GlassCard>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: `${d.color}33`,
                      border: "1px solid var(--glass-brd)",
                    }}
                  >
                    <FolderIcon />
                  </Avatar>
                  <Typography sx={{ fontWeight: 800 }}>
                    Drive {idx + 1}
                  </Typography>
                  <Chip
                    label={`${d.fileCount} files`}
                    size="small"
                    sx={{
                      ml: 1,
                      bgcolor: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--glass-brd)",
                      color: "var(--text)",
                    }}
                  />
                  <Box sx={{ flex: 1 }} />
                  <Button
                    size="small"
                    className="btn-quiet"
                    onClick={() => nav("/upload")}
                  >
                    Upload
                  </Button>
                  <Button
                    size="small"
                    className="btn-quiet"
                    sx={{ ml: 1 }}
                    onClick={() => nav("/gallery")}
                  >
                    Open
                  </Button>
                </Box>

                <Typography variant="body2" sx={{ color: "var(--muted)" }}>
                  <b>ID:</b>{" "}
                  <span style={{ fontFamily: "monospace" }}>
                    {d.id.slice(0, 10)}…{d.id.slice(-6)}
                  </span>
                </Typography>

                <Grid container spacing={1.25} sx={{ mt: 1 }}>
                  <Grid item xs={6} sm={4}>
                    <MiniStat label="Storage" value={fmtBytes(d.size)} color={d.color} />
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <MiniStat label="Files" value={d.fileCount} color={d.color} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <MiniSpark data={d.uploadsByDay} stroke={d.color} />
                  </Grid>
                </Grid>
              </GlassCard>
            </Grid>
          ))}
        </Grid>

        {/* Recent + Top */}
        <Grid container spacing={1.5}>
          <Grid item xs={12} md={8}>
            <GlassCard>
              <Typography sx={{ fontWeight: 800, mb: 1 }}>
                Recent uploads
              </Typography>
              <Box sx={{ overflowX: "auto" }}>
                <table className="snapika-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Size</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {global.recent.map((f) => (
                      <tr key={f.id}>
                        <td title={f.name}>{f.name}</td>
                        <td>{bucket(f.mimeType)}</td>
                        <td>{fmtBytes(parseInt(f.size || "0"))}</td>
                        <td>{new Date(f.createdTime).toLocaleString()}</td>
                      </tr>
                    ))}
                    {!global.recent.length && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: "center", opacity: 0.7 }}>
                          No files yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </Box>
            </GlassCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <GlassCard>
              <Typography sx={{ fontWeight: 800, mb: 1 }}>
                Top files by size
              </Typography>
              <Box sx={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={global.top
                      .map((f) => ({
                        name: (f.name || "").slice(0, 18),
                        size: parseInt(f.size || "0"),
                      }))
                      .reverse()}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "#b7c5d8" }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: "#b7c5d8" }} />
                    <Tooltip
                      formatter={(v) => fmtBytes(v)}
                      contentStyle={{
                        background: "rgba(0,0,0,0.6)",
                        border: "1px solid var(--glass-brd)",
                        borderRadius: 8,
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Bar dataKey="size" fill="#A887FF" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </GlassCard>
          </Grid>
        </Grid>

        {loading && (
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <CircularProgress size={42} />
            <Typography sx={{ mt: 1, color: "var(--muted)" }}>
              Fetching live Drive stats…
            </Typography>
          </Box>
        )}
        {error && (
          <Box sx={{ textAlign: "center", mt: 2, color: "#ffb4c8" }}>
            {error}
          </Box>
        )}
      </Box>
    </div>
  );
}

/* ===== Sub-components ===== */
function StatTile({ icon, label, value, iconBg }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <GlassCard>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ bgcolor: iconBg, border: "1px solid var(--glass-brd)" }}>
            {icon}
          </Avatar>
          <Typography variant="body2" sx={{ color: "var(--muted)" }}>
            {label}
          </Typography>
        </Box>
        <Typography sx={{ mt: 0.5, fontWeight: 900, fontSize: 20 }}>
          {value}
        </Typography>
      </GlassCard>
    </Grid>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <Box>
      <Typography variant="body2" sx={{ color: "var(--muted)" }}>
        {label}
      </Typography>
      <Typography
        sx={{
          fontWeight: 900,
          fontSize: 18,
          background: `linear-gradient(90deg, ${color}, #ffffffaa)`,
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function MiniSpark({ data, stroke = "#7AD7FF" }) {
  return (
    <Box sx={{ height: 46 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" hide />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid var(--glass-brd)",
              borderRadius: 8,
            }}
            labelStyle={{ color: "#fff" }}
            formatter={(v) => [v, "uploads"]}
          />
          <Line type="monotone" dataKey="count" stroke={stroke} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
