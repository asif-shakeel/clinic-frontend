import { useState } from "react";
import { supabase } from "./supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [mode, setMode] = useState("signin"); // signin | signup

  async function signIn() {
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    }

    setLoading(false);
  }

  async function signUp() {
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Check your email to confirm your account. You can resend it below if needed."
      );
    }

    setLoading(false);
  }

  async function resendConfirmation() {
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Confirmation email resent. Check your inbox.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold text-center">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full"
        />

        {message && (
          <div className="text-sm text-center text-gray-600">
            {message}
          </div>
        )}

        {mode === "signin" ? (
          <button
            onClick={signIn}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        ) : (
          <button
            onClick={signUp}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        )}

        <div className="text-center text-sm space-y-2">
          <button
            onClick={() =>
              setMode(mode === "signin" ? "signup" : "signin")
            }
            className="text-blue-600 underline"
          >
            {mode === "signin"
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </button>

          <div>
            <button
              onClick={resendConfirmation}
              disabled={!email || loading}
              className="text-gray-500 underline disabled:opacity-50"
            >
              Resend confirmation email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
