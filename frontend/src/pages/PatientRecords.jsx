import { useState, useEffect } from "react";
import { FileText, Calendar, Pill, Stethoscope, Clock, CheckCircle, XCircle } from "lucide-react";
import { getMyMedicalRecords, getMyReminders, completeReminder } from "../services/api";

export default function PatientRecords() {
  const [records, setRecords] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("records");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem("token");
    try {
      const [recordsRes, remindersRes] = await Promise.all([
        getMyMedicalRecords(token),
        getMyReminders(token)
      ]);
      
      if (recordsRes.records) setRecords(recordsRes.records);
      if (remindersRes.reminders) setReminders(remindersRes.reminders);
    } catch {
      setRecords([]);
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteReminder = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await completeReminder(token, id);
      loadData();
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">My Health Records</h1>
        <p className="text-text-secondary">View your medical history and upcoming checkups</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("records")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === "records" 
              ? "bg-primary-500 text-white" 
              : "bg-white text-text-secondary hover:bg-gray-50"
          }`}
        >
          <FileText size={18} className="inline mr-2" />
          Medical Records
        </button>
        <button
          onClick={() => setActiveTab("reminders")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            activeTab === "reminders" 
              ? "bg-primary-500 text-white" 
              : "bg-white text-text-secondary hover:bg-gray-50"
          }`}
        >
          <Calendar size={18} className="inline mr-2" />
          Upcoming Checkups ({reminders.filter(r => r.status === "PENDING").length})
        </button>
      </div>

      {/* Records Tab */}
      {activeTab === "records" && (
        <div className="space-y-4">
          {records.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-card p-8 text-center">
              <FileText size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Medical Records Yet</h3>
              <p className="text-gray-500">Your medical records will appear here when a doctor adds them.</p>
            </div>
          ) : (
            records.map((record) => (
              <div key={record.id} className="bg-white rounded-2xl shadow-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                      <Stethoscope size={18} className="text-primary-500" />
                      {record.diagnosis}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      Dr. {record.doctor.name} • {record.doctor.hospital?.name}
                    </p>
                  </div>
                  <span className="text-xs text-text-muted bg-gray-100 px-3 py-1 rounded-full">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Symptoms */}
                {record.symptoms && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-text-secondary">Symptoms:</p>
                    <p className="text-text-primary">{record.symptoms}</p>
                  </div>
                )}

                {/* Medications */}
                <div className="mb-3">
                  <p className="text-sm font-medium text-text-secondary flex items-center gap-1">
                    <Pill size={14} /> Medications:
                  </p>
                  <p className="text-text-primary">{record.medications}</p>
                </div>

                {/* Notes */}
                {record.notes && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-text-secondary">Notes:</p>
                    <p className="text-text-primary">{record.notes}</p>
                  </div>
                )}

                {/* Follow-up */}
                {record.followUpDate && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-primary-500 flex items-center gap-1">
                      <Calendar size={14} />
                      Follow-up Checkup: {new Date(record.followUpDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Reminders Tab */}
      {activeTab === "reminders" && (
        <div className="space-y-4">
          {reminders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-card p-8 text-center">
              <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Upcoming Checkups</h3>
              <p className="text-gray-500">Your upcoming checkup reminders will appear here.</p>
            </div>
          ) : (
            reminders.map((reminder) => (
              <div 
                key={reminder.id} 
                className={`bg-white rounded-2xl shadow-card p-6 ${
                  reminder.status === "COMPLETED" ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{reminder.message}</h3>
                    <p className="text-sm text-text-secondary">
                      Recommended by Dr. {reminder.doctor.name} • {reminder.doctor.hospital?.name}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    reminder.status === "PENDING" 
                      ? "bg-yellow-100 text-yellow-700"
                      : reminder.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {reminder.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Clock size={16} />
                    <span>Checkup Date: {new Date(reminder.checkupDate).toLocaleDateString()}</span>
                  </div>
                  
                  {reminder.status === "PENDING" && (
                    <button
                      onClick={() => handleCompleteReminder(reminder.id)}
                      className="flex items-center gap-1 text-sm text-primary-500 hover:text-primary-600 font-medium"
                    >
                      <CheckCircle size={16} />
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
