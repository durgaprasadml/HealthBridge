import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Phone, User, Heart, AlertCircle, Calendar } from "lucide-react";
import { sendSignupOtp, verifySignupOtp } from "../services/api";
import toast from "react-hot-toast";

export default function Signup() {
  const [step, setStep] = useState(1); // 1: details, 2: OTP
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bloodGroup: "",
    allergies: "",
    emergencyContact: "",
    emergencyPhone: "",
    dateOfBirth: "",
    gender: "",
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await sendSignupOtp(formData.name, formData.phone);
      if (res.message) {
        toast.success("OTP sent to your phone!");
        setStep(2);
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (err) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Enter valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await verifySignupOtp(formData.name, formData.phone, otp);

      if (res.user && res.token) {
        // Store token and redirect to profile to complete details
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("role", "PATIENT");
        localStorage.setItem("userName", res.user.name || "Patient");

        toast.success("Account created successfully!");
        // Navigate to profile to add additional details
        navigate("/patient/profile", { state: { isNewUser: true } });
      } else {
        toast.error("Verification failed");
      }
    } catch (err) {
      toast.error(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[30rem] h-[30rem] bg-primary-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[35rem] h-[35rem] bg-emerald-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-slide-up my-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
              <Shield size={28} />
            </div>
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-600 tracking-tight">HealthBridge</span>
          </div>
        </div>

        <div className="glass-panel p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-emerald-400 z-20"></div>
          <h1 className="text-2xl font-bold text-center text-text-primary mb-2">
            Create Your Health ID
          </h1>
          <p className="text-center text-text-secondary mb-6">
            Get started with your unique health identity
          </p>

          {step === 1 ? (
            <>
              {/* Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-1">
                  <User size={16} className="inline mr-1" /> Full Name *
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-1">
                  <Phone size={16} className="inline mr-1" /> Phone Number *
                </label>
                <input
                  type="tel"
                  className="input"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  maxLength={10}
                />
              </div>

              {/* Blood Group */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-1">
                  <Heart size={16} className="inline mr-1" /> Blood Group
                </label>
                <select
                  className="input"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                >
                  <option value="">Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              {/* Allergies */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-1">
                  <AlertCircle size={16} className="inline mr-1" /> Allergies
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Penicillin, Pollen"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                />
              </div>

              {/* Emergency Contact */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Contact name"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Emergency Phone
                  </label>
                  <input
                    type="tel"
                    className="input"
                    placeholder="Phone number"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    maxLength={10}
                  />
                </div>
              </div>

              {/* DOB and Gender */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    <Calendar size={16} className="inline mr-1" /> Date of Birth
                  </label>
                  <input
                    type="date"
                    className="input"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Gender</label>
                  <select
                    className="input"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="btn btn-primary w-full py-3"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>

              <p className="text-center text-sm text-text-secondary mt-4">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login/patient")}
                  className="text-primary-500 font-medium cursor-pointer hover:underline"
                >
                  Login
                </span>
              </p>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="text-primary-500" size={32} />
                </div>
                <p className="text-text-secondary">
                  OTP sent to <span className="font-medium">{formData.phone}</span>
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  className="input text-center text-2xl tracking-widest"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                />
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="btn btn-primary w-full py-3"
              >
                {loading ? "Verifying..." : "Verify & Create Account"}
              </button>

              <p className="text-center text-sm text-text-secondary mt-4">
                <span
                  onClick={() => setStep(1)}
                  className="text-primary-500 font-medium cursor-pointer hover:underline"
                >
                  Change phone number
                </span>
              </p>
            </>
          )}
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
