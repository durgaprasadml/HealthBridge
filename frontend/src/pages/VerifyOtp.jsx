import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyLoginOtp } from "../services/api";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone;

  useEffect(() => {
    if (!phone) {
      navigate("/");
    }
  }, [phone, navigate]);

  const handleVerify = async () => {
    if (!otp) {
      setMessage("OTP is required");
      return;
    }

    try {
      const res = await verifyLoginOtp(phone, otp);

      if (res.token) {
        localStorage.setItem("token", res.token);
        navigate("/profile");
      } else {
        setMessage(res.message || "Invalid OTP");
      }
    } catch (err) {
      setMessage("OTP verification failed");
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <p>OTP sent to registered phone number</p>

      <input
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />

      <button onClick={handleVerify}>Verify OTP</button>

      {message && <p>{message}</p>}
    </div>
  );
}