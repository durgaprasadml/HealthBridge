import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { User, Phone, Heart, AlertCircle, Calendar, MapPin, Save, ArrowLeft } from "lucide-react";
import { getProfile, updateProfile } from "../services/api";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const isNewUser = location.state?.isNewUser;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    healthUid: "",
    bloodGroup: "",
    allergies: "",
    emergencyContact: "",
    emergencyPhone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loadProfile();
    }
  }, []);

  const loadProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await getProfile(token);
      if (res.user) {
        setFormData({
          name: res.user.name || "",
          phone: res.user.phone || "",
          healthUid: res.user.healthUid || "",
          bloodGroup: res.user.bloodGroup || "",
          allergies: res.user.allergies || "",
          emergencyContact: res.user.emergencyContact || "",
          emergencyPhone: res.user.emergencyPhone || "",
          dateOfBirth: res.user.dateOfBirth || "",
          gender: res.user.gender || "",
          address: res.user.address || "",
        });
      }
    } catch (err) {
      setMessage(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");

    const token = localStorage.getItem("token");
    try {
      const res = await updateProfile(token, formData);
      if (res.user) {
        setMessage("Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(res.user));
      } else {
        setMessage("Failed to update profile");
      }
    } catch (err) {
      setMessage(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">
          {isNewUser ? "Complete Your Profile" : "My Profile"}
        </h1>
        <p className="text-text-secondary">
          {isNewUser
            ? "Please complete your profile to get the most out of HealthBridge"
            : "View and manage your health information"
          }
        </p>
      </div>

      {/* Health ID Card */}
      <div className="glass bg-gradient-to-r from-primary-600/90 to-primary-800/90 rounded-2xl p-8 mb-8 text-white shadow-xl shadow-primary-500/20 border-white/20 animate-slide-down">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 text-sm">Health ID</p>
            <p className="text-2xl font-bold tracking-wider">{formData.healthUid || "Generating..."}</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User size={32} />
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="glass-panel p-8 shadow-xl border-white/60 animate-fade-in">
        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1">
            <User size={16} className="inline mr-1" /> Full Name
          </label>
          <input
            type="text"
            className="input w-full"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        {/* Phone (read-only) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1">
            <Phone size={16} className="inline mr-1" /> Phone Number
          </label>
          <input
            type="text"
            className="input w-full bg-gray-50/80 text-gray-500 cursor-not-allowed"
            value={formData.phone}
            disabled
          />
        </div>

        {/* Blood Group & Gender */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              <Heart size={16} className="inline mr-1" /> Blood Group
            </label>
            <select
              className="input w-full"
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
            >
              <option value="">Select</option>
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
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Gender</label>
            <select
              className="input w-full"
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

        {/* DOB */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1">
            <Calendar size={16} className="inline mr-1" /> Date of Birth
          </label>
          <input
            type="date"
            className="input w-full"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />
        </div>

        {/* Allergies */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1">
            <AlertCircle size={16} className="inline mr-1" /> Allergies
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="List any allergies (medications, food, etc.)"
            value={formData.allergies}
            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1">
            <MapPin size={16} className="inline mr-1" /> Address
          </label>
          <textarea
            className="input w-full"
            placeholder="Your address"
            rows={2}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <hr className="my-6 border-gray-100" />

        {/* Emergency Contact */}
        <h3 className="text-lg font-semibold text-text-primary mb-4">Emergency Contact</h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Contact Name</label>
            <input
              type="text"
              className="input w-full"
              placeholder="Emergency contact name"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Contact Phone</label>
            <input
              type="tel"
              className="input w-full"
              placeholder="10-digit number"
              value={formData.emergencyPhone}
              onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
              maxLength={10}
            />
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mt-4 px-4 py-3 rounded-lg text-sm ${message.includes("success") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
            {message}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary w-full py-4 text-lg mt-4"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
