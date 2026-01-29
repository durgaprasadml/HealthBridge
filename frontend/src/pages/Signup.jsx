import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5050";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // ⏱ Timer
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();

  // Only digits, max 10
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) setPhone(value);
  };

  /* ================= TIMER ================= */
  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    }

    if (timer === 0) {
      setCanResend(true);
    }
  }, [step, timer]);

  /* ================= SEND OTP ================= */
  const sendOtp = async (isResend = false) => {
    setMessage("");

    if (!name.trim()) {
      setMessage("Please enter your name");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setMessage("Phone number must be 10 digits");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/auth/signup/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone }),
      }).then((r) => r.json());

      if (res.message?.includes("OTP sent")) {
        setStep(2);
        setTimer(30);
        setCanResend(false);
        setMessage(isResend ? "OTP resent" : `OTP sent to ${phone}`);
      } else {
        setMessage(res.message || "Failed to send OTP");
      }
    } catch {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async () => {
    setMessage("");

    if (!otp) {
      setMessage("Please enter OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/auth/signup/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone,
          otp,
        }),
      }).then((r) => r.json());

      if (res.user) {
        setResult(res.user);
        setStep(3);
      } else {
        setMessage(res.message || "Invalid OTP");
      }
    } catch {
      setMessage("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create HealthBridge Account</h2>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Phone Number (10 digits)"
            value={phone}
            onChange={handlePhoneChange}
          />

          <button onClick={() => sendOtp()} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <p>OTP sent to {phone}</p>

          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button onClick={verifyOtp} disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          {!canResend ? (
            <p style={{ marginTop: "8px" }}>
              Resend OTP in <strong>{timer}s</strong>
            </p>
          ) : (
            <p
              style={{ color: "blue", cursor: "pointer", marginTop: "8px" }}
              onClick={() => sendOtp(true)}
            >
              Resend OTP
            </p>
          )}
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && result && (
        <>
          <p>Your HealthBridge UID:</p>
          <strong>{result.healthUid}</strong>

          <p
            style={{ color: "blue", cursor: "pointer", marginTop: "10px" }}
            onClick={() => navigate("/")}
          >
            Go to Login
          </p>
        </>
      )}

      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}