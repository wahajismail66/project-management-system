import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { SignupPage } from "../pages/SignupPage";
import DashboardLayoutBasic from "../pages/Dashboard";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayoutBasic />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sign-up" element={<SignupPage />} />
    </Routes>
  );
};
