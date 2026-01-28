import { useState } from "react";
import { sendLoginOtp } from "../services/api";

export default function Login({ onOtpSent }) {
  const [healthUid, setHealthUid] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOtp = async () => {
    const res = await sendLoginOtp(healthUid);
    if (res.message) {
      setMessage(res.message);
      onOtpSent();
    }
  };

  return (
    <div>
      <h2>Login to HealthBridge</h2>

      <input
        placeholder="HealthBridge UID"
        value={healthUid}
        onChange={(e) => setHealthUid(e.target.value)}
      />

      <button onClick={handleSendOtp}>Send OTP</button>

      <p>{message}</p>
    </div>
  );
}
