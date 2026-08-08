"use client";

import { useAdminAuth, AdminLoginScreen } from "@/components/restaurant/AdminLogin";
import AdminDashboard from "@/components/restaurant/AdminDashboard";

export default function AdminPageClient() {
  const { authed, login, logout } = useAdminAuth();

  // Still reading sessionStorage — render nothing to avoid flash
  if (authed === null) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--dark-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: "var(--dark-border)", borderTopColor: "var(--gold)" }} />
      </div>
    );
  }

  if (!authed) return <AdminLoginScreen onSuccess={login} />;

  return <AdminDashboard onLogout={logout} />;
}
