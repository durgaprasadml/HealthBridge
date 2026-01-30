import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      <h1
        className="text-2xl font-bold text-primary cursor-pointer"
        onClick={() => navigate("/")}
      >
        HealthBridge
      </h1>

      <div className="space-x-4">
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 text-primary font-medium"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/signup")}
          className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}