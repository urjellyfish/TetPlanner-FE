/**
 * useDashboard.js
 *
 * Convenience hook — consume DashboardContext without importing the context object directly.
 */
import { useContext } from "react";
import DashboardContext from "../contexts/DashboardContext";

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside <DashboardProvider>");
  return ctx;
}
