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
      const res = await sendLoginOtp(value);

      if (res?.message?.includes("OTP sent")) {
        // ✅ IMPORTANT FIX: pass phone returned by backend
        navigate("/verify-otp", {
          state: {
            phone: res.sentTo,
          },
        });
      } else {
        setMessage(res.message || "Failed to send OTP");
      }
    } catch {
      setMessage("Server error. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md bg-white p-8 rounded-xl shadow-md w-full">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Welcome to HealthBridge
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Login using UID or registered phone number
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
      </div>
    </div>
  );
}