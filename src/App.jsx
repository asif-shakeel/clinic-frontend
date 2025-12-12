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
    <div>
      <h2>Logged in</h2>
      <button onClick={() => supabase.auth.signOut()}>
        Sign out
      </button>
    </div>
  );
}
