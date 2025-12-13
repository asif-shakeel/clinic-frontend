export default function UploadCsv({ token, analysisKey, fileRole }) {
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

    alert(`${fileRole} uploaded`);
  }

  return (
    <div className="mb-3">
      <label className="block text-sm mb-1 capitalize">
        Upload {fileRole} file
      </label>
      <input type="file" accept=".csv" onChange={upload} />
    </div>
  );
}
