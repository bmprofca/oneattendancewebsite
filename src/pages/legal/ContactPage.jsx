import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaHandshake, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { useWebsiteContent } from "../../content/WebsiteContent";
import LegalPage from "./LegalPage";

const cards = [
  { key: "email", icon: FaEnvelope, tint: "bg-cyan-100 text-cyan-700", label: "Support email" },
  { key: "phone", icon: FaPhoneAlt, tint: "bg-emerald-100 text-emerald-700", label: "Support phone" },
  { key: "sales_email", icon: FaHandshake, tint: "bg-blue-100 text-blue-700", label: "Sales email" },
  { key: "sales_phone", icon: FaPhoneAlt, tint: "bg-indigo-100 text-indigo-700", label: "Sales phone" },
  { key: "address", icon: FaMapMarkerAlt, tint: "bg-amber-100 text-amber-700", label: "Office" },
];

export default function ContactPage() {
  const { contact } = useWebsiteContent();
  const values = {
    email: contact.email,
    phone: contact.phone,
    sales_email: contact.sales_email,
    sales_phone: contact.sales_phone,
    address: contact.address,
  };

  return (
    <LegalPage slug="contact">
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.tint}`}>
              <card.icon />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-500">{card.label}</p>
            {(card.key === "email" || card.key === "sales_email") && <a className="mt-1 block font-semibold text-brand" href={`mailto:${values[card.key]}`}>{values[card.key]}</a>}
            {(card.key === "phone" || card.key === "sales_phone") && <a className="mt-1 block font-semibold text-brand" href={`tel:${String(values[card.key] || "").replace(/[^\d+]/g, "")}`}>{values[card.key]}</a>}
            {card.key === "address" && <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">{values.address}</p>}
          </motion.div>
        ))}
      </div>
    </LegalPage>
  );
}
