import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { ArrowLeft, Building2, Stethoscope } from "lucide-react";

export default function DoctorRegister() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[30rem] h-[30rem] bg-blue-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
        <div className="absolute top-[30%] right-[10%] w-[35rem] h-[35rem] bg-primary-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <button
          onClick={() => navigate("/login/doctor")}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to doctor login
        </button>

        <AuthCard
          title="Doctor Account Registration"
          subtitle="Doctors are onboarded by hospitals"
        >
          <div className="space-y-4">
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
              <p className="text-sm text-blue-700 leading-relaxed">
                Doctors cannot self-register. Hospital administrators create doctor accounts and provide a Doctor UID and password.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/register/hospital")}
              className="btn btn-primary w-full py-3"
            >
              <Building2 size={18} />
              Register a Hospital
            </button>

            <button
              type="button"
              onClick={() => navigate("/login/doctor")}
              className="btn btn-secondary w-full py-3"
            >
              <Stethoscope size={18} />
              Doctor Login
            </button>
          </div>
        </AuthCard>
      </div>
    </div>
  );
}
