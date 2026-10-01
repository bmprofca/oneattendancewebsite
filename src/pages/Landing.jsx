import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowRight, FaBuilding, FaCalendarCheck, FaClock, FaGooglePlay, FaMapMarkerAlt,
  FaMoneyBillWave, FaUserShield,
} from "react-icons/fa";
import SiteChrome from "../components/SiteChrome";
import { pageClass } from "../content/WebsiteContent";
import { panelPath } from "../utils/panel";

const useCases = [
  { icon: FaMapMarkerAlt, tint: "bg-blue-100 text-blue-700", title: "Field teams", text: "Supervisors can see GPS or QR attendance from people who are not at a single desk. The record still belongs to the company that enabled that method." },
  { icon: FaBuilding, tint: "bg-violet-100 text-violet-700", title: "Office teams", text: "A fixed workplace can use IP or manual attendance, then review the same day beside leave and shift rules." },
  { icon: FaClock, tint: "bg-amber-100 text-amber-700", title: "Shift work", text: "Morning, evening, and rotating shifts stay on one calendar so late arrivals and breaks are read against the shift that was assigned." },
  { icon: FaCalendarCheck, tint: "bg-emerald-100 text-emerald-700", title: "Leave before payroll", text: "Approved leave sits next to attendance, so a payroll period is not closed while a request is still open." },
  { icon: FaMoneyBillWave, tint: "bg-rose-100 text-rose-700", title: "Salary review", text: "Salary, payroll, and ledger screens give the owner a place to check figures before wages are paid or a report is shared." },
  { icon: FaUserShield, tint: "bg-cyan-100 text-cyan-700", title: "More than one role", text: "Owners, managers, and employees do not need the same screen. Invitations and permissions decide who can change a record." },
];

const day = [
  { time: "Start of day", title: "The shift opens", text: "Employees mark attendance with the method the company turned on. Managers see who is present, on leave, or still missing." },
  { time: "During the day", title: "Exceptions stay visible", text: "A late clock-in, a break, or a leave request stays on the same workspace instead of moving into a separate spreadsheet." },
  { time: "End of month", title: "Review, then pay", text: "Attendance, leave, and salary can be checked together before the company treats the payroll numbers as final." },
];

export default function LandingPage() {
  return (
    <SiteChrome>
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <motion.div
          className="pointer-events-none absolute -left-16 top-10 h-56 w-56 rounded-full bg-blue-300/40 blur-3xl"
          animate={{ y: [0, 24, 0], x: [0, 12, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute right-0 top-24 h-64 w-64 rounded-full bg-emerald-300/40 blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className={`${pageClass} relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24`}>
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand shadow-sm"
            >
              Workforce platform
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl"
            >
              A clear record of who worked, who was away, and what payroll shows
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="mt-5 max-w-xl text-lg leading-8 text-slate-600"
            >
              OneAttendance is for companies that need attendance, leave, shifts, and payroll in one workspace. The company chooses the attendance method. People with permission review the result before they rely on it.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <a href={panelPath("/signup")} className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark">
                Create account <FaArrowRight className="text-xs" />
              </a>
              <a href="https://play.google.com/store/apps/details?id=in.onesaas.attendance" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand bg-white px-5 py-3 text-sm font-semibold text-brand transition hover:bg-blue-50">
                <FaGooglePlay /> Download the app
              </a>
              <Link to="/features" className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
                Explore features
              </Link>
            </motion.div>
          </div>
          <div className="relative">
            {[
              { delay: 0.15, tint: "bg-brand", label: "Attendance", value: "Morning shift is open", note: "GPS, QR, IP, face, or manual" },
              { delay: 0.28, tint: "bg-emerald-600", label: "Leave", value: "2 requests waiting", note: "Reviewed before payroll" },
              { delay: 0.4, tint: "bg-violet-600", label: "Payroll", value: "Period ready to check", note: "Salary and attendance together" },
            ].map((card, index) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: index === 0 ? 0 : 0 }}
                transition={{ delay: card.delay, duration: 0.45 }}
                className="mb-4 rounded-2xl border border-white/80 bg-white/90 p-5 shadow-lg shadow-slate-200/70 backdrop-blur"
              >
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}>
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${card.tint}`} />
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{card.label}</p>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-slate-950">{card.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{card.note}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${pageClass} py-16 lg:py-20`}>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Use cases</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Where teams use it</h2>
          <p className="mt-3 text-base leading-7 text-slate-600">The same product covers a shop floor, a field crew, and an office. What changes is the attendance method and who is allowed to edit the records.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.tint}`}>
                <item.icon />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className={`${pageClass} py-16`}>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-950">A working day in the product</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {day.map((item, index) => (
              <motion.li
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <p className="text-sm font-semibold text-brand">{item.time}</p>
                <h3 className="mt-3 text-lg font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`${pageClass} py-16`}>
        <div className="grid items-center gap-8 rounded-3xl bg-brand px-6 py-12 text-white sm:px-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">See the feature list, then start a company</h2>
            <p className="mt-3 max-w-xl text-white/85">Attendance methods, roles, leave, payroll, and the mobile app are described on the features page. Pricing follows the size of the team.</p>
          </div>
          <div className="flex flex-col gap-3">
            <Link to="/features" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-brand transition hover:bg-blue-50">
              View features <FaArrowRight className="text-xs" />
            </Link>
            <Link to="/pricing" className="inline-flex items-center justify-center rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">See pricing</Link>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
