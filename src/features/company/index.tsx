import { Routes, Route } from "react-router-dom";
import CompanyPage from "./ui/CompanyPage";

export default function CompanyModule() {
  return (
    <Routes>
      <Route index element={<CompanyPage />} />
    </Routes>
  );
}
