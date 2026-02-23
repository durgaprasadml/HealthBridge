import Lottie from "lottie-react";
import medicalAnimation from "../assets/medical.json";

export default function MedicalLottie() {
  return (
    <Lottie
      animationData={medicalAnimation}
      loop
      className="w-full h-full"
    />
  );
}