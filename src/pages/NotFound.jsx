import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaHome } from "react-icons/fa";
import SiteChrome from "../components/SiteChrome";
import { pageClass } from "../content/WebsiteContent";

export default function NotFound() {
  return (
    <SiteChrome>
      <section className={`${pageClass} py-20`}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-600">404</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">This page is not available</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">The address may be outdated, or the page may have moved. You can return home, open features, or compare pricing.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"><FaHome /> Back to home</Link>
            <Link to="/features" className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800">Features</Link>
            <button type="button" onClick={() => window.history.back()} className="inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-slate-600 hover:text-slate-950"><FaArrowLeft /> Go back</button>
          </div>
        </motion.div>
      </section>
    </SiteChrome>
  );
}
