import { useState } from "react";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import Profile from "./pages/Profile";

export default function App() {
  const [step, setStep] = useState("login");

  if (step === "login") return <Login onOtpSent={() => setStep("verify")} />;
  if (step === "verify") return <VerifyOtp onLogin={() => setStep("profile")} />;

  return <Profile />;
}
