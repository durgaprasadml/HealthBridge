import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT SECTION */}
        <div>
          <h1 className="text-4xl font-bold text-primary mb-4">
            HealthBridge
          </h1>

          <p className="text-gray-700 text-lg mb-6">
            A secure digital bridge between patients, doctors, and hospitals.
          </p>

          <ul className="space-y-3 text-gray-600">
            <li>✔ One unique Health UID for life</li>
            <li>✔ Secure OTP-based login</li>
            <li>✔ Hospital & doctor controlled access</li>
            <li>✔ Privacy-first medical records</li>
          </ul>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-secondary transition"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="border border-primary text-primary px-6 py-2 rounded hover:bg-primary hover:text-white transition"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-primary mb-4">
            Platform Statistics
          </h3>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-background p-4 rounded">
              <p className="text-2xl font-bold text-primary">1,248</p>
              <p className="text-sm text-gray-600">Registered Users</p>
            </div>

            <div className="bg-background p-4 rounded">
              <p className="text-2xl font-bold text-primary">38</p>
              <p className="text-sm text-gray-600">Hospitals</p>
            </div>

            <div className="bg-background p-4 rounded">
              <p className="text-2xl font-bold text-primary">214</p>
              <p className="text-sm text-gray-600">Doctors</p>
            </div>

            <div className="bg-background p-4 rounded">
              <p className="text-2xl font-bold text-primary">99.9%</p>
              <p className="text-sm text-gray-600">Uptime</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}