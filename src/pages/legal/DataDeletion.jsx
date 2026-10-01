import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaRedo, FaSpinner } from "react-icons/fa";
import apiCall from "../../utils/api";
import LegalPage from "./LegalPage";

const emptyForm = { mobile: "", email: "", remark: "", captchaCode: "" };

const DataDeletion = () => {
  const [form, setForm] = useState(emptyForm);
  const [captcha, setCaptcha] = useState(null);
  const [captchaLoading, setCaptchaLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const loadCaptcha = async () => {
    setCaptchaLoading(true);
    setError("");
    try {
      const response = await apiCall("/data-deletion/captcha", "GET", null, null, { skipUnauthorizedRedirect: true });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to load captcha.");
      setCaptcha(data.data);
      setForm((current) => ({ ...current, captchaCode: "" }));
    } catch (loadError) {
      setCaptcha(null);
      setError(loadError.message || "Unable to load captcha.");
    } finally {
      setCaptchaLoading(false);
    }
  };

  useEffect(() => { loadCaptcha(); }, []);

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const submitRequest = async (event) => {
    event.preventDefault();
    setError("");
    const mobile = form.mobile.trim();
    const email = form.email.trim();
    const remark = form.remark.trim();
    if (!mobile) {
      setError("Mobile number is required.");
      return;
    }
    if (!remark) {
      setError("Description is required.");
      return;
    }
    if (!captcha?.captcha_id || form.captchaCode.trim().length < 5) {
      setError("Enter the captcha.");
      return;
    }
    setBusy(true);
    try {
      const response = await apiCall("/data-deletion/request", "POST", {
        mobile,
        email,
        remark,
        captcha_id: captcha.captcha_id,
        captcha_code: form.captchaCode.trim(),
      }, null, { skipUnauthorizedRedirect: true });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to submit the request.");
      setSuccess(true);
      setForm(emptyForm);
    } catch (submitError) {
      setError(submitError.message || "Unable to submit the request.");
      loadCaptcha();
    } finally {
      setBusy(false);
    }
  };

  return (
    <LegalPage slug="data-deletion">
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-slate-950">Request data deletion</h2>
        <p className="mb-5 mt-2 text-sm leading-7 text-slate-600 sm:text-base">Enter the mobile number on the account and a short description. Email is optional. This form sends a request for review. It does not delete the account immediately.</p>
        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900" role="status">
            <FaCheckCircle className="mb-3 text-2xl text-emerald-600" />
            <h3 className="font-bold">Deletion request submitted</h3>
            <p className="mt-1">We received your request and will review it using the mobile number you provided.</p>
            <button
              type="button"
              onClick={() => { setSuccess(false); loadCaptcha(); }}
              className="mt-4 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-800"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={submitRequest} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
            {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700" role="alert">{error}</p>}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="deletion-mobile">Mobile number <span className="text-red-500">*</span></label>
              <input
                id="deletion-mobile"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                value={form.mobile}
                onChange={updateField("mobile")}
                placeholder="10-digit mobile number"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="deletion-email">Email</label>
              <input
                id="deletion-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={updateField("email")}
                placeholder="Optional"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="deletion-remark">Description <span className="text-red-500">*</span></label>
              <textarea
                id="deletion-remark"
                rows={4}
                maxLength={1000}
                required
                value={form.remark}
                onChange={updateField("remark")}
                placeholder="Why you want this data deleted"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="deletion-captcha">Captcha</label>
              <div className="mb-3 flex items-center gap-3">
                {captchaLoading ? (
                  <div className="flex h-[58px] w-[180px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
                    <FaSpinner className="animate-spin" />
                  </div>
                ) : captcha?.image ? (
                  <img
                    src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(captcha.image)}`}
                    alt="Captcha"
                    className="h-[58px] rounded-lg border border-slate-200"
                  />
                ) : (
                  <div className="flex h-[58px] items-center rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">Captcha unavailable</div>
                )}
                <button
                  type="button"
                  onClick={loadCaptcha}
                  disabled={captchaLoading || busy}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <FaRedo className={captchaLoading ? "animate-spin" : ""} />
                  Refresh
                </button>
              </div>
              <input
                id="deletion-captcha"
                value={form.captchaCode}
                onChange={(event) => setForm((current) => ({ ...current, captchaCode: event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5) }))}
                autoComplete="off"
                required
                placeholder="Enter the characters"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-mono tracking-[0.3em] outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              disabled={busy || captchaLoading || !captcha}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy && <FaSpinner className="animate-spin" />}
              {busy ? "Submitting..." : "Submit request"}
            </button>
          </form>
        )}
      </section>
    </LegalPage>
  );
};

export default DataDeletion;
