import { useEffect, useState } from "react";
import journey from "@/data/journey.json";
export type Preferences = { coast: string; edits: Record<string, string> };
const empty: Preferences = { coast: "", edits: {} };
export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(empty);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("omi-journey-v1") || "null",
      );
      if (saved) {
        const edits: Record<string, string> = {};
        for (const day of journey.days) {
          const value = saved.edits?.[day.id];
          if (typeof value === "string" && value.trim())
            edits[day.id] = value.slice(0, 500);
        }
        setPrefs({
          coast: journey.coasts.some((c) => c.name === saved.coast)
            ? saved.coast
            : "",
          edits,
        });
      }
    } catch {}
    setReady(true);
  }, []);
  function update(next: Preferences) {
    setPrefs(next);
    try {
      localStorage.setItem("omi-journey-v1", JSON.stringify(next));
    } catch {}
  }
  return { prefs, update, ready };
}
