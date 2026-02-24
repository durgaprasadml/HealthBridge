import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { sendPatientLoginOtp } from "../services/api";
import { User, Loader2, ArrowLeft } from "lucide-react";

export default function PatientLogin() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setError("");
    let value = identifier.trim();

    if (!value) {
      setError("Health ID or phone number is required");
      return;
    }

    // Auto-add HB- prefix if not present and it's not a phone number
    if (!/^[6-9]\d{9}$/.test(value) && !value.startsWith("HB-")) {
      value = "HB-" + value.toUpperCase();
    }

    setLoading(true);
    try {
      const res = await sendPatientLoginOtp(value);

      if (res) {
        // identifier for verify step can be phone (sentTo) or original value
        const identifier = res.sentTo || value;
        navigate("/verify-otp", {
          state: { identifier, role: "PATIENT" },
        });
      } else {
        setError(res?.message || "Failed to send OTP. Please check your input.");
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendOtp();
    }
  };

  const handleIdentifierChange = (e) => {
    let value = e.target.value.toUpperCase();
    // Keep HB- prefix if user typed it
    if (!value.startsWith("HB-") && value.length > 0) {
      // Only add HB- if user hasn't deleted it and is typing alphanumeric
      if (!/^[6-9]$/.test(value.slice(-1))) {
        // Let them type freely
      }
    }
    setIdentifier(value);
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
          title="Patient Login"
          subtitle="Enter your Health ID or phone number to continue"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Health ID or Phone Number
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  className="input pl-10 font-mono"
                  placeholder="HB-XXXXXXX or 9876543210"
                  value={identifier}
                  onChange={handleIdentifierChange}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <p className="text-xs text-text-muted mt-1">Enter your unique ID (HB- is added automatically)</p>
            </div>

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="btn btn-primary w-full py-3"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>

            {error && (
              <p className="text-error text-sm text-center bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            <p className="text-center text-sm text-text-secondary mt-4">
              New patient?{" "}
              <button
                type="button"
                onClick={() => navigate("/register/patient")}
                className="text-primary-500 font-medium hover:underline"
              >
                Register for Health ID
              </button>
            </p>
          </div>
        </AuthCard>
      </div>
    </div>
  );
}
