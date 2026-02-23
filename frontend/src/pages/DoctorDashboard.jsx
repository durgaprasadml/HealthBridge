import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatsCard";
import { Search, AlertTriangle, Clock, Users, CheckCircle, Loader2 } from "lucide-react";

export default function DoctorDashboard() {
  const [patientUid, setPatientUid] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [recentAccesses, setRecentAccesses] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch recent accesses
  useEffect(() => {
    fetch("http://localhost:5050/doctor/accesses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setRecentAccesses(data.accesses || []))
      .catch(() => {});
  }, []);

  const emergencyAccess = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("http://localhost:5050/access/emergency/start", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientUid: patientUid.trim().toUpperCase(),
          reason: reason || "Emergency treatment required",
        }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.message || "Failed to get access");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { title: "Patients Seen", value: recentAccesses.length, icon: Users, color: "primary" },
    { title: "Active Access", value: recentAccesses.filter(a => a.status === "ACTIVE").length, icon: CheckCircle, color: "success" },
    { title: "Pending", value: 0, icon: Clock, color: "warning" },
  ];

  return (
    <DashboardLayout title="Doctor Dashboard">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`stagger-${index + 1}`} style={{ animationDelay: `${index * 0.1}s` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Access Form */}
        <div className="bg-white rounded-xl shadow-card p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-red-50">
              <AlertTriangle size={24} className="text-error" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Emergency Access</h2>
              <p className="text-sm text-text-secondary">Request immediate access to patient records</p>
            </div>
          </div>

          <form onSubmit={emergencyAccess} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Patient Health UID
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  type="text"
                  className="input pl-10"
                  placeholder="Enter Patient Health ID (e.g., HB-XXXXXXX)"
                  value={patientUid}
                  onChange={(e) => setPatientUid(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Reason for Access
              </label>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="Describe the emergency situation..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !patientUid}
              className="btn btn-danger w-full py-3 text-base"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <AlertTriangle size={20} />
                  Request Emergency Access
                </>
              )}
            </button>
          </form>

          {/* Result Display */}
          {result && (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg animate-slide-up">
              <div className="flex items-center gap-2 text-emerald-700 font-medium mb-2">
                <CheckCircle size={20} />
                Access Granted
              </div>
              <p className="text-sm text-emerald-600 mb-3">
                Emergency access has been approved. You can now view the patient's records.
              </p>
              <div className="bg-white/50 p-3 rounded text-xs font-mono text-emerald-800">
                Access ID: {result.accessId || "N/A"}<br />
                Expires: {result.expiresAt ? new Date(result.expiresAt).toLocaleString() : "N/A"}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-up">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>

        {/* Recent Accesses */}
        <div className="bg-white rounded-xl shadow-card">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Recent Patient Accesses</h2>
            <p className="text-sm text-text-secondary mt-1">Your recent patient record accesses</p>
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
              {recentAccesses.slice(0, 10).map((access, index) => (
                <div 
                  key={access.id || index}
                  className="p-4 hover:bg-primary-50/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                        {access.patient?.healthUid?.slice(-2) || "??"}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary text-sm">
                          {access.patient?.healthUid || "Unknown"}
                        </p>
                        <p className="text-xs text-text-muted">
                          {access.createdAt ? new Date(access.createdAt).toLocaleDateString() : "Unknown date"}
                        </p>
                      </div>
                    </div>
                    <span className={`badge ${access.status === 'ACTIVE' ? 'badge-success' : 'badge-info'}`}>
                      {access.status || "ACTIVE"}
                    </span>
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

