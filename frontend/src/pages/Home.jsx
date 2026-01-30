import Navbar from "../components/Navbar";
import Stats from "../components/Stats";
import MedicalLottie from "../components/MedicalLottie";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        {/* LEFT */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            One Digital Health Identity
          </h1>

          <p className="mt-4 text-gray-600">
            HealthBridge securely connects patients, hospitals, and doctors
            using a single verified healthcare ID.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-secondary transition"
            >
              Create Health ID
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 border border-primary text-primary rounded-xl"
            >
              Login
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <MedicalLottie />
      </div>

      <Stats />
    </div>
  );
}