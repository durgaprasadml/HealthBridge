import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Pill, Stethoscope, Calendar, Save, ArrowLeft, User } from "lucide-react";
import { addMedicalRecord } from "../services/api";

export default function AddMedicalRecord() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const [formData, setFormData] = useState({
    patientUid: "",
    diagnosis: "",
    symptoms: "",
    medications: "",
    notes: "",
    followUpDate: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    if (!formData.patientUid || !formData.diagnosis || !formData.medications) {
      setMessage("Patient UID, diagnosis, and medications are required");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await addMedicalRecord(token, formData);
      if (res.record) {
        setMessage("Medical record added successfully!");
        // Reset form
        setFormData({
          patientUid: "",
          diagnosis: "",
          symptoms: "",
          medications: "",
          notes: "",
          followUpDate: "",
        });
      } else {
        setMessage("Failed to add record");
      }
    } catch (err) {
      setMessage(err.message || "Failed to add record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <button
        onClick={() => navigate("/doctor")}
        className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-4"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Add Medical Record</h1>
        <p className="text-text-secondary">Enter patient diagnosis and treatment details</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-6">
        {/* Patient UID */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1">
            <User size={16} className="inline mr-1" /> Patient Health UID *
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            placeholder="HB-XXXXXXXX"
            value={formData.patientUid}
            onChange={(e) => setFormData({ ...formData, patientUid: e.target.value.toUpperCase() })}
          />
        </div>

        {/* Diagnosis */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1">
            <Stethoscope size={16} className="inline mr-1" /> Diagnosis *
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            placeholder="Primary diagnosis"
            value={formData.diagnosis}
            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
          />
        </div>

        {/* Symptoms */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1">
            Symptoms
          </label>
          <textarea
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            placeholder="Describe patient's symptoms"
            rows={2}
            value={formData.symptoms}
            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
          />
        </div>

        {/* Medications */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1">
            <Pill size={16} className="inline mr-1" /> Medications *
          </label>
          <textarea
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            placeholder="List all prescribed medications with dosage"
            rows={3}
            value={formData.medications}
            onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
          />
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1">
            Additional Notes
          </label>
          <textarea
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            placeholder="Doctor's notes, instructions, etc."
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        {/* Follow-up Date */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-primary mb-1">
            <Calendar size={16} className="inline mr-1" /> Follow-up Checkup Date
          </label>
          <input
            type="date"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
            value={formData.followUpDate}
            onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
          />
          <p className="text-xs text-text-muted mt-1">
            Patient will receive a reminder for this checkup
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
            message.includes("success") 
              ? "bg-green-50 text-green-600" 
              : "bg-red-50 text-red-600"
          }`}>
            {message}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-500 text-white py-3 rounded-xl font-medium hover:bg-primary-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {loading ? "Saving..." : "Save Medical Record"}
        </button>
      </form>
    </div>
  );
}
