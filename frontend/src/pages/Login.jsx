import { useState } from "react";
import { sendLoginOtp } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const isPhone = (v) => /^[6-9]\d{9}$/.test(v);
  const isUid = (v) => /^HB-[A-Z0-9]+$/.test(v);

  const handleSendOtp = async () => {
    setMessage("");

    const value = identifier.trim().toUpperCase();

    if (!isPhone(value) && !isUid(value)) {
      setMessage("Enter a valid HealthBridge UID or phone number");
      return;
    }

    try {
      // ✅ SEND STRING ONLY
      const res = await sendLoginOtp(value);

      if (res?.message === "OTP sent") {
        navigate("/verify-otp", {
          state: { phone: res.sentTo },
        });
      } else {
        setMessage(res.message || "Invalid UID or phone number");
      }
    } catch (err) {
      setMessage("Failed to send OTP. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login to HealthBridge</h2>

      <input
        placeholder="HealthBridge UID or Phone number"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />

      <button onClick={handleSendOtp}>Send OTP</button>

      {message && <p style={{ color: "red" }}>{message}</p>}

      <p>
        Don&apos;t have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/signup")}
        >
          Sign up
        </span>
      </p>
    </div>
  );
}