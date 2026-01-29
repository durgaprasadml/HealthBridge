import { useState } from "react";
import { signupSendOtp, signupVerifyOtp } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [step, setStep] = useState(1); // 1 = send OTP, 2 = verify OTP
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Allow only digits, max 10
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) setPhone(value);
  };

  /* ================= STEP 1: SEND OTP ================= */
  const handleSendOtp = async () => {
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Phone number must be 10 digits");
      return;
    }

    try {
      setLoading(true);
      const res = await signupSendOtp(name.trim(), phone);
      setLoading(false);

      if (res.message?.includes("OTP sent")) {
        setStep(2);
      } else {
        setError(res.message || "Failed to send OTP");
      }
    } catch {
      setLoading(false);
      setError("Failed to send OTP");
    }
  };

  /* ================= STEP 2: VERIFY OTP ================= */
  const handleVerifyOtp = async () => {
    setError("");

    if (!otp || otp.length !== 6) {
      setError("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await signupVerifyOtp(name.trim(), phone, otp);
      setLoading(false);

      if (res.user) {
        setResult(res);
      } else {
        setError(res.message || "Invalid OTP");
      }
    } catch {
      setLoading(false);
      setError("Signup failed");
    }
  };

  return (
    <div className="max-w-md bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-4">
        Create HealthBridge Account
      </h2>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <input
            className="w-full border rounded px-4 py-2 mb-4"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border rounded px-4 py-2 mb-4"
            placeholder="Phone Number"
            value={phone}
            onChange={handlePhoneChange}
          />

          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <p className="text-sm text-gray-600 mb-2">
            OTP sent to <strong>{phone}</strong>
          </p>

          <input
            className="w-full border rounded px-4 py-2 mb-4"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />

          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition"
          >
            {loading ? "Verifying..." : "Verify & Create Account"}
          </button>
        </>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {result?.user && (
        <div className="mt-6 bg-background p-4 rounded">
          <p className="text-sm text-gray-700">Your HealthBridge UID</p>
          <p className="font-mono text-lg text-primary">
            {result.user.healthUid}
          </p>

          <p
            className="mt-4 text-primary cursor-pointer font-medium"
            onClick={() => navigate("/")}
          >
            Go to Login →
          </p>
        </div>
      )}
    </div>
  );
}