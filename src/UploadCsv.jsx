export default function UploadCsv({ token }) {
  async function upload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/upload_file`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      }
    );

    if (!res.ok) {
      alert("Upload failed");
      return;
    }

    alert("File uploaded");
    window.location.reload(); // simplest refresh of file list
  }

  return (
    <div className="mb-4 p-3 bg-white rounded border">
      <label className="block text-sm mb-1">
        Upload a CSV file
      </label>
      <input type="file" accept=".csv" onChange={upload} />
    </div>
  );
}
