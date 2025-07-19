import React from "react";

const folderIds = process.env.REACT_APP_DRIVE_FOLDER_IDS
  ? process.env.REACT_APP_DRIVE_FOLDER_IDS.split(",")
  : [];

function FolderPicker({ value, onChange }) {
  return (
    <div style={{ marginTop: 12 }}>
      <label style={{ fontWeight: 500, fontSize: 15, color: "#fff" }}>
        Select Drive Folder:
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: 8,
          background: "#2d3047",
          color: "#fff",
          marginTop: 6,
        }}
      >
        <option value="">-- Choose folder --</option>
        {folderIds.map((fid, idx) => (
          <option key={fid} value={fid}>
            Folder {idx + 1} ({fid})
          </option>
        ))}
      </select>
    </div>
  );
}

export default FolderPicker;
