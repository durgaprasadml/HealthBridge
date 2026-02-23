import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { Building2, Lock, Loader2, ArrowLeft } from "lucide-react";
import { loginHospital } from "../services/api";

export default function HospitalLogin() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("Hospital ID/email/phone and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await loginHospital(identifier, password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", "HOSPITAL");
      localStorage.setItem("userName", res.hospital?.name || "Hospital");
      navigate("/hospital");
    } catch (err) {
      setError(err.message || "Hospital login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
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
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to role selection
        </button>

        <AuthCard
          title="Hospital Login"
          subtitle="Enter your hospital credentials to continue"
        >
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Hospital ID / Email / Phone
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  className="input pl-10 font-mono"
                  placeholder="HOSP-XXXXXX or admin@hospital.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  type="password"
                  className="input pl-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {error && (
              <p className="text-error text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            <p className="text-center text-sm text-text-secondary mt-4">
              Register your hospital{" "}
              <button
                type="button"
                onClick={() => navigate("/register/hospital")}
                className="text-primary-500 font-medium hover:underline"
              >
                here
              </button>
            </p>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
