import { useState } from "react";

export default function RunAnalysis({ token, onDone, disabled, analysisKey }) {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-03-31");

  async function run() {
    if (disabled || loading) return;

    setLoading(true);

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/analyze?analysis_key=${analysisKey}&start_date=${startDate}&end_date=${endDate}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json(); // ← IMPORTANT

    setLoading(false);

    // Pass the job_id upward so the UI tracks THIS job
    onDone(data.job_id);
  }

  return (
    <div className="mb-4 space-y-2">
      <div className="flex gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>

      <button
        onClick={run}
        disabled={disabled || loading}
        className={`px-4 py-2 rounded text-white ${
          disabled || loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Starting analysis…" : "Run Analysis"}
      </button>

      {disabled && !loading && (
        <div className="text-sm text-gray-500">
          An analysis is already running
        </div>
      )}
    </div>
  );
}
