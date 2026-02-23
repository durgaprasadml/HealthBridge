import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatsCard";
import { Search, Users, Clock, Shield, AlertCircle, UserPlus, Loader2 } from "lucide-react";
import { createDoctor, getHospitalActiveAccess, getHospitalDoctors } from "../services/api";

export default function HospitalDashboard() {
  const [accesses, setAccesses] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    specialization: "",
    password: "",
  });

  const token = localStorage.getItem("token");

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [accessData, doctorData] = await Promise.all([
        getHospitalActiveAccess(token),
        getHospitalDoctors(token),
      ]);
      setAccesses(accessData.activeAccesses || []);
      setDoctors(doctorData.doctors || []);
    } catch {
      setAccesses([]);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    setCreateError("");
    setCreateSuccess("");

    if (!formData.name.trim() || !formData.phone.trim() || !formData.password) {
      setCreateError("Name, phone and password are required");
      return;
    }

    setCreateLoading(true);
    try {
      const res = await createDoctor(token, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        specialization: formData.specialization.trim(),
        password: formData.password,
      });

      setCreateSuccess(`Doctor created. UID: ${res.doctor?.doctorUid}`);
      setFormData({ name: "", phone: "", specialization: "", password: "" });
      await loadData();
    } catch (err) {
      setCreateError(err.message || "Failed to create doctor");
    } finally {
      setCreateLoading(false);
    }
  };

  const filteredAccesses = accesses.filter((access) => {
    const matchesSearch =
      access.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      access.patient?.healthUid?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || access.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    { title: "Doctors", value: doctors.length, icon: Users, color: "primary" },
    { title: "Active Accesses", value: accesses.length, icon: Shield, color: "success" },
    { title: "Emergency", value: accesses.filter((a) => a.type === "EMERGENCY").length, icon: AlertCircle, color: "error" },
    { title: "Standard", value: accesses.filter((a) => a.type === "STANDARD").length, icon: Clock, color: "info" },
  ];

  return (
    <DashboardLayout title="Hospital Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`stagger-${index + 1}`} style={{ animationDelay: `${index * 0.1}s` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-card p-6 xl:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus size={20} className="text-primary-600" />
            <h2 className="text-lg font-semibold text-text-primary">Create Doctor Account</h2>
          </div>

          <form onSubmit={handleCreateDoctor} className="space-y-3">
            <input
              className="input"
              placeholder="Doctor name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />
            <input
              className="input"
              placeholder="Phone number"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
            />
            <input
              className="input"
              placeholder="Specialization (optional)"
              value={formData.specialization}
              onChange={(e) => setFormData((prev) => ({ ...prev, specialization: e.target.value }))}
            />
            <input
              type="password"
              className="input"
              placeholder="Temporary password"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            />

            {createError && <p className="text-sm text-error bg-red-50 p-2 rounded-lg">{createError}</p>}
            {createSuccess && <p className="text-sm text-success bg-emerald-50 p-2 rounded-lg">{createSuccess}</p>}

            <button type="submit" disabled={createLoading} className="btn btn-primary w-full">
              {createLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Creating...
                </>
              ) : (
                "Create Doctor"
              )}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-card overflow-hidden xl:col-span-2">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-text-primary">Doctors</h2>
            <p className="text-sm text-text-secondary mt-1">Doctors created by your hospital</p>
          </div>
          {loading ? (
            <div className="p-8 text-center text-text-secondary">Loading doctors...</div>
          ) : doctors.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">No doctors created yet.</div>
          ) : (
            <div className="divide-y divide-border max-h-80 overflow-y-auto">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-primary">{doctor.name}</p>
                    <p className="text-sm text-text-secondary">{doctor.specialization || "General"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm text-text-primary">{doctor.doctorUid}</p>
                    <p className="text-xs text-text-secondary">{doctor.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Active Accesses</h2>
              <p className="text-sm text-text-secondary mt-1">Monitor active patient record accesses</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
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

              <select
                className="input py-2"
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

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-text-secondary mt-2">Loading accesses...</p>
          </div>
        ) : filteredAccesses.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="text-lg font-semibold text-text-primary mb-2">No Active Accesses</h3>
            <p className="text-text-secondary max-w-sm mx-auto">
              {searchTerm || filterType !== "all" ? "No accesses match your search." : "There are currently no active accesses."}
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
                </tr>
              </thead>
              <tbody>
                {filteredAccesses.map((access) => (
                  <tr key={access.id}>
                    <td>
                      <p className="font-medium text-text-primary">{access.doctor?.name || "Unknown"}</p>
                      <p className="text-xs text-text-muted">{access.doctor?.doctorUid || "N/A"}</p>
                    </td>
                    <td>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{access.patient?.healthUid || "N/A"}</code>
                    </td>
                    <td>
                      <span className={`badge ${access.type === "EMERGENCY" ? "badge-error" : "badge-info"}`}>
                        {access.type}
                      </span>
                    </td>
                    <td className="text-text-secondary">{access.createdAt ? new Date(access.createdAt).toLocaleString() : "N/A"}</td>
                    <td className="text-text-secondary">{access.expiresAt ? new Date(access.expiresAt).toLocaleString() : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
