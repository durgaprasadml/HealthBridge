const API_BASE = "http://localhost:5050";

/* ============================= */
/* GENERIC REQUEST FUNCTION      */
/* ============================= */

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

/* ============================= */
/* AUTH                          */
/* ============================= */

export async function sendSignupOtp(name, phone) {
  return request("/auth/signup/send-otp", {
    method: "POST",
    body: JSON.stringify({ name, phone }),
  });
}

export async function verifySignupOtp(name, phone, otp) {
  return request("/auth/signup/verify-otp", {
    method: "POST",
    body: JSON.stringify({ name, phone, otp }),
  });
}

export async function sendPatientLoginOtp(identifier) {
  return request("/auth/login/send-otp", {
    method: "POST",
    body: JSON.stringify({ identifier }),
  });
}

export async function verifyPatientLoginOtp(phone, otp) {
  return request("/auth/login/verify-otp", {
    method: "POST",
    body: JSON.stringify({ phone, otp }),
  });
}

export async function sendDoctorLoginOtp(doctorUid) {
  return request("/doctor/login/send-otp", {
    method: "POST",
    body: JSON.stringify({
      doctorUid: doctorUid.trim().toUpperCase(),
    }),
  });
}

export async function verifyDoctorLoginOtp(doctorUid, otp) {
  return request("/doctor/login/verify-otp", {
    method: "POST",
    body: JSON.stringify({
      doctorUid: doctorUid.trim().toUpperCase(),
      otp,
    }),
  });
}

export async function loginDoctorWithPassword(doctorUid, password) {
  return request("/doctor/login/password", {
    method: "POST",
    body: JSON.stringify({
      doctorUid: doctorUid.trim().toUpperCase(),
      password,
    }),
  });
}

/* ============================= */
/* HOSPITAL                      */
/* ============================= */

export async function registerHospital(payload) {
  return request("/hospital/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginHospital(identifier, password) {
  const trimmed = identifier.trim();
  const body = { password };

  if (trimmed.includes("@")) body.email = trimmed.toLowerCase();
  else if (/^[6-9]\d{9}$/.test(trimmed)) body.phone = trimmed;
  else body.hospitalUid = trimmed.toUpperCase();

  return request("/hospital/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function createDoctor(token, payload) {
  return request("/hospital/create-doctor", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function getHospitalDoctors(token) {
  return request("/hospital/doctors", {
    headers: authHeaders(token),
  });
}

export async function getHospitalProfile(token) {
  return request("/hospital/profile", {
    headers: authHeaders(token),
  });
}

export async function getHospitalActiveAccess(token) {
  return request("/access/hospital/active-access", {
    headers: authHeaders(token),
  });
}

/* ============================= */
/* PROFILE & MEDICAL             */
/* ============================= */

export async function getProfile(token) {
  return request("/profile", {
    headers: authHeaders(token),
  });
}

export async function updateProfile(token, data) {
  return request("/profile", {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export async function getMyMedicalRecords(token) {
  return request("/medical/my-records", {
    headers: authHeaders(token),
  });
}

export async function addMedicalRecord(token, data) {
  return request("/medical", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

/* ============================= */
/* REMINDERS                     */
/* ============================= */

export async function getMyReminders(token) {
  return request("/reminders/my-reminders", {
    headers: authHeaders(token),
  });
}

export async function completeReminder(token, id) {
  return request(`/reminders/${id}/complete`, {
    method: "PUT",
    headers: authHeaders(token),
  });
}

/* ============================= */
/* EMERGENCY & ACCESS            */
/* ============================= */

export async function getEmergencyByPhone(phone) {
  return request(`/emergency/by-phone/${phone}`);
}

export async function requestEmergencyAccess(token, patientUid, reason) {
  return request("/access/emergency/start", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ patientUid, reason }),
  });
}

export async function requestPatientAccess(token, patientUid, durationHours = 24) {
  return request("/access/request", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ patientUid, durationHours }),
  });
}

export async function getAccessRequests(token) {
  return request("/access/requests", {
    headers: authHeaders(token),
  });
}

export async function respondToAccess(token, requestId, action) {
  return request("/access/respond", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ requestId, action }),
  });
}

export async function getDoctorAccesses(token) {
  return request("/doctor/accesses", {
    headers: authHeaders(token),
  });
}