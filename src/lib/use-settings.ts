"use client";

import { useEffect, useState } from "react";
import type { SiteSettings } from "./store";

/**
 * Shared client hook that loads site settings from the public settings API.
 * Centralizes the fetch so components (footer, contact, …) don't each
 * re-implement it, and hands back a typed object instead of `any`.
 *
 * Returns `null` until the first response arrives; callers should fall back
 * to their own defaults while it is null.
 */
export function useSettings(): SiteSettings | null {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (active && d.settings) setSettings(d.settings as SiteSettings);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return settings;
}
