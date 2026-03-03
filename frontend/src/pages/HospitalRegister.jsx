import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { ArrowLeft, Loader2, Mail, Phone, Building2, User, Lock } from "lucide-react";
import { registerHospital } from "../services/api";

export default function HospitalRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hospitalName: "",
    location: "",
    adminName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.hospitalName.trim() || !formData.location.trim() || !formData.adminName.trim()) {
      setError("Hospital name, location, and admin name are required");
      return;
    }

    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      setError("Enter a valid 10-digit phone number");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await registerHospital({
        name: formData.hospitalName.trim(),
        location: formData.location.trim(),
        adminName: formData.adminName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      localStorage.setItem("token", res.token);
      localStorage.setItem("role", "HOSPITAL");
      localStorage.setItem("userName", res.hospital?.name || "Hospital");

      setLoading(false);
      setSuccess(`Hospital registered. Your Hospital ID: ${res.hospital?.hospitalUid || "generated"}`);
      setTimeout(() => navigate("/hospital"), 700);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <button
          onClick={() => navigate("/login/hospital")}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to hospital login
        </button>

        <AuthCard
          title="Hospital Registration"
          subtitle="Register your hospital in HealthBridge"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                className="input pl-10"
                placeholder="Hospital Name"
                value={formData.hospitalName}
                onChange={(e) => handleChange("hospitalName", e.target.value)}
              />
            </div>

            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                className="input pl-10"
                placeholder="Hospital Location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                className="input pl-10"
                placeholder="Admin Name"
                value={formData.adminName}
                onChange={(e) => handleChange("adminName", e.target.value)}
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                type="tel"
                className="input pl-10"
                placeholder="Contact Phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                type="email"
                className="input pl-10"
                placeholder="Official Email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                type="password"
                className="input pl-10"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                type="password"
                className="input pl-10"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
              />
            </div>

            {error && <p className="text-error text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>}
            {success && <p className="text-success text-sm text-center bg-emerald-50 p-3 rounded-lg">{success}</p>}

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Register Hospital"
              )}
            </button>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
