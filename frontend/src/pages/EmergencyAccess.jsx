import { useState } from "react";
import { AlertCircle, Phone, Heart, User, PhoneCall } from "lucide-react";
import { getEmergencyByPhone } from "../services/api";

export default function EmergencyAccess() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patient, setPatient] = useState(null);

  const handleSearch = async () => {
    setError("");
    if (!phone || phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await getEmergencyByPhone(phone);
      if (res.emergency) {
        setPatient(res.emergency);
      } else {
        setError("No patient found with this phone number");
        setPatient(null);
      }
    } catch (err) {
      setError(err.message || "No patient found with this phone number");
      setPatient(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-20 px-4 relative overflow-hidden bg-background">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[35rem] h-[35rem] bg-red-500/10 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[40rem] h-[40rem] bg-orange-500/10 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      <div className="max-w-lg mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in shadow-xl shadow-red-500/20 relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
            <AlertCircle className="text-red-600 relative z-10" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Emergency Access
          </h1>
          <p className="text-gray-600">
            Quick access to patient information in emergencies
          </p>
        </div>

        {/* Ambulance Button */}
        <div className="mb-6 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <a href="tel:108" className="btn bg-white text-red-600 hover:bg-red-50 border-2 border-red-200 shadow-xl px-8 py-4 w-full flex items-center justify-center gap-3 text-lg font-bold transition-all hover:scale-[1.02] active:scale-[0.98]">
            <PhoneCall className="animate-pulse text-red-500" />
            CALL AMBULANCE 108
          </a>
        </div>

        {/* Search Box */}
        <div className="glass-panel border border-red-200/50 shadow-2xl p-6 mb-6 animate-slide-up">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Patient's Phone Number
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                className="input pl-10 font-mono text-lg w-full py-3"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/30 border-none px-8 py-3 h-auto"
            >
              <PhoneCall size={18} />
              Search
            </button>
          </div>

          {error && (
            <div className="mt-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Patient Info Card */}
        {patient && (
          <div className="glass-panel overflow-hidden border border-red-200 shadow-2xl animate-slide-up">
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-5">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} />
                <span className="font-semibold">Emergency Information</span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Name */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="text-blue-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="font-semibold text-gray-900">{patient.name}</p>
                </div>
              </div>

              {/* Health ID */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-500 font-bold">ID</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Health ID</p>
                  <p className="font-semibold text-gray-900">{patient.healthUid}</p>
                </div>
              </div>

              {/* Blood Group */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="text-red-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blood Group</p>
                  <p className="font-semibold text-red-600 text-lg">{patient.bloodGroup}</p>
                </div>
              </div>

              {/* Allergies */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="text-orange-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Allergies</p>
                  <p className="font-semibold text-orange-600">{patient.allergies}</p>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Emergency Contact */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <PhoneCall className="text-green-500" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Emergency Contact</p>
                  <p className="font-semibold text-gray-900">{patient.emergencyContact}</p>
                  <p className="font-semibold text-green-600">{patient.emergencyPhone}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>This information is available for emergency purposes only.</p>
          <p>Please contact the nearest hospital for full medical records.</p>
        </div>
      </div>
    </div>
  );
}
