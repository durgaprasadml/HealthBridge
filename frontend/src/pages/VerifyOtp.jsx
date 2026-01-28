import { useState } from "react";
import { verifyLoginOtp } from "../services/api";

export default function VerifyOtp({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    const res = await verifyLoginOtp(phone, otp);

    if (res.token) {
      localStorage.setItem("token", res.token);
      onLogin();
    } else {
      setError("Invalid OTP");
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>

      <input
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        placeholder="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={handleVerify}>Verify</button>

      <p>{error}</p>
    </div>
  );
}
