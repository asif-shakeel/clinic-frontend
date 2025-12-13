import { useEffect, useState } from "react";

export function useFiles(token) {
  const [files, setFiles] = useState([]);

  async function load() {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/files`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setFiles(await res.json());
  }

  useEffect(() => {
    if (token) load();
  }, [token]);

  return { files, reload: load };
}
