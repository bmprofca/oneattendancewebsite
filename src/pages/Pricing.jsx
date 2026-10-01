import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SiteChrome from '../components/SiteChrome';
import { pageClass } from '../content/WebsiteContent';
import {
  FaUsers, FaArrowRight, FaSpinner, FaExclamationTriangle,
  FaRocket, FaShieldAlt, FaClock, FaBuilding, FaLock,
} from 'react-icons/fa';
import apiCall from '../utils/api';
import { panelPath } from '../utils/panel';

const DURATION_OPTIONS = [
  { key: 'monthly_price', label: 'Monthly', suffix: '/mo', billedLabel: 'billed monthly', months: 1 },
  { key: 'quarterly_price', label: 'Quarterly', suffix: '/qtr', billedLabel: 'billed quarterly', months: 3 },
  { key: 'half_yearly_price', label: 'Half-yearly', suffix: '/6 mo', billedLabel: 'billed every 6 months', months: 6 },
  { key: 'yearly_price', label: 'Yearly', suffix: '/yr', billedLabel: 'billed yearly', months: 12 },
];

const fmt = (value) => {
  if (!value && value !== 0) return '—';
  const num = parseFloat(value);
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const DurButton = ({ duration, isSelected, price, monthlyPrice, employees, onClick }) => {
  const priceNum = price != null ? parseFloat(price) : null;
  const basePrice = monthlyPrice != null ? parseFloat(monthlyPrice) * duration.months : null;
  let discount = 0;
  if (basePrice > 0 && priceNum != null && basePrice > priceNum) {
    discount = Math.round(((basePrice - priceNum) / basePrice) * 100);
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`relative flex-1 cursor-pointer rounded-xl p-3 sm:p-4 text-center transition-all duration-200 select-none ${isSelected
        ? 'bg-white border-2 border-brand shadow-sm'
        : 'bg-white border border-gray-200 hover:border-gray-300'
      }`}
    >
      {discount > 0 && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-green-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
          Save {discount}%
        </span>
      )}
      <p className={`text-[12px] font-semibold mb-1 ${isSelected ? 'text-brand' : 'text-gray-500'}`}>
        {duration.label}
      </p>
      <p className="text-[17px] font-semibold text-gray-800">
        {priceNum != null && !isNaN(priceNum) ? fmt(priceNum) : '—'}
      </p>
      {priceNum != null && !isNaN(priceNum) && employees > 0 && (
        <p className="text-[11px] text-gray-400 mt-0.5">
          {fmt(priceNum / employees)}{duration.suffix}
        </p>
      )}
    </motion.div>
  );
};

