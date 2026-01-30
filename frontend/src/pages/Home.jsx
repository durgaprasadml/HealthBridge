import Navbar from "../components/Navbar";
import MedicalLottie from "../components/MedicalLottie";
import Stats from "../components/Stats";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="flex flex-col md:flex-row items-center justify-between px-16 py-20 gap-16">
        {/* LEFT */}
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Get Quick <br />
            <span className="text-primary">Medical Services</span>
          </h1>

          <p className="text-gray-600 mt-6">
            HealthBridge provides a secure digital healthcare identity
            for patients, doctors, and hospitals — all in one platform.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary"
            >
              Get Started
            </button>
            <button className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white">
              Learn More
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <MedicalLottie />
      </section>

      {/* STATS */}
      <div className="px-16 pb-20">
        <Stats />
      </div>
    </div>
  );
}