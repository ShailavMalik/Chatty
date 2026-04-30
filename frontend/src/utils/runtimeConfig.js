const normalizeBaseUrl = (value) => {
  if (!value) return "";
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

export const getApiBaseUrl = () =>
  normalizeBaseUrl(
    import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_BACKEND_URL ||
      import.meta.env.VITE_SERVER_URL ||
      "",
  );

export const getSocketUrl = () =>
  normalizeBaseUrl(
    import.meta.env.VITE_SOCKET_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      import.meta.env.VITE_BACKEND_URL ||
      import.meta.env.VITE_SERVER_URL ||
      "http://localhost:5000",
  );

export const buildApiUrl = (path) => `${getApiBaseUrl()}${path}`;
