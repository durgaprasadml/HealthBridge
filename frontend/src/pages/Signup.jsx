import { useState } from "react";
import { signupSendOtp, signupVerifyOtp } from "../services/api";
import AuthLayout from "../components/AuthLayout";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) setPhone(value);
  };

  const sendOtp = async () => {
    setError("");
    const res = await signupSendOtp(name.trim(), phone);
    if (res.message?.includes("OTP")) setStep(2);
    else setError(res.message || "Failed to send OTP");
  };

  const verifyOtp = async () => {
    setError("");
    const res = await signupVerifyOtp(name.trim(), phone, otp);
    if (res?.user) setResult(res);
    else setError(res.message || "Invalid OTP");
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-primary mb-4">
        Create HealthBridge Account
      </h2>

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
            placeholder="Phone Number (10 digits)"
            value={phone}
            onChange={handlePhoneChange}
          />

          <button
            onClick={sendOtp}
            className="w-full bg-primary text-white py-2 rounded"
          >
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            className="w-full border rounded px-4 py-2 mb-4"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            onClick={verifyOtp}
            className="w-full bg-primary text-white py-2 rounded"
          >
            Verify & Create Account
          </button>
        </>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {result?.user && (
        <div className="mt-6 bg-background p-4 rounded text-center">
          <p className="text-sm">Your HealthBridge UID</p>
          <p className="font-mono text-lg text-primary">
            {result.user.healthUid}
          </p>

          <p
            className="mt-4 text-primary cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Go to Login →
          </p>
        </div>
      )}
    </AuthLayout>
  );
}