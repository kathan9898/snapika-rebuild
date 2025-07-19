export function uploadFileToDrive(accessToken, folderId, file, onProgress) {
  return new Promise((resolve, reject) => {
    const url =
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";
    const metadata = {
      name: file.name,
      parents: [folderId],
    };

    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.setRequestHeader("Authorization", "Bearer " + accessToken);

    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable && onProgress) {
        const percent = Math.round((evt.loaded / evt.total) * 100);
        onProgress(percent);
      }
    };
    xhr.onload = () => {
      if (xhr.status === 200) resolve(JSON.parse(xhr.response));
      else reject(xhr.response);
    };
    xhr.onerror = reject;
    xhr.send(form);
  });
}
