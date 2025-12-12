import { useEffect, useState } from "react";

export default function JobsList({ token, reloadFlag }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadJobs() {
    setLoading(true);
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/jobs`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  }

  useEffect(() => {
    loadJobs();
  }, [reloadFlag]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Jobs</h3>

      {loading && <div className="text-sm">Loading…</div>}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Status</th>
            <th className="text-left">Created</th>
            <th className="text-left">Results</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(j => (
            <tr key={j.id} className="border-b">
              <td className="py-2">
                {j.status === "completed" ? "✅ Completed" :
                 j.status === "running" ? "⏳ Running" :
                 "❌ Failed"}
              </td>
              <td>{new Date(j.created_at).toLocaleString()}</td>
              <td>
                {j.result_files?.map(f => (
                  <a
                    key={f}
                    href={`${import.meta.env.VITE_API_BASE}/jobs/${j.id}/download/${f}`}
                    className="text-blue-600 block"
                    target="_blank"
                  >
                    {f}
                  </a>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
