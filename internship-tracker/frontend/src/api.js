import axios from "axios";

/** Production API (Render). Override with VITE_API_BASE_URL in Vercel if the URL changes. */
export const PRODUCTION_API = "https://internship-tracker-1-q568.onrender.com";

const LOCAL_API = "http://localhost:5000";

function isBrowserLocalhost() {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]";
}

function looksLikeLocalApi(url) {
  return /localhost|127\.0\.0\.1/.test(url);
}

/**
 * Picks API URL so HTTPS deployments never call http://localhost (mixed content — blocked, no Network row).
 */
function resolveApiBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL;
  const envUrl = typeof raw === "string" ? raw.trim().replace(/\/$/, "") : "";

  if (envUrl) {
    if (
      typeof window !== "undefined" &&
      window.location.protocol === "https:" &&
      looksLikeLocalApi(envUrl)
    ) {
      console.warn(
        "[api] Ignoring VITE_API_BASE_URL pointing to localhost on an HTTPS page (mixed content). Using production API."
      );
      return PRODUCTION_API;
    }
    return envUrl;
  }

  if (isBrowserLocalhost()) {
    return LOCAL_API;
  }

  return PRODUCTION_API;
}

export const API_BASE_URL = resolveApiBaseUrl();

export const apiUrl = (path) => `${API_BASE_URL}${path}`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
});
