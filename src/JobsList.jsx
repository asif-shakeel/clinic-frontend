import { useEffect, useState } from "react";

function ResultLink({ jobId, filename, token }) {
  async function download() {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/jobs/${jobId}/download/${filename}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      alert("Failed to generate download link");
      return;
    }

    const { url } = await res.json();

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <button
      onClick={download}
      className="text-blue-600 block underline text-left"
    >
      {filename}
    </button>
  );
}

export default function JobsList({ token, jobId, onStatusChange }) {
  const [job, setJob] = useState(null);

  async function loadJob() {
    // If we know the job ID, fetch that job
    if (jobId) {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/jobs`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      const found = data.find(j => j.id === jobId) ?? null;
      setJob(found);
      onStatusChange?.(found?.status ?? null);
      return;
    }

    // Fallback: latest job
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/jobs`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    const latest = data[0] ?? null;
    setJob(latest);
    onStatusChange?.(latest?.status ?? null);
  }

  // Initial load
  useEffect(() => {
    loadJob();
  }, [jobId]);

  // Poll ONLY while running
  useEffect(() => {
    if (!job || job.status !== "running") return;

    const id = setInterval(loadJob, 2000);
    return () => clearInterval(id);
  }, [job?.status]);

  if (!job) {
    return <div className="text-sm">No analysis yet</div>;
  }

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h3 className="font-semibold mb-3">Latest Analysis</h3>

      <div className="mb-2">
        Status:{" "}
        {job.status === "completed" && "✅ Completed"}
        {job.status === "running" && "⏳ Running"}
        {job.status === "failed" && "❌ Failed"}
      </div>

      {job.status === "running" && (
        <div className="text-sm text-gray-500 mb-2">
          Analysis is running… results will appear automatically.
        </div>
      )}

      {job.status === "failed" && (
        <div className="text-red-600 text-sm">{job.error}</div>
      )}

      {job.status === "completed" && (
        <div className="mt-3">
          <div className="font-medium mb-1">Results</div>
          {job.result_files.map((f) => (
            <ResultLink
              key={f}
              jobId={job.id}
              filename={f}
              token={token}
            />
          ))}
        </div>
      )}
    </div>
  );
}
