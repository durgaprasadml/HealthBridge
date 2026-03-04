import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { verifyPatientLoginOtp, verifyDoctorLoginOtp, sendPatientLoginOtp, sendDoctorLoginOtp } from "../services/api";
import { Shield, Lock, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // after sending OTP pages now pass `identifier` (phone or UID) and `role` in state
  if (!state?.identifier) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="text-center glass-panel p-8">
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
      toast.error("Please enter the OTP");
      return;
    }

    setLoading(true);

    try {
      const res =
        state.role === "DOCTOR"
          ? await verifyDoctorLoginOtp(state.identifier, otp)
          : await verifyPatientLoginOtp(state.identifier, otp);

      if (res.token) {
        localStorage.setItem("token", res.token);
        const role = res.user?.role || state.role || "PATIENT";
        localStorage.setItem("role", role);
        localStorage.setItem("userName", res.user?.name || res.doctor?.name || "User");

        toast.success("Verification successful!");
        if (role === "PATIENT") navigate("/patient");
        else if (role === "DOCTOR") navigate("/doctor");
        else if (role === "HOSPITAL") navigate("/hospital");
        else navigate("/redirect");
      } else {
        toast.error(res.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      if (state.role === "DOCTOR") {
        await sendDoctorLoginOtp(state.identifier);
      } else {
        await sendPatientLoginOtp(state.identifier);
      }
      toast.success("OTP resent successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to resend OTP");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[30rem] h-[30rem] bg-primary-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Go back
        </button>

        <div className="glass-panel p-6 md:p-8 relative overflow-hidden shadow-xl animate-scale-in">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-emerald-400 z-20"></div>
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 text-white mb-4 shadow-lg shadow-primary-500/30">
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

            <div className="text-center">
              <p className="text-sm text-text-secondary">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-primary-500 font-medium hover:underline"
                >
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
