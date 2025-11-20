import { useState } from "react";
import { SignUpModal } from "../SignUpModal";
import { HobbiesSelector } from "../HobbiesSelector";

export const SignUpFlow = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="w-full max-w-md mx-auto">
      {activeStep === 0 && <SignUpModal onNext={() => setActiveStep(1)} />}
      {activeStep === 1 && <HobbiesSelector handleBack={() => setActiveStep(0)} />}
    </div>
  );
};
