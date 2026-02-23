import { useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { ArrowLeft, Building2, Stethoscope } from "lucide-react";

export default function DoctorRegister() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-200/30 rounded-full blur-3xl"></div>
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
