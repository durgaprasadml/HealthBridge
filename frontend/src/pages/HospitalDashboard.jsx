import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatsCard";
import { Search, Users, Clock, Building2, Filter, MoreVertical, Shield, AlertCircle } from "lucide-react";

export default function HospitalDashboard() {
  const [accesses, setAccesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5050/hospital/active-access", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((d) => {
        setAccesses(d.activeAccesses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter accesses
  const filteredAccesses = accesses.filter((access) => {
    const matchesSearch = 
      access.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      access.patient?.healthUid?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || access.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { title: "Active Accesses", value: accesses.length, icon: Shield, color: "primary" },
    { title: "Doctors", value: [...new Set(accesses.map(a => a.doctor?.id))].length, icon: Users, color: "success" },
    { title: "Emergency", value: accesses.filter(a => a.type === "EMERGENCY").length, icon: AlertCircle, color: "error" },
    { title: "Standard", value: accesses.filter(a => a.type === "STANDARD").length, icon: Clock, color: "info" },
  ];

  const getStatusBadge = (type) => {
    switch (type) {
      case "EMERGENCY":
        return <span className="badge badge-error">Emergency</span>;
      case "STANDARD":
        return <span className="badge badge-info">Standard</span>;
      default:
        return <span className="badge badge-warning">{type}</span>;
    }
  };

  return (
    <DashboardLayout title="Hospital Dashboard">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`stagger-${index + 1}`} style={{ animationDelay: `${index * 0.1}s` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Active Accesses Table */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Active Accesses</h2>
              <p className="text-sm text-text-secondary mt-1">
                Monitor all active patient record accesses in your hospital
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="text"
                  placeholder="Search doctor or patient..."
                  className="input pl-10 pr-4 py-2 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <select
                  className="input pl-10 pr-8 py-2 appearance-none cursor-pointer"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="EMERGENCY">Emergency</option>
                  <option value="STANDARD">Standard</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-text-secondary mt-2">Loading accesses...</p>
          </div>
        ) : filteredAccesses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No Active Accesses</h3>
            <p className="text-text-secondary max-w-sm mx-auto">
              {searchTerm || filterType !== "all" 
                ? "No accesses match your search criteria."
                : "There are currently no active patient record accesses."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Patient UID</th>
                  <th>Type</th>
                  <th>Started</th>
                  <th>Expires</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccesses.map((access, index) => (
                  <tr 
                    key={access.id || index}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                          {access.doctor?.name?.charAt(0) || "D"}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">
                            {access.doctor?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-text-muted">
                            {access.doctor?.doctorUid || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                        {access.patient?.healthUid || "N/A"}
                      </code>
                    </td>
                    <td>{getStatusBadge(access.type)}</td>
                    <td className="text-text-secondary">
                      {access.createdAt ? new Date(access.createdAt).toLocaleString() : "N/A"}
                    </td>
                    <td className="text-text-secondary">
                      {access.expiresAt ? new Date(access.expiresAt).toLocaleString() : "N/A"}
                    </td>
                    <td>
                      <span className="badge badge-success">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Footer */}
        {filteredAccesses.length > 0 && (
          <div className="px-6 py-4 border-t border-border bg-gray-50">
            <p className="text-sm text-text-secondary">
              Showing {filteredAccesses.length} of {accesses.length} active accesses
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

