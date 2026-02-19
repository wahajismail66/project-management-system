import { useState } from "react";
import LiquidFormModal from "../components/LiquidFormModal";
import { useNavigate } from "react-router-dom";
import { login } from "../services/Api";
import { useAuth } from "../../context/AuthContext";

export const LoginPage = () => {
  const [form, setForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: loginUser } = useAuth();

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
    setLoading(true);
    try {
      console.log("Form submitted", formData);

      const response = await login(formData);
      console.log("Response: ", response.data.data);

      const token = response.data.data.token;

      loginUser({ token });

      navigate("/");
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="bg-gray-300 w-1/2 h-full relative">
        <LiquidFormModal
          isOpen={form}
          loading={loading}
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
        <img src="/ProjectManagementLogo.png" alt="Logo" />
      </div>
    </div>
  );
};
