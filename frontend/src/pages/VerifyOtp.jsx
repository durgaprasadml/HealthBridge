import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { verifyOtp } from "../services/api";
import { Shield, Lock, Loader2, ArrowLeft, CheckCircle } from "lucide-react";

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // after sending OTP pages now pass `identifier` (phone or UID) and `role` in state
  if (!state?.identifier) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-text-primary mb-2">Invalid Session</h2>
          <p className="text-text-secondary mb-4">Please start the login process again.</p>
          <button
            onClick={() => navigate("/login")}
            className="btn btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const submit = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await verifyOtp(state.identifier, otp, state.role);

      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.user.role);
        localStorage.setItem("userName", res.user.name || "User");

        if (res.user.role === "PATIENT") navigate("/patient");
        else if (res.user.role === "DOCTOR") navigate("/doctor");
        else if (res.user.role === "HOSPITAL") navigate("/hospital");
        else navigate("/redirect");
      } else {
        setError(res.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Go back
        </button>

        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 text-primary-500 mb-4">
              <Shield size={28} />
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Verify OTP</h2>
            <p className="text-text-secondary mt-2">
              Enter the 6-digit code sent to
            </p>
            <p className="font-medium text-text-primary mt-1">{state.identifier}</p>
          </div>

          {/* OTP Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Enter OTP
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  onKeyPress={handleKeyPress}
                  className="input pl-10 text-center text-2xl font-mono tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>
            </div>

            <button
              onClick={submit}
              disabled={loading || otp.length < 4}
              className="btn btn-primary w-full py-3"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Verify & Login
                </>
              )}
            </button>

            {error && (
              <p className="text-error text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            <div className="text-center">
              <p className="text-sm text-text-secondary">
                Didn't receive the code?{" "}
                <button className="text-primary-500 font-medium hover:underline">
                  Resend OTP
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

