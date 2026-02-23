import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Phone, User, Heart, AlertCircle, Calendar } from "lucide-react";
import { sendSignupOtp, verifySignupOtp } from "../services/api";

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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    setError("");
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    const res = await sendSignupOtp(formData.name, formData.phone);
    setLoading(false);

    if (res.message) {
      setStep(2);
    } else {
      setError(res.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    if (!otp || otp.length !== 6) {
      setError("Enter valid 6-digit OTP");
      return;
    }

    setLoading(true);
    const res = await verifySignupOtp(formData.name, formData.phone, otp);
    setLoading(false);

    if (res.user) {
      // Store token and redirect to profile to complete details
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("role", "PATIENT");
      
      // Navigate to profile to add additional details
      navigate("/patient/profile", { state: { isNewUser: true } });
    } else {
      setError(res.message || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center text-white">
              <Shield size={24} />
            </div>
            <span className="text-2xl font-bold text-text-primary">HealthBridge</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 md:p-8">
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">Gender</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
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

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium hover:bg-primary-600 transition disabled:opacity-50"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-center text-2xl tracking-widest"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  maxLength={6}
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium hover:bg-primary-600 transition disabled:opacity-50"
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

