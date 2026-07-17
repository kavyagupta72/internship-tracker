import axios from "axios";

const LOCAL_API = "http://localhost:5000";

function isBrowserLocalhost() {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]";
}

/** Strips accidental `/auth` or `/auth/signup` so requests hit `/auth/signup` once, not `/auth/auth/signup`. */
function normalizeRootApiUrl(url) {
  if (!url) return url;
  return url.trim().replace(/\/$/, "").replace(/\/auth(?:\/.*)?$/i, "");
}

/** Uses env override when present, otherwise defaults to local backend. */
function resolveApiBaseUrl() {
  const raw = import.meta.env.VITE_API_BASE_URL;
  const envUrl =
    typeof raw === "string" ? normalizeRootApiUrl(raw.trim()) : "";

  if (envUrl) return envUrl;
  if (isBrowserLocalhost()) return LOCAL_API;
  return LOCAL_API;
}

export const API_BASE_URL = resolveApiBaseUrl();

export const apiUrl = (path) => `${API_BASE_URL}${path}`;

const isLocalApiHost =
  API_BASE_URL.includes("localhost") || API_BASE_URL.includes("127.0.0.1");
const remoteTimeoutMs = Number(import.meta.env.VITE_API_TIMEOUT_MS) || 10_000;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: isLocalApiHost ? 10_000 : remoteTimeoutMs,
});
