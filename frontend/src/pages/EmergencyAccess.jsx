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
    const res = await getEmergencyByPhone(phone);
    setLoading(false);

    if (res.emergency) {
      setPatient(res.emergency);
    } else {
      setError(res.message || "No patient found with this phone number");
      setPatient(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-500" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Emergency Access
          </h1>
          <p className="text-gray-600">
            Quick access to patient information in emergencies
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter Patient's Phone Number
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2"
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
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="bg-red-500 text-white px-6 py-4">
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

