const API_BASE = "http://localhost:5050";

/* SIGNUP */
export async function signupSendOtp(name, phone) {
  const res = await fetch(`${API_BASE}/auth/signup/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone }),
  });
  return res.json();
}

export async function signupVerifyOtp(name, phone, otp) {
  const res = await fetch(`${API_BASE}/auth/signup/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, otp }),
  });
  return res.json();
}

/* LOGIN */
export async function sendLoginOtp(identifier) {
  const payload =
    /^[6-9]\d{9}$/.test(identifier)
      ? { phone: identifier }
      : { healthUid: identifier };

  const res = await fetch(`${API_BASE}/auth/login/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function verifyLoginOtp(phone, otp) {
  const res = await fetch(`${API_BASE}/auth/login/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp }),
  });
  return res.json();
}

/* PROFILE */
export async function getProfile(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}