import { useEffect, useState } from "react";
import { getProfile } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    getProfile(token).then((res) => {
      if (res?.user) setUser(res.user);
      else navigate("/");
    });
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-primary mb-6">
        My Profile
      </h2>

      <div className="space-y-3 text-sm">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Role:</strong> {user.role}</p>

        <div className="mt-4 bg-background p-3 rounded">
          <p className="text-xs text-gray-600">
            HealthBridge UID
          </p>
          <p className="font-mono text-primary text-lg">
            {user.healthUid}
          </p>
        </div>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
        className="w-full mt-6 bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}