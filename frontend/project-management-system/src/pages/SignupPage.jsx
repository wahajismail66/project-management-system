import { useState } from "react";
import LiquidFormModal from "../components/LiquidFormModal";
import { useNavigate } from "react-router-dom";

export const SignupPage = () => {
  const [form, setForm] = useState(true);
  const navigate = useNavigate();

  const signupFields = [
    {
      name: "name",
      label: "Name",
      placeholder: "e.g John Doe",
      required: true,
    },
    {
      name: "username",
      label: "Email",
      placeholder: "email@example.com",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
      halfWidth: true,
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "••••••••",
      halfWidth: true,
    },
  ];

  const handleFormSubmit = () => {
    console.log("Form submitted");
  };
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="bg-gray-300 w-1/2 h-full relative">
        <LiquidFormModal
          isOpen={form}
          title="Sign up"
          fields={signupFields}
          onSubmit={handleFormSubmit}
          buttonText="Sign up"
          buttonClassName="bg-blue-600/80 hover:bg-blue-600"
          footerText="Already have an account?"
          footerLinkText="Log in"
          onFooterLinkClick={() => navigate("/login")}
          containerClassName="max-w-sm p-6"
          fieldsClassName="space-y-3"
        />
      </div>
      <div className="bg-blue-500 w-1/2 h-full flex items-center justify-center">
        <img src="/public/ProjectManagementLogo.png" alt="Logo" />
      </div>
    </div>
  );
};
