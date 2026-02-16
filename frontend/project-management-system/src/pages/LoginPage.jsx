import { useState } from "react";
import LiquidFormModal from "../components/LiquidFormModal";
import { useNavigate } from "react-router-dom";
import { login } from "../services/Api";

export const LoginPage = () => {
  const [form, setForm] = useState(true);
  const navigate = useNavigate();

  const loginFields = [
    {
      name: "email",
      label: "Email",
      placeholder: "email@example.com",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
    },
  ];

  const handleFormSubmit = async (formData) => {
    try {
      console.log("Form submitted", formData);

      const response = await login(formData);
      console.log("Response: ", response.data.data);

      localStorage.setItem("token", response.data.data.token);

      navigate("/");
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="bg-gray-300 w-1/2 h-full relative">
        <LiquidFormModal
          isOpen={form}
          title="Login"
          fields={loginFields}
          onSubmit={handleFormSubmit}
          buttonText="Login"
          buttonClassName="bg-blue-600/80 hover:bg-blue-600"
          footerText="Don't have an account?"
          footerLinkText="Sign up"
          onFooterLinkClick={() => navigate("/sign-up")}
        />
      </div>
      <div className="bg-blue-500 w-1/2 h-full flex items-center justify-center">
        <img src="/public/ProjectManagementLogo.png" alt="Logo" />
      </div>
    </div>
  );
};
