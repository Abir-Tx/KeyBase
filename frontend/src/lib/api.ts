// src/lib/api.ts
import axios from "axios";

// The API Connection Base URL | Read it from .env file
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export type Shortcut = {
  id?: number;
  name: string;
  keys: string[];
  app: string;
  os: string;
  description?: string;
  tags: string[];
};

export const fetchShortcuts = async (): Promise<Shortcut[]> => {
  const res = await axios.get(`${API_BASE}/shortcuts/`);
  return res.data;
};

export const addShortcut = async (shortcut: Shortcut) => {
  const res = await axios.post(`${API_BASE}/shortcuts/`, shortcut);
  return res.data;
};

export const updateShortcut = async (shortcut: Shortcut) => {
  if (!shortcut.id) throw new Error("Shortcut ID is required for update");
  const res = await axios.put(`${API_BASE}/shortcuts/${shortcut.id}`, shortcut);
  return res.data;
};
