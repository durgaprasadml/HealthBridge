import { useEffect, useState } from "react";
import { getProfile } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    getProfile(token).then((res) => {
      if (res?.user) setUser(res.user);
      else navigate("/");
    });
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-2xl bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Patient Profile
      </h2>

      <div className="space-y-3 text-gray-700">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>HealthBridge UID:</strong></p>
        <p className="font-mono text-lg text-primary">
          {user.healthUid}
        </p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      <button
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
}