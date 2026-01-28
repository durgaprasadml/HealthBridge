import { useState } from "react";
import { signup } from "../services/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function handleSignup() {
    setError("");
    setResult(null);

    if (!name || !phone) {
      setError("Please enter name and phone number");
      return;
    }

    try {
      setLoading(true);
      const res = await signup({ name, phone });
      setResult(res);
    } catch (err) {
      setError("Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Create HealthBridge Account
      </h2>

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded mb-3"
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "Creating..." : "Create Account"}
      </button>

      {error && (
        <p className="text-red-600 text-sm mt-3">{error}</p>
      )}

      {result?.user && (
        <div className="mt-4 bg-blue-50 p-3 rounded">
          <p className="text-sm text-gray-700">
            Your HealthBridge UID:
          </p>
          <p className="font-mono text-blue-700 text-lg">
            {result.user.healthUid}
          </p>
        </div>
      )}
    </div>
  );
}
