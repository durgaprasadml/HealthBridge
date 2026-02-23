import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatsCard";
import { Shield, Check, X, Clock, User, Building2 } from "lucide-react";
import { getAccessRequests, respondToAccess } from "../services/api";

export default function PatientDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    getAccessRequests(token)
      .then((data) => setRequests(data || []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

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

  const stats = [
    { title: "Total Requests", value: requests.length, icon: Shield, color: "primary" },
    { title: "Pending", value: requests.filter(r => r.status === "PENDING").length, icon: Clock, color: "warning" },
    { title: "Approved", value: requests.filter(r => r.status === "APPROVED").length, icon: Check, color: "success" },
  ];

  return (
    <DashboardLayout title="Patient Dashboard">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`stagger-${index + 1}`} style={{ animationDelay: `${index * 0.1}s` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Access Requests Section */}
      <div className="bg-white rounded-xl shadow-card">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Access Requests</h2>
              <p className="text-sm text-text-secondary mt-1">
                Review and manage your health record access requests
              </p>
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
                      {r.hospital && (
                        <p className="text-sm text-text-secondary flex items-center gap-1 mt-0.5">
                          <Building2 size={14} />
                          {r.hospital.name || "Hospital"}
                        </p>
                      )}
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
                    {r.reason && (
                      <span className="text-sm text-text-secondary max-w-xs truncate">
                        {r.reason}
                      </span>
                    )}
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
