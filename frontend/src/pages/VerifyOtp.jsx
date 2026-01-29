import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyLoginOtp, sendLoginOtp } from "../services/api";

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const identifier = state?.identifier;

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (!identifier) navigate("/");
  }, [identifier, navigate]);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    const res = await verifyLoginOtp(identifier, otp);

    if (res?.token) {
      localStorage.setItem("token", res.token);
      navigate("/profile");
    } else {
      setMessage(res.message || "Invalid OTP");
    }
  };

  const resendOtp = async () => {
    await sendLoginOtp(identifier);
    setTimer(30);
    setMessage("OTP resent");
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-primary mb-2">
        Verify OTP
      </h2>

      <p className="text-gray-600 text-sm mb-6">
        Enter the OTP sent to your registered phone
      </p>

      <input
        className="w-full border rounded px-4 py-2 mb-4 text-center tracking-widest"
        placeholder="Enter 6-digit OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
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

      <div className="text-center mt-6 text-sm">
        {timer > 0 ? (
          <span className="text-gray-500">
            Resend OTP in {timer}s
          </span>
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
  );
}