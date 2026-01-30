import { useState } from "react";
import { signupSendOtp } from "../services/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) setPhone(value);
  };

  const handleSignup = async () => {
    setMessage("");

    if (!name.trim()) {
      setMessage("Name is required");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setMessage("Phone must be 10 digits");
      return;
    }

    const res = await signupSendOtp(name.trim(), phone);

    if (res?.message?.includes("OTP sent")) {
      setMessage("OTP sent to your phone");
    } else {
      setMessage(res.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-primary mb-4 text-center">
          Create HealthBridge Account
        </h2>

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
          onClick={handleSignup}
          className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition"
        >
          Send OTP
        </button>

        {message && (
          <p className="text-sm text-center text-red-600 mt-4">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}