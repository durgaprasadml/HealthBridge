const API_BASE = "http://localhost:5050";

export async function signup(name, phone) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone }),
  });
  return res.json();
}

export async function sendLoginOtp(healthUid) {
  const res = await fetch(`${API_BASE}/auth/login/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ healthUid }),
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

export async function getProfile(token) {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
}
