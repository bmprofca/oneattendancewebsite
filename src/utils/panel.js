export const PANEL_URL = (process.env.REACT_APP_PANEL_URL || "http://localhost:3000").replace(/\/$/, "");

export const panelPath = (path = "/") => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${PANEL_URL}${normalized}`;
};
