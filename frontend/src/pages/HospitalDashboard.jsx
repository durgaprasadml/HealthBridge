import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatsCard";
import { Search, Users, Clock, Shield, AlertCircle, UserPlus, Loader2, Building2, X } from "lucide-react";
import { createDoctor, getHospitalActiveAccess, getHospitalDoctors, getHospitalProfile } from "../services/api";
import toast from "react-hot-toast";

export default function HospitalDashboard() {
  const [accesses, setAccesses] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [createLoading, setCreateLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      const [accessData, doctorData, hospitalData] = await Promise.all([
        getHospitalActiveAccess(token),
        getHospitalDoctors(token),
        getHospitalProfile(token),
      ]);
      setAccesses(accessData.activeAccesses || []);
      setDoctors(doctorData.doctors || []);
      setHospital(hospitalData.hospital || null);
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

    if (!formData.name.trim() || !formData.phone.trim() || !formData.password) {
      toast.error("Name, phone and password are required");
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

      toast.success(`Doctor created successfully! UID: ${res.doctor?.doctorUid}`);
      setFormData({ name: "", phone: "", specialization: "", password: "" });
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      toast.error(err.message || "Failed to create doctor");
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
      {/* Hospital Info Header */}
      {hospital && (
        <div className="glass bg-gradient-to-r from-primary-600/90 to-primary-800/90 rounded-2xl p-8 mb-8 text-white shadow-xl shadow-primary-500/20 border-white/20 animate-slide-down">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
                <Building2 size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">{hospital.name}</h2>
                <p className="text-primary-100/90 font-medium">{hospital.location}</p>
              </div>
            </div>
            <div className="flex bg-white/10 backdrop-blur-md rounded-xl px-5 py-3 border border-white/10 relative overflow-hidden group items-center justify-between gap-6">
              <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors"></div>
              <div className="relative z-10">
                <p className="text-xs text-primary-200 uppercase tracking-widest font-bold mb-1">Hospital ID</p>
                <p className="text-xl font-mono font-bold tracking-wider">{hospital.hospitalUid || "N/A"}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 transition-all font-medium flex items-center gap-2 shadow-sm whitespace-nowrap relative z-10 py-2.5"
              >
                <UserPlus size={18} />
                Add Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Doctor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" style={{ animation: "fadeIn 0.2s ease-out" }}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold flex items-center gap-2 text-text-primary">
                <UserPlus size={22} className="text-primary-600" />
                Create Doctor Profile
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-primary transition">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateDoctor} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Doctor Name *</label>
                <input
                  className="input w-full"
                  placeholder="e.g. Dr. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Phone Number *</label>
                <input
                  className="input w-full"
                  placeholder="10-digit mobile"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Specialization</label>
                <input
                  className="input w-full"
                  placeholder="e.g. Cardiologist"
                  value={formData.specialization}
                  onChange={(e) => setFormData((prev) => ({ ...prev, specialization: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Initial Password *</label>
                <input
                  type="password"
                  className="input w-full"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={createLoading} className="btn btn-primary flex-1">
                  {createLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin inline mr-2" /> Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`stagger-${index + 1}`} style={{ animationDelay: `${index * 0.1}s` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">

        <div className="glass-panel overflow-hidden border border-white/60 shadow-xl">
          <div className="p-6 border-b border-border/50 bg-white/40">
            <h2 className="text-lg font-semibold text-text-primary">Doctors</h2>
            <p className="text-sm text-text-secondary mt-1">Doctors created by your hospital</p>
          </div>
          {loading ? (
            <div className="p-8 text-center text-text-secondary">Loading doctors...</div>
          ) : doctors.length === 0 ? (
            <div className="p-8 text-center text-text-secondary">No doctors created yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 overflow-y-auto max-h-[500px]">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:border-primary-200 transition bg-gray-50/50">
                  <div>
                    <h3 className="font-semibold text-text-primary text-lg">{doctor.name}</h3>
                    <p className="text-sm text-primary-600 font-medium mb-1">{doctor.specialization || "General"}</p>
                    <p className="text-xs text-text-secondary flex items-center gap-1"><Shield size={12} /> {doctor.doctorUid}</p>
                  </div>
                  <div className="bg-white shadow-sm border border-gray-100 rounded-lg px-3 py-2 text-center">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold mb-1">Phone</p>
                    <p className="text-sm font-mono text-text-primary">{doctor.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="glass-panel overflow-hidden border border-white/60 shadow-xl">
        <div className="p-6 border-b border-border/50 bg-white/40">
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
