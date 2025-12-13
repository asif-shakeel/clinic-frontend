import UploadCsv from "./UploadCsv";
import RunAnalysis from "./RunAnalysis";
import JobsList from "./JobsList";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Login from "./Login";

export default function App() {
  const [session, setSession] = useState(null);
  const [analyses, setAnalyses] = useState(null);
  const [analysisKey, setAnalysisKey] = useState(null);

  const [currentJobId, setCurrentJobId] = useState(null);
  const [latestJobStatus, setLatestJobStatus] = useState(null);

  // ---- auth ----
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => sub.subscription.unsubscribe();
  }, []);

  // ---- fetch analyses AFTER login ----
  useEffect(() => {
    if (!session) return;

    async function loadAnalyses() {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/analyses`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await res.json();
      setAnalyses(data);

      // default to first analysis
      const firstKey = Object.keys(data)[0];
      setAnalysisKey(firstKey);
    }

    loadAnalyses();
  }, [session]);

  if (!session) return <Login />;
  if (!analyses || !analysisKey) {
    return <div className="p-6 text-sm">Loading analyses…</div>;
  }

  const analysis = analyses[analysisKey];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-red-600"
          >
            Sign out
          </button>
        </div>

        {/* Analysis selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Analysis Type
          </label>
          <select
            value={analysisKey}
            onChange={(e) => setAnalysisKey(e.target.value)}
            className="border p-2 rounded w-full"
          >
            {Object.entries(analyses).map(([key, a]) => (
              <option key={key} value={key}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {/* Upload files */}
        {Object.entries(analysis.files).map(([role, cfg]) => (
          <UploadCsv
            key={role}
            token={session.access_token}
            analysisKey={analysisKey}
            fileRole={role}
            requiredColumns={cfg.required_columns}
          />
        ))}

        {/* Run analysis */}
        <RunAnalysis
          token={session.access_token}
          analysisKey={analysisKey}
          disabled={latestJobStatus === "running"}
          onDone={(jobId) => setCurrentJobId(jobId)}
        />

        {/* Job status + results */}
        <JobsList
          token={session.access_token}
          jobId={currentJobId}
          onStatusChange={setLatestJobStatus}
        />
      </div>
    </div>
  );
}
