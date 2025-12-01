import { useState } from "react";
import { HobbiesSelector } from "../HobbiesSelector";
import { SignUpModal } from "../SignUpModal";
import { authService } from "../../../../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../../stores/auth";

export const SignUpFlow = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => setActiveStep(1);
  const handleBack = () => setActiveStep(0);

  const handleRegister = async () => {
    setIsLoading(true);
    const payload = {
      email,
      firstName,
      lastName,
      password,
      username,
      interests,
    };
    try {
      const response = await authService.register(payload);
      setUser(response.user);
      localStorage.setItem("token", response.token);

      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {activeStep === 0 && (
        <SignUpModal
          onNext={handleNext}
          setEmail={setEmail}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      )}

      {activeStep === 1 && (
        <HobbiesSelector
          isLoading={isLoading}
          handleBack={handleBack}
          selected={interests}
          setSelected={setInterests}
          handleRegister={handleRegister}
        />
      )}
    </div>
  );
};
