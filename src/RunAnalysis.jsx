import { useState } from "react";

export default function RunAnalysis({ token, onDone, disabled }) {
  const [loading, setLoading] = useState(false);

  async function run() {
    if (disabled || loading) return;

    setLoading(true);

    await fetch(
      `${import.meta.env.VITE_API_BASE}/analyze?start_date=2024-01-01&end_date=2024-03-31`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setLoading(false);
    onDone();
  }

  return (
    <div className="mb-4">
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
        <div className="text-sm text-gray-500 mt-1">
          An analysis is already running
        </div>
      )}
    </div>
  );
}
