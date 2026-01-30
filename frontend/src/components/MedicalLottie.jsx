import Lottie from "lottie-react";
import animationData from "../assets/medical.json";

export default function MedicalLottie() {
  return (
    <div className="w-72 mx-auto">
      <Lottie animationData={animationData} loop />
    </div>
  );
}