# 🏠 West Shore Home – AI-Powered Lead Intake & Routing Automation

**Live Demo (Frontend):**  
👉 [https://automation-wsh.vercel.app/](https://automation-wsh.vercel.app/)

**Project Type:** AI + Automation Workflow Demo  
**Role Alignment:** Junior AI Automation Specialist (West Shore Home)  
**Location Context:** Onsite operations, high-volume lead workflows

---

## 📌 Overview

This project is an **end-to-end AI-powered lead intake and automation system** designed around the operational needs of **West Shore Home**.

West Shore Home handles a large volume of inbound customer leads across services such as bathrooms, kitchens, windows, and doors. These leads typically require manual review to determine urgency, route to the correct representative, and gather missing information before follow-up.

This system automates that process while keeping decisions **explainable, reliable, and auditable**.

---

## 🎯 Business Problem

Manual lead triage creates:
- Delays in customer follow-up
- Inconsistent urgency assessment
- Human error in routing
- Limited context for sales reps before first contact

This project demonstrates how **AI + workflow automation** can reduce manual effort while preserving human oversight.

---

## 🧠 What the System Does (End-to-End)

### 1️⃣ Lead Intake (Frontend)
- A customer submits a lead through a React web form
- Basic validation ensures required fields (name, ZIP, contact info) are present

### 2️⃣ Automation Trigger (n8n)
- The form submits data to a production webhook
- Payload is normalized into a consistent structure for downstream steps

### 3️⃣ AI Enrichment (OpenAI)
AI analyzes unstructured lead notes and generates:
- Lead intent (High / Medium / Low)
- Urgency level
- A concise AI summary for sales reps
- Red flags (insurance claims, water damage, mold, etc.)
- Missing information needed to proceed
- Suggested first follow-up message

AI output is **strictly structured JSON** and defensively parsed to prevent workflow failures.

### 4️⃣ Deterministic Routing
- ZIP code is mapped to a territory using prefix rules
- Lead is assigned to a representative based on territory
- A clear routing reason is recorded for transparency
- Safe fallback logic applies if a ZIP is unmapped

### 5️⃣ System of Record (Airtable)
- All enriched lead data is stored in Airtable
- Airtable acts as a lightweight CRM and operational dashboard
- Sales and operations teams work from the same source of truth

### 6️⃣ Notification
- Assigned representative receives an email notification
- Email is informational only — not the system of record

### 7️⃣ Audit & Reliability
- Every automation run is logged
- Errors and fallbacks are surfaced, not hidden
- No silent failures

---

## 🏗️ Architecture

```
React (Vite)
    ↓
n8n Webhook
    ↓
Normalize & Validate Lead Data
    ↓
OpenAI (AI Classification & Enrichment)
    ↓
Defensive JSON Parsing
    ↓
ZIP-Based Territory & Rep Routing
    ↓
Airtable (Leads + Automation Runs)
    ↓
Email Notification
```

---

## 🧰 Technology Stack

| Layer | Technology |
|------|-----------|
| Frontend | React + Vite |
| Automation | n8n (Cloud) |
| AI | OpenAI API |
| Data Store | Airtable |
| Notifications | Gmail |
| Deployment | Vercel |

---

## 📊 Airtable Data Model

### Leads Table (Primary Record)
- Full Name
- Email
- Phone
- ZIP Code
- Address
- Service Requested
- Lead Notes
- **AI Summary**
- **AI Intent**
- **AI Urgency**
- **AI Red Flags**
- **AI Missing Info**
- **AI Next Message**
- **Assigned Rep**
- **Territory**
- **Routing Reason**
- Automation Status
- Created At

### Automation Runs Table (Audit Log)
- Run Timestamp
- Workflow Step
- Status
- Error Summary (if any)
- Raw Payload (optional)

---

## 🌐 Live Demo

👉 https://your-vercel-app.vercel.app  

### Suggested Demo Scenarios
- High-intent bathroom remodel → AI flags urgency and readiness
- Lead missing contact details → AI highlights missing info
- Different ZIP codes → deterministic territory routing

---

## 🧪 Local Development

### Frontend Setup

```bash
git clone https://github.com/shahdev007/wsh-ai-lead-automation.git .
cd frontend
npm install
npm run dev
```

Create a `.env` file:

```env
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.app.n8n.cloud/webhook/lead-intake
```

### n8n Workflow Setup

1. Import the workflow JSON from `/n8n-workflows/lead-intake-workflow.json`
2. Configure credentials:
   - OpenAI API Key
   - Airtable API Key & Base ID
   - Gmail SMTP credentials
3. Update webhook URL in frontend `.env`
4. Test with sample payloads

---

## 🧠 Design Principles

**AI is advisory, not authoritative**  
Business-critical routing remains deterministic and explainable.

**Explainability over automation magic**  
Every decision (AI or rule-based) has a visible reason.

**Email is not the source of truth**  
Airtable holds structured, queryable lead intelligence.

**Graceful failure handling**  
AI parsing issues and routing fallbacks are logged and visible.

**Built for scale**  
Additional workflows, SLA logic, or CRM integrations can be added without re-architecting the system.

---

## 🔮 Future Enhancements

- SLA timers and follow-up enforcement
- CRM integrations (Salesforce / HubSpot)
- Lead deduplication
- AI confidence scoring
- Auto-generated rep follow-up drafts

---

## 🎤 Interview Talking Points

- How AI is used only where rules fall short (unstructured text)
- Why explainable routing builds trust with operations teams
- How this reduces manual workload without removing human oversight
- How this system could integrate with West Shore Home's existing tools

---

## 📄 License

MIT

---

## 👤 Author

Built by [Dev Shah] as a portfolio demonstration for AI automation engineering roles.

**Contact:** your.email@example.com  
**LinkedIn:** https://linkedin.com/in/yourprofile  
**Portfolio:** https://yourportfolio.com
