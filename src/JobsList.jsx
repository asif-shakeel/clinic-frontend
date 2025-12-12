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
    <h3 className="font-semibold mb-3">Jobs</h3>

    {loading && <div className="text-sm">Loading…</div>}

    {job?.status === "running" && (
      <div className="text-sm text-gray-500 mb-2">
        Analysis is running… results will appear automatically
      </div>
    )}

    <table className="w-full text-sm">
      <thead>
        <tr className="border-b">
          <th className="text-left py-2">Status</th>
          <th className="text-left">Created</th>
          <th className="text-left">Results</th>
        </tr>
      </thead>
      <tbody>
        {job && (
          <tr className="border-b">
            <td className="py-2">
              {job.status === "completed" ? "✅ Completed" :
               job.status === "running" ? "⏳ Running" :
               "❌ Failed"}
            </td>
            <td>{new Date(job.created_at).toLocaleString()}</td>
            <td>
              {job.result_files?.map(f => (
                <a
                  key={f}
                  href={`${import.meta.env.VITE_API_BASE}/jobs/${job.id}/download/${f}`}
                  className="text-blue-600 block"
                  target="_blank"
                >
                  {f}
                </a>
              ))}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

}
