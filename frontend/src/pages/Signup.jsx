import { useState } from "react";
import { signup } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Allow only digits & max 10 characters
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  async function handleSignup() {
    setError("");
    setResult(null);

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    try {
      setLoading(true);
      const res = await signup(name.trim(), phone);

      if (res?.user) {
        setResult(res);
      } else {
        setError(res.message || "Signup failed");
      }
    } catch (err) {
      setError("Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Create HealthBridge Account</h2>

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

      <button onClick={handleSignup} disabled={loading}>
        {loading ? "Creating..." : "Create Account"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result?.user && (
        <div style={{ marginTop: "12px" }}>
          <p>Your HealthBridge UID:</p>
          <strong>{result.user.healthUid}</strong>

          <p
            style={{ color: "blue", cursor: "pointer", marginTop: "10px" }}
            onClick={() => navigate("/")}
          >
            Go to Login
          </p>
        </div>
      )}
    </div>
  );
}