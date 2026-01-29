import { useState } from "react";
import { sendLoginOtp } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const isPhone = (v) => /^[6-9]\d{9}$/.test(v);
  const isUid = (v) => /^HB-[A-Z0-9]{8}$/.test(v);

  const handleSendOtp = async () => {
    setMessage("");
    const value = identifier.trim().toUpperCase();

    if (!isPhone(value) && !isUid(value)) {
      setMessage("Enter valid HealthBridge UID or phone number");
      return;
    }

    try {
      // ✅ SEND STRING ONLY
      const res = await sendLoginOtp(value);

      if (res?.message?.includes("OTP sent")) {
        navigate("/verify-otp", { state: { identifier: value } });
      } else {
        setMessage(res.message || "Failed to send OTP");
      }
    } catch (err) {
      setMessage("Server error. Please try again.");
    }
  };

  return (
    <div className="max-w-md bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-2">
        Welcome to HealthBridge
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Login using your UID or registered phone number
      </p>

      <input
        className="w-full border rounded px-4 py-2 mb-4"
        placeholder="HealthBridge UID or Phone"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />

      <button
        onClick={handleSendOtp}
        className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition"
      >
        Send OTP
      </button>

      {message && (
        <p className="text-red-600 text-sm mt-4">{message}</p>
      )}

      <p className="text-sm mt-6">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-primary cursor-pointer font-medium"
        >
          Sign up
        </span>
      </p>
    </div>
  );
}