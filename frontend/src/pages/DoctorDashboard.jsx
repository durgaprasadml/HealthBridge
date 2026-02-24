import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatsCard";
import { Search, AlertTriangle, Clock, Users, CheckCircle, Loader2, Shield, Stethoscope } from "lucide-react";
import { getDoctorAccesses, requestEmergencyAccess, requestPatientAccess, getProfile } from "../services/api";

export default function DoctorDashboard() {
  const [patientUid, setPatientUid] = useState("");
  const [reason, setReason] = useState("");
  const [durationHours, setDurationHours] = useState(24);
  const [mode, setMode] = useState("STANDARD");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [recentAccesses, setRecentAccesses] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const token = localStorage.getItem("token");

  const loadAccesses = async () => {
    if (!token) return;
    try {
      const data = await getDoctorAccesses(token);
      setRecentAccesses(data.accesses || []);
    } catch {
      setRecentAccesses([]);
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile(token);
        setDoctorProfile(data.doctor);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };
    loadAccesses();
    loadProfile();
  }, []);

  const submitAccessRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      let uid = patientUid.trim().toUpperCase();
      // Auto-add HB- prefix if not present and it's not a phone number
      if (!/^[6-9]\d{9}$/.test(uid) && !uid.startsWith("HB-")) {
        uid = "HB-" + uid;
      }
      
      const res =
        mode === "EMERGENCY"
          ? await requestEmergencyAccess(token, uid, reason || "Emergency treatment required")
          : await requestPatientAccess(token, uid, durationHours);

      setResult(res);
      setPatientUid("");
      setReason("");
      await loadAccesses();
    } catch (err) {
      setError(err.message || "Failed to request access");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: "Total Accesses", value: recentAccesses.length, icon: Users, color: "primary" },
    {
      title: "Active Access",
      value: recentAccesses.filter((a) => ["APPROVED", "ACTIVE"].includes(a.status)).length,
      icon: CheckCircle,
      color: "success",
    },
    { title: "Pending", value: recentAccesses.filter((a) => a.status === "PENDING").length, icon: Clock, color: "warning" },
  ];

  return (
    <DashboardLayout title="Doctor Dashboard">
      {/* Doctor Info Header */}
      {doctorProfile && (
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 mb-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <Stethoscope size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{doctorProfile.name}</h2>
                <p className="text-primary-100 text-sm">{doctorProfile.hospital?.name}</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-xs text-primary-100 uppercase tracking-wide">Doctor ID</p>
              <p className="text-lg font-mono font-bold">{doctorProfile.doctorUid}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`stagger-${index + 1}`} style={{ animationDelay: `${index * 0.1}s` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-card p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-3 rounded-xl ${mode === "EMERGENCY" ? "bg-red-50" : "bg-blue-50"}`}>
              {mode === "EMERGENCY" ? <AlertTriangle size={24} className="text-error" /> : <Shield size={24} className="text-blue-600" />}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Patient Access Request</h2>
              <p className="text-sm text-text-secondary">Request standard or emergency access to patient records</p>
            </div>
          </div>

          <form onSubmit={submitAccessRequest} className="space-y-4">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setMode("STANDARD")}
                className={`flex-1 py-2 text-sm rounded-md ${mode === "STANDARD" ? "bg-white shadow text-primary-600" : "text-text-secondary"}`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setMode("EMERGENCY")}
                className={`flex-1 py-2 text-sm rounded-md ${mode === "EMERGENCY" ? "bg-white shadow text-primary-600" : "text-text-secondary"}`}
              >
                Emergency
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Patient Health UID</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  type="text"
                  className="input pl-10 font-mono"
                  placeholder="HB-XXXXXXXX"
                  value={patientUid}
                  onChange={(e) => setPatientUid(e.target.value.toUpperCase())}
                  required
                />
              </div>
              <p className="text-xs text-text-muted mt-1">HB- is added automatically</p>
            </div>

            {mode === "STANDARD" ? (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Access Duration</label>
                <select className="input" value={durationHours} onChange={(e) => setDurationHours(Number(e.target.value))}>
                  <option value={1}>1 hour</option>
                  <option value={6}>6 hours</option>
                  <option value={12}>12 hours</option>
                  <option value={24}>24 hours</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Emergency Reason</label>
                <textarea
                  className="input resize-none"
                  rows={3}
                  placeholder="Describe the emergency situation..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            )}

            <button type="submit" disabled={loading || !patientUid} className={`btn w-full py-3 text-base ${mode === "EMERGENCY" ? "btn-danger" : "btn-primary"}`}>
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : mode === "EMERGENCY" ? (
                <>
                  <AlertTriangle size={20} />
                  Request Emergency Access
                </>
              ) : (
                <>
                  <Shield size={20} />
                  Request Standard Access
                </>
              )}
            </button>
          </form>

          {result && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg animate-slide-up">
              <div className="flex items-center gap-2 text-emerald-700 font-medium mb-2">
                <CheckCircle size={20} />
                Request Submitted
              </div>
              <p className="text-sm text-emerald-600 mb-3">{result.message}</p>
              <div className="bg-white/50 p-3 rounded text-xs font-mono text-emerald-800">
                Expires: {result.expiresAt ? new Date(result.expiresAt).toLocaleString() : "N/A"}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-up">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-card">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Recent Accesses</h2>
            <p className="text-sm text-text-secondary mt-1">Your standard and emergency access activity</p>
          </div>

          {recentAccesses.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users size={24} className="text-text-muted" />
              </div>
              <p className="text-text-secondary">No recent accesses</p>
            </div>
          ) : (
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {recentAccesses.slice(0, 15).map((access) => (
                <div key={`${access.type}-${access.id}`} className="p-4 hover:bg-primary-50/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                        {access.patient?.healthUid?.slice(-2) || "??"}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary text-sm">{access.patient?.healthUid || "Unknown"}</p>
                        <p className="text-xs text-text-muted">{access.createdAt ? new Date(access.createdAt).toLocaleString() : "Unknown date"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`badge ${access.type === "EMERGENCY" ? "badge-error" : "badge-info"}`}>{access.type}</span>
                      <p className="text-xs text-text-muted mt-1">{access.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
