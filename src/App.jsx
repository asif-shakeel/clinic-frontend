import UploadCsv from "./UploadCsv";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import Login from "./Login";

export default function App() {
  const [session, setSession] = useState(null);

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

          <UploadCsv token={session.access_token} />

          {/* jobs table will go here next */}
        </div>
      </div>
    );

}
