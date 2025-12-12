import { useState } from "react";

export default function RunAnalysis({ token, onDone }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [status, setStatus] = useState("");

  async function run() {
    setStatus("Running analysis…");

    const params = new URLSearchParams();
    if (start) params.append("start_date", start);
    if (end) params.append("end_date", end);

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/analyze?${params.toString()}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!res.ok) {
      const err = await res.text();
      setStatus(`Error: ${err}`);
      return;
    }

    setStatus("Job started ✅");
    onDone?.();
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h3 className="font-semibold mb-2">Run Analysis</h3>

      <div className="flex gap-4 mb-3">
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={run}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Run
        </button>
      </div>

      {status && <div className="text-sm">{status}</div>}
    </div>
  );
}
