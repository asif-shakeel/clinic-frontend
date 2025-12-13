import UploadCsv from "./UploadCsv";
import RunAnalysis from "./RunAnalysis";
import JobsList from "./JobsList";
import { ANALYSES } from "./analyses";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Login from "./Login";



export default function App() {
  const [session, setSession] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0);
  const [latestJobStatus, setLatestJobStatus] = useState(null);
  const [analysisKey, setAnalysisKey] = useState("basic_clinic");
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => sub.subscription.unsubscribe();
  }, []);

  if (!session) return <Login />;

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

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Analysis Type
          </label>
          <select
            value={analysisKey}
            onChange={(e) => setAnalysisKey(e.target.value)}
            className="border p-2 rounded w-full"
          >
            {Object.entries(ANALYSES).map(([key, a]) => (
              <option key={key} value={key}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {ANALYSES[analysisKey].files.map((role) => (
          <UploadCsv
            key={role}
            token={session.access_token}
            analysisKey={analysisKey}
            fileRole={role}
          />
        ))}

        <RunAnalysis
          token={session.access_token}
          analysisKey={analysisKey}
          onDone={() => setReloadFlag(v => v + 1)}
        />


        <JobsList
          token={session.access_token}
          onStatusChange={setLatestJobStatus}
        />



        {/* jobs table will go here next */}
      </div>
    </div>
  );
}
