# 🚀 AI-Powered Lead Intake & Routing Automation

**Live Demo:**  
👉 https://<your-vercel-app>.vercel.app  

*(React frontend → n8n → OpenAI → Airtable → Email)*

---

## 📌 Overview

This project is an **AI-powered lead intake and automation system** built to reduce manual lead triage, improve routing accuracy, and provide sales teams with actionable context before first contact.

A customer submits a lead through a web form. The system automatically:
- Validates and normalizes incoming data
- Uses AI to classify intent, urgency, red flags, and missing information
- Routes the lead by territory using deterministic business rules
- Stores enriched lead data in Airtable as the system of record
- Notifies the assigned representative via email
- Logs every automation run for traceability and debugging

The focus of this project is **operational reliability, explainability, and scalability**, not just AI output.

---

## 🧠 Key Features

- **AI Classification (OpenAI)**
  - Lead intent (High / Medium / Low)
  - Urgency detection
  - Natural-language AI summary
  - Red flags identification
  - Missing critical information detection
  - Suggested next message for sales reps

- **Deterministic Territory Routing**
  - ZIP → prefix → territory mapping
  - Explainable routing reasons
  - Safe fallback assignments

- **Airtable as System of Record**
  - Structured lead intelligence
  - Clear audit trail for automation runs
  - Sales- and ops-friendly views

- **Automated Notifications**
  - Clean email alerts to assigned reps
  - Email used only as a trigger, not as a data source

- **Production-Safe Design**
  - Defensive JSON parsing for AI output
  - Graceful degradation on AI or data failures
  - No silent automation failures

---

## 🏗️ Architecture

