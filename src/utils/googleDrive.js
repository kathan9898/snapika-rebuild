import {  SignJWT } from 'jose';

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

async function importPrivateKey(pem) {
  // Remove header/footer and newlines
  const pemClean = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const binaryDer = atob(pemClean);
  const bytes = new Uint8Array([...binaryDer].map((ch) => ch.charCodeAt(0)));
  return await crypto.subtle.importKey(
    "pkcs8",
    bytes.buffer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"]
  );
}

async function getServiceAccountAccessToken() {
  const privateKey = process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, "\n");
  const clientEmail = process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/drive.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(clientEmail)
    .setSubject(clientEmail)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(await importPrivateKey(privateKey));

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error("Failed to obtain access token: " + JSON.stringify(data));
  }
  return data.access_token;
}

// List files in a Drive folder (service account)
export async function listFilesFromFoldersSA(folderId) {
  const token = await getServiceAccountAccessToken();
  const q = `'${folderId}' in parents and trashed = false`;
  const url =
    "https://www.googleapis.com/drive/v3/files?fields=files(id,name,mimeType,createdTime,iconLink,thumbnailLink,webViewLink)&q=" +
    encodeURIComponent(q) +
    "&orderBy=createdTime desc&pageSize=100";
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await resp.json();
  return data.files || [];
}

// For download link
export async function getDownloadUrlSA(fileId) {
  const token = await getServiceAccountAccessToken();
  return `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&access_token=${token}`;
}
