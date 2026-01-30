import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyLoginOtp, sendLoginOtp } from "../services/api";

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const phone = state?.phone;

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (!phone) navigate("/login");
  }, [phone, navigate]);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    setMessage("");

    if (!otp) {
      setMessage("OTP required");
      return;
    }

    const res = await verifyLoginOtp(phone, otp);

    if (res?.token) {
      localStorage.setItem("token", res.token);
      navigate("/profile");
    } else {
      setMessage(res.message || "Invalid OTP");
    }
  };

  const resendOtp = async () => {
    await sendLoginOtp(phone);
    setTimer(30);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold text-primary mb-4">Verify OTP</h2>

        <input
          className="w-full border rounded px-4 py-2 mb-4"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={handleVerify}
          className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition"
        >
          Verify OTP
        </button>

        {message && (
          <p className="text-red-600 text-sm mt-4">{message}</p>
        )}

        <div className="text-center mt-4 text-sm text-gray-600">
          {timer > 0 ? (
            <>Resend OTP in {timer}s</>
          ) : (
            <button
              onClick={resendOtp}
              className="text-primary font-medium"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}