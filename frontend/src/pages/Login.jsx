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
      setMessage("Enter valid HealthBridge UID or 10-digit phone number");
      return;
    }

    const res = await sendLoginOtp(value);

    if (res?.message?.includes("OTP sent")) {
      navigate("/verify-otp", {
        state: { identifier: value },
      });
    } else {
      setMessage(res.message || "Failed to send OTP");
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-primary mb-2">
        Login to HealthBridge
      </h2>

      <p className="text-gray-600 text-sm mb-6">
        Enter your HealthBridge UID or registered phone number
      </p>

      <input
        className="w-full border rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="HB-XXXXXXXX or Phone Number"
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

      <p className="text-sm mt-6 text-center">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-primary cursor-pointer font-medium"
        >
          Create one
        </span>
      </p>
    </div>
  );
}