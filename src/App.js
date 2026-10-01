import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./components/ScrollToTop";
import { WebsiteContentProvider } from "./content/WebsiteContent";
import LandingPage from "./pages/Landing";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";
import LegalPage from "./pages/legal/LegalPage";
import ContactPage from "./pages/legal/ContactPage";
import DataDeletion from "./pages/legal/DataDeletion";

const legalSlugs = ["privacy-policy", "terms", "disclaimer", "refund-policy", "cookie-policy", "shipping-policy", "grievance"];

export default function App() {
  return (
    <WebsiteContentProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/data-deletion" element={<DataDeletion />} />
        {legalSlugs.map((slug) => (
          <Route key={slug} path={`/${slug}`} element={<LegalPage slug={slug} />} />
        ))}
        <Route path="/public-subscription" element={<Navigate to="/pricing" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </WebsiteContentProvider>
  );
}
