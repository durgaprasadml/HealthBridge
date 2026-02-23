const API_BASE = "http://localhost:5050/api";

/* ===========================
   GENERIC REQUEST HELPER
=========================== */
async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Something went wrong");
  }

  return res.json();
}

/* ===========================
   AUTH helpers
=========================== */

// signup flow (patients only for now)
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

// generic verify OTP helper that supports patient and doctor/login
// for patient the backend expects { phone, otp }
// for doctor it requires { doctorUid, otp } and uses a different route.
// `role` is optional and defaults to "PATIENT" when not provided.
export async function verifyOtp(identifier, otp, role = "PATIENT") {
  if (role === "DOCTOR") {
    return request("/doctor/login/verify-otp", {
      method: "POST",
      body: JSON.stringify({ doctorUid: identifier, otp }),
    });
  }

  // default patient (or hospital) login flow
  return request("/auth/login/verify-otp", {
    method: "POST",
    body: JSON.stringify({ phone: identifier, otp }),
  });
}

/* ===========================
   EMERGENCY
=========================== */

export async function getEmergencyByPhone(phone) {
  return request(`/emergency/${phone}`);
}

// ===========================
// LOGIN
// ===========================

export async function sendLoginOtp(value) {
  const trimmed = value?.toString().trim();
  if (!trimmed) {
    throw new Error("Identifier is required");
  }

  // doctor UID pattern usually starts with DOC- (configured in backend)
  if (/^DOC-/i.test(trimmed)) {
    return request("/doctor/login/send-otp", {
      method: "POST",
      body: JSON.stringify({ doctorUid: trimmed.toUpperCase() }),
    });
  }

  // otherwise treat as patient login (UID or phone)
  return request("/auth/login/send-otp", {
    method: "POST",
    body: JSON.stringify({ identifier: trimmed }),
  });
}

/* ===========================
   PROFILE
=========================== */

export async function getProfile(token) {
  return request("/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateProfile(token, data) {
  return request("/profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

/* ===========================
   RECORDS
=========================== */

export async function getMyMedicalRecords(token) {
  return request("/medical/my-records", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function addMedicalRecord(data, token) {
  return request("/medical", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}
export async function getMyReminders(token) {
  return request("/reminders/my-reminders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function completeReminder(token, id) {
  return request(`/reminders/${id}/complete`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

