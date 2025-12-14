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

  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});

  const [currentJobId, setCurrentJobId] = useState(null);
  const [latestJobStatus, setLatestJobStatus] = useState(null);

  const [selectedForDelete, setSelectedForDelete] = useState([]);

  // AUTH
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => sub.subscription.unsubscribe();
  }, []);

  // LOAD ANALYSES
  useEffect(() => {
    if (!session) return;

    fetch(`${import.meta.env.VITE_API_BASE}/analyses`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })
      .then((r) => r.json())
      .then((data) => {
        setAnalyses(data);
        setAnalysisKey(Object.keys(data)[0]);
      });
  }, [session]);

  // LOAD FILES
  useEffect(() => {
    if (!session) return;

    fetch(`${import.meta.env.VITE_API_BASE}/files`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })
      .then((r) => r.json())
      .then((data) => setFiles(data));
  }, [session]);

  if (!session) return <Login />;
  if (!analyses || !analysisKey) return <div>Loading…</div>;

  const analysis = analyses[analysisKey];

  async function deleteSelectedFiles() {
    if (!selectedForDelete.length) return;

    for (const id of selectedForDelete) {
      await fetch(`${import.meta.env.VITE_API_BASE}/files/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
    }

    const res = await fetch(`${import.meta.env.VITE_API_BASE}/files`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    setFiles(await res.json());
    setSelectedForDelete([]);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-semibold">Dashboard</h2>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-red-600"
          >
            Sign out
          </button>
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT: MAIN WORKFLOW */}
          <div className="md:col-span-2">

            {/* ANALYSIS SELECTOR */}
            <select
              className="border p-2 rounded w-full mb-4"
              value={analysisKey}
              onChange={(e) => {
                setAnalysisKey(e.target.value);
                setSelectedFiles({});
              }}
            >
              {Object.entries(analyses).map(([k, a]) => (
                <option key={k} value={k}>
                  {a.label}
                </option>
              ))}
            </select>

            {/* FILE ASSIGNMENT */}
            {Object.entries(analysis.files).map(([role, cfg]) => (
              <div key={role} className="mb-4 p-3 bg-white rounded border">
                <div className="font-medium mb-1 capitalize">{role}</div>

                <div className="text-xs text-gray-500 mb-2">
                  Required columns:{" "}
                  <span className="font-mono">
                    {cfg.required_columns.join(", ")}
                  </span>
                </div>

                <select
                  className="border p-2 rounded w-full"
                  value={selectedFiles[role] || ""}
                  onChange={(e) =>
                    setSelectedFiles((prev) => ({
                      ...prev,
                      [role]: e.target.value,
                    }))
                  }
                >
                  <option value="">Select file</option>
                  {files.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.filename}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* UPLOAD */}


            {/* RUN */}
            <RunAnalysis
              token={session.access_token}
              analysisKey={analysisKey}
              selectedFiles={selectedFiles}
              disabled={latestJobStatus === "running"}
              onDone={setCurrentJobId}
            />

            {/* JOBS */}
            <JobsList
              token={session.access_token}
              jobId={currentJobId}
              onStatusChange={setLatestJobStatus}
            />
          </div>

          {/* RIGHT: FILE LIST + DELETE */}
          <div className="bg-white border rounded p-3 h-fit">
            <div className="font-medium mb-2">Your files</div>

            <div className="max-h-64 overflow-y-auto space-y-1 text-sm mb-2">
              {files.map((f) => (
                <label key={f.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedForDelete.includes(f.id)}
                    onChange={(e) =>
                      setSelectedForDelete((prev) =>
                        e.target.checked
                          ? [...prev, f.id]
                          : prev.filter((x) => x !== f.id)
                      )
                    }
                  />
                  {f.filename}
                </label>
              ))}
            </div>

            <button
              onClick={deleteSelectedFiles}
              disabled={!selectedForDelete.length}
              className="w-full px-3 py-1 text-sm bg-red-600 text-white rounded disabled:bg-gray-400"
            >
              Delete selected
            </button>
            <div className="mt-4">
            <UploadCsv token={session.access_token} />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
