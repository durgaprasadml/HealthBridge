import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatsCard";
import { Shield, Check, X, Clock, User, Building2, Key, Activity, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getAccessRequests, respondToAccess, getActiveAccesses, revokeAccess, getProfile } from "../services/api";

export default function PatientDashboard() {
  const [requests, setRequests] = useState([]);
  const [activeAccesses, setActiveAccesses] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(null);
  const [revoking, setRevoking] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileData, requestsData, accessesData] = await Promise.all([
        getProfile(token),
        getAccessRequests(token),
        getActiveAccesses(token),
      ]);
      setProfile(profileData.user);
      setRequests(requestsData || []);
      setActiveAccesses(accessesData.activeAccesses || []);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const respond = async (id, action) => {
    setResponding(id);
    try {
      await respondToAccess(token, id, action);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error responding to request:", error);
    } finally {
      setResponding(null);
    }
  };

  const handleRevokeAccess = async (accessId, accessType) => {
    setRevoking(accessId);
    try {
      await revokeAccess(token, accessId, accessType);
      setActiveAccesses((prev) => prev.filter((a) => a.id !== accessId));
    } catch (error) {
      console.error("Error revoking access:", error);
    } finally {
      setRevoking(null);
    }
  };

  const stats = [
    { title: "Pending Requests", value: requests.length, icon: Clock, color: "warning" },
    { title: "Active Accesses", value: activeAccesses.length, icon: Activity, color: "primary" },
    { title: "Emergency Access", value: activeAccesses.filter(a => a.type === "EMERGENCY").length, icon: Shield, color: "error" },
  ];

  return (
    <DashboardLayout title="Patient Dashboard">
      {/* Patient Info Header */}
      {profile && (
        <div className="glass bg-gradient-to-r from-primary-600/90 to-primary-800/90 rounded-2xl p-8 mb-8 text-white shadow-xl shadow-primary-500/20 border-white/20 animate-slide-down">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">{profile.name}</h2>
                <p className="text-primary-100/90 font-medium">{profile.phone}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors"></div>
              <p className="text-xs text-primary-200 uppercase tracking-widest font-bold mb-1">Health ID</p>
              <p className="text-xl font-mono font-bold tracking-wider">{profile.healthUid}</p>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Action */}
      <div className="flex justify-end mb-6">
        <Link
          to="/emergency"
          className="btn btn-danger flex items-center gap-2 px-6 py-3 shadow-lg shadow-red-500/30"
        >
          <AlertCircle size={20} />
          Emergency Access Portal
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`stagger-${index + 1}`} style={{ animationDelay: `${index * 0.1}s` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Active Accesses Section */}
      {activeAccesses.length > 0 && (
        <div className="glass-panel mb-8 border border-white/60 animate-fade-in shadow-xl">
          <div className="p-6 border-b border-border/50 bg-white/40">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key size={20} className="text-primary-600" />
                <h2 className="text-lg font-semibold text-text-primary">Active Accesses</h2>
              </div>
              <span className="badge badge-primary">{activeAccesses.length} active</span>
            </div>
          </div>
          <div className="divide-y divide-border">
            {activeAccesses.map((access) => (
              <div key={access.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                    {access.doctor?.name?.charAt(0) || "D"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">{access.doctor?.name || "Doctor"}</h3>
                    <p className="text-sm text-text-secondary flex items-center gap-1">
                      <User size={12} /> {access.doctor?.doctorUid}
                      {access.doctor?.specialization && ` • ${access.doctor.specialization}`}
                    </p>
                    {access.hospital && (
                      <p className="text-sm text-text-secondary flex items-center gap-1">
                        <Building2 size={12} /> {access.hospital.name}
                      </p>
                    )}
                    <p className="text-xs text-text-muted mt-1">
                      Access started: {access.startedAt ? new Date(access.startedAt).toLocaleString() : "Unknown"}
                      {" • "}Expires: {access.expiresAt ? new Date(access.expiresAt).toLocaleString() : "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${access.type === 'EMERGENCY' ? 'badge-error' : 'badge-info'}`}>
                    {access.type}
                  </span>
                  <button
                    onClick={() => handleRevokeAccess(access.id, access.type === "EMERGENCY" ? "emergency" : "normal")}
                    disabled={revoking === access.id}
                    className="btn btn-danger px-3 py-1.5 text-sm"
                  >
                    {revoking === access.id ? "Revoking..." : "Revoke Access"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Access Requests Section */}
      <div className="glass-panel border border-white/60 animate-fade-in shadow-xl">
        <div className="p-6 border-b border-border/50 bg-white/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-primary-600" />
              <h2 className="text-lg font-semibold text-text-primary">Access Requests</h2>
            </div>
            <span className="badge badge-warning">{requests.length} pending</span>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-text-secondary mt-2">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No Access Requests</h3>
            <p className="text-text-secondary max-w-sm mx-auto">
              You don't have any pending access requests from doctors or hospitals.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {requests.map((r, index) => (
              <div
                key={r.id}
                className="p-6 hover:bg-primary-50/30 transition-colors animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Doctor Info */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
                      {r.doctor?.name?.charAt(0) || "D"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{r.doctor?.name || "Doctor"}</h3>
                      <p className="text-sm text-text-secondary flex items-center gap-1 mt-0.5">
                        <User size={14} />
                        {r.doctor?.doctorUid || "N/A"}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        Requested: {r.createdAt ? new Date(r.createdAt).toLocaleString() : "Just now"}
                      </p>
                    </div>
                  </div>

                  {/* Request Type Badge */}
                  <div className="flex items-center gap-3">
                    <span className={`badge ${r.type === 'EMERGENCY' ? 'badge-error' : 'badge-info'}`}>
                      {r.type || "STANDARD"}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => respond(r.id, "APPROVE")}
                      disabled={responding === r.id}
                      className="btn btn-success px-4 py-2"
                    >
                      <Check size={18} />
                      Approve
                    </button>
                    <button
                      onClick={() => respond(r.id, "REVOKE")}
                      disabled={responding === r.id}
                      className="btn btn-danger px-4 py-2"
                    >
                      <X size={18} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
