import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyLoginOtp, sendLoginOtp } from "../services/api";

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const identifier = state?.identifier;

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  // 🔁 Countdown timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  if (!identifier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-red-600">Invalid access. Please login again.</p>
          <button
            className="mt-4 text-primary underline"
            onClick={() => navigate("/")}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const isPhone = /^[6-9]\d{9}$/.test(identifier);

  const handleVerify = async () => {
    setMessage("");

    if (otp.length !== 6) {
      setMessage("Enter valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyLoginOtp(
        isPhone ? identifier : state.phone,
        otp
      );

      if (res?.token) {
        localStorage.setItem("token", res.token);
        navigate("/profile");
      } else {
        setMessage(res.message || "Invalid OTP");
      }
    } catch {
      setMessage("Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setMessage("");
    setTimer(30);

    try {
      await sendLoginOtp(identifier);
      setMessage("OTP resent successfully");
    } catch {
      setMessage("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-primary mb-2">
          Verify OTP
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          OTP sent to {identifier}
        </p>

        <input
          className="w-full border rounded px-4 py-2 mb-4"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* 🔁 RESEND OTP */}
        <div className="text-center mt-4 text-sm">
          {timer > 0 ? (
            <p className="text-gray-500">
              Resend OTP in <span className="font-medium">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-primary font-medium hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>

        {message && (
          <p className="text-red-600 text-sm mt-4">{message}</p>
        )}
      </div>
    </div>
  );
}