import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import apiCall from "../utils/api";

export const pageClass = "mx-auto w-full max-w-6xl px-4 sm:px-6";

const FALLBACK_CONTACT = {
  company_name: "OneSaaS Technologies Private Limited",
  email: "support@onesaas.in",
  phone: "+91 9826000001",
  sales_email: "sales@onesaas.in",
  sales_phone: "+91 9826000000",
  address: "123 Business Park, Sector 62\nNoida, Uttar Pradesh 201301\nIndia",
  footer_text: "Attendance, leave, and payroll for teams that need a clear record of the workday.",
};

const WebsiteContentContext = createContext(null);

export function WebsiteContentProvider({ children }) {
  const [contact, setContact] = useState(FALLBACK_CONTACT);
  const [pages, setPages] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const response = await apiCall("/website", "GET", null, null, { skipUnauthorizedRedirect: true });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Unable to load website content");
        if (!active) return;
        setContact({ ...FALLBACK_CONTACT, ...(result.data?.contact || {}) });
        setPages(result.data?.pages || []);
        setFaqs(Array.isArray(result.data?.faqs) ? result.data.faqs : []);
      } catch (loadError) {
        if (active) setError(loadError.message || "Unable to load website content");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const value = useMemo(() => ({ contact, pages, faqs, loading, error }), [contact, pages, faqs, loading, error]);
  return <WebsiteContentContext.Provider value={value}>{children}</WebsiteContentContext.Provider>;
}

export function useWebsiteContent() {
  const value = useContext(WebsiteContentContext);
  if (!value) throw new Error("Website content is unavailable");
  return value;
}

export function useWebsitePage(slug) {
  const { pages, loading, error, contact } = useWebsiteContent();
  const page = pages.find((item) => item.slug === slug) || null;
  return { page, loading, error, contact };
}

const applyTokens = (text, contact) => String(text || "")
  .replaceAll("{{company}}", contact.company_name || "")
  .replaceAll("{{email}}", contact.email || "")
  .replaceAll("{{phone}}", contact.phone || "")
  .replaceAll("{{sales_email}}", contact.sales_email || "")
  .replaceAll("{{sales_phone}}", contact.sales_phone || "")
  .replaceAll("{{address}}", contact.address || "");

const safeHref = (href) => {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("https://")) return href;
  return null;
};

function renderInline(text) {
  const nodes = [];
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  let match;
  let index = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={index} className="font-semibold text-slate-900">{token.slice(2, -2)}</strong>);
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
      const href = link ? safeHref(link[2]) : null;
      if (link && href) {
        const className = "font-semibold text-brand";
        nodes.push(href.startsWith("/")
          ? <Link key={index} to={href} className={className}>{link[1]}</Link>
          : <a key={index} href={href} className={className}>{link[1]}</a>);
      } else {
        nodes.push(token);
      }
    }
    last = pattern.lastIndex;
    index += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function RichText({ text, contact }) {
  const source = applyTokens(text, contact);
  const paragraphs = source.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);
  return (
    <div className="space-y-3">
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 80)}>
          {paragraph.split("\n").map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              {lineIndex > 0 && <br />}
              {renderInline(line)}
            </React.Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}
