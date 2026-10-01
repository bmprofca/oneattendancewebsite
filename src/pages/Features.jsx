import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight, FaClock, FaFingerprint, FaMobileAlt, FaQrcode,
  FaShieldAlt, FaUserFriends, FaWallet,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import SiteChrome from "../components/SiteChrome";
import { pageClass } from "../content/WebsiteContent";
import { panelPath } from "../utils/panel";

const groups = [
  {
    icon: FaClock,
    tint: "bg-blue-100 text-blue-700",
    title: "Attendance",
    text: "Record clock-ins, clock-outs, and breaks against the shift the company assigned.",
    points: ["Manual attendance for a supervised workplace", "GPS and QR when people work away from one office", "IP checks for a known network", "Face or fingerprint when the company enrolls that method"],
  },
  {
    icon: FaUserFriends,
    tint: "bg-violet-100 text-violet-700",
    title: "People and permissions",
    text: "A company invites employees and decides what each role can see or change.",
    points: ["Owner, manager, and employee access", "Invitations instead of shared passwords", "More than one company on the same account, with a selected workspace"],
  },
  {
    icon: MdLocationOn,
    tint: "bg-emerald-100 text-emerald-700",
    title: "Shifts and leave",
    text: "Time off and work schedules stay next to the attendance record.",
    points: ["Shift setup with the company's own timings", "Leave requests and balances", "Holiday calendars for the company"],
  },
  {
    icon: FaWallet,
    tint: "bg-rose-100 text-rose-700",
    title: "Salary and payroll",
    text: "Salary structure, payroll, and ledger entries give the company a place to review money before it is treated as final.",
    points: ["Salary components and packages", "Payroll for a period", "Ledger and bank-account records kept with the company"],
  },
  {
    icon: FaMobileAlt,
    tint: "bg-amber-100 text-amber-700",
    title: "Web panel and mobile app",
    text: "Admins work in the browser. Employees can mark attendance from the Android app.",
    points: ["Panel for company setup and review", "App for attendance on the move", "The public website explains the product and pricing"],
  },
  {
    icon: FaShieldAlt,
    tint: "bg-cyan-100 text-cyan-700",
    title: "Sessions and subscriptions",
    text: "Sign-in can expire, and a company plan sets how many employees the workspace can cover.",
    points: ["Email, phone, and supported social sign-in", "Sessions that can be logged out", "Plans by team size and billing period"],
  },
];

export default function Features() {
  return (
    <SiteChrome>
      <section className="border-b border-slate-200 bg-gradient-to-br from-violet-50 via-white to-blue-50">
        <div className={`${pageClass} py-16 lg:py-20`}>
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-sm font-semibold uppercase tracking-[0.16em] text-violet-700">Features</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            What the company can run in OneAttendance
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Each area below is part of the product. A company turns on the attendance methods it wants and assigns people only the access they need.
          </motion.p>
        </div>
      </section>
      <section className={`${pageClass} grid gap-5 py-14 md:grid-cols-2`}>
        {groups.map((group, index) => (
          <motion.article
            key={group.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: (index % 2) * 0.06 }}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${group.tint}`}>
              <group.icon className="text-lg" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-slate-950">{group.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{group.text}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              {group.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <FaFingerprint className="mt-1 shrink-0 text-xs text-brand" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </section>
      <section className={`${pageClass} pb-16`}>
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-brand px-6 py-8 text-white sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Ready to set up a company?</h2>
            <p className="mt-1 text-sm text-blue-100">Create an account or compare plans for your team size.</p>
          </div>
          <div className="flex gap-3">
            <a href={panelPath("/signup")} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-brand">Create account <FaArrowRight className="text-xs" /></a>
            <Link to="/pricing" className="inline-flex items-center gap-2 rounded-lg border border-blue-300 px-4 py-2.5 text-sm font-semibold text-white"><FaQrcode className="text-xs" /> Pricing</Link>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
