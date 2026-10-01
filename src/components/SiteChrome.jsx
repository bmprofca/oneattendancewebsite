import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { panelPath } from "../utils/panel";
import { legalLinks } from "../pages/legal/legalLinks";
import { pageClass, useWebsiteContent } from "../content/WebsiteContent";

const navLinks = [
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/contact", label: "Contact" },
];

const footerLegal = legalLinks.filter((item) => !["/pricing", "/contact"].includes(item.to));

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="OneAttendance home">
      <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="" className="h-9 w-9" />
      <span className="text-lg font-semibold tracking-tight text-brand">OneAttendance</span>
    </Link>
  );
}

function SiteHeader() {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <motion.header initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35 }} className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className={`${pageClass} flex h-16 items-center justify-between gap-4`}>
        <Brand />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `text-sm font-medium transition ${isActive ? "text-brand" : "text-slate-600 hover:text-brand"}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <a href={panelPath("/login")} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Login</a>
          <a href={panelPath("/signup")} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark">Get started</a>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {navLinks.map((item) => (
              <Link key={item.to} to={item.to} onClick={close} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                {item.label}
              </Link>
            ))}
            <a href={panelPath("/login")} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Login</a>
            <a href={panelPath("/signup")} className="mt-2 rounded-lg bg-brand px-3 py-2.5 text-center text-sm font-semibold text-white">Get started</a>
          </nav>
        </div>
      )}
    </motion.header>
  );
}

function SiteFooter() {
  const { contact } = useWebsiteContent();
  const phoneHref = `tel:${String(contact.phone || "").replace(/[^\d+]/g, "")}`;
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className={`${pageClass} grid gap-10 py-12 md:grid-cols-4`}>
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5">
            <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="" className="h-9 w-9 rounded-full bg-white" />
            <span className="text-base font-semibold text-white">OneAttendance</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">{contact.footer_text}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">Product</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/features" className="hover:text-white">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><a href={panelPath("/login")} className="hover:text-white">Login</a></li>
            <li><a href={panelPath("/signup")} className="hover:text-white">Create account</a></li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-400">Legal</p>
          <ul className="mt-4 space-y-2 text-sm">
            {footerLegal.map((item) => (
              <li key={item.to}><Link to={item.to} className="hover:text-white">{item.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/contact" className="hover:text-white">Contact page</Link></li>
            <li><a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a></li>
            <li><a href={phoneHref} className="hover:text-white">{contact.phone}</a></li>
            <li className="whitespace-pre-line leading-6 text-slate-400">{contact.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className={`${pageClass} flex flex-col gap-2 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between`}>
          <p>© 2026 OneAttendance. {contact.company_name}</p>
          <p>Workforce records for companies in India.</p>
        </div>
      </div>
    </footer>
  );
}

export default function SiteChrome({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-800">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
