import { useState } from "react";

export default function RunAnalysis({
  token,
  analysisKey,
  selectedFiles,
  disabled,
  onDone,
}) {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("2024-01-01");
  const [endDate, setEndDate] = useState("2024-03-31");

  async function run() {
    if (loading || disabled) return;

    setLoading(true);

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/analyze`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysis_key: analysisKey,
          start_date: startDate,
          end_date: endDate,
          files: selectedFiles,
        }),
      }
    );

    const data = await res.json();
    setLoading(false);
    onDone(data.job_id);
  }

  return (
    <div className="mt-4">
      <div className="flex gap-2 mb-2">
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
            ? "bg-gray-400"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Running…" : "Run Analysis"}
      </button>
    </div>
  );
}
