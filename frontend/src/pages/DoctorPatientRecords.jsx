import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, FileText, Calendar, Pill, Stethoscope, ArrowLeft } from "lucide-react";
import { getPatientRecordsByDoctor } from "../services/api";

export default function DoctorPatientRecords() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const token = localStorage.getItem("token");
            try {
                const res = await getPatientRecordsByDoctor(token, id);
                if (res.records) {
                    setRecords(res.records);
                } else {
                    setError("Failed to fetch records.");
                }
            } catch (err) {
                setError(err.message || "No access to this patient or patient not found.");
            } finally {
                setLoading(false);
            }
        };
        if (id) loadData();
    }, [id]);

    const filteredRecords = records.filter((r) => {
        const query = searchQuery.toLowerCase();
        return (
            (r.diagnosis && r.diagnosis.toLowerCase().includes(query)) ||
            (r.symptoms && r.symptoms.toLowerCase().includes(query)) ||
            (r.medications && r.medications.toLowerCase().includes(query)) ||
            (r.notes && r.notes.toLowerCase().includes(query))
        );
    });

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
            <button
                onClick={() => navigate("/doctor")}
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 transition-colors"
            >
                <ArrowLeft size={18} />
                Back to Dashboard
            </button>

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Patient History</h1>
                    <p className="text-text-secondary font-mono">ID: {id}</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                        type="text"
                        className="input pl-10 w-full"
                        placeholder="Search diagnosis, meds..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {error ? (
                <div className="glass-panel p-12 text-center border-red-200">
                    <FileText size={48} className="text-red-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-red-600 mb-2">Access Denied</h3>
                    <p className="text-red-500">{error}</p>
                </div>
            ) : filteredRecords.length === 0 ? (
                <div className="glass-panel p-12 text-center border-white/60">
                    <FileText size={48} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Records Found</h3>
                    <p className="text-gray-500">
                        {searchQuery ? "No records match your search criteria." : "This patient has no medical records yet."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRecords.map((record) => (
                        <div key={record.id} className="glass-panel p-6 border-white/60 animate-slide-up hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4 border-b border-gray-100 pb-4">
                                <div>
                                    <h3 className="text-xl font-extrabold text-text-primary flex items-center gap-2">
                                        <Stethoscope size={20} className="text-primary-600" />
                                        {record.diagnosis}
                                    </h3>
                                    <p className="text-sm font-medium text-text-secondary mt-1">
                                        Dr. {record.doctor.name} • {record.doctor.hospital?.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold text-text-secondary bg-gray-100 px-3 py-1.5 rounded-full shadow-inner border border-gray-200/50">
                                        {new Date(record.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {record.symptoms && (
                                <div className="mb-4">
                                    <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-1.5">Symptoms</p>
                                    <p className="text-text-primary text-sm font-medium">{record.symptoms}</p>
                                </div>
                            )}

                            <div className="mb-4">
                                <p className="text-xs font-bold text-primary-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                    <Pill size={14} /> Medications
                                </p>
                                <div className="bg-primary-50/50 p-3 rounded-lg border border-primary-100/50">
                                    <p className="text-text-primary text-sm font-medium leading-relaxed">{record.medications}</p>
                                </div>
                            </div>

                            {record.notes && (
                                <div className="mb-3">
                                    <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-1.5">Notes</p>
                                    <p className="text-yellow-900 text-sm bg-yellow-50/80 p-3 rounded-lg border border-yellow-200/50 font-medium leading-relaxed">
                                        {record.notes}
                                    </p>
                                </div>
                            )}

                            {record.followUpDate && (
                                <div className="mt-5 pt-4 border-t border-dashed border-gray-200">
                                    <p className="text-sm font-bold text-primary-600 flex items-center gap-2 bg-primary-50 w-fit px-4 py-2 rounded-lg border border-primary-100 shadow-sm">
                                        <Calendar size={16} />
                                        Follow-up: {new Date(record.followUpDate).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
