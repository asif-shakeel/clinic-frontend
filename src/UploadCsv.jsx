export default function UploadCsv({
  token,
  analysisKey,
  fileRole,
  requiredColumns,
}) {
  async function upload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    await fetch(
      `${import.meta.env.VITE_API_BASE}/upload?analysis_key=${analysisKey}&file_role=${fileRole}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      }
    );

    const data = await res.json();
    alert(`${data.filename} uploaded`);

  }

  return (
    <div className="mb-4">
      <label className="block text-sm mb-1 capitalize">
        Upload {fileRole} file
      </label>

      <input type="file" accept=".csv" onChange={upload} />

      {/* REQUIRED COLUMNS DISPLAY */}
      <div className="mt-1 text-xs text-gray-500">
        Required columns:
        <span className="ml-1 font-mono">
          {(requiredColumns || []).join(", ")}
        </span>
      </div>
    </div>
  );
}
