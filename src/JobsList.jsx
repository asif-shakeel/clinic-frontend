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
    window.location.href = url;
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

export default function JobsList({ token, reloadFlag }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadJobs() {
    setLoading(true);

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/jobs`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await res.json();

    // Only keep the most recent job
    setJob(data[0] ?? null);
    setLoading(false);
  }

    useEffect(() => {
    loadJobs();
    }, [reloadFlag]);

    useEffect(() => {
    if (!job || job.status !== "running") return;

    const id = setInterval(loadJobs, 2000);
    return () => clearInterval(id);
    }, [job?.status]);


  if (loading) {
    return <div className="text-sm">Loading job…</div>;
  }

  if (!job) {
    return <div className="text-sm">No jobs yet</div>;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Latest Analysis</h3>

      <div className="mb-2">
        Status:{" "}
        {job.status === "completed" && "✅ Completed"}
        {job.status === "running" && "⏳ Running"}
        {job.status === "failed" && "❌ Failed"}
      </div>

      {job.status === "failed" && (
        <div className="text-red-600 text-sm">
          {job.error}
        </div>
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
