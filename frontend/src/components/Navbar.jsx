import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-white shadow-sm px-10 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-primary cursor-pointer"
          onClick={() => navigate("/")}>
        HealthBridge
      </h1>

      <div className="flex items-center gap-6">
        <button className="text-gray-600 hover:text-primary">
          How it works
        </button>
        <button
          onClick={() => navigate("/login")}
          className="text-gray-600 hover:text-primary"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/signup")}
          className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-secondary"
        >
          Get Started
        </button>
      </div>
    </nav>
  );
}