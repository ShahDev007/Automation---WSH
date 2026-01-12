import { useMemo, useState } from "react";
import "./App.css";

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "";

const SERVICE_OPTIONS = ["Bathroom", "Kitchen", "Windows", "Doors", "Other"];
const CONTACT_OPTIONS = ["Email", "Phone"];
const TIME_OPTIONS = ["Morning", "Afternoon", "Evening"];

function normalizePhone(input) {
  return String(input || "").replace(/[^\d+]/g, "").slice(0, 20);
}

function isValidZip(zip) {
  const z = String(zip || "").trim();
  return /^\d{5}(-\d{4})?$/.test(z); // 12345 or 12345-6789
}

export default function App() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    zip: "",
    address: "",
    preferredContact: "Email",
    preferredTime: "Afternoon",
    serviceRequested: "Bathroom",
    leadNotes: "",
  });

  const [status, setStatus] = useState({ type: "idle", message: "" }); // idle|loading|success|error
  const [lastResponse, setLastResponse] = useState(null);

  const validation = useMemo(() => {
    const fullNameOk = form.fullName.trim().length > 0;
    const zipOk = isValidZip(form.zip);
    const emailOk = form.email.trim().length > 0;
    const phoneOk = form.phone.trim().length > 0;
    const contactOk = emailOk || phoneOk;

    const errors = [];
    if (!fullNameOk) errors.push("Full Name is required.");
    if (!zipOk) errors.push("ZIP must be a valid 5-digit ZIP (or ZIP+4).");
    if (!contactOk) errors.push("Please provide Email or Phone.");

    return { ok: errors.length === 0, errors };
  }, [form]);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLastResponse(null);

    if (!validation.ok) {
      setStatus({ type: "error", message: validation.errors[0] });
      return;
    }

    setStatus({ type: "loading", message: "Submitting lead..." });

    // Match your n8n payload keys exactly
    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: normalizePhone(form.phone),
      zip: form.zip.trim(),
      address: form.address.trim(),
      preferredContact: form.preferredContact,
      preferredTime: form.preferredTime,
      serviceRequested: form.serviceRequested,
      leadNotes: form.leadNotes.trim(),
    };

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // n8n may return {ok:true} or plain text depending on your webhook node settings
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = { raw: text };
      }

      if (!res.ok) {
        setStatus({
          type: "error",
          message: `Request failed (${res.status}). Check webhook URL / n8n execution.`,
        });
        setLastResponse(data);
        return;
      }

      setStatus({ type: "success", message: "Submitted ✅ Lead sent to automation." });
      setLastResponse(data);

      // Optional: clear a few fields (keep dropdown selections)
      setForm((prev) => ({
        ...prev,
        fullName: "",
        email: "",
        phone: "",
        zip: "",
        address: "",
        leadNotes: "",
      }));
    } catch (err) {
      setStatus({
        type: "error",
        message: "Network error. Check webhook URL, CORS, or internet.",
      });
      setLastResponse({ error: String(err) });
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Lead Intake (Demo)</h1>
          <p className="subtitle">Sends leads to n8n → OpenAI → Airtable → Email</p>
        </div>
        <div className="pill">West Shore Home demo</div>
      </header>

      <main className="grid">
        <section className="card">
          <h2>Customer Details</h2>

          {status.type !== "idle" && (
            <div className={`banner ${status.type}`}>
              <strong>
                {status.type === "loading"
                  ? "Working"
                  : status.type === "success"
                  ? "Success"
                  : "Error"}
                :
              </strong>{" "}
              {status.message}
            </div>
          )}

          <form onSubmit={onSubmit} className="form">
            <div className="row">
              <label>
                Full Name *
                <input
                  value={form.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  placeholder="Sam Demo"
                  autoComplete="name"
                />
              </label>

              <label>
                ZIP *
                <input
                  value={form.zip}
                  onChange={(e) => updateField("zip", e.target.value)}
                  placeholder="17110"
                  inputMode="numeric"
                  autoComplete="postal-code"
                />
              </label>
            </div>

            <div className="row">
              <label>
                Email
                <input
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="sam@example.com"
                  autoComplete="email"
                />
              </label>

              <label>
                Phone
                <input
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="(619) 379-7248"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </label>
            </div>

            <label>
              Address
              <input
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="123 Market St"
                autoComplete="street-address"
              />
            </label>

            <div className="row">
              <label>
                Preferred Contact
                <select
                  value={form.preferredContact}
                  onChange={(e) => updateField("preferredContact", e.target.value)}
                >
                  {CONTACT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Preferred Time
                <select
                  value={form.preferredTime}
                  onChange={(e) => updateField("preferredTime", e.target.value)}
                >
                  {TIME_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Service Requested
              <select
                value={form.serviceRequested}
                onChange={(e) => updateField("serviceRequested", e.target.value)}
              >
                {SERVICE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Lead Notes
              <textarea
                value={form.leadNotes}
                onChange={(e) => updateField("leadNotes", e.target.value)}
                placeholder="Need bathroom remodel, want quote this month. Ready to schedule consultation."
                rows={4}
              />
            </label>

            {!validation.ok && (
              <div className="hint">
                <strong>Fix:</strong> {validation.errors.join(" ")}
              </div>
            )}

            <button className="btn" type="submit" disabled={status.type === "loading"}>
              {status.type === "loading" ? "Submitting..." : "Submit Lead"}
            </button>

            <p className="fineprint">
              * Required: Full Name, ZIP, and Email or Phone.
            </p>
          </form>
        </section>

        <section className="card">
          <h2>Debug</h2>
          <p className="subtitle">
            Shows the raw response from n8n (useful during demo + testing).
          </p>

          <div className="debugBox">
            <div className="debugTitle">Webhook URL</div>
            <code className="code">{WEBHOOK_URL || "PASTE_YOUR_URL_HERE"}</code>
          </div>

          <div className="debugBox">
            <div className="debugTitle">Last Response</div>
            <pre className="pre">
              {lastResponse ? JSON.stringify(lastResponse, null, 2) : "(none yet)"}
            </pre>
          </div>

          <div className="debugBox">
            <div className="debugTitle">Current Payload Preview</div>
            <pre className="pre">{JSON.stringify(form, null, 2)}</pre>
          </div>
        </section>
      </main>
    </div>
  );
}
