import { useEffect, useState } from "react";

export default function JobsList({ token, reloadFlag }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadJobs() {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to fetch jobs");
        return;
      }

      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Jobs fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load
    loadJobs();

    // poll every 5 seconds
    const interval = setInterval(() => {
      loadJobs();
    }, 5000);

    return () => clearInterval(interval);
  }, [reloadFlag, token]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Jobs</h3>

      {loading && <div className="text-sm mb-2">Loading…</div>}

      {jobs.length === 0 && !loading && (
        <div className="text-sm text-gray-500">
          No jobs yet
        </div>
      )}

      {jobs.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Status</th>
              <th className="text-left">Created</th>
              <th className="text-left">Results</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id} className="border-b">
                <td className="py-2">
                  {job.status === "completed" && "✅ Completed"}
                  {job.status === "running" && "⏳ Running"}
                  {job.status === "failed" && "❌ Failed"}
                </td>

                <td>
                  {new Date(job.created_at).toLocaleString()}
                </td>

                <td>
                  {job.result_files?.length > 0 ? (
                    job.result_files.map(file => (
                      <a
                        key={file}
                        href={`${import.meta.env.VITE_API_BASE}/jobs/${job.id}/download/${file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 block"
                      >
                        {file}
                      </a>
                    ))
                  ) : (
                    <span className="text-gray-400">
                      —
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
