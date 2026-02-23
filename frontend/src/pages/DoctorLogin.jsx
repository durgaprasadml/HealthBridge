import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { sendDoctorLoginOtp, loginDoctorWithPassword } from "../services/api";
import { Stethoscope, Loader2, ArrowLeft, Lock } from "lucide-react";

export default function DoctorLogin() {
  const [doctorUid, setDoctorUid] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("OTP");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setError("");

    if (!doctorUid.trim()) {
      setError("Doctor UID is required");
      return;
    }

    setLoading(true);
    try {
      const uid = doctorUid.trim().toUpperCase();
      const res = await sendDoctorLoginOtp(uid);

      if (res) {
        // doctor endpoint doesn't return sentTo, so just pass the UID
        navigate("/verify-otp", {
          state: {
            identifier: uid,
            role: "DOCTOR",
          },
        });
      } else {
        setError(res?.message || "Failed to send OTP. Please check your Doctor UID.");
      }
    } catch (err) {
      setError(err.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    setError("");
    if (!doctorUid.trim() || !password) {
      setError("Doctor UID and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await loginDoctorWithPassword(doctorUid, password);
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", "DOCTOR");
      localStorage.setItem("userName", res.doctor?.name || "Doctor");
      navigate("/doctor");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (mode === "OTP") handleSendOtp();
      else handlePasswordLogin();
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
          title="Doctor Login"
          subtitle="Login using OTP or password"
        >
          <div className="space-y-4">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setMode("OTP")}
                className={`flex-1 py-2 text-sm rounded-md ${mode === "OTP" ? "bg-white shadow text-primary-600" : "text-text-secondary"}`}
              >
                OTP
              </button>
              <button
                type="button"
                onClick={() => setMode("PASSWORD")}
                className={`flex-1 py-2 text-sm rounded-md ${mode === "PASSWORD" ? "bg-white shadow text-primary-600" : "text-text-secondary"}`}
              >
                Password
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Doctor UID
              </label>
              <div className="relative">
                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  className="input pl-10 font-mono"
                  placeholder="DOC-XXXXX"
                  value={doctorUid}
                  onChange={(e) => setDoctorUid(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            {mode === "PASSWORD" && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                  <input
                    type="password"
                    className="input pl-10"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>
            )}

            <button
              onClick={mode === "OTP" ? handleSendOtp : handlePasswordLogin}
              disabled={loading}
              className="btn btn-primary w-full py-3"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Please wait...
                </>
              ) : (
                mode === "OTP" ? "Send OTP" : "Login"
              )}
            </button>

            {error && (
              <p className="text-error text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            <p className="text-center text-sm text-text-secondary mt-4">
              New doctor?{" "}
              <button
                type="button"
                onClick={() => navigate("/register/doctor")}
                className="text-primary-500 font-medium hover:underline"
              >
                Register here
              </button>
            </p>

            <p className="text-center text-sm text-text-secondary mt-4">
              If your hospital already created your account, use your Doctor UID to sign in.
            </p>
          </div>
        </AuthCard>
      </div>
    </div>
  );
}
