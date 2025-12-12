import { useState } from "react";

export default function UploadCsv({ token }) {
  const [status, setStatus] = useState("");

  async function uploadFile(file) {
    if (!file) return;

    setStatus(`Uploading ${file.name}...`);

    const form = new FormData();
    form.append("file", file);

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      }
    );

    if (!res.ok) {
      const err = await res.text();
      setStatus(`Error: ${err}`);
      return;
    }

    setStatus(`Uploaded ${file.name} ✅`);
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h3 className="font-semibold mb-2">Upload CSV</h3>

      <input
        type="file"
        accept=".csv"
        onChange={(e) => uploadFile(e.target.files[0])}
      />

      {status && <div className="text-sm mt-2">{status}</div>}
    </div>
  );
}
