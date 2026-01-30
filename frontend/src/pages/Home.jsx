import Navbar from "../components/Navbar";
import MedicalLottie from "../components/MedicalLottie";
import Stats from "../components/Stats";
import About from "../components/About";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Navbar />

      {/* HERO SECTION */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-16 gap-12">
        {/* LEFT */}
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
            Digital Healthcare <br /> Identity Platform
          </h1>

          <p className="text-gray-600 mt-4">
            HealthBridge securely connects patients, doctors, hospitals, and labs
            using one unified Health ID.
          </p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => navigate("/signup")}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/login")}
              className="border border-primary text-primary px-6 py-3 rounded-lg hover:bg-primary hover:text-white transition"
            >
              Login
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-[420px]">
          <MedicalLottie />
        </div>
      </section>

      {/* STATS */}
      <Stats />

      {/* ABOUT */}
      <About />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}