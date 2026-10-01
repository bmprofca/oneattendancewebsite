import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./components/ScrollToTop";
import LandingPage from "./pages/Landing";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import DataDeletion from "./pages/legal/DataDeletion";
import Terms from "./pages/legal/Terms";
import PublicSubscription from "./pages/PublicSubscription";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/public-subscription" element={<PublicSubscription />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
}