export default function Pricing() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState(25);
  const [selectedDur, setSelectedDur] = useState(DURATION_OPTIONS[0]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await apiCall('/subscriptions/public-packages', 'GET', null, null, { skipUnauthorizedRedirect: true });
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) setPackages(result.data);
        else throw new Error(result.message || 'Invalid API response');
      } catch (err) {
        console.error('API Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sortedPackages = useMemo(
    () => [...packages].sort((a, b) => (a.min_employee_count || 0) - (b.min_employee_count || 0)),
    [packages],
  );

  const sliderStops = useMemo(() => {
    const stops = sortedPackages
      .flatMap((pkg, index) => [
        index === 0 ? Number(pkg.min_employee_count) : null,
        Number(pkg.max_employee_count),
      ])
      .filter((value) => Number.isFinite(value));
    return [...new Set(stops)].sort((a, b) => a - b);
  }, [sortedPackages]);

  const snapEmployeesToPackageLimit = (value) => {
    if (!sliderStops.length) return Number(value) || 1;
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return sliderStops[0];
    return sliderStops.reduce((closest, stop) => {
      const currentDistance = Math.abs(stop - numericValue);
      const closestDistance = Math.abs(closest - numericValue);
      if (currentDistance < closestDistance) return stop;
      if (currentDistance === closestDistance && stop > closest) return stop;
      return closest;
    }, sliderStops[0]);
  };

  const sliderMin = sliderStops[0] ?? 1;
  const sliderMax = sliderStops[sliderStops.length - 1] ?? 200;

  const currentPackage = sortedPackages.find(
    (pkg) => employees >= pkg.min_employee_count && employees <= pkg.max_employee_count,
  ) ?? null;

  const selectedPackagePrice = currentPackage ? parseFloat(currentPackage[selectedDur.key]) : null;
  const currentPrice = Number.isFinite(selectedPackagePrice) ? selectedPackagePrice : null;
  const currentMonthlyPrice = currentPackage ? parseFloat(currentPackage.monthly_price) : null;
  const basePrice = currentMonthlyPrice != null ? currentMonthlyPrice * selectedDur.months : null;

  let calculatedDiscountPct = 0;
  if (basePrice > 0 && currentPrice != null && basePrice > currentPrice) {
    calculatedDiscountPct = Math.round(((basePrice - currentPrice) / basePrice) * 100);
  }

  const pricePerUser = currentPrice != null && employees > 0 ? currentPrice / employees : null;

  useEffect(() => {
    if (!sliderStops.length) return;
    setEmployees((current) => snapEmployeesToPackageLimit(current));
  }, [sliderStops]);

  return (
    <SiteChrome>
      <div className={`${pageClass} py-12 sm:py-16`}>
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">Pricing</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Subscription pricing</h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">Choose a team size and billing period to see the plan price. Payment happens after you create an account.</p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-400">
            <FaSpinner className="animate-spin text-3xl text-blue-400" />
            <p className="text-sm">Loading subscription packages…</p>
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <FaExclamationTriangle className="mx-auto mb-3 text-3xl text-red-400" />
            <p className="mb-1 text-sm font-medium text-red-600">Failed to load packages</p>
            <p className="mb-4 text-xs text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white transition-colors hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.75fr)]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="border-b border-gray-100 p-4 sm:p-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">Billing period</p>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
                  {DURATION_OPTIONS.map((dur) => (
                    <DurButton
                      key={dur.key}
                      duration={dur}
                      isSelected={selectedDur.key === dur.key}
                      price={currentPackage ? currentPackage[dur.key] : null}
                      monthlyPrice={currentPackage ? currentPackage.monthly_price : null}
                      employees={employees}
                      onClick={() => setSelectedDur(dur)}
                    />
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-gray-400">Price calculator</p>

                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-[13px] text-gray-600">
                      <FaUsers className="text-[11px] text-blue-400" />
                      Employees
                    </label>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={employees}
                        initial={{ scale: 1.15, color: '#3b82f6' }}
                        animate={{ scale: 1, color: '#1f2937' }}
                        transition={{ duration: 0.2 }}
                        className="text-[18px] font-semibold text-gray-800"
                      >
                        {employees}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                  <input
                    type="range"
                    min={sliderMin}
                    max={sliderMax}
                    value={employees}
                    step={1}
                    onChange={(e) => setEmployees(snapEmployeesToPackageLimit(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-blue-500"
                  />
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-gray-500">
                    {sortedPackages.map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => setEmployees(Number(pkg.max_employee_count))}
                        className={`rounded-md border px-2 py-1 transition-all ${currentPackage?.id === pkg.id
                          ? 'border-blue-200 bg-blue-50 font-bold text-blue-700 shadow-sm'
                          : 'border-gray-200 bg-white font-medium hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        title={`${pkg.min_employee_count}-${pkg.max_employee_count} employees`}
                      >
                        {pkg.min_employee_count}-{pkg.max_employee_count}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-5 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-[13px]">
                  <span className="text-gray-500">Your package</span>
                  <AnimatePresence mode="wait">
                    {currentPackage ? (
                      <motion.span
                        key={currentPackage.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="rounded-full bg-blue-50 px-3 py-1 text-[12px] font-semibold text-blue-700"
                      >
                        {currentPackage.name}
                      </motion.span>
                    ) : (
                      <span className="text-[12px] text-gray-400">Select employee range</span>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mb-5 space-y-0 border-y border-gray-100">
                  {[
                    {
                      label: 'Base price',
                      value: currentPrice != null ? fmt(basePrice != null && basePrice > currentPrice ? basePrice : currentPrice) : '—',
                      valueClass: 'font-medium text-gray-800',
                    },
                    {
                      label: 'Per employee',
                      value: pricePerUser ? `${fmt(pricePerUser)}${selectedDur.suffix}` : '—',
                      valueClass: 'text-gray-600',
                    },
                    ...(basePrice != null && basePrice > currentPrice && currentPrice != null ? [{
                      label: (
                        <span className="flex items-center gap-1 text-green-600">
                          <FaRocket className="text-[10px]" /> You save ({calculatedDiscountPct}%)
                        </span>
                      ),
                      value: `-${fmt(basePrice - currentPrice)}`,
                      valueClass: 'font-medium text-green-600',
                    }] : []),
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between border-b border-gray-100 py-2.5 text-[13px] last:border-0">
                      <span className="text-gray-500">{row.label}</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={String(row.value)}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={row.valueClass}
                        >
                          {row.value}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

                <div className="mb-5 flex items-baseline justify-between rounded-xl bg-gray-50 px-4 py-4">
                  <div>
                    <p className="text-[13px] font-medium text-gray-500">Estimated total</p>
                    {currentPrice != null && (
                      <p className="mt-0.5 text-[11px] text-gray-400">{selectedDur.billedLabel}</p>
                    )}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentPrice}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-[24px] font-semibold text-gray-800 sm:text-[28px]"
                    >
                      {currentPrice != null ? fmt(currentPrice) : '—'}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <a
                  href={panelPath('/signup')}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-[14px] font-semibold text-white transition hover:bg-brand-dark"
                >
                  Get started <FaArrowRight className="text-[11px]" />
                </a>

                <div className="mt-4 flex items-center justify-center gap-5 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1"><FaShieldAlt /> Secure checkout</span>
                  <span className="flex items-center gap-1"><FaLock /> 256-bit SSL</span>
                  <span className="flex items-center gap-1"><FaClock /> Cancel anytime</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative flex flex-col gap-5 overflow-hidden rounded-xl bg-gradient-to-br from-slate-900 to-blue-950 p-6 text-white shadow-xl"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500 opacity-20 blur-3xl" />
              <div className="relative z-10 text-center md:text-left">
                <h2 className="flex items-center justify-center gap-2.5 text-xl font-bold md:justify-start">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-blue-400">
                    <FaBuilding size={16} />
                  </span>
                  Enterprise & Custom Plans
                </h2>
                <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-slate-300">
                  Need a custom offer or want to manage more employees? Contact our sales team for a tailored solution designed for your business scale.
                </p>
              </div>
              <Link
                to="/contact"
                className="relative z-10 flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl bg-brand px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-brand-dark"
              >
                Contact Sales
                <FaArrowRight size={12} />
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </SiteChrome>
  );
}
