import React from "react";
import { motion } from "framer-motion";
import {
  FaCookieBite, FaEnvelope, FaExclamationTriangle, FaFileContract,
  FaGavel, FaShieldAlt, FaShippingFast, FaTrashAlt, FaUndo,
} from "react-icons/fa";
import SiteChrome from "../../components/SiteChrome";
import { pageClass, RichText, useWebsitePage } from "../../content/WebsiteContent";

const PAGE_STYLE = {
  "privacy-policy": { icon: FaShieldAlt, tint: "bg-indigo-100", text: "text-indigo-600" },
  terms: { icon: FaFileContract, tint: "bg-blue-100", text: "text-blue-600" },
  disclaimer: { icon: FaExclamationTriangle, tint: "bg-amber-100", text: "text-amber-600" },
  "refund-policy": { icon: FaUndo, tint: "bg-emerald-100", text: "text-emerald-600" },
  "cookie-policy": { icon: FaCookieBite, tint: "bg-orange-100", text: "text-orange-600" },
  "shipping-policy": { icon: FaShippingFast, tint: "bg-sky-100", text: "text-sky-600" },
  "data-deletion": { icon: FaTrashAlt, tint: "bg-rose-100", text: "text-rose-600" },
  grievance: { icon: FaGavel, tint: "bg-fuchsia-100", text: "text-fuchsia-600" },
  contact: { icon: FaEnvelope, tint: "bg-cyan-100", text: "text-cyan-600" },
};

export default function LegalPage({ slug, children }) {
  const { page, loading, error, contact } = useWebsitePage(slug);
  const style = PAGE_STYLE[slug] || PAGE_STYLE.terms;
  const Icon = style.icon;

  return (
    <SiteChrome>
      <article className={`${pageClass} py-12 sm:py-16`}>
        {loading && <p className="text-sm text-slate-500">Loading page...</p>}
        {!loading && error && !page && <p className="text-sm font-medium text-rose-600">{error}</p>}
        {page && (
          <>
            <motion.header
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-start gap-4 border-b border-slate-200 pb-8"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${style.tint} ${style.text}`}>
                <Icon className="text-xl" aria-hidden="true" />
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${style.text}`}>OneAttendance</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{page.title}</h1>
                <div className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                  <RichText text={page.description} contact={contact} />
                </div>
                {page.updated_label && <p className="mt-2 text-xs text-slate-400">Last updated: {page.updated_label}</p>}
              </div>
            </motion.header>
            {children}
            <div className="mt-8 grid gap-6">
              {page.sections.map((section, index) => (
                <motion.section
                  key={`${section.heading}-${index}`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
                >
                  <h2 className="mb-3 flex items-center gap-3 text-xl font-semibold text-slate-950">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.tint} ${style.text}`}>
                      <Icon className="text-sm" aria-hidden="true" />
                    </span>
                    {section.heading}
                  </h2>
                  <div className="text-sm leading-7 text-slate-600 sm:text-base">
                    <RichText text={section.body} contact={contact} />
                  </div>
                </motion.section>
              ))}
            </div>
          </>
        )}
      </article>
    </SiteChrome>
  );
}
