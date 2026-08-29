import React, { useState, useEffect, useRef, useContext, createContext } from "react";
import {
  Rocket, FolderOpen, FilePlus2, ClipboardCheck, FileText, BarChart3, Gavel, Share2,
  History, Settings, Search, Bell, HelpCircle, Sparkles, CheckCircle2, AlertTriangle,
  AlertOctagon, Clock, TrendingUp, ClipboardList, MoreVertical, ChevronLeft, ChevronRight,
  ChevronDown, ChevronUp, Plus, X, Download, Upload, Loader2, User, LogOut, Moon, Sun,
  Eye, EyeOff, Lock, Mail, Phone, Building2, DollarSign, Target, Shield, Flag, RotateCcw,
  Edit3, Trash2, ArrowRight, ArrowLeft, Bot, MessageSquare, Command, XCircle, Check,
  PenSquare, Gauge as GaugeIcon, Menu, Calendar, Award, Zap, FileCheck2, ExternalLink,
  SlidersHorizontal, Info, ShieldCheck, FileSearch, Layers, Database, Cpu, Globe
} from "lucide-react";

/* ============================================================
   THEME — "DecisAI" Design System (by X Group)
   Corporate Modern + Glassmorphic. Deep Navy command center
   navigation, Intelligent Indigo for AI / primary actions.
============================================================ */
const T = {
  bg: "#FCF8FF",
  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerLow: "#F5F2FE",
  surfaceContainer: "#EFECF8",
  surfaceContainerHigh: "#E9E6F3",
  surfaceContainerHighest: "#E4E1ED",
  onSurface: "#1B1B23",
  onSurfaceVariant: "#464554",
  outline: "#767586",
  outlineVariant: "#E2E8F0",
  primary: "#4648D4",
  primaryContainer: "#6063EE",
  onPrimary: "#FFFFFF",
  secondary: "#565E74",
  secondaryContainer: "#DAE2FD",
  tertiary: "#904900",
  tertiaryContainer: "#B55D00",
  error: "#BA1A1A",
  errorContainer: "#FFDAD6",
  // command-center navigation
  navy: "#0F172A",
  navySoft: "#1A2540",
  navyLine: "rgba(218,226,253,0.08)",
  navyText: "#F2EFFB",
  navyTextDim: "rgba(218,226,253,0.55)",
  // functional status colors
  pass: "#16A34A",
  passBg: "#DCFCE7",
  partial: "#D97706",
  partialBg: "#FEF3C7",
  highRisk: "#EA580C",
  highRiskBg: "#FFEDD5",
  fail: "#DC2626",
  failBg: "#FEE2E2",
  info: "#2563EB",
  infoBg: "#DBEAFE",
  // dark mode
  darkBg: "#0B1020",
  darkCard: "#141B30",
  darkLine: "#27314A",
  darkText: "#E7E9F5",
  darkTextDim: "#9AA3C2",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
`;

const LOGO_DATA_URI = "data:image/png;base64,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";

/* ============================================================
   DATA — derived from TekRowe sample dataset
============================================================ */
const SECTORS = ["IT Services","Construction","Healthcare","Education","Energy","Finance","Telecom","Logistics"];

const SECTOR_DATA = {
  "IT Services": { total: 24, won: 14, winRate: 58, avgBudget: 6800000 },
  "Construction": { total: 18, won: 9, winRate: 50, avgBudget: 38000000 },
  "Healthcare": { total: 12, won: 8, winRate: 67, avgBudget: 3100000 },
  "Education": { total: 10, won: 5, winRate: 50, avgBudget: 1700000 },
  "Energy": { total: 16, won: 9, winRate: 56, avgBudget: 13500000 },
  "Finance": { total: 14, won: 8, winRate: 57, avgBudget: 18000000 },
  "Telecom": { total: 14, won: 8, winRate: 57, avgBudget: 9800000 },
  "Logistics": { total: 12, won: 7, winRate: 58, avgBudget: 3900000 },
};

const BID_MANAGERS = [
  { name: "Hira Noor", wins: 10, total: 14 },
  { name: "Nadia Ahmed", wins: 9, total: 13 },
  { name: "Sara Malik", wins: 8, total: 12 },
  { name: "Faiza Iqbal", wins: 8, total: 13 },
  { name: "Zara Hussain", wins: 7, total: 12 },
  { name: "Usman Raza", wins: 6, total: 11 },
  { name: "Kamran Ali", wins: 6, total: 11 },
  { name: "Asif Khan", wins: 5, total: 10 },
  { name: "Bilal Sheikh", wins: 5, total: 10 },
  { name: "Tariq Mehmood", wins: 4, total: 9 },
];

const CAPABILITY_LIBRARY = [
  { id: "PROJ-001", name: "FBR Tax System Modernization", client: "Federal Board of Revenue", sector: "IT Services", value: 8500000, certs: ["ISO 27001","CMMI L3"], summary: "Full-stack modernization of the national tax filing platform; 99.9% uptime; 30% cost reduction." },
  { id: "PROJ-002", name: "NADRA Identity Database Upgrade", client: "NADRA", sector: "IT Services", value: 6200000, certs: ["ISO 27001"], summary: "Migrated the national identity database to a high-availability cluster with biometric matching." },
  { id: "PROJ-003", name: "PTCL Core Network Redesign", client: "PTCL", sector: "Telecom", value: 11000000, certs: ["ISO 27001","CMMI L3"], summary: "Redesigned core fibre network architecture across six cities; cut latency by 40%." },
  { id: "PROJ-004", name: "NHA Highway Construction Phase II", client: "National Highway Authority", sector: "Construction", value: 45000000, certs: ["ISO 9001"], summary: "120km dual-carriageway construction including bridge sections, delivered ahead of schedule." },
  { id: "PROJ-005", name: "PIMS Hospital Management System", client: "PIMS Hospital", sector: "Healthcare", value: 3200000, certs: ["ISO 27001","HL7"], summary: "Integrated hospital management and patient records system deployed across 8 departments." },
  { id: "PROJ-006", name: "WAPDA Grid Automation", client: "WAPDA", sector: "Energy", value: 15500000, certs: ["ISO 9001","ISO 27001"], summary: "SCADA-based automation for 12 grid stations; cut outage response time by 55%." },
  { id: "PROJ-007", name: "NLC Fleet Management Platform", client: "National Logistics Cell", sector: "Logistics", value: 2800000, certs: ["ISO 9001"], summary: "Real-time GPS fleet tracking and route optimization for 400+ vehicles." },
  { id: "PROJ-008", name: "State Bank Core Banking Upgrade", client: "State Bank of Pakistan", sector: "Finance", value: 22000000, certs: ["ISO 27001","PCI-DSS"], summary: "Upgraded core banking infrastructure with zero-downtime migration across 40 branches." },
  { id: "PROJ-009", name: "HEC Learning Management System", client: "Higher Education Commission", sector: "Education", value: 1900000, certs: ["ISO 27001"], summary: "Built an LMS serving 200,000+ students across 60 universities." },
  { id: "PROJ-010", name: "Solar Microgrid Rollout — Sindh", client: "Sindh Energy Department", sector: "Energy", value: 9800000, certs: ["ISO 9001"], summary: "Deployed 18 solar microgrids powering rural healthcare and education facilities." },
  { id: "PROJ-011", name: "Cybersecurity Operations Center Setup", client: "Federal Investigation Agency", sector: "IT Services", value: 4500000, certs: ["ISO 27001","CMMI L3"], summary: "Established a 24/7 SOC with SIEM tooling and incident response playbooks." },
  { id: "PROJ-012", name: "Karachi Port Logistics ERP", client: "Karachi Port Trust", sector: "Logistics", value: 5300000, certs: ["ISO 9001","ISO 27001"], summary: "ERP system for container tracking and customs clearance automation." },
];

const COUNTRIES = [
  { name: "Pakistan", dial: "+92", flag: "🇵🇰" }, { name: "United States", dial: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", dial: "+44", flag: "🇬🇧" }, { name: "United Arab Emirates", dial: "+971", flag: "🇦🇪" },
  { name: "Saudi Arabia", dial: "+966", flag: "🇸🇦" }, { name: "India", dial: "+91", flag: "🇮🇳" },
  { name: "China", dial: "+86", flag: "🇨🇳" }, { name: "Canada", dial: "+1", flag: "🇨🇦" },
  { name: "Australia", dial: "+61", flag: "🇦🇺" }, { name: "Germany", dial: "+49", flag: "🇩🇪" },
  { name: "France", dial: "+33", flag: "🇫🇷" }, { name: "Turkey", dial: "+90", flag: "🇹🇷" },
  { name: "Qatar", dial: "+974", flag: "🇶🇦" }, { name: "Bangladesh", dial: "+880", flag: "🇧🇩" },
  { name: "Malaysia", dial: "+60", flag: "🇲🇾" }, { name: "Singapore", dial: "+65", flag: "🇸🇬" },
  { name: "South Africa", dial: "+27", flag: "🇿🇦" }, { name: "Egypt", dial: "+20", flag: "🇪🇬" },
  { name: "Nigeria", dial: "+234", flag: "🇳🇬" }, { name: "Japan", dial: "+81", flag: "🇯🇵" },
];

const SAMPLE_RFP = `REQUEST FOR PROPOSAL
Title: National Health Records Digitization Programme
Issuing Authority: Ministry of National Health Services, Regulation and Coordination
RFP Reference: MoNHSRC/IT/2026/014
Submission Deadline: 30th September 2026, 17:00 PKT
Estimated Budget Ceiling: PKR 7,200,000
Contract Duration: 18 months

1. BACKGROUND
The Ministry intends to digitize patient health records across 40 public hospitals and integrate them into a unified national health record system.

2. MANDATORY REQUIREMENTS
2.1 The Bidder must hold a valid ISO 27001 certification for information security management.
2.2 The Bidder must demonstrate a minimum of 5 years' experience delivering healthcare IT systems.
2.3 The Bidder must provide evidence of at least one HL7-compliant hospital information system implementation.
2.4 The Bidder must maintain a local support office within Pakistan.
2.5 The Bidder must have completed at least one government contract exceeding PKR 3,000,000 in value.
2.6 The proposed solution must support biometric patient identity verification.

3. EVALUATION CRITERIA
- Technical Approach and Solution Architecture: 35%
- Company Experience and Past Performance: 30%
- Financial Proposal: 25%
- Team Qualifications and Certifications: 10%

4. QUESTIONS TO BE ANSWERED IN THE PROPOSAL
Q1. Describe your proposed technical architecture for integrating 40 hospitals into a unified national health record system.
Q2. Describe your experience delivering similar healthcare digitization projects for government clients.
Q3. Describe your approach to data security, patient privacy, and compliance with ISO 27001.
Q4. Describe your implementation plan, timeline, and team structure for an 18-month rollout.

5. SUBMISSION
Proposals must be submitted electronically via the PPRA e-procurement portal no later than the deadline above. Late submissions will not be considered.`;

/* ============================================================
   TEAM X — fixed workspace identity + local persistence layer
   (no login/signup; all data is stored for the current team and
   survives page reloads, online or offline)
============================================================ */
const TEAM_X = {
  id: "TEAM-X", name: "Team X", company: "X Group", email: "xgroup266@gmail.com",
  role: "Bid Manager", joined: "2026-01-01",
};

const TEAMX_DB_KEY = "decisai_teamx_db_v1";

function loadTeamXDB() {
  try {
    return JSON.parse(localStorage.getItem(TEAMX_DB_KEY) || "{}") || {};
  } catch (e) { return {}; }
}

function saveTeamXDB(data) {
  try {
    localStorage.setItem(TEAMX_DB_KEY, JSON.stringify({ ...loadTeamXDB(), ...data }));
  } catch (e) { /* storage full/unavailable — in-memory state still works */ }
}

/* ============================================================
   UTILITIES
============================================================ */
function extractJSON(text) {
  const clean = (text || "").replace(/```json/gi, "").replace(/```/g, "").trim();
  try { return JSON.parse(clean); } catch (e) {}
  const obj = clean.match(/\{[\s\S]*\}/);
  if (obj) { try { return JSON.parse(obj[0]); } catch (e) {} }
  const arr = clean.match(/\[[\s\S]*\]/);
  if (arr) { try { return JSON.parse(arr[0]); } catch (e) {} }
  throw new Error("Could not parse AI response as JSON");
}

async function callClaude(prompt) {
  throw new Error("Browser-side Claude is disabled. Use the DecisAI backend endpoints instead.");
}

async function callClaudeText(prompt) {
  throw new Error("Browser-side Claude is disabled. Use the DecisAI backend endpoints instead.");
}

const API_BASE = "http://127.0.0.1:8000";

async function apiFetch(path, options = {}) {
  const response = await fetch(API_BASE + path, options);
  if (!response.ok) {
    let detail = "";
    try {
      const data = await response.json();
      detail = data.error || data.detail || JSON.stringify(data);
    } catch (e) {
      detail = await response.text();
    }
    throw new Error(detail || `Backend request failed (${response.status})`);
  }
  return response;
}

async function apiJSON(path, options = {}) {
  const response = await apiFetch(path, options);
  return response.json();
}

function parseAmount(amount) {
  const s = String(amount || "").toUpperCase();
  const m = s.match(/(?:PKR|RS\.?|USD|\$)?\s*([\d,.]+)\s*(M|MILLION|B|BILLION)?/);
  if (!m) return null;
  let value = Number(m[1].replace(/,/g, ""));
  if (!Number.isFinite(value)) return null;
  if (m[2] === "M" || m[2] === "MILLION") value *= 1000000;
  if (m[2] === "B" || m[2] === "BILLION") value *= 1000000000;
  return value;
}

function normalizeDecision(decision) {
  return String(decision || "").replace(/\s+/g, "_").toUpperCase();
}

function displayCriterionName(criterion) {
  return String(criterion || "").replace(/\s*[:\-–]\s*\d{1,3}\s?%\s*$/, "");
}

function confidenceForStatus(status) {
  if (status === "PASS") return 92;
  if (status === "PARTIAL") return 68;
  if (status === "FAIL") return 35;
  return 50;
}

function complianceSummaryFrom(results = []) {
  const pass = results.filter(r => r.status === "PASS").length;
  const partial = results.filter(r => r.status === "PARTIAL").length;
  const fail = results.filter(r => r.status === "FAIL").length;
  const info = results.filter(r => r.status === "INFO").length;
  const actionable = results.filter(r => r.status !== "INFO");
  const total = results.length;
  const score = actionable.length ? Math.round(((pass + partial * 0.5) / actionable.length) * 100) : 0;
  return { pass, partial, fail, info, total, score };
}

function riskForRow(row, req) {
  const text = `${req?.text || ""} ${row?.text || ""}`.toLowerCase();
  if (row.status === "FAIL" && req?.mandatory) return { level: "High", owner: "Technical Team", why: "Mandatory evidence is missing and may disqualify the bid.", action: "Provide verified capability evidence or mark NO-GO." };
  if (row.status === "PARTIAL" && req?.mandatory) return { level: "Medium", owner: "Technical Team", why: "Mandatory requirement has only partial supporting evidence.", action: "Strengthen evidence, add partner proof, or clarify compliance." };
  if (row.status === "FAIL") return { level: "Medium", owner: "Bid Manager", why: "Optional requirement is not supported by current evidence.", action: "Decide whether to add evidence or accept lower competitiveness." };
  if (row.status === "PARTIAL") return { level: "Low", owner: "Bid Manager", why: "Requirement has some evidence but should be reviewed.", action: "Review top CAP matches before submission." };
  if (row.status === "INFO") {
    const legal = /security|payment|retention|tax|legal|bank|financial|bid/i.test(text);
    return { level: legal ? "Medium" : "Low", owner: legal ? "Finance" : "Procurement", why: "Administrative clause needs manual tracking, not capability evidence.", action: "Confirm required document, amount, deadline, or approval owner." };
  }
  return null;
}

function reviewFlagsForRequirement(row, req) {
  const flags = [];
  if (!row.evidence?.length && row.status !== "INFO") flags.push("Evidence Gap");
  if (row.requirement_type === "administrative" || req?.requirement_type === "administrative") flags.push("Admin Clause");
  if (/capacity|team|cv|staff|resource/i.test(req?.text || row?.text || "") && !row.evidence?.length) flags.push("Capacity Data Missing");
  if ((row.confidence || 0) < 50 && row.status !== "INFO") flags.push("Review Required");
  if (req?.mandatory && row.status !== "PASS" && row.status !== "INFO") flags.push("Review Required");
  if (row.status === "FAIL") flags.push("Missing Capability");
  return [...new Set(flags)];
}

function reviewFlagsForDraft(draft) {
  const flags = [];
  if (draft.generation_method === "template_fallback") flags.push("LLM Fallback");
  if (draft.fallback_reason === "unsupported_capacity_claim") flags.push("Capacity Data Missing");
  if (draft.fallback_reason === "unsupported_team_claim") flags.push("Manager Input Needed");
  if (draft.confidence === "low") flags.push("Review Required");
  if (!draft.content && !draft.answer) flags.push("Missing Draft Answer");
  return flags;
}

function mapRequirement(r) {
  return {
    id: r.requirement_id,
    text: r.text,
    mandatory: !!r.mandatory,
    category: r.category || r.requirement_type || "other",
    requirement_type: r.requirement_type || "capability",
  };
}

function mapComplianceRow(row) {
  const top = row.evidence?.[0];
  return {
    ...row,
    evidence_project: top ? top.cap_id : null,
    reason: row.notes || (top ? `Best evidence is ${top.cap_id} (${top.domain}) with similarity ${top.similarity_score}.` : "No matching capability evidence found."),
    confidence: Math.round((top?.similarity_score || confidenceForStatus(row.status) / 100) * 100),
    suggested_action: row.notes || (row.status === "PASS" ? "Review and approve the evidence mapping." : row.status === "PARTIAL" ? "Review partial evidence and add supporting proof if available." : "Provide missing evidence or escalate before submission."),
  };
}

function mapDraft(draft, question) {
  return {
    id: draft.question_id,
    section: question?.question?.replace(/^Q\d+[:.)]\s*/i, "") || draft.question_id,
    content: draft.answer || "",
    approved: false,
    ...draft,
    reviewFlags: reviewFlagsForDraft(draft),
  };
}

function buildWorkspaceFromBackend(upload, extraction, match, score) {
  const requirements = (extraction.requirements || []).map(mapRequirement);
  const compliance = (match.results || []).map(mapComplianceRow);
  const firstFinancial = extraction.financials?.[0]?.amount;
  const deadline = (extraction.deadlines || []).find(d => /submission/i.test(d.context || "")) || extraction.deadlines?.[0];
  const sectorCounts = requirements.filter(r => r.requirement_type === "capability" && r.category).reduce((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});
  const sector = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "IT Services";
  return {
    id: upload.rfp_id,
    backendId: upload.rfp_id,
    createdAt: new Date().toISOString(),
    meta: {
      title: extraction.meta?.title || upload.filename || "Untitled RFP",
      issuer: extraction.meta?.issuer || "Unknown Issuer",
      reference: extraction.meta?.reference || "",
      sector: SECTORS.includes(sector) ? sector : "IT Services",
      deadline: deadline?.date || null,
      budget: parseAmount(firstFinancial),
      currency: String(firstFinancial || "").toUpperCase().includes("USD") ? "USD" : "PKR",
      duration: "-",
      extractionConfidence: extraction.extraction_method === "claude+heuristic" ? 94 : 88,
      extractionMethod: extraction.extraction_method,
      filename: upload.filename,
    },
    extraction,
    requirements,
    evaluation_criteria: (extraction.evaluation_criteria || []).map(c => ({ criterion: displayCriterionName(c.criterion), weight: c.weight_pct ?? c.weight ?? 0 })),
    questions: (extraction.questions || []).map(q => ({ id: q.question_id, section: q.question_id, question: q.question, category: q.category || "" })),
    financials: extraction.financials || [],
    deadlines: extraction.deadlines || [],
    compliance,
    complianceSummary: complianceSummaryFrom(compliance),
    draftSections: null,
    winScore: score ? {
      overall: score.overall,
      breakdown: {
        compliance: score.breakdown?.compliance || 0,
        domainMatch: score.breakdown?.domain_match || 0,
        budgetAlignment: score.breakdown?.budget_alignment || 0,
        pastWinRate: score.breakdown?.past_win_rate || 0,
        competitorScore: score.breakdown?.competitor_risk || 0,
        competitorRisk: 100 - (score.breakdown?.competitor_risk || 50),
      },
      suggestedDecision: normalizeDecision(score.decision),
      backendScore: score,
    } : null,
    decision: null,
    decisionDetails: null,
    actions: {},
    flagged: {},
    approved: {},
    version: "v1.0",
  };
}

async function downloadBackendExport(ws, format) {
  const response = await apiFetch(`/api/rfp/${ws.backendId || ws.id}/export?format=${format}`);
  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition") || "";
  const nameMatch = disposition.match(/filename="?([^"]+)"?/i);
  const filename = nameMatch?.[1] || `proposal_${ws.backendId || ws.id}.${format}`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  return { filename, blob };
}

function decisionDetailsFromWorkspace(ws, decisionResult) {
  const rows = ws.compliance || [];
  const summary = ws.complianceSummary || {};
  const risks = rows.filter(c => ["FAIL", "PARTIAL", "INFO"].includes(c.status));
  const passed = rows.filter(c => c.status === "PASS").length;
  return {
    strengths: [
      `${passed} requirement(s) have traceable evidence.`,
      `Dominant sector: ${ws.winScore?.backendScore?.dominant_sector || ws.meta.sector || "Not detected"}.`,
      `Export package is available in JSON, DOCX, and PDF.`,
    ],
    risks: [
      ...(summary.fail ? [`${summary.fail} capability gap(s) remain.`] : []),
      ...(summary.partial ? [`${summary.partial} requirement(s) need stronger evidence.`] : []),
      ...(summary.info ? [`${summary.info} admin/financial/legal clause(s) require human review.`] : []),
      ...(decisionResult?.mandatory_failures?.length ? [`Mandatory failures: ${decisionResult.mandatory_failures.join(", ")}.`] : []),
    ].slice(0, 4),
    actions: [
      ...(risks.length ? ["Assign owners for the risk register before submission."] : []),
      "Review evidence traceability and approve each claim.",
      "Confirm final GO/NO-GO decision with the bid manager.",
    ],
    rationale: decisionResult?.rationale,
    backendDecision: decisionResult,
  };
}

function fmtMoney(n, currency = "PKR") {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return currency + " " + Number(n).toLocaleString();
}

function fmtDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  const diff = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diff;
}

function passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}

function uid(prefix) {
  return prefix + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

// Functional status colors (DESIGN.md: Pass=Emerald, Partial=Amber, High Risk=Orange, Fail=Red, Info=Blue)
function statusColor(status) {
  if (status === "PASS") return T.pass;
  if (status === "PARTIAL") return T.partial;
  if (status === "FAIL") return T.fail;
  if (status === "INFO") return T.info;
  return T.secondary;
}
function statusBg(status) {
  if (status === "PASS") return T.passBg;
  if (status === "PARTIAL") return T.partialBg;
  if (status === "FAIL") return T.failBg;
  if (status === "INFO") return T.infoBg;
  return T.surfaceContainer;
}
function statusIcon(status) {
  if (status === "PASS") return CheckCircle2;
  if (status === "PARTIAL") return AlertTriangle;
  if (status === "FAIL") return XCircle;
  return Info;
}

// Decision-level colors (GO / CONDITIONAL_GO / HIGH_RISK / NO-GO)
function decisionColor(d) {
  if (d === "GO") return T.pass;
  if (d === "CONDITIONAL_GO") return T.partial;
  if (d === "HIGH_RISK") return T.highRisk;
  return T.fail;
}
function decisionBg(d) {
  if (d === "GO") return T.passBg;
  if (d === "CONDITIONAL_GO") return T.partialBg;
  if (d === "HIGH_RISK") return T.highRiskBg;
  return T.failBg;
}
function decisionIcon(d) {
  if (d === "GO") return CheckCircle2;
  if (d === "CONDITIONAL_GO") return AlertTriangle;
  if (d === "HIGH_RISK") return AlertOctagon;
  return XCircle;
}
function decisionLabel(d) {
  return { GO: "GO", CONDITIONAL_GO: "Conditional GO", HIGH_RISK: "High Risk", "NO-GO": "No-Go" }[d] || d;
}

// Shared context for cross-cutting actions (activity log, export center)
const AppContext = createContext({ logActivity: () => {}, logExport: () => {} });

/* ============================================================
   SHARED UI PRIMITIVES
============================================================ */
function inputStyle(dark) {
  return {
    width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px",
    border: "1px solid " + (dark ? T.darkLine : T.outlineVariant),
    background: dark ? T.darkBg : "#fff", color: dark ? T.darkText : T.onSurface,
    fontSize: "0.9rem", fontFamily: "'Inter',sans-serif", outline: "none",
    transition: "border-color .15s, box-shadow .15s",
  };
}

function Btn({ children, onClick, variant = "primary", size = "md", icon: Icon, full, disabled, type = "button", style }) {
  const sizes = {
    sm: { padding: "0.4rem 0.85rem", fontSize: "0.78rem", gap: "0.35rem" },
    md: { padding: "0.6rem 1.25rem", fontSize: "0.86rem", gap: "0.45rem" },
    lg: { padding: "0.8rem 1.6rem", fontSize: "0.95rem", gap: "0.55rem" },
  };
  const variants = {
    primary: { background: T.primary, color: "#fff", border: "1px solid " + T.primary, boxShadow: "0 4px 14px rgba(70,72,212,0.28)" },
    ai: { background: `linear-gradient(135deg, ${T.primary}, ${T.primaryContainer})`, color: "#fff", border: "1px solid " + T.primary, boxShadow: "0 4px 14px rgba(70,72,212,0.32)" },
    secondary: { background: "#fff", color: T.navy, border: "1px solid " + T.navy },
    outline: { background: "transparent", color: T.primary, border: "1px solid " + T.primary },
    ghost: { background: "transparent", color: T.onSurfaceVariant, border: "1px solid transparent" },
    danger: { background: T.fail, color: "#fff", border: "1px solid " + T.fail },
    success: { background: T.pass, color: "#fff", border: "1px solid " + T.pass },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", ...sizes[size], ...variants[variant],
      borderRadius: "8px", fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1, width: full ? "100%" : "auto", fontFamily: "'Inter',sans-serif",
      transition: "transform .1s, box-shadow .15s", whiteSpace: "nowrap", ...style,
    }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = "scale(0.98)"; }}
      onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {Icon && <Icon size={size === "lg" ? 18 : size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
}

function Card({ children, style, level = 1, dark }) {
  const base = {
    background: dark ? T.darkCard : "#fff",
    border: "1px solid " + (dark ? T.darkLine : T.outlineVariant),
    borderRadius: "16px",
  };
  if (level === 2) base.boxShadow = "0 4px 20px rgba(15,23,42,0.08)";
  return <div style={{ ...base, ...style }}>{children}</div>;
}

function Field({ label, error, hint, children }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      {label && <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: T.onSurfaceVariant, marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</label>}
      {children}
      {hint && !error && <div style={{ fontSize: "0.75rem", color: T.outline, marginTop: "0.3rem" }}>{hint}</div>}
      {error && <div style={{ fontSize: "0.78rem", color: T.error, marginTop: "0.3rem", fontWeight: 600 }}>{error}</div>}
    </div>
  );
}

// Pill-shaped status badge with icon — meets DESIGN.md accessibility requirement
function StatusPill({ status, label, size = "md" }) {
  const color = statusColor(status);
  const bg = statusBg(status);
  const Icon = statusIcon(status);
  const pad = size === "sm" ? "0.2rem 0.6rem" : "0.3rem 0.75rem";
  const fs = size === "sm" ? "0.68rem" : "0.74rem";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: pad, borderRadius: "999px", background: bg, color, fontWeight: 800, fontSize: fs, textTransform: "uppercase", letterSpacing: "0.03em" }}>
      <Icon size={size === "sm" ? 12 : 14} />
      {label || status}
    </span>
  );
}

function ReviewBadge({ label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.18rem 0.48rem", borderRadius: "999px", background: T.highRiskBg, color: T.highRisk, fontSize: "0.62rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.03em" }}>
      <Flag size={10} />
      {label}
    </span>
  );
}

function RiskPill({ level }) {
  const color = level === "High" ? T.fail : level === "Medium" ? T.partial : T.info;
  const bg = level === "High" ? T.failBg : level === "Medium" ? T.partialBg : T.infoBg;
  return <span style={{ padding: "0.22rem 0.58rem", borderRadius: "999px", background: bg, color, fontSize: "0.68rem", fontWeight: 900, textTransform: "uppercase" }}>{level}</span>;
}

function DecisionPill({ decision, size = "md" }) {
  if (!decision) return null;
  const color = decisionColor(decision);
  const bg = decisionBg(decision);
  const Icon = decisionIcon(decision);
  const pad = size === "sm" ? "0.2rem 0.6rem" : "0.35rem 0.85rem";
  const fs = size === "sm" ? "0.68rem" : "0.78rem";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: pad, borderRadius: "999px", background: bg, color, fontWeight: 800, fontSize: fs, textTransform: "uppercase", letterSpacing: "0.03em" }}>
      <Icon size={size === "sm" ? 13 : 15} />
      {decisionLabel(decision)}
    </span>
  );
}

function SectorBadge({ sector }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "0.25rem 0.7rem", borderRadius: "999px", background: T.secondaryContainer, color: T.primary, fontWeight: 700, fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
      {sector}
    </span>
  );
}

// Toast notifications
function Toasts({ toasts }) {
  return (
    <div style={{ position: "fixed", top: "1.1rem", left: "50%", transform: "translateX(-50%)", zIndex: 1000, display: "flex", flexDirection: "column", gap: "0.6rem", width: "min(520px, calc(100vw - 2rem))" }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: "flex", alignItems: "flex-start", gap: "0.6rem", padding: "0.75rem 1rem", borderRadius: "12px",
          background: t.type === "error" ? T.error : t.type === "warn" ? T.partial : T.navy,
          color: "#fff", fontSize: "0.88rem", fontWeight: 700, boxShadow: "0 10px 28px rgba(15,23,42,0.25)", fontFamily: "'Inter',sans-serif",
          animation: "slideIn .25s ease",
        }}>
          {t.type === "error" ? <XCircle size={18} /> : t.type === "warn" ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          <span style={{ lineHeight: 1.4 }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// Circular confidence / score ring with center label — the "AI confidence" signature element
function ConfidenceRing({ value, size = 110, color, label, sublabel }) {
  const stroke = size * 0.09;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const ringColor = color || T.primary;
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    let frame; const start = performance.now(); const dur = 800;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setAnimated(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.surfaceContainerHigh} strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={ringColor} strokeWidth={stroke}
            strokeDasharray={`${(animated/100)*c} ${c}`} strokeLinecap="round" style={{ transition: "stroke-dasharray .2s" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <span style={{ fontSize: size * 0.24, fontWeight: 800, color: T.onSurface, lineHeight: 1 }}>{Math.round(animated)}%</span>
        </div>
      </div>
      {label && <div style={{ fontWeight: 800, fontSize: "0.9rem", color: T.onSurface, textAlign: "center" }}>{label}</div>}
      {sublabel && <div style={{ fontSize: "0.75rem", color: T.onSurfaceVariant, textAlign: "center", maxWidth: "180px" }}>{sublabel}</div>}
    </div>
  );
}

function Bar({ label, value, weight, color }) {
  return (
    <div style={{ marginBottom: "0.85rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: T.onSurface }}>{label}{weight ? <span style={{ color: T.outline, fontWeight: 500 }}> · {weight}% weight</span> : null}</span>
        <span style={{ fontSize: "0.8rem", fontWeight: 800, color }}>{value}</span>
      </div>
      <div style={{ height: "8px", background: T.surfaceContainerHigh, borderRadius: "4px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${Math.max(0,Math.min(100,value))}%`, background: color, borderRadius: "4px", transition: "width .5s ease" }} />
      </div>
    </div>
  );
}

// Large radial score gauge for the Decision/Score tabs
function ScoreRing({ value, size = 160 }) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);
  const color = value >= 80 ? T.pass : value >= 60 ? T.partial : value >= 40 ? T.highRisk : T.fail;
  useEffect(() => {
    let frame; const start = performance.now(); const dur = 900;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setAnimated(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.surfaceContainerHigh} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${(animated/100)*c} ${c}`} strokeLinecap="round" style={{ transition: "stroke-dasharray .2s" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "2.2rem", fontWeight: 900, color: T.onSurface, lineHeight: 1 }}>{Math.round(animated)}</span>
        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: T.outline, textTransform: "uppercase", letterSpacing: "0.06em" }}>Win Score</span>
      </div>
    </div>
  );
}

// Animated counter for stat cards
function Counter({ value, suffix = "", prefix = "" }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let frame; const start = performance.now(); const dur = 900;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{prefix}{n.toLocaleString()}{suffix}</>;
}

function CountryPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef();
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  const filtered = COUNTRIES.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.dial.includes(q));
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={{ ...inputStyle(false), display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", width: "120px" }}>
        <span>{value.flag} {value.dial}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 50, width: "240px", background: "#fff", border: "1px solid " + T.outlineVariant, borderRadius: "10px", boxShadow: "0 8px 24px rgba(15,23,42,0.12)", maxHeight: "240px", overflowY: "auto" }}>
          <div style={{ padding: "0.5rem" }}>
            <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search country..." style={{ ...inputStyle(false), padding: "0.45rem 0.6rem", fontSize: "0.8rem" }} />
          </div>
          {filtered.map(c => (
            <div key={c.name} onClick={() => { onChange(c); setOpen(false); setQ(""); }} style={{ padding: "0.5rem 0.85rem", fontSize: "0.85rem", cursor: "pointer", display: "flex", gap: "0.5rem" }}
              onMouseEnter={e => e.currentTarget.style.background = T.surfaceContainerLow}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <span>{c.flag}</span><span style={{ flex: 1 }}>{c.name}</span><span style={{ color: T.outline }}>{c.dial}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   AUTH SHELL & SCREENS
============================================================ */
function Logo({ size = 40, textSize = "1.3rem", light }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
      <div style={{ width: size, height: size, borderRadius: "10px", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: T.navy, boxShadow: "0 4px 14px rgba(70,72,212,0.35)" }}>
        <img src={LOGO_DATA_URI} alt="X Group" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div>
        <div style={{ fontWeight: 900, fontSize: textSize, color: light ? "#fff" : T.onSurface, lineHeight: 1.1, letterSpacing: "-0.01em" }}>DecisAI</div>
        <div style={{ fontSize: "0.65rem", fontWeight: 700, color: light ? "rgba(255,255,255,0.6)" : T.outline, textTransform: "uppercase", letterSpacing: "0.12em" }}>by X Group</div>
      </div>
    </div>
  );
}

function AuthShell({ children, side }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter',sans-serif", background: T.bg }}>
      {/* Left / brand panel */}
      <div style={{
        flex: "0 0 42%", minHeight: "100vh", position: "relative", overflow: "hidden",
        background: `linear-gradient(160deg, ${T.navy} 0%, #1A2150 55%, ${T.primary} 100%)`,
        display: window.innerWidth < 860 ? "none" : "flex", flexDirection: "column",
        justifyContent: "space-between", padding: "3rem",
      }}>
        <div style={{ position: "absolute", top: "-120px", right: "-120px", width: "360px", height: "360px", borderRadius: "50%", background: "rgba(99,102,241,0.25)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "-100px", left: "-100px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(99,102,241,0.18)", filter: "blur(80px)" }} />
        <Logo light size={46} textSize="1.5rem" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ color: "#fff", fontSize: "2.1rem", fontWeight: 800, lineHeight: 1.25, letterSpacing: "-0.01em", marginBottom: "1rem" }}>{side?.title || "Precise, authoritative, AI-assisted bidding."}</h1>
          <p style={{ color: "rgba(242,239,251,0.75)", fontSize: "1rem", lineHeight: 1.6, maxWidth: "420px" }}>{side?.body || "Upload tenders, extract requirements, run compliance checks, and draft winning proposals — all in one command center."}</p>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "2rem", flexWrap: "wrap" }}>
            {(side?.chips || ["AI Extraction", "Compliance Matching", "Win Scoring", "Auto-Draft"]).map(c => (
              <span key={c} style={{ padding: "0.4rem 0.9rem", borderRadius: "999px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "0.78rem", fontWeight: 700, backdropFilter: "blur(6px)" }}>{c}</span>
            ))}
          </div>
        </div>
        <p style={{ color: "rgba(242,239,251,0.4)", fontSize: "0.75rem", position: "relative", zIndex: 1 }}>© 2026 X Group · DecisAI Enterprise</p>
      </div>

      {/* Right / form panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
        <div style={{ width: "100%", maxWidth: "440px" }}>
          {window.innerWidth < 860 && <div style={{ marginBottom: "1.75rem" }}><Logo /></div>}
          {children}
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ users, onLogin, goSignup, goForgot, demoLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Enter your email and password to continue."); return; }
    setLoading(true);
    setTimeout(() => {
      const u = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!u) { setError("We couldn't find an account with that email and password."); setLoading(false); return; }
      onLogin(u);
    }, 500);
  };

  return (
    <AuthShell side={{ title: "Welcome back, Bid Manager.", body: "Sign in to pick up where you left off — your workspaces, drafts, and win-probability scores are waiting." }}>
      <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: T.onSurface, margin: "0 0 0.25rem" }}>Sign in</h2>
      <p style={{ color: T.onSurfaceVariant, fontSize: "0.9rem", margin: "0 0 1.5rem" }}>Access your DecisAI workspace.</p>

      <form onSubmit={submit}>
        <Field label="Email address">
          <div style={{ position: "relative" }}>
            <Mail size={16} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: T.outline }} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" style={{ ...inputStyle(false), paddingLeft: "2.4rem" }}
              onFocus={e => e.target.style.boxShadow = `0 0 0 3px ${T.primary}22`} onBlur={e => e.target.style.boxShadow = "none"} />
          </div>
        </Field>
        <Field label="Password">
          <div style={{ position: "relative" }}>
            <Lock size={16} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: T.outline }} />
            <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ ...inputStyle(false), paddingLeft: "2.4rem", paddingRight: "2.4rem" }}
              onFocus={e => e.target.style.boxShadow = `0 0 0 3px ${T.primary}22`} onBlur={e => e.target.style.boxShadow = "none"} />
            <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: "absolute", right: "0.7rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: T.outline, cursor: "pointer" }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </Field>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.1rem", marginTop: "-0.5rem" }}>
          <button type="button" onClick={goForgot} style={{ background: "none", border: "none", color: T.primary, fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", padding: 0 }}>Forgot password?</button>
        </div>

        {error && <div style={{ background: T.errorContainer, color: T.error, padding: "0.65rem 0.85rem", borderRadius: "8px", fontSize: "0.83rem", marginBottom: "1rem", fontWeight: 600 }}>{error}</div>}

        <Btn full size="lg" type="submit" icon={loading ? Loader2 : ArrowRight} disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Btn>
      </form>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.25rem 0" }}>
        <div style={{ flex: 1, height: "1px", background: T.outlineVariant }} />
        <span style={{ fontSize: "0.75rem", color: T.outline, fontWeight: 700, textTransform: "uppercase" }}>or</span>
        <div style={{ flex: 1, height: "1px", background: T.outlineVariant }} />
      </div>

      <Btn full size="lg" variant="secondary" icon={Sparkles} onClick={demoLogin}>Try the demo account</Btn>

      <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.88rem", color: T.onSurfaceVariant }}>
        New to DecisAI?{" "}
        <button onClick={goSignup} style={{ background: "none", border: "none", color: T.primary, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: "0.88rem" }}>Create an account</button>
      </p>
    </AuthShell>
  );
}

function SignupScreen({ users, setUsers, onLogin, goLogin }) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const strength = passwordStrength(password);
  const strengthLabel = ["Very weak", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = [T.fail, T.fail, T.partial, T.info, T.pass][strength];

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = "Enter your full name.";
    if (!company.trim()) errs.company = "Enter your company name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email address.";
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) errs.email = "An account with this email already exists.";
    if (!/^\d{6,12}$/.test(mobile)) errs.mobile = "Enter a valid mobile number (digits only).";
    if (password.length < 8) errs.password = "Password must be at least 8 characters.";
    if (password !== confirm) errs.confirm = "Passwords do not match.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    setTimeout(() => {
      const newUser = { id: uid("USR"), name, company, email, mobile: country.dial + " " + mobile, countryFlag: country.flag, password, role: "Bid Manager", joined: new Date().toISOString().slice(0,10) };
      setUsers(u => [...u, newUser]);
      onLogin(newUser);
    }, 500);
  };

  return (
    <AuthShell side={{ title: "Bring your bid team into one workspace.", body: "Set up your enterprise account and start turning tenders into compliant, AI-assisted proposals in minutes.", chips: ["Multi-RFP Workspaces", "Capability Library", "Audit-Ready Exports"] }}>
      <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: T.onSurface, margin: "0 0 0.25rem" }}>Create your account</h2>
      <p style={{ color: T.onSurfaceVariant, fontSize: "0.9rem", margin: "0 0 1.5rem" }}>Set up DecisAI for your organization.</p>

      <form onSubmit={submit}>
        <Field label="Full name" error={errors.name}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Hira Noor" style={inputStyle(false)} />
        </Field>
        <Field label="Company name" error={errors.company}>
          <div style={{ position: "relative" }}>
            <Building2 size={16} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: T.outline }} />
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="TekRowe Technologies" style={{ ...inputStyle(false), paddingLeft: "2.4rem" }} />
          </div>
        </Field>
        <Field label="Email address" error={errors.email}>
          <div style={{ position: "relative" }}>
            <Mail size={16} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: T.outline }} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" style={{ ...inputStyle(false), paddingLeft: "2.4rem" }} />
          </div>
        </Field>
        <Field label="Mobile number" error={errors.mobile}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <CountryPicker value={country} onChange={setCountry} />
            <div style={{ position: "relative", flex: 1 }}>
              <Phone size={16} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: T.outline }} />
              <input value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g,""))} placeholder="3001234567" style={{ ...inputStyle(false), paddingLeft: "2.4rem" }} />
            </div>
          </div>
        </Field>
        <Field label="Password" error={errors.password}>
          <div style={{ position: "relative" }}>
            <Lock size={16} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: T.outline }} />
            <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" style={{ ...inputStyle(false), paddingLeft: "2.4rem", paddingRight: "2.4rem" }} />
            <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: "absolute", right: "0.7rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: T.outline, cursor: "pointer" }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {password && (
            <div style={{ marginTop: "0.5rem" }}>
              <div style={{ display: "flex", gap: "4px" }}>
                {[0,1,2,3].map(i => <div key={i} style={{ flex: 1, height: "4px", borderRadius: "2px", background: i < strength ? strengthColor : T.surfaceContainerHigh }} />)}
              </div>
              <div style={{ fontSize: "0.72rem", color: strengthColor, fontWeight: 700, marginTop: "0.25rem" }}>{strengthLabel}</div>
            </div>
          )}
        </Field>
        <Field label="Confirm password" error={errors.confirm}>
          <input type={showPw ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter your password" style={inputStyle(false)} />
        </Field>

        <Btn full size="lg" type="submit" icon={loading ? Loader2 : ArrowRight} disabled={loading} style={{ marginTop: "0.25rem" }}>{loading ? "Creating account..." : "Create account"}</Btn>
      </form>

      <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.88rem", color: T.onSurfaceVariant }}>
        Already have an account?{" "}
        <button onClick={goLogin} style={{ background: "none", border: "none", color: T.primary, fontWeight: 700, cursor: "pointer", padding: 0, fontSize: "0.88rem" }}>Sign in</button>
      </p>
    </AuthShell>
  );
}

function ForgotPasswordScreen({ users, setUsers, goLogin, pushToast }) {
  const [step, setStep] = useState(1); // 1 email, 2 code, 3 new password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [genCode, setGenCode] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const sendCode = (e) => {
    e.preventDefault();
    const u = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!u) { setError("No account found with that email address."); return; }
    setError("");
    const c = String(Math.floor(100000 + Math.random() * 900000));
    setGenCode(c);
    pushToast(`Verification code sent (demo): ${c}`, "success");
    setStep(2);
  };

  const verifyCode = (e) => {
    e.preventDefault();
    if (code !== genCode) { setError("That code doesn't match. Check the toast notification for your demo code."); return; }
    setError(""); setStep(3);
  };

  const resetPw = (e) => {
    e.preventDefault();
    if (pw.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (pw !== confirm) { setError("Passwords do not match."); return; }
    setUsers(us => us.map(u => u.email.toLowerCase() === email.toLowerCase() ? { ...u, password: pw } : u));
    pushToast("Password reset successfully — sign in with your new password.", "success");
    goLogin();
  };

  return (
    <AuthShell side={{ title: "Account recovery", body: "We'll help you regain access to your DecisAI workspace in a few quick steps.", chips: ["Secure Reset", "Email Verification"] }}>
      <button onClick={goLogin} style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "none", border: "none", color: T.onSurfaceVariant, fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", padding: 0, marginBottom: "1.25rem" }}>
        <ArrowLeft size={15} /> Back to sign in
      </button>

      {/* Stepper */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.5rem" }}>
        {[1,2,3].map(s => (
          <React.Fragment key={s}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 800, background: step >= s ? T.primary : T.surfaceContainerHigh, color: step >= s ? "#fff" : T.outline }}>
              {step > s ? <Check size={14} /> : s}
            </div>
            {s < 3 && <div style={{ flex: 1, height: "2px", background: step > s ? T.primary : T.surfaceContainerHigh }} />}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: T.onSurface, margin: "0 0 0.25rem" }}>Reset your password</h2>
          <p style={{ color: T.onSurfaceVariant, fontSize: "0.9rem", margin: "0 0 1.5rem" }}>Enter the email linked to your account and we'll send a verification code.</p>
          <form onSubmit={sendCode}>
            <Field label="Email address">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" style={inputStyle(false)} />
            </Field>
            {error && <div style={{ background: T.errorContainer, color: T.error, padding: "0.65rem 0.85rem", borderRadius: "8px", fontSize: "0.83rem", marginBottom: "1rem", fontWeight: 600 }}>{error}</div>}
            <Btn full size="lg" type="submit" icon={ArrowRight}>Send verification code</Btn>
          </form>
        </>
      )}
      {step === 2 && (
        <>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: T.onSurface, margin: "0 0 0.25rem" }}>Check your inbox</h2>
          <p style={{ color: T.onSurfaceVariant, fontSize: "0.9rem", margin: "0 0 1.5rem" }}>Enter the 6-digit verification code we sent to <strong>{email}</strong>.</p>
          <form onSubmit={verifyCode}>
            <Field label="Verification code">
              <input value={code} onChange={e => setCode(e.target.value.replace(/\D/g,""))} placeholder="123456" maxLength={6} style={{ ...inputStyle(false), letterSpacing: "0.3em", fontWeight: 800, textAlign: "center", fontSize: "1.1rem" }} />
            </Field>
            {error && <div style={{ background: T.errorContainer, color: T.error, padding: "0.65rem 0.85rem", borderRadius: "8px", fontSize: "0.83rem", marginBottom: "1rem", fontWeight: 600 }}>{error}</div>}
            <Btn full size="lg" type="submit" icon={ArrowRight}>Verify code</Btn>
          </form>
        </>
      )}
      {step === 3 && (
        <>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: T.onSurface, margin: "0 0 0.25rem" }}>Set a new password</h2>
          <p style={{ color: T.onSurfaceVariant, fontSize: "0.9rem", margin: "0 0 1.5rem" }}>Choose a strong password for your account.</p>
          <form onSubmit={resetPw}>
            <Field label="New password">
              <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="At least 8 characters" style={inputStyle(false)} />
            </Field>
            <Field label="Confirm new password">
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Re-enter your password" style={inputStyle(false)} />
            </Field>
            {error && <div style={{ background: T.errorContainer, color: T.error, padding: "0.65rem 0.85rem", borderRadius: "8px", fontSize: "0.83rem", marginBottom: "1rem", fontWeight: 600 }}>{error}</div>}
            <Btn full size="lg" type="submit" icon={CheckCircle2}>Reset password</Btn>
          </form>
        </>
      )}
    </AuthShell>
  );
}

/* ============================================================
   APP SHELL — Sidebar, Topbar, Command Palette, Notifications,
   AI Assistant
============================================================ */
const NAV_ITEMS = [
  { id: "dashboard", label: "Workspaces", icon: FolderOpen },
  { id: "upload", label: "New RFP", icon: FilePlus2 },
  { id: "dataset", label: "Upload Dataset", icon: Database },
  { id: "compliance", label: "Compliance", icon: ClipboardCheck },
  { id: "drafts", label: "Proposal Drafts", icon: FileText },
  { id: "windashboard", label: "Win Dashboard", icon: BarChart3 },
  { id: "decision", label: "Decision Panel", icon: Gavel },
  { id: "exports", label: "Exports", icon: Share2 },
];
const NAV_ITEMS_2 = [
  { id: "activity", label: "Activity Logs", icon: History },
  { id: "profile", label: "Settings", icon: Settings },
];

function Sidebar({ view, setView, wsTab, workspaces, activeWsId, openWorkspace, openWorkspaceTab, mobileOpen, setMobileOpen, pushToast }) {
  const goto = (id) => {
    if (["compliance","drafts","decision"].includes(id)) {
      if (!activeWsId) {
        if (workspaces.length) { openWorkspace(workspaces[0].id); }
        else { setView("upload"); pushToast("Create an RFP workspace first.", "warn"); setMobileOpen(false); return; }
      }
      const tabMap = { compliance: "compliance", drafts: "draft", decision: "decision" };
      openWorkspaceTab(tabMap[id]);
    } else {
      setView(id);
    }
    setMobileOpen(false);
  };

  const isActive = (id) => {
    if (id === "dashboard") return view === "dashboard";
    if (id === "compliance") return view === "workspace" && wsTab === "compliance";
    if (id === "drafts") return view === "workspace" && wsTab === "draft";
    if (id === "decision") return view === "workspace" && wsTab === "decision";
    return view === id;
  };

  const content = (
    <>
      <div style={{ marginBottom: "1.75rem", padding: "0 0.5rem" }}>
        <Logo light size={42} textSize="1.2rem" />
      </div>
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.15rem" }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => goto(item.id)} style={{
            display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.75rem", borderRadius: "8px",
            border: "none", textAlign: "left", cursor: "pointer", width: "100%",
            background: isActive(item.id) ? "rgba(99,102,241,0.18)" : "transparent",
            color: isActive(item.id) ? "#C0C1FF" : T.navyTextDim,
            fontWeight: isActive(item.id) ? 800 : 600, fontSize: "0.85rem",
            transition: "background .15s, color .15s",
          }}
            onMouseEnter={e => { if (!isActive(item.id)) e.currentTarget.style.background = T.navyLine; }}
            onMouseLeave={e => { if (!isActive(item.id)) e.currentTarget.style.background = "transparent"; }}
          >
            <item.icon size={18} /> {item.label}
          </button>
        ))}
        <div style={{ margin: "0.6rem 0.5rem", borderTop: "1px solid " + T.navyLine }} />
        {NAV_ITEMS_2.map(item => (
          <button key={item.id} onClick={() => goto(item.id)} style={{
            display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0.75rem", borderRadius: "8px",
            border: "none", textAlign: "left", cursor: "pointer", width: "100%",
            background: isActive(item.id) ? "rgba(99,102,241,0.18)" : "transparent",
            color: isActive(item.id) ? "#C0C1FF" : T.navyTextDim,
            fontWeight: isActive(item.id) ? 800 : 600, fontSize: "0.85rem",
          }}
            onMouseEnter={e => { if (!isActive(item.id)) e.currentTarget.style.background = T.navyLine; }}
            onMouseLeave={e => { if (!isActive(item.id)) e.currentTarget.style.background = "transparent"; }}
          >
            <item.icon size={18} /> {item.label}
          </button>
        ))}

        {workspaces.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <div style={{ padding: "0 0.75rem", fontSize: "0.68rem", fontWeight: 800, color: "rgba(218,226,253,0.35)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.4rem" }}>Recent Workspaces</div>
            {workspaces.slice(0, 4).map(ws => (
              <button key={ws.id} onClick={() => { openWorkspace(ws.id); setMobileOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "none",
                textAlign: "left", cursor: "pointer", width: "100%",
                background: activeWsId === ws.id && view.startsWith("workspace") ? "rgba(99,102,241,0.18)" : "transparent",
                color: activeWsId === ws.id && view.startsWith("workspace") ? "#C0C1FF" : T.navyTextDim, fontSize: "0.78rem", fontWeight: 600,
              }}
                onMouseEnter={e => { if (activeWsId !== ws.id) e.currentTarget.style.background = T.navyLine; }}
                onMouseLeave={e => { if (activeWsId !== ws.id) e.currentTarget.style.background = "transparent"; }}
              >
                <FileSearch size={14} style={{ flexShrink: 0 }} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ws.meta.title}</span>
              </button>
            ))}
          </div>
        )}
      </nav>
    </>
  );

  return (
    <>
      {mobileOpen && window.innerWidth < 960 && <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 90 }} />}
      {/* FIXED to the viewport: the panel always spans the full screen height,
          regardless of how far the page content scrolls. The main content area
          compensates with a matching left margin (see App layout). */}
      <aside style={{
        width: "280px", height: "100vh", position: "fixed", top: 0, left: 0,
        background: T.navy, display: "flex", flexDirection: "column", padding: "1.25rem 1rem", overflowY: "auto",
        zIndex: 95, transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform .2s ease", overflowX: "hidden",
      }}>
        {content}
      </aside>
    </>
  );
}

/* ---- Command Palette (Cmd/Ctrl + K) ---- */
function CommandPalette({ open, onClose, workspaces, openWorkspace, setView, pushToast }) {
  const [q, setQ] = useState("");
  const ref = useRef();
  useEffect(() => { if (open) setTimeout(() => ref.current?.focus(), 50); else setQ(""); }, [open]);

  if (!open) return null;

  const actions = [
    { label: "Go to Workspaces", icon: FolderOpen, run: () => setView("dashboard") },
    { label: "Create New RFP", icon: FilePlus2, run: () => setView("upload") },
    { label: "Open Win Dashboard", icon: BarChart3, run: () => setView("windashboard") },
    { label: "Open Activity Logs", icon: History, run: () => setView("activity") },
    { label: "Open Exports", icon: Share2, run: () => setView("exports") },
    { label: "Open Settings", icon: Settings, run: () => setView("profile") },
  ];
  const wsActions = workspaces.map(ws => ({ label: "Open: " + ws.meta.title, icon: FileSearch, run: () => openWorkspace(ws.id) }));
  const all = [...actions, ...wsActions].filter(a => a.label.toLowerCase().includes(q.toLowerCase()));

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 500, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "12vh", backdropFilter: "blur(2px)" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: "560px", background: "#fff", borderRadius: "16px", boxShadow: "0 20px 60px rgba(15,23,42,0.35)", overflow: "hidden", border: "1px solid " + T.outlineVariant }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.9rem 1.1rem", borderBottom: "1px solid " + T.outlineVariant }}>
          <Search size={18} color={T.outline} />
          <input ref={ref} value={q} onChange={e => setQ(e.target.value)} placeholder="Search actions, workspaces, RFPs..." style={{ flex: 1, border: "none", outline: "none", fontSize: "0.95rem", fontFamily: "'Inter',sans-serif" }} />
          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: T.outline, border: "1px solid " + T.outlineVariant, borderRadius: "5px", padding: "0.1rem 0.4rem" }}>ESC</span>
        </div>
        <div style={{ maxHeight: "360px", overflowY: "auto", padding: "0.5rem" }}>
          {all.length === 0 && <div style={{ padding: "1.5rem", textAlign: "center", color: T.outline, fontSize: "0.85rem" }}>No matching actions.</div>}
          {all.map((a, i) => (
            <button key={i} onClick={() => { a.run(); onClose(); }} style={{
              display: "flex", alignItems: "center", gap: "0.7rem", width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px",
              border: "none", background: "transparent", cursor: "pointer", textAlign: "left", fontSize: "0.88rem", color: T.onSurface, fontWeight: 600,
            }}
              onMouseEnter={e => e.currentTarget.style.background = T.surfaceContainerLow}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <a.icon size={16} color={T.primary} /> {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Notifications dropdown ---- */
function NotificationPanel({ notifications, setNotifications, open, setOpen }) {
  const ref = useRef();
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [setOpen]);
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{ position: "relative", width: 38, height: 38, borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.onSurfaceVariant }}
        onMouseEnter={e => e.currentTarget.style.background = T.surfaceContainer} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        <Bell size={19} />
        {unread > 0 && <span style={{ position: "absolute", top: 4, right: 6, width: 9, height: 9, borderRadius: "50%", background: T.error, border: "2px solid #fff" }} />}
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: "340px", background: "#fff", border: "1px solid " + T.outlineVariant, borderRadius: "12px", boxShadow: "0 12px 32px rgba(15,23,42,0.15)", zIndex: 60, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.8rem 1rem", borderBottom: "1px solid " + T.outlineVariant }}>
            <span style={{ fontWeight: 800, fontSize: "0.9rem", color: T.onSurface }}>Notifications</span>
            {unread > 0 && <button onClick={() => setNotifications(ns => ns.map(n => ({ ...n, read: true })))} style={{ background: "none", border: "none", color: T.primary, fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>Mark all read</button>}
          </div>
          <div style={{ maxHeight: "340px", overflowY: "auto" }}>
            {notifications.length === 0 && <div style={{ padding: "1.5rem", textAlign: "center", color: T.outline, fontSize: "0.85rem" }}>You're all caught up.</div>}
            {notifications.map(n => (
              <div key={n.id} onClick={() => setNotifications(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))} style={{
                display: "flex", gap: "0.6rem", padding: "0.75rem 1rem", borderBottom: "1px solid " + T.surfaceContainerLow, cursor: "pointer",
                background: n.read ? "transparent" : T.surfaceContainerLow,
              }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: statusBg(n.kind) || T.secondaryContainer, color: statusColor(n.kind) || T.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <n.icon size={14} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: T.onSurface }}>{n.title}</div>
                  <div style={{ fontSize: "0.78rem", color: T.onSurfaceVariant, marginTop: "0.1rem" }}>{n.body}</div>
                  <div style={{ fontSize: "0.7rem", color: T.outline, marginTop: "0.2rem" }}>{n.time}</div>
                </div>
                {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.primary, flexShrink: 0, marginTop: "0.3rem" }} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Topbar({ user, mobileOpen, setMobileOpen, setView, openCommandPalette, notifications, setNotifications, workspaces, openWorkspace, breadcrumb, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const query = searchQ.trim().toLowerCase();
  const results = query ? [
    ...workspaces.filter(ws => (ws.meta.title + " " + ws.meta.issuer + " " + ws.meta.sector).toLowerCase().includes(query)).map(ws => ({ type: "workspace", id: ws.id, title: ws.meta.title, subtitle: `${ws.meta.issuer} - ${ws.meta.sector}` })),
    ...NAV_ITEMS.concat(NAV_ITEMS_2).filter(n => (n.label + " " + n.id).toLowerCase().includes(query)).map(n => ({ type: "nav", id: n.id, title: n.label, subtitle: "Navigation" })),
  ].slice(0, 8) : [];
  const runSearch = () => {
    if (!query) return;
    if (!results.length) { setSearchOpen(true); return; }
    results[0].type === "workspace" ? openWorkspace(results[0].id) : setView(results[0].id);
    setSearchQ("");
  };

  return (
    <header style={{
      display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 1.5rem", height: "64px",
      position: "sticky", top: 0, zIndex: 50, background: "rgba(252,248,255,0.8)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid " + T.outlineVariant, gap: "1rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: 0 }}>
        <button onClick={() => setMobileOpen(o => !o)} style={{ display: "flex", width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: "12px", background: T.primary, border: "1px solid " + T.primary, color: mobileOpen ? "#fff" : "#fff", cursor: "pointer", boxShadow: "0 6px 16px rgba(70,72,212,0.22)", flexShrink: 0 }}>
          <Menu size={22} />
        </button>
        <div style={{ position: "relative", width: "100%", maxWidth: "420px" }}>
          <Search size={16} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: T.outline }} />
          <input value={searchQ} onChange={e => { setSearchQ(e.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            placeholder="Search RFPs, entities, or documents..."
            style={{ width: "100%", padding: "0.55rem 2.5rem 0.55rem 2.4rem", borderRadius: "999px", border: "1px solid " + T.outlineVariant, background: T.surfaceContainerLow, fontSize: "0.85rem", outline: "none", fontFamily: "'Inter',sans-serif" }}
            onKeyDown={e => { e.target.style.boxShadow = `0 0 0 3px ${T.primary}22`; if (e.key === "Enter") runSearch(); }} />
          <span style={{ position: "absolute", right: "0.6rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.68rem", fontWeight: 700, color: T.outline, border: "1px solid " + T.outlineVariant, borderRadius: "5px", padding: "0.05rem 0.35rem", background: "#fff" }} onClick={openCommandPalette}>⌘K</span>
          {searchOpen && results.length > 0 && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", border: "1px solid " + T.outlineVariant, borderRadius: "10px", boxShadow: "0 8px 24px rgba(15,23,42,0.12)", zIndex: 60, overflow: "hidden" }}>
              {results.map(ws => (
                <div key={ws.id} onMouseDown={() => { openWorkspace(ws.id); setSearchQ(""); }} style={{ padding: "0.6rem 0.85rem", fontSize: "0.85rem", cursor: "pointer", display: "flex", flexDirection: "column" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.surfaceContainerLow} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ fontWeight: 700, color: T.onSurface }}>{ws.meta.title}</span>
                  <span style={{ fontSize: "0.74rem", color: T.outline }}>{ws.meta.issuer} · {ws.meta.sector}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {breadcrumb && <div style={{ display: window.innerWidth < 760 ? "none" : "flex", alignItems: "center", gap: "0.4rem", color: T.onSurfaceVariant, fontSize: "0.85rem", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{breadcrumb}</div>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <NotificationPanel notifications={notifications} setNotifications={setNotifications} open={notifOpen} setOpen={setNotifOpen} />
        <button onClick={openCommandPalette} style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", display: window.innerWidth < 760 ? "none" : "flex", alignItems: "center", justifyContent: "center", color: T.onSurfaceVariant }}
          onMouseEnter={e => e.currentTarget.style.background = T.surfaceContainer} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <HelpCircle size={19} />
        </button>
        <div style={{ width: "1px", height: "24px", background: T.outlineVariant, margin: "0 0.4rem" }} />
        <div ref={ref} style={{ position: "relative" }}>
          <button onClick={() => setProfileOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "none", border: "none", cursor: "pointer", padding: "0.2rem 0.3rem", borderRadius: "10px" }}
            onMouseEnter={e => e.currentTarget.style.background = T.surfaceContainer} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ textAlign: "right", display: window.innerWidth < 640 ? "none" : "block" }}>
              <div style={{ fontWeight: 800, fontSize: "0.82rem", color: T.onSurface, lineHeight: 1.2 }}>{user?.name}</div>
              <div style={{ fontSize: "0.68rem", color: T.outline, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>{user?.role}</div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${T.primary}, ${T.primaryContainer})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem", border: "2px solid " + T.primary }}>
              {(user?.name || "?").split(" ").map(p => p[0]).slice(0,2).join("")}
            </div>
          </button>
          {profileOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: "200px", background: "#fff", border: "1px solid " + T.outlineVariant, borderRadius: "12px", boxShadow: "0 12px 32px rgba(15,23,42,0.15)", zIndex: 60, overflow: "hidden", padding: "0.4rem" }}>
              <button onClick={() => { setView("profile"); setProfileOpen(false); }} style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", border: "none", background: "transparent", cursor: "pointer", fontSize: "0.85rem", color: T.onSurface, fontWeight: 600 }}
                onMouseEnter={e => e.currentTarget.style.background = T.surfaceContainerLow} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <User size={16} /> Profile
              </button>
              <button onClick={() => { setView("profile"); setProfileOpen(false); }} style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", border: "none", background: "transparent", cursor: "pointer", fontSize: "0.85rem", color: T.onSurface, fontWeight: 600 }}
                onMouseEnter={e => e.currentTarget.style.background = T.surfaceContainerLow} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <Settings size={16} /> Settings
              </button>
              <div style={{ borderTop: "1px solid " + T.outlineVariant, margin: "0.3rem 0" }} />
              <button onClick={() => { onLogout(); setProfileOpen(false); }} style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", border: "none", background: "transparent", cursor: "pointer", fontSize: "0.85rem", color: T.error, fontWeight: 700 }}
                onMouseEnter={e => e.currentTarget.style.background = T.errorContainer} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function DecisAITopbar({ user, mobileOpen, setMobileOpen, setView, openCommandPalette, notifications, setNotifications, workspaces, openWorkspace, breadcrumb, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const query = searchQ.trim().toLowerCase();
  const results = query ? [
    ...workspaces.filter(ws => (ws.meta.title + " " + ws.meta.issuer + " " + ws.meta.sector).toLowerCase().includes(query)).map(ws => ({ type: "workspace", id: ws.id, title: ws.meta.title, subtitle: `${ws.meta.issuer} - ${ws.meta.sector}` })),
    ...NAV_ITEMS.concat(NAV_ITEMS_2).filter(n => (n.label + " " + n.id).toLowerCase().includes(query)).map(n => ({ type: "nav", id: n.id, title: n.label, subtitle: "Navigation" })),
  ].slice(0, 8) : [];
  const runSearch = () => {
    if (!query) return;
    if (!results.length) { setSearchOpen(true); return; }
    results[0].type === "workspace" ? openWorkspace(results[0].id) : setView(results[0].id);
    setSearchQ("");
  };

  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 1.25rem", height: "64px", position: "sticky", top: 0, zIndex: 50, background: "rgba(252,248,255,0.94)", backdropFilter: "blur(12px)", borderBottom: "1px solid " + T.outlineVariant, gap: "1rem", maxWidth: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: 0 }}>
        {/* Hamburger: brand color when closed -> turns white once the panel opens */}
        <button aria-label="Toggle navigation" onClick={() => setMobileOpen(o => !o)} style={{ display: "flex", width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: "12px", background: mobileOpen ? "#fff" : T.primary, border: "1px solid " + T.primary, color: mobileOpen ? T.primary : "#fff", cursor: "pointer", boxShadow: "0 6px 16px rgba(70,72,212,0.22)", flexShrink: 0, transition: "background .2s ease, color .2s ease" }}>
          <Menu size={22} />
        </button>
        <div style={{ position: "relative", width: "min(100%, 600px)" }}>
          <Search size={16} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: T.outline }} />
          <input value={searchQ} onChange={e => { setSearchQ(e.target.value); setSearchOpen(true); }} onFocus={() => setSearchOpen(true)} onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            placeholder="Search RFPs, entities, or documents..."
            style={{ width: "100%", padding: "0.62rem 2.7rem 0.62rem 2.45rem", borderRadius: "999px", border: "2px solid " + T.secondaryContainer, background: "#fff", fontSize: "0.92rem", outline: "none", fontFamily: "'Inter',sans-serif", boxShadow: "0 6px 18px rgba(70,72,212,0.08)" }}
            onKeyDown={e => { if (e.key === "Enter") runSearch(); }} />
          {searchQ.trim() && <button onMouseDown={e => { e.preventDefault(); runSearch(); }} style={{ position: "absolute", right: "0.35rem", top: "50%", transform: "translateY(-50%)", width: 30, height: 30, borderRadius: "50%", border: "none", background: T.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><ArrowRight size={15} /></button>}
          {searchOpen && searchQ.trim() && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", border: "1px solid " + T.outlineVariant, borderRadius: "12px", boxShadow: "0 8px 24px rgba(15,23,42,0.12)", zIndex: 60, overflow: "hidden" }}>
              {results.length === 0 && <div style={{ padding: "0.85rem 1rem", fontSize: "0.86rem", color: T.outline, fontWeight: 800 }}>Not found</div>}
              {results.map(item => (
                <div key={item.type + item.id} onMouseDown={() => { item.type === "workspace" ? openWorkspace(item.id) : setView(item.id); setSearchQ(""); }} style={{ padding: "0.65rem 0.9rem", fontSize: "0.86rem", cursor: "pointer", display: "flex", flexDirection: "column" }}
                  onMouseEnter={e => e.currentTarget.style.background = T.surfaceContainerLow} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ fontWeight: 800, color: T.onSurface }}>{item.title}</span>
                  <span style={{ fontSize: "0.74rem", color: T.outline }}>{item.subtitle}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {breadcrumb && <div style={{ display: window.innerWidth < 900 ? "none" : "block", color: T.onSurfaceVariant, fontSize: "0.9rem", fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{breadcrumb}</div>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
        <NotificationPanel notifications={notifications} setNotifications={setNotifications} open={notifOpen} setOpen={setNotifOpen} />
        <button onClick={openCommandPalette} style={{ width: 38, height: 38, borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", display: window.innerWidth < 760 ? "none" : "flex", alignItems: "center", justifyContent: "center", color: T.onSurfaceVariant }}
          onMouseEnter={e => e.currentTarget.style.background = T.surfaceContainer} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <HelpCircle size={19} />
        </button>
        <div style={{ width: "1px", height: "24px", background: T.outlineVariant, margin: "0 0.4rem" }} />
        <div ref={ref} style={{ position: "relative" }}>
          <button onClick={() => setProfileOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: "0.6rem", background: "none", border: "none", cursor: "pointer", padding: "0.2rem 0.3rem", borderRadius: "10px" }}>
            <div style={{ textAlign: "right", display: window.innerWidth < 640 ? "none" : "block" }}>
              <div style={{ fontWeight: 800, fontSize: "0.82rem", color: T.onSurface, lineHeight: 1.2 }}>{user?.name}</div>
              <div style={{ fontSize: "0.68rem", color: T.outline, textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>{user?.role}</div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${T.primary}, ${T.primaryContainer})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem", border: "2px solid " + T.primary }}>
              {(user?.name || "?").split(" ").map(p => p[0]).slice(0,2).join("")}
            </div>
          </button>
          {profileOpen && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: "200px", background: "#fff", border: "1px solid " + T.outlineVariant, borderRadius: "12px", boxShadow: "0 12px 32px rgba(15,23,42,0.15)", zIndex: 60, overflow: "hidden", padding: "0.4rem" }}>
              <button onClick={() => { setView("profile"); setProfileOpen(false); }} style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", border: "none", background: "transparent", cursor: "pointer", fontSize: "0.85rem", color: T.onSurface, fontWeight: 600 }}><User size={16} /> Profile</button>
              <button onClick={() => { setView("profile"); setProfileOpen(false); }} style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", padding: "0.55rem 0.7rem", borderRadius: "8px", border: "none", background: "transparent", cursor: "pointer", fontSize: "0.85rem", color: T.onSurface, fontWeight: 600 }}><Settings size={16} /> Settings</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ---- Floating AI Assistant ---- */
function AIAssistant({ activeWs, pushToast }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: "Hi! I'm your DecisAI assistant. Ask me about this RFP's requirements, compliance gaps, or how to strengthen your proposal." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setMessages(m => [...m, { role: "user", text }]);
    setInput(""); setLoading(true);
    try {
      const gaps = activeWs?.complianceSummary?.fail || 0;
      const partial = activeWs?.complianceSummary?.partial || 0;
      const info = activeWs?.complianceSummary?.info || 0;
      const backendAssistantReply = activeWs
        ? `For ${activeWs.meta.title}, the current compliance score is ${activeWs.complianceSummary?.score ?? "n/a"}%. Key focus: ${gaps} FAIL, ${partial} PARTIAL, and ${info} INFO/manual-review item(s). Use the compliance tab for evidence traceability, then resolve high-risk items before confirming GO.`
        : "Open or upload an RFP first. DecisAI will extract requirements, match evidence, score the bid, draft grounded answers, and export JSON/DOCX/PDF.";
      setMessages(m => [...m, { role: "assistant", text: backendAssistantReply }]);
      return;
      const context = activeWs
        ? `Context — Active RFP workspace:\nTitle: ${activeWs.meta.title}\nIssuer: ${activeWs.meta.issuer}\nSector: ${activeWs.meta.sector}\nBudget: ${fmtMoney(activeWs.meta.budget, activeWs.meta.currency)}\nDeadline: ${activeWs.meta.deadline}\nCompliance score: ${activeWs.complianceSummary?.score ?? "n/a"}%\nMandatory gaps: ${activeWs.complianceSummary?.fail ?? 0}\nRequirements: ${JSON.stringify((activeWs.requirements||[]).map(r=>r.text)).slice(0,1500)}`
        : "Context — No active RFP workspace is open.";
      const prompt = `You are DecisAI, an AI decision-support assistant embedded in a bid & proposal management tool for TekRowe Technologies, built by X Group. Be concise (under 80 words), practical, and professional.\n\n${context}\n\nConversation so far:\n${messages.slice(-4).map(m=>`${m.role}: ${m.text}`).join("\n")}\n\nUser: ${text}\n\nReply directly as the assistant (no preamble like "Assistant:").`;
      const reply = await callClaudeText(prompt);
      setMessages(m => [...m, { role: "assistant", text: reply }]);
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", text: "Sorry, I couldn't reach the AI service just now. Please try again." }]);
      pushToast("AI assistant error: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div style={{ position: "fixed", bottom: "5.5rem", right: "1.5rem", width: "min(360px, calc(100vw - 2rem))", height: "min(480px, 60vh)", background: "#fff", borderRadius: "16px", boxShadow: "0 16px 48px rgba(15,23,42,0.25)", border: "1px solid " + T.outlineVariant, display: "flex", flexDirection: "column", zIndex: 400, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.85rem 1rem", background: `linear-gradient(135deg, ${T.primary}, ${T.primaryContainer})`, color: "#fff" }}>
            <Bot size={18} />
            <div style={{ fontWeight: 800, fontSize: "0.9rem", flex: 1 }}>DecisAI Assistant</div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer" }}><X size={18} /></button>
          </div>
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "0.85rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                maxWidth: "85%", padding: "0.55rem 0.8rem", borderRadius: "12px", fontSize: "0.83rem", lineHeight: 1.5,
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                background: m.role === "user" ? T.primary : T.surfaceContainerLow,
                color: m.role === "user" ? "#fff" : T.onSurface,
              }}>{m.text}</div>
            ))}
            {loading && <div style={{ alignSelf: "flex-start", color: T.outline, fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Thinking...</div>}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", padding: "0.7rem", borderTop: "1px solid " + T.outlineVariant }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask about this RFP..." style={{ ...inputStyle(false), fontSize: "0.83rem" }} />
            <button onClick={send} disabled={loading} style={{ width: 38, height: 38, borderRadius: "10px", border: "none", background: T.primary, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, opacity: loading ? 0.6 : 1 }}>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(o => !o)} style={{
        position: "fixed", bottom: "1.5rem", right: "1.5rem", width: 56, height: 56, borderRadius: "50%",
        background: `linear-gradient(135deg, ${T.primary}, ${T.primaryContainer})`, color: "#fff", border: "none", cursor: "pointer",
        boxShadow: "0 8px 24px rgba(70,72,212,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 399,
      }}>
        {open ? <X size={24} /> : (
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1px" }}>
            <Bot size={20} />
            <span style={{ fontSize: "0.66rem", fontWeight: 900, lineHeight: 1, letterSpacing: "0.06em" }}>AI</span>
          </span>
        )}
      </button>
    </>
  );
}

/* ============================================================
   DASHBOARD — Workspaces overview
============================================================ */
function workspaceStage(ws) {
  if (ws.decision) return { label: "Decided", tone: "info" };
  if (ws.draftSections) return { label: "Draft Review", tone: "info" };
  if (ws.complianceSummary?.fail > 0) return { label: "Compliance Check", tone: "partial" };
  return { label: "Extraction Complete", tone: "info" };
}

function Dashboard({ workspaces, openWorkspace, setView, user, setUploadDocType, pushToast }) {
  const [filter, setFilter] = useState("All");
  const [typeTab, setTypeTab] = useState("RFP"); // separate RFP / RFQ / Tender workspaces

  // Only show data that belongs to the selected workspace type
  const typed = workspaces.filter(ws => (ws.docType || "RFP") === typeTab);

  const avgCompliance = typed.length ? Math.round(typed.reduce((s,w) => s + (w.complianceSummary?.score || 0), 0) / typed.length) : 0;
  const avgWin = typed.length ? Math.round(typed.reduce((s,w) => s + (w.winScore?.overall ?? w.complianceSummary?.score ?? 0), 0) / typed.length) : 0;
  const pendingReview = typed.filter(w => !w.decision).length;
  const urgent = typed.filter(w => { const d = daysUntil(w.meta.deadline); return d !== null && d <= 14 && d >= 0 && !w.decision; }).length;

  const stats = [
    { label: `Active ${typeTab}s`, value: typed.length, icon: ClipboardList, color: T.primary, sub: `${typed.length} in pipeline`, subIcon: TrendingUp },
    { label: "Pending Reviews", value: pendingReview, icon: Clock, color: T.tertiary, sub: urgent ? `${urgent} requiring urgent action` : "All on track" },
    { label: "Avg. Compliance", value: avgCompliance, suffix: "%", icon: ShieldCheck, color: T.primaryContainer, sub: "AI-checked against capability library", subIcon: Zap },
    { label: "Win Prob. Avg", value: avgWin, suffix: "%", icon: TrendingUp, color: T.primary, bar: true },
  ];

  const startUpload = () => { setUploadDocType?.(typeTab); setView("upload"); };

  const filters = ["All", "Drafting", "Review", "GO", "High Risk"];
  const filtered = typed.filter(ws => {
    if (filter === "All") return true;
    if (filter === "Drafting") return !ws.draftSections;
    if (filter === "Review") return !ws.decision;
    if (filter === "GO") return ws.decision === "GO" || ws.winScore?.suggestedDecision === "GO";
    if (filter === "High Risk") return ws.winScore?.suggestedDecision === "HIGH_RISK" || ws.winScore?.suggestedDecision === "NO-GO" || ws.decision === "NO-GO";
    return true;
  });

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1600px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Hero */}
      <section style={{
        position: "relative", overflow: "hidden", borderRadius: "24px", padding: "2.5rem",
        background: T.surfaceContainer, display: "grid", gridTemplateColumns: window.innerWidth < 900 ? "1fr" : "1.2fr 1fr", gap: "2rem", alignItems: "center",
        border: "1px solid " + T.outlineVariant,
      }}>
        <div style={{ position: "absolute", top: "-100px", right: "-60px", width: "320px", height: "320px", borderRadius: "50%", background: `${T.primary}14`, filter: "blur(60px)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{ display: "inline-block", padding: "0.3rem 0.85rem", borderRadius: "999px", background: `${T.primary}18`, color: T.primary, fontWeight: 800, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem" }}>Enterprise Edition</span>
          <h1 style={{ fontSize: window.innerWidth < 700 ? "1.8rem" : "2.6rem", fontWeight: 900, color: T.onSurface, lineHeight: 1.15, letterSpacing: "-0.01em", margin: "0 0 0.85rem" }}>DecisAI</h1>
          <p style={{ fontSize: "1rem", color: T.onSurfaceVariant, lineHeight: 1.6, maxWidth: "480px", margin: "0 0 1.5rem" }}>
            Welcome back, {user?.name?.split(" ")[0]}. Upload tenders, extract requirements, and make confident GO / NO-GO decisions with predictive scoring and automated drafting.
          </p>
          <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
            <Btn size="lg" icon={Plus} onClick={startUpload}>New {typeTab}</Btn>
          </div>
        </div>
        {workspaces.length > 0 && (
          <div style={{ position: "relative", display: window.innerWidth < 900 ? "none" : "block" }}>
            <div style={{ position: "absolute", inset: "-12px", borderRadius: "20px", background: `${T.primary}12`, filter: "blur(18px)" }} />
            <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.5)", boxShadow: "0 20px 50px rgba(15,23,42,0.18)", background: T.navy, padding: "1.25rem", height: "260px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#fff" }}>
                <span style={{ fontWeight: 800, fontSize: "0.85rem" }}>Win Probability Trend</span>
                <Sparkles size={16} color="#C0C1FF" />
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "8px" }}>
                {[42,58,49,67,72,61,80,75,88].map((v,i) => (
                  <div key={i} style={{ flex: 1, borderRadius: "4px 4px 0 0", background: `linear-gradient(180deg, ${T.primaryContainer}, ${T.primary})`, height: `${v}%`, opacity: 0.85 }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "rgba(255,255,255,0.5)" }}>
                <span>Jan</span><span>Win Rate 57%</span><span>Now</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Workspace type tabs — RFP / RFQ / Tender are separate workspaces */}
      <section style={{ display: "flex", gap: "0.4rem", background: T.surfaceContainer, borderRadius: "12px", padding: "0.3rem", width: "fit-content", maxWidth: "100%" }}>
        {["RFP", "RFQ", "Tender"].map(t => {
          const count = workspaces.filter(ws => (ws.docType || "RFP") === t).length;
          return (
            <button key={t} onClick={() => { setTypeTab(t); setFilter("All"); }} style={{
              display: "flex", alignItems: "center", gap: "0.45rem", padding: "0.5rem 1.1rem", borderRadius: "10px",
              fontSize: "0.85rem", fontWeight: 800, cursor: "pointer", border: "none",
              background: typeTab === t ? "#fff" : "transparent", color: typeTab === t ? T.primary : T.onSurfaceVariant,
              boxShadow: typeTab === t ? "0 2px 10px rgba(15,23,42,0.1)" : "none",
            }}>
              {t}
              <span style={{ padding: "0.05rem 0.45rem", borderRadius: "999px", background: typeTab === t ? T.secondaryContainer : T.surfaceContainerHighest, fontSize: "0.7rem", fontWeight: 900 }}>{count}</span>
            </button>
          );
        })}
      </section>

      {/* Stats grid — only when this workspace actually has data (no zero dashboards) */}
      {typed.length > 0 && (
        <section style={{ display: "grid", gridTemplateColumns: window.innerWidth < 700 ? "1fr 1fr" : "repeat(4,1fr)", gap: "1rem" }}>
          {stats.map(s => (
            <Card key={s.label} style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: T.onSurfaceVariant }}>{s.label}</span>
                <div style={{ width: 32, height: 32, borderRadius: "8px", background: s.color + "18", color: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <s.icon size={17} />
                </div>
              </div>
              <div style={{ fontSize: "1.9rem", fontWeight: 900, color: T.onSurface }}><Counter value={s.value} suffix={s.suffix || ""} /></div>
              {s.bar && (
                <div style={{ height: "6px", background: T.surfaceContainerHigh, borderRadius: "3px", marginTop: "0.5rem", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${avgWin}%`, background: T.primary, borderRadius: "3px", transition: "width .6s" }} />
                </div>
              )}
              {s.sub && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.74rem", color: s.subIcon ? T.primary : T.onSurfaceVariant, fontWeight: s.subIcon ? 800 : 600, marginTop: "0.4rem" }}>
                  {s.subIcon && <s.subIcon size={13} />} {s.sub}
                </div>
              )}
            </Card>
          ))}
        </section>
      )}

      {/* Filters */}
      {typed.length > 0 && (
        <section style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {filters.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "0.5rem 1rem", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
                border: "1px solid " + (filter === f ? T.navy : T.outlineVariant),
                background: filter === f ? T.navy : "#fff", color: filter === f ? "#fff" : T.onSurfaceVariant,
              }}>{f}</button>
            ))}
          </div>
          <div style={{ fontSize: "0.78rem", color: T.onSurfaceVariant }}>{filtered.length} of {typed.length} {typeTab} workspaces</div>
        </section>
      )}

      {/* Workspace table */}
      <Card level={1} style={{ overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
            <FolderOpen size={36} color={T.outline} style={{ marginBottom: "0.75rem" }} />
            <h3 style={{ margin: "0 0 0.4rem", color: T.onSurface, fontWeight: 800 }}>{typed.length === 0 ? `No ${typeTab} workspaces yet` : "No workspaces match this filter"}</h3>
            <p style={{ color: T.onSurfaceVariant, fontSize: "0.88rem", margin: "0 0 1rem", maxWidth: "440px", marginLeft: "auto", marginRight: "auto" }}>{typed.length === 0 ? `Upload ${typeTab === "RFP" ? "an RFP" : typeTab === "RFQ" ? "an RFQ" : "a Tender"} to start analysis — DecisAI will extract requirements, validate compliance, and score the bid.` : "Try a different filter to see more results."}</p>
            {typed.length === 0 && <Btn icon={Plus} onClick={startUpload}>Upload {typeTab === "Tender" ? "a Tender" : `an ${typeTab}`} to start analysis</Btn>}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "880px" }}>
              <thead>
                <tr style={{ background: T.surfaceContainerLow, borderBottom: "1px solid " + T.outlineVariant }}>
                  {["Bid Opportunity","Entity / Sector","Deadline","Status","Win %","AI Recommendation",""].map((h,i) => (
                    <th key={i} style={{ padding: "0.85rem 1.25rem", textAlign: i === 6 ? "right" : "left", fontSize: "0.74rem", fontWeight: 800, color: T.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(ws => {
                  const days = daysUntil(ws.meta.deadline);
                  const stage = workspaceStage(ws);
                  const winPct = ws.winScore?.overall ?? ws.complianceSummary?.score ?? 0;
                  return (
                    <tr key={ws.id} onClick={() => openWorkspace(ws.id)} style={{ borderBottom: "1px solid " + T.surfaceContainerLow, cursor: "pointer" }}
                      onMouseEnter={e => e.currentTarget.style.background = `${T.primary}06`} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ fontWeight: 800, color: T.onSurface, fontSize: "0.92rem" }}>{ws.meta.title}</div>
                        <div style={{ fontSize: "0.74rem", color: T.outline, fontFamily: "'JetBrains Mono',monospace" }}>Ref: {ws.id}</div>
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ fontSize: "0.85rem", color: T.onSurface, fontWeight: 600 }}>{ws.meta.issuer}</div>
                        <div style={{ fontSize: "0.74rem", color: T.outline }}>{ws.meta.sector}</div>
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ fontSize: "0.85rem", color: T.onSurface, fontWeight: 600 }}>{fmtDate(ws.meta.deadline)}</div>
                        {days !== null && (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.1rem 0.45rem", borderRadius: "5px", background: days <= 14 ? T.failBg : `${T.primary}14`, color: days <= 14 ? T.fail : T.primary, fontSize: "0.68rem", fontWeight: 800, marginTop: "0.2rem" }}>
                            <Clock size={11} /> {days >= 0 ? `${days} days left` : "Overdue"}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <span style={{ padding: "0.25rem 0.7rem", borderRadius: "999px", background: T.surfaceContainerHighest, color: T.onSurfaceVariant, fontSize: "0.72rem", fontWeight: 800 }}>{stage.label}</span>
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: 800, color: T.primary, fontSize: "0.85rem" }}>{winPct}%</span>
                          <div style={{ width: 50, height: 6, background: T.surfaceContainerHigh, borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${winPct}%`, background: T.primary, borderRadius: "3px" }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "1rem 1.25rem" }}>
                        {ws.decision ? <DecisionPill decision={ws.decision} size="sm" /> : ws.winScore ? <DecisionPill decision={ws.winScore.suggestedDecision} size="sm" /> : <span style={{ fontSize: "0.74rem", color: T.outline, fontWeight: 700 }}>Pending</span>}
                      </td>
                      <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                        <MoreVertical size={18} color={T.outline} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ============================================================
   UPLOAD / NEW RFP — 4-step stepper
============================================================ */
/* ONE consistent workflow progress bar used on every workflow page:
   New RFP -> Extract -> Match -> Draft -> Decision */
const WORKFLOW_STEPS = ["Upload", "Extract", "Match", "Draft", "Decision"];

function WorkflowStepper({ active, onStep }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", padding: "0.8rem 1.1rem", borderRadius: "14px",
      background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", border: "1px solid " + T.outlineVariant,
      marginBottom: "1rem", flexWrap: "wrap", rowGap: "0.5rem", boxShadow: "0 4px 20px rgba(15,23,42,0.06)",
      maxWidth: "100%",
    }}>
      {WORKFLOW_STEPS.map((s, i) => {
        const clickable = !!onStep && i > 0 && i <= active;
        return (
          <React.Fragment key={s}>
            <button
              onClick={clickable ? () => onStep(i) : undefined}
              style={{
                display: "flex", alignItems: "center", gap: "0.45rem", flexShrink: 0, border: "none",
                background: "transparent", padding: "0.15rem 0.2rem", cursor: clickable ? "pointer" : "default",
                fontFamily: "'Inter',sans-serif",
              }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.78rem", fontWeight: 800, flexShrink: 0,
                background: i < active ? T.pass : i === active ? T.primary : T.surfaceContainerHigh,
                color: i <= active ? "#fff" : T.outline,
                transition: "background .2s",
              }}>
                {i < active ? <Check size={14} /> : i + 1}
              </div>
              <span style={{ fontSize: "0.84rem", fontWeight: i === active ? 800 : 600, color: i === active ? T.primary : i < active ? T.onSurface : T.outline, whiteSpace: "nowrap" }}>{s}</span>
            </button>
            {i < WORKFLOW_STEPS.length - 1 && <div style={{ flex: 1, height: "2px", background: i < active ? T.pass : T.surfaceContainerHigh, margin: "0 0.6rem", minWidth: "14px" }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

const MODEL_OPTIONS = [
  { id: "claude", label: "Claude (Online, Optional)", icon: Globe },
  { id: "ollama", label: "Ollama Qwen 2.5 1.5B (Offline)", icon: Cpu },
];

function ModelSelector({ value, onChange, disabled }) {
  const opt = MODEL_OPTIONS.find(o => o.id === value) || MODEL_OPTIONS[0];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
      <span style={{ fontSize: "0.7rem", fontWeight: 800, color: T.outline, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>AI Model</span>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <opt.icon size={14} style={{ position: "absolute", left: "0.6rem", color: T.primary, pointerEvents: "none" }} />
        <select value={value} disabled={disabled} onChange={e => onChange(e.target.value)} style={{
          ...inputStyle(false), width: "auto", padding: "0.45rem 1.9rem 0.45rem 1.9rem",
          fontSize: "0.8rem", fontWeight: 700, color: T.onSurface, cursor: disabled ? "not-allowed" : "pointer",
          appearance: "none", WebkitAppearance: "none",
        }}>
          {MODEL_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
        <ChevronDown size={14} style={{ position: "absolute", right: "0.55rem", color: T.outline, pointerEvents: "none" }} />
      </div>
    </div>
  );
}

const DOC_TYPES = ["RFP", "RFQ", "Tender"];

function UploadScreen({ onCreate, pushToast, prefillText, docType, setDocType }) {
  const { logActivity } = useContext(AppContext);
  const [text, setText] = useState(prefillText || "");
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [stage, setStage] = useState(0); // 0 idle, 1-5 processing steps, 6 done
  const [error, setError] = useState("");
  const [model, setModel] = useState("claude"); // claude (online) | ollama (offline)
  const fileRef = useRef();

  const steps = [
    "Reading document...",
    "Extracting requirements & criteria...",
    "Identifying deadlines & budget...",
    "Matching against capability library...",
    "Running compliance check...",
  ];

  const handleFile = (f) => {
    if (!f) return;
    setFileName(f.name);
    setSelectedFile(f);
    if (f.type === "text/plain" || f.name.endsWith(".txt") || f.name.endsWith(".md")) {
      const reader = new FileReader();
      reader.onload = (e) => setText(e.target.result);
      reader.readAsText(f);
    } else {
      setText("");
      pushToast("File ready. DecisAI will send it to the local backend parser.", "success");
    }
  };

  const analyze = async () => {
    if (!selectedFile && text.trim().length < 80) {
      setError(`Upload a PDF/DOCX/TXT ${docType} or paste enough tender text to analyze.`);
      return;
    }
    setError(""); setStage(1);
    try {
      const form = new FormData();
      if (selectedFile) {
        form.append("file", selectedFile);
      } else {
        form.append("file", new File([text], fileName || "pasted_rfp.txt", { type: "text/plain" }));
      }
      setStage(2);
      // The selected model is passed end-to-end into the extraction pipeline.
      const upload = await apiJSON(`/api/upload?use_llm=true&model=${model}&doc_type=${docType}`, { method: "POST", body: form });
      setStage(3);
      const extracted = await apiJSON(`/api/rfp/${upload.rfp_id}/extract`);
      setStage(4);
      const match = await apiJSON(`/api/rfp/${upload.rfp_id}/match`, { method: "POST" });
      setStage(5);
      const score = await apiJSON(`/api/rfp/${upload.rfp_id}/score?competitor_presence=low`);
      const ws = buildWorkspaceFromBackend(upload, extracted, match, score);
      ws.docType = docType;
      ws.model = model;
      setStage(6);
      logActivity(`New ${docType} workspace created`, `"${ws.meta.title}" - compliance score ${ws.complianceSummary.score}%, ${ws.complianceSummary.fail} gap(s) found`, FilePlus2, ws.complianceSummary.fail > 0 ? "partial" : "pass");
      setTimeout(() => onCreate(ws), 500);
    } catch (e) {
      setError("Backend analysis failed: " + e.message + ". Make sure FastAPI is running on http://127.0.0.1:8000.");
      setStage(0);
    }
  };

  const loadSample = () => { setSelectedFile(null); setText(SAMPLE_RFP); setFileName("sample_rfp.txt"); setError(""); };

  return (
    <div style={{ padding: "1rem 1.5rem", maxWidth: "1000px", margin: "0 auto" }}>
      <WorkflowStepper active={stage === 0 ? 0 : stage < 6 ? 1 : 2} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem", flexWrap: "wrap", marginBottom: "0.85rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: T.onSurface, margin: "0 0 0.25rem" }}>New {docType}</h1>
          <p style={{ color: T.onSurfaceVariant, fontSize: "0.9rem", margin: 0 }}>Upload a document to start AI-assisted analysis in the {docType} workspace.</p>
        </div>
        {/* RFP / RFQ / Tender workspace selector */}
        <div style={{ display: "flex", gap: "0.35rem", background: T.surfaceContainer, borderRadius: "10px", padding: "0.25rem" }}>
          {DOC_TYPES.map(t => (
            <button key={t} onClick={() => stage === 0 && setDocType(t)} style={{
              padding: "0.4rem 0.95rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 800, cursor: "pointer",
              border: "none", background: docType === t ? "#fff" : "transparent",
              color: docType === t ? T.primary : T.onSurfaceVariant,
              boxShadow: docType === t ? "0 2px 8px rgba(15,23,42,0.1)" : "none",
            }}>{t}</button>
          ))}
        </div>
      </div>

      <Card style={{ padding: "1.25rem" }}>
        <div onClick={() => stage === 0 && fileRef.current.click()} onDrop={e => { e.preventDefault(); if (stage === 0) handleFile(e.dataTransfer.files[0]); }} onDragOver={e => e.preventDefault()}
          style={{ border: "2px dashed " + (selectedFile ? T.primary : T.outlineVariant), borderRadius: "12px", padding: "1rem", textAlign: "center", cursor: "pointer", marginBottom: "0.85rem", background: selectedFile ? `${T.primary}08` : T.surfaceContainerLow }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.85rem", flexWrap: "wrap" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${T.primary}14`, color: T.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {selectedFile ? <FileCheck2 size={20} /> : <Upload size={20} />}
            </div>
            <div style={{ textAlign: "left", minWidth: 0 }}>
              <div style={{ fontWeight: 800, color: T.onSurface, fontSize: "0.95rem", overflowWrap: "anywhere" }}>{fileName || `Drop your ${docType} file here`}</div>
              <div style={{ fontSize: "0.76rem", color: T.onSurfaceVariant }}>PDF, DOCX, TXT, or MD — parsed by the local DecisAI engine.</div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <Btn size="sm" onClick={e => { e.stopPropagation(); fileRef.current.click(); }}>Choose File</Btn>
              <button onClick={e => { e.stopPropagation(); loadSample(); }} style={{ background: "none", border: "none", color: T.primary, fontWeight: 800, fontSize: "0.8rem", cursor: "pointer" }}>Use sample</button>
            </div>
          </div>
          <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.md" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
        </div>

        <Field label={`${docType} document text`} hint="Optional when a file is selected. Pasted text is uploaded as a TXT file.">
          <textarea value={text} onChange={e => setText(e.target.value)} rows={4} placeholder={`Paste the full ${docType} / tender text here...`} style={{ ...inputStyle(false), fontFamily: "'JetBrains Mono',monospace", fontSize: "0.78rem", resize: "vertical", lineHeight: 1.5, maxHeight: "160px" }} />
        </Field>

        {error && <div style={{ background: T.errorContainer, color: T.error, padding: "0.65rem 0.85rem", borderRadius: "8px", fontSize: "0.83rem", marginBottom: "0.85rem", fontWeight: 600 }}>{error}</div>}

        {stage > 0 && (
          <div style={{ marginBottom: "0.5rem" }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.35rem 0", fontSize: "0.84rem", color: stage > i ? T.pass : stage === i + 1 ? T.primary : T.outline, fontWeight: stage === i + 1 ? 800 : 600 }}>
                {stage > i + 1 || stage === 6 ? <CheckCircle2 size={15} /> : stage === i + 1 ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> : <div style={{ width: 15, height: 15, borderRadius: "50%", border: "1px solid " + T.outlineVariant }} />}
                {s}
              </div>
            ))}
            {stage === 6 && <div style={{ color: T.pass, fontWeight: 800, fontSize: "0.86rem", marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><CheckCircle2 size={16} /> Workspace ready — opening...</div>}
          </div>
        )}

        {/* Card footer: model selector + analysis button (bottom-right, no scrolling needed) */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.85rem", flexWrap: "wrap", borderTop: "1px solid " + T.surfaceContainerLow, paddingTop: "0.85rem" }}>
          <ModelSelector value={model} onChange={setModel} disabled={stage > 0} />
          {stage === 0 && (selectedFile || text.trim()) && (
            <Btn size="lg" variant="ai" icon={Sparkles} onClick={analyze}>Analyse with DecisAI</Btn>
          )}
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   WORKSPACE SHELL — top stepper + tab routing
============================================================ */
const WS_TABS = [
  { id: "summary", label: "Extract", icon: FileSearch },
  { id: "compliance", label: "Match", icon: ClipboardCheck },
  { id: "draft", label: "Draft", icon: PenSquare },
  { id: "decision", label: "Decision", icon: Gavel },
];

function Workspace({ ws, updateWs, pushToast, tab, setTab, onGoWorkspaces }) {
  const { logActivity, logExport } = useContext(AppContext);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef();
  const activeIdx = WS_TABS.findIndex(t => t.id === tab);

  useEffect(() => {
    const onClick = (e) => { if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const exportWorkspaceReport = async (format, label = "Report") => {
    setExportOpen(false);
    try {
      const { filename } = await downloadBackendExport(ws, format);
      logExport(filename, "Downloaded from DecisAI backend", `${label} ${format.toUpperCase()}`, ws.meta.title);
      logActivity(`${label} exported`, `${format.toUpperCase()} report exported for "${ws.meta.title}"`, FileCheck2, "info");
      pushToast(`${format.toUpperCase()} report exported.`, "success");
    } catch (e) {
      pushToast("Export failed: " + e.message, "error");
    }
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1500px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
            <span style={{ padding: "0.2rem 0.6rem", borderRadius: "6px", background: T.surfaceContainerHighest, color: T.onSurfaceVariant, fontSize: "0.7rem", fontWeight: 800, fontFamily: "'JetBrains Mono',monospace" }}>{ws.id}</span>
            <span style={{ padding: "0.2rem 0.6rem", borderRadius: "6px", background: T.secondaryContainer, color: T.primary, fontSize: "0.7rem", fontWeight: 800 }}>{ws.docType || "RFP"}</span>
            <SectorBadge sector={ws.meta.sector} />
            {ws.decision && <DecisionPill decision={ws.decision} size="sm" />}
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: T.onSurface, margin: 0, overflowWrap: "anywhere" }}>{ws.meta.title}</h1>
          <p style={{ color: T.onSurfaceVariant, margin: "0.2rem 0 0", fontSize: "0.9rem" }}>{ws.meta.issuer}</p>
        </div>
      </div>

      {/* Consistent workflow progress bar (same design on every workflow page) */}
      <WorkflowStepper active={activeIdx + 1} onStep={(i) => setTab(WS_TABS[i - 1].id)} />

      {/* Navigation row: Back on the left; Export Report + Next on the right */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", marginBottom: tab === "decision" ? "0.8rem" : "1.25rem", flexWrap: "wrap" }}>
        <Btn size="lg" variant="secondary" icon={ArrowLeft} onClick={() => activeIdx > 0 && setTab(WS_TABS[activeIdx - 1].id)} disabled={activeIdx === 0}>Back</Btn>
        <div style={{ display: "flex", gap: "0.65rem", flexWrap: "wrap", alignItems: "center" }}>
          {(tab === "compliance" || tab === "decision") && (
            <div ref={exportRef} style={{ position: "relative" }}>
              <Btn size="lg" variant={tab === "decision" ? "success" : "secondary"} icon={Download} onClick={() => setExportOpen(o => !o)}>{tab === "decision" ? "Save Report" : "Export Report"}</Btn>
              {exportOpen && (
                <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: "190px", background: "#fff", border: "1px solid " + T.outlineVariant, borderRadius: "12px", boxShadow: "0 12px 28px rgba(15,23,42,0.16)", overflow: "hidden", zIndex: 40 }}>
                  {(tab === "decision" ? [["pdf", "PDF report", Download], ["docx", "DOCX report", FileText], ["json", "JSON data", FileCheck2]] : [["docx", "DOCX report", FileText], ["pdf", "PDF report", Download]]).map(([format, label, Icon]) => (
                    <button key={format} onClick={() => exportWorkspaceReport(format, tab === "decision" ? "Decision report" : "Compliance report")} style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.55rem", padding: "0.7rem 0.85rem", border: "none", background: "#fff", cursor: "pointer", color: T.onSurface, fontWeight: 800, fontSize: "0.82rem", textAlign: "left", fontFamily: "'Inter',sans-serif" }}
                      onMouseEnter={e => e.currentTarget.style.background = T.surfaceContainerLow}
                      onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                      <Icon size={15} color={T.primary} /> {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeIdx < WS_TABS.length - 1 && <Btn size="lg" icon={ArrowRight} onClick={() => setTab(WS_TABS[activeIdx + 1].id)}>Next: {WS_TABS[activeIdx + 1].label}</Btn>}
        </div>
      </div>

      {tab === "summary" && <SummaryTab ws={ws} updateWs={updateWs} />}
      {tab === "compliance" && <ComplianceTab ws={ws} updateWs={updateWs} pushToast={pushToast} />}
      {tab === "draft" && <DraftTab ws={ws} updateWs={updateWs} pushToast={pushToast} />}
      {tab === "score" && <ScoreTab ws={ws} updateWs={updateWs} />}
      {tab === "decision" && <DecisionTab ws={ws} updateWs={updateWs} pushToast={pushToast} onGoWorkspaces={onGoWorkspaces} />}
    </div>
  );
}

/* ---- Extract / Summary tab — SPLIT VIEW: document left, live AI extraction right ---- */
function SummaryTab({ ws, updateWs }) {
  const days = daysUntil(ws.meta.deadline);
  const conf = ws.meta.extractionConfidence || 90;
  const total = ws.requirements.length || 1;
  const [previewPage, setPreviewPage] = useState(1);

  // Live reveal: requirements appear one by one with their compliance validation
  const [revealed, setRevealed] = useState(ws.extractionRevealed ? ws.requirements.length : 0);
  useEffect(() => {
    if (ws.extractionRevealed) return;
    if (revealed >= ws.requirements.length) {
      if (ws.requirements.length > 0) updateWs(prev => ({ ...prev, extractionRevealed: true }));
      return;
    }
    const t = setTimeout(() => setRevealed(r => r + 1), 160);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [revealed, ws.requirements.length]);

  const matchFor = (reqId) => (ws.compliance || []).find(c => c.requirement_id === reqId);
  const validatedCount = ws.requirements.slice(0, revealed).filter(r => {
    const m = matchFor(r.id);
    return m && (m.status === "PASS" || m.status === "PARTIAL");
  }).length;

  const previewText = (ws.extraction?.chunks || [])
    .map(c => (typeof c === "string" ? c : c.text || ""))
    .join("\n\n").slice(0, 12000);
  const fileName = ws.meta.filename || ws.extraction?.filename || ws.meta.title || "";
  const isPdf = /\.pdf$/i.test(fileName);
  const previewPages = Math.max(1, Math.min(6, ws.extraction?.chunks?.length || 2));
  const pageText = (ws.extraction?.chunks || [])
    .map(c => (typeof c === "string" ? c : c.text || ""))[previewPage - 1] || previewText || "";
  const previewUrl = `${API_BASE}/api/rfp/${ws.backendId || ws.id}/file#page=${previewPage}&toolbar=0&navpanes=0&scrollbar=1&view=FitH&pagemode=none`;

  // Synthetic critical-deadline milestones derived from the submission deadline
  const milestones = [];
  if (ws.meta.deadline) {
    const submission = new Date(ws.meta.deadline);
    const clar = new Date(submission); clar.setDate(clar.getDate() - 21);
    const eval1 = new Date(submission); eval1.setDate(eval1.getDate() + 5);
    const eval2 = new Date(submission); eval2.setDate(eval2.getDate() + 20);
    milestones.push({ label: "Clarification Deadline", date: clar, status: daysUntil(clar.toISOString()) < 0 ? "Passed" : "Upcoming" });
    milestones.push({ label: "Final Submission", date: submission, status: "Next Action" });
    milestones.push({ label: "Technical Evaluation", date: eval1, date2: eval2, status: "Upcoming" });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* SPLIT VIEW: uploaded document (left) | AI extraction with live validation (right) */}
      <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 980 ? "1fr" : "1fr 1.2fr", gap: "1.25rem", alignItems: "stretch" }}>
        {/* Left: document preview / file information */}
        <Card style={{ padding: "1.25rem", display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.85rem" }}>
            <div style={{ width: 42, height: 42, borderRadius: "10px", background: `${T.primary}14`, color: T.primary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <FileText size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, color: T.onSurface, fontSize: "0.95rem", overflowWrap: "anywhere" }}>{ws.meta.filename || ws.meta.title}</div>
              <div style={{ fontSize: "0.74rem", color: T.outline }}>{ws.docType || "RFP"} · {ws.meta.issuer}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.85rem" }}>
            {[["Est. Budget", fmtMoney(ws.meta.budget, ws.meta.currency)], ["Deadline", days !== null ? `${days} days` : fmtDate(ws.meta.deadline)], ["Requirements", ws.requirements.length], ["AI Model", ws.model === "ollama" ? "Ollama (Offline)" : "Claude Haiku 4.5"]].map(([label, value]) => (
              <div key={label} style={{ background: T.surfaceContainerLow, borderRadius: "10px", padding: "0.55rem 0.75rem" }}>
                <div style={{ fontSize: "0.62rem", fontWeight: 800, color: T.outline, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: T.onSurface }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <div>
              <div style={{ fontSize: "0.66rem", fontWeight: 800, color: T.outline, textTransform: "uppercase", letterSpacing: "0.06em" }}>Original Document Preview</div>
              <div style={{ fontSize: "0.72rem", color: T.onSurfaceVariant, marginTop: "0.15rem" }}>Live vertical document review — scroll through the full RFP.</div>
            </div>
          </div>
          <div style={{ flex: 1, background: T.surfaceContainerLow, border: "1px solid " + T.outlineVariant, borderRadius: "14px", overflow: "hidden", minHeight: "520px", maxHeight: "680px", position: "relative" }}>
            {isPdf ? (
              <iframe key={previewPage} title="Original RFP preview" src={previewUrl} style={{ width: "100%", height: "100%", minHeight: "640px", border: 0, background: "#fff", display: "block" }} />
            ) : (
              <div style={{ height: "100%", minHeight: "640px", padding: "1.1rem 1.25rem", overflowY: "auto", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.76rem", lineHeight: 1.7, color: T.onSurfaceVariant, whiteSpace: "pre-wrap", overflowWrap: "anywhere", background: "#fff" }}>
                {(ws.extraction?.chunks || [])
                  .map(c => (typeof c === "string" ? c : c.text || ""))
                  .filter(Boolean)
                  .map((txt, i) => (
                    <div key={i} style={{ position: "relative", paddingTop: i === 0 ? 0 : "1.25rem", marginTop: i === 0 ? 0 : "1.25rem", borderTop: i === 0 ? "none" : "1px dashed " + T.outlineVariant }}>
                      <div style={{ position: "absolute", right: 0, top: i === 0 ? 0 : "1.25rem", fontSize: "0.6rem", fontWeight: 800, color: T.outline, letterSpacing: "0.05em" }}>PAGE {i + 1}</div>
                      {txt}
                    </div>
                  ))}
                {!(ws.extraction?.chunks || []).some(c => (typeof c === "string" ? c : c.text)) && (pageText || "No preview available for this document.")}
              </div>
            )}

            {/* Page-navigation buttons overlaid ON the document */}
            {isPdf && previewPage > 1 && (
              <button aria-label="Previous page" onClick={() => setPreviewPage(p => Math.max(1, p - 1))} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 38, height: 38, borderRadius: "50%", border: "1px solid " + T.outlineVariant, background: "rgba(255,255,255,0.94)", color: T.primary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(15,23,42,0.18)", zIndex: 2 }}>
                <ChevronLeft size={19} />
              </button>
            )}
            {isPdf && previewPage < previewPages && (
              <button aria-label="Next page" onClick={() => setPreviewPage(p => Math.min(previewPages, p + 1))} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 38, height: 38, borderRadius: "50%", border: "1px solid " + T.primary, background: T.primary, color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px rgba(79,70,229,0.32)", zIndex: 2 }}>
                <ChevronRight size={19} />
              </button>
            )}

            <div style={{ position: "absolute", left: "50%", bottom: 10, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.25rem 0.45rem", borderRadius: "999px", background: "rgba(255,255,255,0.92)", border: "1px solid " + T.outlineVariant, boxShadow: "0 8px 20px rgba(15,23,42,0.12)", zIndex: 2 }}>
              {Array.from({ length: previewPages }).map((_, i) => (
                <button key={i} onClick={() => setPreviewPage(i + 1)} aria-label={`Preview page ${i + 1}`} style={{ width: previewPage === i + 1 ? 22 : 8, height: 8, borderRadius: "999px", border: "none", background: previewPage === i + 1 ? T.primary : T.outlineVariant, cursor: "pointer", transition: "width .2s ease" }} />
              ))}
              <span style={{ marginLeft: "0.2rem", fontSize: "0.68rem", fontWeight: 900, color: T.onSurfaceVariant }}>{previewPage}/{previewPages}</span>
            </div>
          </div>
        </Card>

        {/* Right: AI-extracted requirements with live compliance validation */}
        <Card style={{ padding: "1.25rem", display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", marginBottom: "0.85rem", flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, fontWeight: 800, color: T.onSurface, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Sparkles size={16} color={T.primary} /> AI-Extracted Requirements
            </h3>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.25rem 0.7rem", borderRadius: "999px", background: T.passBg, color: T.pass, fontSize: "0.72rem", fontWeight: 800 }}>
              {revealed < ws.requirements.length ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <CheckCircle2 size={12} />}
              {validatedCount} of {ws.requirements.length} validated
            </span>
          </div>
          <div style={{ flex: 1, overflowY: "auto", maxHeight: "480px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {ws.requirements.length === 0 && (
              <div style={{ textAlign: "center", padding: "2rem 1rem", color: T.outline }}>
                <FileSearch size={26} style={{ marginBottom: "0.5rem" }} />
                <p style={{ fontSize: "0.85rem", margin: 0 }}>No requirements were extracted from this document.</p>
              </div>
            )}
            {ws.requirements.slice(0, revealed).map(r => {
              const m = matchFor(r.id);
              const status = m?.status;
              const StatusIcon = status === "PASS" ? CheckCircle2 : status === "PARTIAL" ? AlertTriangle : status === "FAIL" ? XCircle : Info;
              const sColor = statusColor(status || "INFO");
              return (
                <div key={r.id} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", padding: "0.6rem 0.75rem", background: status ? statusBg(status) + "99" : T.surfaceContainerLow, border: "1px solid " + (status ? sColor + "2e" : T.outlineVariant), borderRadius: "10px", animation: "fadeUp .3s ease" }}>
                  <StatusIcon size={17} color={sColor} style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.82rem", color: T.onSurface, fontWeight: 600, lineHeight: 1.45, overflowWrap: "anywhere" }}>{r.text}</div>
                    <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.3rem", flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.64rem", color: T.outline, fontWeight: 700 }}>{r.id}</span>
                      {r.mandatory && <span style={{ fontSize: "0.6rem", fontWeight: 800, color: T.fail, background: T.failBg, borderRadius: "4px", padding: "0.08rem 0.35rem" }}>MANDATORY</span>}
                      {status === "PASS" && m?.evidence?.[0] && <span style={{ fontSize: "0.66rem", fontWeight: 800, color: T.pass }}>✓ Matched: {m.evidence[0].cap_id}</span>}
                      {status === "PARTIAL" && <span style={{ fontSize: "0.66rem", fontWeight: 800, color: T.partial }}>Partial evidence</span>}
                      {status === "FAIL" && <span style={{ fontSize: "0.66rem", fontWeight: 800, color: T.fail }}>No capability match</span>}
                      {status === "INFO" && <span style={{ fontSize: "0.66rem", fontWeight: 800, color: T.info }}>Admin clause — manual review</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.85rem", paddingTop: "0.75rem", borderTop: "1px solid " + T.surfaceContainerLow }}>
            <ConfidenceRing value={conf} size={48} color={conf >= 90 ? T.pass : T.primary} />
            <div style={{ fontSize: "0.78rem", color: T.onSurfaceVariant }}>
              <strong style={{ color: T.onSurface }}>{conf >= 90 ? "High" : "Good"} extraction confidence.</strong> Each requirement was checked live against your capability library — green means matched evidence exists.
            </div>
          </div>
        </Card>
      </div>

      {/* Evaluation scoring weight + critical deadlines */}
      <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 980 ? "1fr" : "1.4fr 1fr", gap: "1.25rem" }}>
        <Card style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0, fontWeight: 800, color: T.onSurface, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><BarChart3 size={16} color={T.primary} /> Evaluation Scoring Weight</h3>
          </div>
          {(ws.evaluation_criteria || []).length === 0 && <p style={{ fontSize: "0.82rem", color: T.outline }}>No evaluation criteria extracted.</p>}
          {(ws.evaluation_criteria || []).map((c, i) => (
            <Bar key={i} label={c.criterion} value={c.weight} color={[T.primary, T.tertiary, T.secondary, T.pass, T.partial][i % 5]} />
          ))}
        </Card>

        <Card style={{ padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 1rem", fontWeight: 800, color: T.onSurface, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Calendar size={16} color={T.primary} /> Critical Deadlines</h3>
          {milestones.length === 0 && <p style={{ fontSize: "0.82rem", color: T.outline }}>No deadline extracted from this document.</p>}
          {milestones.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: i < milestones.length - 1 ? "0.85rem" : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: m.status === "Passed" ? T.surfaceContainerHigh : m.status === "Next Action" ? T.fail : T.primary, border: "2px solid " + (m.status === "Passed" ? T.outlineVariant : m.status === "Next Action" ? T.fail : T.primary), flexShrink: 0, marginTop: "0.15rem" }} />
                {i < milestones.length - 1 && <div style={{ flex: 1, width: "2px", background: T.outlineVariant, marginTop: "0.2rem" }} />}
              </div>
              <div>
                <div style={{ fontSize: "0.68rem", fontWeight: 800, color: m.status === "Passed" ? T.outline : m.status === "Next Action" ? T.fail : T.primary, textTransform: "uppercase", letterSpacing: "0.06em" }}>{m.status}</div>
                <div style={{ fontWeight: 800, color: T.onSurface, fontSize: "0.9rem", margin: "0.1rem 0" }}>{m.label}</div>
                <div style={{ fontSize: "0.78rem", color: T.onSurfaceVariant }}>{fmtDate(m.date.toISOString())}{m.date2 ? ` – ${fmtDate(m.date2.toISOString())}` : ""}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

    </div>
  );
}

/* ---- Compliance / Match tab ---- */
function ComplianceTab({ ws, updateWs, pushToast }) {
  const { logActivity, logExport } = useContext(AppContext);
  const [filter, setFilter] = useState("All");
  const [mandatoryOnly, setMandatoryOnly] = useState(false);
  const [selectedId, setSelectedId] = useState((ws.compliance && ws.compliance[0]?.requirement_id) || null);
  const [manualEditId, setManualEditId] = useState(null);
  const [manualText, setManualText] = useState("");
  const [bottomTab, setBottomTab] = useState("risks"); // risks | evidence — one compact section instead of two stacked cards
  const { pass, partial, fail, info, total, score } = ws.complianceSummary || { pass: 0, partial: 0, fail: 0, info: 0, total: 0, score: 0 };

  const filtered = (ws.compliance || []).filter(c => {
    if (filter !== "All" && c.status !== filter) return false;
    if (mandatoryOnly && !(ws.requirements.find(r => r.id === c.requirement_id) || {}).mandatory) return false;
    return true;
  });

  const recalc = (newCompliance) => {
    const p = newCompliance.filter(c => c.status === "PASS").length;
    const pa = newCompliance.filter(c => c.status === "PARTIAL").length;
    const f = newCompliance.filter(c => c.status === "FAIL").length;
    const i = newCompliance.filter(c => c.status === "INFO").length;
    const actionable = newCompliance.filter(c => c.status !== "INFO");
    const t = newCompliance.length;
    const s = actionable.length ? Math.round(((p + pa * 0.5) / actionable.length) * 100) : 0;
    return { pass: p, partial: pa, fail: f, info: i, total: t, score: s };
  };

  const saveManual = (reqId) => {
    const newCompliance = ws.compliance.map(c => c.requirement_id === reqId ? { ...c, status: "PARTIAL", evidence_project: "Manual entry", reason: manualText, suggested_action: "Verify and formalize this evidence before submission." } : c);
    updateWs({ ...ws, compliance: newCompliance, complianceSummary: recalc(newCompliance) });
    setManualEditId(null); setManualText("");
    pushToast("Manual evidence added — status updated to PARTIAL.", "success");
  };

  const toggleFlag = (reqId) => {
    updateWs({ ...ws, flagged: { ...ws.flagged, [reqId]: !ws.flagged?.[reqId] } });
    pushToast(ws.flagged?.[reqId] ? "Flag removed." : "Requirement flagged for review.", ws.flagged?.[reqId] ? "success" : "warn");
  };

  const toggleApprove = (reqId) => {
    updateWs({ ...ws, approved: { ...ws.approved, [reqId]: !ws.approved?.[reqId] } });
    pushToast(ws.approved?.[reqId] ? "Match unapproved." : "Match approved.", "success");
  };

  // Export lives in the workflow toolbar (Export Report dropdown next to "Next: Draft").
  const overallDecision = score >= 80 ? "GO" : score >= 60 ? "CONDITIONAL_GO" : score >= 40 ? "HIGH_RISK" : "NO-GO";
  const selected = (ws.compliance || []).find(c => c.requirement_id === selectedId);
  const selectedReq = selected ? (ws.requirements.find(r => r.id === selected.requirement_id) || {}) : null;
  const riskRows = (ws.compliance || []).map(c => {
    const req = ws.requirements.find(r => r.id === c.requirement_id) || {};
    const risk = riskForRow(c, req);
    return risk ? { row: c, req, risk } : null;
  }).filter(Boolean);
  const riskCounts = riskRows.reduce((acc, r) => ({ ...acc, [r.risk.level]: (acc[r.risk.level] || 0) + 1 }), { High: 0, Medium: 0, Low: 0 });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
      {/* Header card */}
      <Card style={{ padding: "1rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "0.85rem" }}>
        <div>
          <h2 style={{ margin: "0 0 0.35rem", fontWeight: 900, fontSize: "1.15rem", color: T.onSurface }}>Compliance Checklist</h2>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <DecisionPill decision={overallDecision} />
            <span style={{ fontSize: "0.85rem", color: T.onSurfaceVariant }}>{total} items evaluated in "{ws.meta.title}"</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{ textAlign: "center" }}>
            <ConfidenceRing value={score} size={64} color={score >= 80 ? T.pass : score >= 60 ? T.partial : T.fail} />
            <div style={{ fontSize: "0.65rem", fontWeight: 800, color: T.outline, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: "0.2rem" }}>Compliance Score</div>
          </div>
        </div>
      </Card>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 800 ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: "0.7rem" }}>
        {[["PASS", pass, "pass"], ["PARTIAL", partial, "partial"], ["FAIL", fail, "fail"], ["INFO", info, "info"]].map(([label, val, status]) => {
          const Icon = statusIcon(status === "fail" ? "FAIL" : status === "partial" ? "PARTIAL" : "PASS");
          const active = filter === label;
          return (
            <button key={label} onClick={() => setFilter(active ? "All" : label)} style={{
              textAlign: "left", padding: "0.72rem 0.9rem", borderRadius: "12px", cursor: "pointer",
              border: "1px solid " + (active ? statusColor(label) : T.outlineVariant),
              background: active ? statusBg(label) : "#fff",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 800, color: T.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
                <Icon size={18} color={statusColor(label)} />
              </div>
              <div style={{ fontSize: "1.45rem", fontWeight: 900, color: T.onSurface }}>{val}</div>
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
        {["All","PASS","PARTIAL","FAIL","INFO"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "0.4rem 1rem", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer",
            border: "1px solid " + (filter === f ? T.primary : T.outlineVariant),
            background: filter === f ? T.primary : "#fff", color: filter === f ? "#fff" : T.onSurfaceVariant,
          }}>{f}</button>
        ))}
        <div style={{ width: "1px", height: "20px", background: T.outlineVariant, margin: "0 0.4rem" }} />
        <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 700, color: T.onSurfaceVariant, cursor: "pointer" }}>
          <input type="checkbox" checked={mandatoryOnly} onChange={e => setMandatoryOnly(e.target.checked)} /> Mandatory Only
        </label>
        <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: T.outline }}>Showing {filtered.length} of {total} requirements</span>
      </div>

      {/* Table + side panel */}
      <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 1100 ? "1fr" : "1.55fr 0.95fr", gap: "0.85rem", alignItems: "stretch" }}>
        <Card style={{ overflow: "hidden", display: "flex", flexDirection: "column", height: window.innerWidth < 1100 ? "auto" : "520px" }}>
          <div style={{ flex: 1, overflowX: "hidden", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <thead>
                <tr style={{ background: T.surfaceContainerLow, borderBottom: "1px solid " + T.outlineVariant }}>
                  {["Status","ID","Requirement","Type","Evidence"].map(h => (
                    <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 800, color: T.onSurfaceVariant, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: T.outline, fontSize: "0.85rem" }}>No requirements match this filter.</td></tr>
                )}
                {filtered.map(c => {
                  const req = ws.requirements.find(r => r.id === c.requirement_id) || {};
                  const isSel = selectedId === c.requirement_id;
                  return (
                    <tr key={c.requirement_id} onClick={() => setSelectedId(c.requirement_id)} style={{ borderBottom: "1px solid " + T.surfaceContainerLow, cursor: "pointer", background: isSel ? T.surfaceContainerLow : "transparent" }}
                      onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = `${T.primary}06`; }} onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}>
                      <td style={{ padding: "0.85rem 1rem" }}><StatusPill status={c.status} size="sm" /></td>
                      <td style={{ padding: "0.85rem 1rem", fontFamily: "'JetBrains Mono',monospace", fontSize: "0.78rem", color: T.onSurfaceVariant, fontWeight: 700 }}>{c.requirement_id}</td>
                      <td style={{ padding: "0.85rem 1rem", maxWidth: "320px" }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: T.onSurface, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{req.text}</div>
                        <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", marginTop: "0.25rem" }}>
                          {ws.flagged?.[c.requirement_id] && <ReviewBadge label="Flagged" />}
                          {reviewFlagsForRequirement(c, req).slice(0, 2).map(flag => <ReviewBadge key={flag} label={flag} />)}
                        </div>
                      </td>
                      <td style={{ padding: "0.85rem 1rem", fontSize: "0.78rem", color: T.onSurfaceVariant, textTransform: "capitalize" }}>{req.mandatory ? "Mandatory" : (req.category || "—")}</td>
                      <td style={{ padding: "0.85rem 1rem" }}>
                        {c.evidence_project ? (
                          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: T.primary }}>{c.evidence_project}</span>
                        ) : (
                          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: T.fail }}>No match found</span>
                        )}
                        {ws.approved?.[c.requirement_id] && <CheckCircle2 size={13} color={T.pass} style={{ marginLeft: "0.3rem", verticalAlign: "middle" }} />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {fail > 0 && (
            <div style={{ padding: "0.85rem 1.25rem", borderTop: "1px solid " + T.outlineVariant, background: T.failBg, color: T.fail, fontSize: "0.82rem", fontWeight: 700 }}>
              {fail} compliance gap{fail > 1 ? "s" : ""} found — these may disqualify the bid if mandatory. Review before submission.
            </div>
          )}
        </Card>

        {/* Side panel */}
        <Card style={{ padding: "1rem", position: window.innerWidth < 1100 ? "static" : "sticky", top: "5.5rem", height: window.innerWidth < 1100 ? "auto" : "520px", maxHeight: "520px", overflowY: "auto" }}>
          {!selected ? (
            <div style={{ textAlign: "center", padding: "2rem 0.5rem", color: T.outline }}>
              <FileSearch size={28} style={{ marginBottom: "0.5rem" }} />
              <p style={{ fontSize: "0.85rem", margin: 0 }}>Select a requirement to view AI reasoning and evidence details.</p>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div>
                  <div style={{ fontSize: "1rem", fontWeight: 900, color: T.onSurface, marginBottom: "0.25rem" }}>Requirement Details</div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 800, color: T.outline, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>Selected requirement, AI reasoning, and evidence</div>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.78rem", fontWeight: 800, color: T.primary, background: T.secondaryContainer, padding: "0.1rem 0.45rem", borderRadius: "5px" }}>{selected.requirement_id}</span>
                </div>
                <button onClick={() => setSelectedId(null)} style={{ background: "none", border: "none", color: T.outline, cursor: "pointer" }}><X size={18} /></button>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 800, color: T.outline, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Full Text</div>
                <p style={{ fontSize: "0.88rem", color: T.onSurface, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>"{selectedReq?.text}"</p>
              </div>

              {reviewFlagsForRequirement(selected, selectedReq).length > 0 && (
                <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                  {reviewFlagsForRequirement(selected, selectedReq).map(flag => <ReviewBadge key={flag} label={flag} />)}
                </div>
              )}

              <div style={{ background: T.secondaryContainer + "55", border: "1px solid " + T.secondaryContainer, borderRadius: "10px", padding: "0.85rem", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem", fontWeight: 800, fontSize: "0.8rem", color: T.primary }}>
                  <Sparkles size={14} /> AI Reasoning
                </div>
                <p style={{ fontSize: "0.84rem", color: T.onSurface, margin: "0 0 0.75rem", lineHeight: 1.55 }}>{selected.reason}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: T.onSurfaceVariant, flexShrink: 0 }}>AI Confidence</span>
                  <div style={{ flex: 1, height: "6px", background: "#fff", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${selected.confidence || 70}%`, background: T.primary, borderRadius: "3px" }} />
                  </div>
                  <span style={{ fontSize: "0.8rem", fontWeight: 800, color: T.primary }}>{selected.confidence || 70}%</span>
                </div>
              </div>

              {(selected.evidence || []).length > 0 && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 800, color: T.outline, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Evidence Details</div>
                  <div style={{ display: "grid", gap: "0.45rem" }}>
                    {(selected.evidence || []).slice(0, 3).map(ev => (
                      <details key={ev.cap_id} style={{ background: T.surfaceContainerLow, borderRadius: "10px", padding: "0.65rem 0.75rem" }}>
                        <summary style={{ cursor: "pointer", fontSize: "0.82rem", color: T.primary, fontWeight: 900 }}>{ev.cap_id} - {ev.domain || "Evidence"}</summary>
                        <div style={{ marginTop: "0.5rem", fontSize: "0.78rem", color: T.onSurfaceVariant, lineHeight: 1.6 }}>
                          <div>Similarity: <strong>{Math.round((ev.similarity_score || 0) * 100)}%</strong></div>
                          <div>Certification: <strong>{ev.certification || "Not listed"}</strong></div>
                          <div>Contract value: <strong>{fmtMoney(ev.contract_value || ev.value || 0)}</strong></div>
                          <div>Year completed: <strong>{ev.year_completed || "Not listed"}</strong></div>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {selected.suggested_action && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 800, color: T.outline, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>Suggested Action</div>
                  <div style={{ background: T.surfaceContainerLow, borderRadius: "10px", padding: "0.75rem 0.85rem", fontSize: "0.84rem", color: T.onSurfaceVariant, fontStyle: "italic", lineHeight: 1.55 }}>"{selected.suggested_action}"</div>
                </div>
              )}

              {selected.status === "FAIL" && (
                <div style={{ marginBottom: "1.25rem" }}>
                  {manualEditId !== selected.requirement_id ? (
                    <Btn size="sm" variant="outline" icon={Edit3} onClick={() => setManualEditId(selected.requirement_id)}>Add manual evidence</Btn>
                  ) : (
                    <div>
                      <Field label="Manual evidence">
                        <textarea value={manualText} onChange={e => setManualText(e.target.value)} rows={3} placeholder="Describe the evidence (e.g. subcontractor partnership, in-progress certification)..." style={{ ...inputStyle(false), fontSize: "0.82rem" }} />
                      </Field>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Btn size="sm" onClick={() => saveManual(selected.requirement_id)}>Save evidence</Btn>
                        <Btn size="sm" variant="ghost" onClick={() => { setManualEditId(null); setManualText(""); }}>Cancel</Btn>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <Btn size="sm" variant={ws.flagged?.[selected.requirement_id] ? "danger" : "secondary"} icon={Flag} onClick={() => toggleFlag(selected.requirement_id)}>{ws.flagged?.[selected.requirement_id] ? "Unflag" : "Flag for Review"}</Btn>
                <Btn size="sm" variant={ws.approved?.[selected.requirement_id] ? "success" : "primary"} icon={CheckCircle2} onClick={() => toggleApprove(selected.requirement_id)}>{ws.approved?.[selected.requirement_id] ? "Approved" : "Approve Match"}</Btn>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* ONE compact section with tabs — no more stacking two big cards & scrolling */}
      <Card style={{ padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.85rem" }}>
          <div style={{ display: "flex", gap: "0.35rem", background: T.surfaceContainer, borderRadius: "10px", padding: "0.25rem" }}>
            {[["risks", `Risk Register (${riskRows.length})`], ["evidence", `Evidence Traceability (${(ws.compliance || []).length})`]].map(([id, label]) => (
              <button key={id} onClick={() => setBottomTab(id)} style={{
                padding: "0.42rem 0.95rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 800, cursor: "pointer",
                border: "none", background: bottomTab === id ? "#fff" : "transparent",
                color: bottomTab === id ? T.primary : T.onSurfaceVariant,
                boxShadow: bottomTab === id ? "0 2px 8px rgba(15,23,42,0.1)" : "none",
              }}>{label}</button>
            ))}
          </div>
          {bottomTab === "risks" ? (
            <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", marginLeft: "auto", flexWrap: "wrap" }}>
              {[["High", riskCounts.High, T.fail, T.failBg], ["Medium", riskCounts.Medium, T.partial, T.partialBg], ["Low", riskCounts.Low, T.info, T.infoBg]].map(([level, count, color, bg]) => (
                <span key={level} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", background: bg, border: "1px solid " + color + "33", borderRadius: "10px", padding: "0.3rem 0.6rem" }}>
                  <RiskPill level={level} />
                  <strong style={{ color, fontSize: "0.95rem" }}>{count}</strong>
                </span>
              ))}
            </div>
          ) : (
            <span style={{ marginLeft: "auto", fontSize: "0.78rem", color: T.onSurfaceVariant }}>Every claim is traceable — click a row to expand.</span>
          )}
        </div>

        {bottomTab === "risks" ? (
          <div style={{ maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {riskRows.length === 0 && (
              <div style={{ padding: "1.5rem", textAlign: "center", color: T.outline, fontSize: "0.85rem", background: T.surfaceContainerLow, borderRadius: "10px" }}>
                No open risks. All actionable requirements have strong evidence.
              </div>
            )}
            {riskRows.map(({ row, req, risk }) => (
              <div key={row.requirement_id} style={{ background: T.surfaceContainerLow, borderRadius: "10px", padding: "0.7rem 0.85rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
                  <RiskPill level={risk.level} />
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.74rem", fontWeight: 800, color: T.onSurface }}>{row.requirement_id}</span>
                  <StatusPill status={row.status} size="sm" />
                  <span style={{ marginLeft: "auto", fontSize: "0.72rem", fontWeight: 800, color: T.onSurfaceVariant }}>Owner: {risk.owner}</span>
                </div>
                <div style={{ fontSize: "0.79rem", color: T.onSurfaceVariant, lineHeight: 1.5 }}>{risk.why}</div>
                <div style={{ fontSize: "0.79rem", color: T.onSurface, fontWeight: 600, marginTop: "0.2rem" }}>→ {risk.action}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {(ws.compliance || []).length === 0 && (
              <div style={{ padding: "1.5rem", textAlign: "center", color: T.outline, fontSize: "0.85rem", background: T.surfaceContainerLow, borderRadius: "10px" }}>
                Run an analysis to populate the evidence traceability report.
              </div>
            )}
            {(ws.compliance || []).map(row => {
              const top = row.evidence?.[0] || {};
              const confLabel = row.status === "INFO" ? "Manual Review" : confidenceForStatus(row.status) >= 80 ? "High" : confidenceForStatus(row.status) >= 60 ? "Medium" : "Low";
              return (
                <details key={row.requirement_id} style={{ background: T.surfaceContainerLow, borderRadius: "10px", padding: "0.6rem 0.85rem" }}>
                  <summary style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", listStyle: "none" }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: "0.74rem", fontWeight: 800, color: T.onSurface }}>{row.requirement_id}</span>
                    <StatusPill status={row.status} size="sm" />
                    <span style={{ fontSize: "0.74rem", fontWeight: 900, color: row.evidence?.length ? T.primary : T.outline, overflowWrap: "anywhere" }}>
                      {row.evidence?.length ? row.evidence.map(e => e.cap_id).join(", ") : "No evidence"}
                    </span>
                    <span style={{ marginLeft: "auto", fontSize: "0.7rem", fontWeight: 800, color: T.onSurfaceVariant }}>{confLabel}</span>
                  </summary>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.45rem", marginTop: "0.6rem" }}>
                    {[["Similarity", top.similarity_score ? `${Math.round(top.similarity_score * 100)}%` : "—"],
                      ["Domain", top.domain || "—"],
                      ["Certification", top.certification || "—"],
                      ["Contract Value", top.contract_value ? fmtMoney(top.contract_value) : "—"],
                      ["Year", top.year_completed || "—"]].map(([label, value]) => (
                      <div key={label} style={{ background: "#fff", borderRadius: "8px", padding: "0.45rem 0.6rem" }}>
                        <div style={{ fontSize: "0.6rem", fontWeight: 800, color: T.outline, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: T.onSurface, overflowWrap: "anywhere" }}>{value}</div>
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ---- Draft tab ---- */
function DraftTab({ ws, updateWs, pushToast }) {
  const { logActivity, logExport } = useContext(AppContext);
  const [generating, setGenerating] = useState(false);
  const [regenId, setRegenId] = useState(null);
  const [active, setActive] = useState(0);

  const generate = async () => {
    setGenerating(true);
    try {
      const data = await apiJSON(`/api/rfp/${ws.backendId || ws.id}/draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_ids: [], use_llm: true, model: ws.model || "ollama", max_sections: 4 }),
      });
      const drafts = data.drafts || [];
      if (!drafts.length) {
        pushToast("No questions or requirements were found to draft from. Re-run extraction with a richer document.", "warn");
        return;
      }
      const withMeta = drafts.map(d => mapDraft(d,
        (ws.questions || []).find(q => q.id === d.question_id) || (d.question ? { question: d.question } : null)));
      updateWs({ ...ws, draftSections: withMeta });
      logActivity("Draft proposal generated", `DecisAI drafted ${withMeta.length} section(s) for "${ws.meta.title}"`, Sparkles, "info");
      pushToast(`Proposal draft generated — ${withMeta.length} section(s) ready for review.`, "success");
    } catch (e) {
      pushToast("Draft generation failed: " + e.message + ". Check that the DecisAI backend is running.", "error");
    } finally {
      setGenerating(false);
    }
  };

  const regenerate = async (idx) => {
    setRegenId(ws.draftSections[idx].id);
    try {
      const current = ws.draftSections[idx];
      const q = ws.questions.find(q => q.id === current.id);
      const data = await apiJSON(`/api/rfp/${ws.backendId || ws.id}/draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_ids: [current.id], use_llm: true, model: ws.model || "ollama", max_sections: 1 }),
      });
      const next = mapDraft((data.drafts || [])[0] || current, q);
      const updated = ws.draftSections.map((s, i) => i === idx ? { ...s, ...next, approved: false } : s);
      updateWs({ ...ws, draftSections: updated });
      pushToast("Section regenerated by backend.", "success");
    } catch (e) {
      pushToast("Regeneration failed: " + e.message, "error");
    } finally {
      setRegenId(null);
    }
  };

  const editContent = (idx, val) => {
    const updated = ws.draftSections.map((s, i) => i === idx ? { ...s, content: val } : s);
    updateWs({ ...ws, draftSections: updated });
  };

  const toggleApprove = (idx) => {
    const updated = ws.draftSections.map((s, i) => i === idx ? { ...s, approved: !s.approved } : s);
    updateWs({ ...ws, draftSections: updated });
  };

  const exportProposal = async (format = "pdf") => {
    try {
      const { filename } = await downloadBackendExport(ws, format);
      updateWs({ ...ws, exportedAt: new Date().toISOString() });
      logExport(filename, "Downloaded from DecisAI backend", `Proposal ${format.toUpperCase()}`, ws.meta.title);
      logActivity("Proposal exported", `${format.toUpperCase()} exported for "${ws.meta.title}"`, Download, "info");
      pushToast(`${format.toUpperCase()} exported from backend.`, "success");
      return;
    } catch (e) {
      pushToast("Export failed: " + e.message, "error");
      return;
    }
    const lines = [`PROPOSAL — ${ws.meta.title}`, `Submitted to: ${ws.meta.issuer}`, ``];
    (ws.draftSections || []).forEach(s => { lines.push(`## ${s.section}`); lines.push(s.content); lines.push(""); });
    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const filename = `Proposal_${ws.meta.title.replace(/\s+/g,"_")}.txt`;
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    updateWs({ ...ws, exportedAt: new Date().toISOString() });
    logExport(filename, content, "Proposal Draft", ws.meta.title);
    logActivity("Proposal exported", `${ws.draftSections.length} sections exported for "${ws.meta.title}"`, Download, "info");
    pushToast("Proposal exported.", "success");
  };

  if (!ws.draftSections || ws.draftSections.length === 0) {
    return (
      <Card style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${T.primary}14`, color: T.primary, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.85rem" }}>
          <PenSquare size={26} />
        </div>
        <h3 style={{ margin: "0 0 0.4rem", color: T.onSurface, fontWeight: 800 }}>No draft yet</h3>
        <p style={{ color: T.onSurfaceVariant, fontSize: "0.9rem", margin: "0 auto 1.25rem", maxWidth: "420px" }}>Generate an AI-written first draft for each question in this {ws.docType || "RFP"}, grounded in your capability evidence. You can review, edit, and approve every section before export.</p>
        {generating ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem" }}>
            <Loader2 size={28} color={T.primary} style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: T.primary }}>Drafting grounded answers from matched evidence…</span>
            <span style={{ fontSize: "0.75rem", color: T.outline }}>Using {ws.model === "ollama" ? "Ollama Qwen 2.5 1.5B (offline)" : "Claude Haiku 4.5 (online)"} with template fallback — this can take a moment.</span>
          </div>
        ) : (
          <Btn size="lg" variant="ai" icon={Sparkles} onClick={generate}>Generate Proposal Draft</Btn>
        )}
      </Card>
    );
  }

  const approvedCount = ws.draftSections.filter(s => s.approved).length;
  const sectionTotal = Math.max(1, ws.draftSections.length);

  return (
    <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 950 ? "1fr" : "280px 1fr", gap: "1.25rem" }}>
      <Card style={{ padding: "1.25rem", alignSelf: "flex-start" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
          <span style={{ fontSize: "0.82rem", fontWeight: 800, color: T.onSurface }}>Sections</span>
          <span style={{ fontSize: "0.78rem", color: T.onSurfaceVariant, fontWeight: 700 }}>{approvedCount}/{ws.draftSections.length} approved</span>
        </div>
        <div style={{ height: "6px", background: T.surfaceContainerHigh, borderRadius: "3px", marginBottom: "0.85rem", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(approvedCount/sectionTotal)*100}%`, background: T.pass, transition: "width .4s" }} />
        </div>
        {ws.draftSections.map((s, i) => (
          <button key={s.id} onClick={() => setActive(i)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", textAlign: "left", padding: "0.55rem 0.6rem", borderRadius: "8px", border: "none", background: active === i ? T.surfaceContainerLow : "transparent", cursor: "pointer", marginBottom: "0.15rem" }}>
            {s.approved ? <CheckCircle2 size={15} color={T.pass} /> : <div style={{ width: 15, height: 15, borderRadius: "50%", border: "1px solid " + T.outlineVariant, flexShrink: 0 }} />}
            <span style={{ fontSize: "0.82rem", color: T.onSurface, fontWeight: active === i ? 800 : 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.section}</span>
          </button>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.85rem" }}>
          <Btn full size="sm" icon={Download} onClick={() => exportProposal("pdf")}>Export PDF</Btn>
          <Btn full size="sm" variant="secondary" icon={FileText} onClick={() => exportProposal("docx")}>Export DOCX</Btn>
          <Btn full size="sm" variant="outline" icon={FileCheck2} onClick={() => exportProposal("json")}>Export JSON</Btn>
          <Btn full size="sm" variant="outline" icon={RotateCcw} onClick={generate} disabled={generating}>{generating ? "Regenerating all..." : "Regenerate all"}</Btn>
        </div>
      </Card>

      <Card style={{ padding: "1.5rem" }}>
        {ws.draftSections[active] && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
              <div>
                <div style={{ fontSize: "0.7rem", color: T.outline, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>{ws.draftSections[active].id}</div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 900, margin: "0.15rem 0 0", color: T.onSurface }}>{ws.draftSections[active].section}</h3>
              </div>
              <span style={{ fontSize: "0.78rem", fontWeight: 800, color: T.outline, fontFamily: "'JetBrains Mono',monospace" }}>{(ws.draftSections[active].content || "").split(/\s+/).filter(Boolean).length} words</span>
            </div>
            {(() => { const q = ws.questions.find(q => q.id === ws.draftSections[active].id); return q ? (
              <div style={{ fontSize: "0.82rem", color: T.primary, background: T.secondaryContainer + "55", border: "1px solid " + T.secondaryContainer, padding: "0.6rem 0.85rem", borderRadius: "8px", marginBottom: "0.85rem", fontWeight: 600 }}>
                <strong>RFP asked:</strong> "{q.question}"
              </div>
            ) : null; })()}
            {(ws.draftSections[active].reviewFlags || []).length > 0 && (
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.85rem" }}>
                {ws.draftSections[active].reviewFlags.map(flag => <ReviewBadge key={flag} label={flag} />)}
              </div>
            )}
            <div style={{ fontSize: "0.76rem", color: T.onSurfaceVariant, marginBottom: "0.5rem" }}>
              Generation method: <strong>{ws.draftSections[active].generation_method || "backend"}</strong>
              {ws.draftSections[active].fallback_reason ? ` | Reason: ${ws.draftSections[active].fallback_reason}` : ""}
            </div>
            <textarea value={ws.draftSections[active].content} onChange={e => editContent(active, e.target.value)} rows={11} style={{ ...inputStyle(false), fontSize: "0.9rem", lineHeight: 1.65, resize: "vertical" }}
              onFocus={e => e.target.style.boxShadow = `0 0 0 3px ${T.primary}1a`} onBlur={e => e.target.style.boxShadow = "none"} />
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.85rem", flexWrap: "wrap" }}>
              <Btn size="sm" icon={ws.draftSections[active].approved ? CheckCircle2 : Check} variant={ws.draftSections[active].approved ? "success" : "outline"} onClick={() => toggleApprove(active)}>{ws.draftSections[active].approved ? "Approved" : "Approve section"}</Btn>
              <Btn size="sm" variant="outline" icon={regenId === ws.draftSections[active].id ? Loader2 : RotateCcw} onClick={() => regenerate(active)} disabled={regenId !== null}>{regenId === ws.draftSections[active].id ? "Regenerating..." : "Regenerate section"}</Btn>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

/* ---- Score tab ---- */
function ScoreTab({ ws, updateWs }) {
  const [backendPresence, setBackendPresence] = useState(ws.winScore?.backendScore?.competitor_presence || "medium");
  const [backendScoreLoading, setBackendScoreLoading] = useState(false);
  const backendBreakdown = ws.winScore?.breakdown || {};
  const backendOverall = Math.round(ws.winScore?.overall || 0);
  const backendSuggested = ws.winScore?.suggestedDecision || "HIGH_RISK";
  const backendRiskCounts = (ws.compliance || []).reduce((acc, c) => {
    const req = ws.requirements.find(r => r.id === c.requirement_id) || {};
    const risk = riskForRow(c, req);
    if (risk) acc[risk.level] = (acc[risk.level] || 0) + 1;
    return acc;
  }, { High: 0, Medium: 0, Low: 0 });
  const refreshBackendScore = async (presence = backendPresence) => {
    setBackendScoreLoading(true);
    try {
      const score = await apiJSON(`/api/rfp/${ws.backendId || ws.id}/score?competitor_presence=${presence}`);
      updateWs({
        ...ws,
        winScore: {
          overall: score.overall,
          breakdown: {
            compliance: score.breakdown?.compliance || 0,
            domainMatch: score.breakdown?.domain_match || 0,
            budgetAlignment: score.breakdown?.budget_alignment || 0,
            pastWinRate: score.breakdown?.past_win_rate || 0,
            competitorScore: score.breakdown?.competitor_risk || 0,
            competitorRisk: 100 - (score.breakdown?.competitor_risk || 50),
          },
          suggestedDecision: normalizeDecision(score.decision),
          backendScore: { ...score, competitor_presence: presence },
        },
      });
    } catch (e) {
      // The score already shown remains valid; the toast surface is not passed into this tab.
    } finally {
      setBackendScoreLoading(false);
    }
  };
  const backendLabel = backendOverall >= 80 ? "Strong GO" : backendOverall >= 60 ? "Conditional GO" : backendOverall >= 40 ? "High Risk" : "No-Go";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 950 ? "1fr" : "280px 1fr", gap: "1.25rem" }}>
        <Card style={{ padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <ScoreRing value={backendOverall} />
          <div style={{ fontWeight: 900, fontSize: "1.1rem", color: decisionColor(backendSuggested), marginTop: "0.75rem" }}>{backendLabel}</div>
          <DecisionPill decision={backendSuggested} size="sm" />
          <p style={{ fontSize: "0.8rem", color: T.onSurfaceVariant, textAlign: "center", margin: "0.5rem 0 0" }}>Backend weighted score using compliance, domain match, budget alignment, past win rate, and competitor presence.</p>
        </Card>
        <Card style={{ padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 1rem", fontWeight: 800, color: T.onSurface, fontSize: "1rem" }}>Score Breakdown</h3>
          <Bar label="Compliance" value={Math.round(backendBreakdown.compliance || 0)} weight={30} color={T.pass} />
          <Bar label="Domain match" value={Math.round(backendBreakdown.domainMatch || 0)} weight={25} color={T.primary} />
          <Bar label="Budget alignment" value={Math.round(backendBreakdown.budgetAlignment || 0)} weight={20} color={T.tertiary} />
          <Bar label="Past win rate" value={Math.round(backendBreakdown.pastWinRate || 0)} weight={15} color={T.primaryContainer} />
          <Bar label="Competitor position" value={Math.round(backendBreakdown.competitorScore || 0)} weight={10} color={T.secondary} />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 950 ? "1fr" : "1fr 1fr", gap: "1.25rem" }}>
        <Card style={{ padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 0.85rem", fontWeight: 800, color: T.onSurface, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><BarChart3 size={16} color={T.primary} /> Requirement Status Matrix</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.65rem" }}>
            {[["PASS", ws.complianceSummary?.pass || 0], ["PARTIAL", ws.complianceSummary?.partial || 0], ["FAIL", ws.complianceSummary?.fail || 0], ["INFO", ws.complianceSummary?.info || 0]].map(([label, value]) => (
              <div key={label} style={{ background: statusBg(label), borderRadius: "12px", padding: "0.85rem", textAlign: "center" }}>
                <div style={{ color: statusColor(label), fontWeight: 900, fontSize: "1.55rem" }}>{value}</div>
                <div style={{ color: statusColor(label), fontWeight: 900, fontSize: "0.68rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 0.85rem", fontWeight: 800, color: T.onSurface, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><SlidersHorizontal size={16} color={T.primary} /> Competitor Presence</h3>
          <Field label="Manager input">
            <select value={backendPresence} onChange={e => { setBackendPresence(e.target.value); refreshBackendScore(e.target.value); }} style={inputStyle(false)}>
              <option value="low">Low competitor presence</option>
              <option value="medium">Medium competitor presence</option>
              <option value="high">High competitor presence</option>
            </select>
          </Field>
          <Btn size="sm" icon={backendScoreLoading ? Loader2 : RotateCcw} onClick={() => refreshBackendScore()} disabled={backendScoreLoading}>{backendScoreLoading ? "Refreshing..." : "Refresh Backend Score"}</Btn>
        </Card>
      </div>

      <Card style={{ padding: "1.5rem" }}>
        <h3 style={{ margin: "0 0 0.85rem", fontWeight: 800, color: T.onSurface, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><AlertTriangle size={16} color={T.partial} /> Risk Count Cards</h3>
        <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 700 ? "1fr" : "repeat(3,1fr)", gap: "0.85rem" }}>
          {["High", "Medium", "Low"].map(level => (
            <div key={level} style={{ border: "1px solid " + T.outlineVariant, borderRadius: "14px", padding: "1rem", background: level === "High" ? T.failBg : level === "Medium" ? T.partialBg : T.infoBg }}>
              <RiskPill level={level} />
              <div style={{ fontSize: "2rem", fontWeight: 900, color: level === "High" ? T.fail : level === "Medium" ? T.partial : T.info, marginTop: "0.35rem" }}>{backendRiskCounts[level] || 0}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const [competitorRisk, setCompetitorRisk] = useState(ws.winScore?.competitorRisk ?? 50);
  const [assumeFixed, setAssumeFixed] = useState(false);

  const sectorInfo = SECTOR_DATA[ws.meta.sector];
  let { pass, partial, fail, total } = ws.complianceSummary || { pass: 0, partial: 0, fail: 0, total: 1 };
  if (assumeFixed) { pass += fail; fail = 0; }
  const complianceScore = total ? Math.round(((pass + partial * 0.5) / total) * 100) : 0;

  const budgetRatio = ws.meta.budget ? ws.meta.budget / sectorInfo.avgBudget : 1;
  let budgetAlignment = 90 - Math.abs(1 - budgetRatio) * 25;
  budgetAlignment = Math.max(20, Math.min(95, Math.round(budgetAlignment)));

  const domainMatch = sectorInfo.winRate;
  const pastWinRate = sectorInfo.winRate;
  const competitorScore = 100 - competitorRisk;

  const overall = Math.round(complianceScore * 0.30 + domainMatch * 0.25 + budgetAlignment * 0.20 + pastWinRate * 0.15 + competitorScore * 0.10);

  useEffect(() => {
    const decision = overall >= 80 ? "GO" : overall >= 60 ? "CONDITIONAL_GO" : overall >= 40 ? "HIGH_RISK" : "NO-GO";
    updateWs(prev => ({ ...prev, winScore: { overall, breakdown: { compliance: complianceScore, domainMatch, budgetAlignment, pastWinRate, competitorScore, competitorRisk }, suggestedDecision: decision } }));
    // eslint-disable-next-line
  }, [overall, competitorRisk, assumeFixed]);

  const label = overall >= 80 ? "Strong GO" : overall >= 60 ? "Conditional GO" : overall >= 40 ? "High Risk" : "No-Go";
  const labelColor = overall >= 80 ? T.pass : overall >= 60 ? T.partial : overall >= 40 ? T.highRisk : T.fail;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 950 ? "1fr" : "280px 1fr", gap: "1.25rem" }}>
        <Card style={{ padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <ScoreRing value={overall} />
          <div style={{ fontWeight: 900, fontSize: "1.1rem", color: labelColor, marginTop: "0.75rem" }}>{label}</div>
          <p style={{ fontSize: "0.8rem", color: T.onSurfaceVariant, textAlign: "center", margin: "0.3rem 0 0" }}>Predicted win probability for this opportunity</p>
        </Card>
        <Card style={{ padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 1rem", fontWeight: 800, color: T.onSurface, fontSize: "1rem" }}>Score Breakdown</h3>
          <Bar label="Compliance" value={complianceScore} weight={30} color={T.pass} />
          <Bar label="Domain match" value={domainMatch} weight={25} color={T.primary} />
          <Bar label="Budget alignment" value={budgetAlignment} weight={20} color={T.tertiary} />
          <Bar label="Past win rate" value={pastWinRate} weight={15} color={T.primaryContainer} />
          <Bar label="Competitor position" value={competitorScore} weight={10} color={T.secondary} />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 950 ? "1fr" : "1fr 1fr", gap: "1.25rem" }}>
        <Card style={{ padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 0.75rem", fontWeight: 800, color: T.onSurface, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><History size={16} color={T.primary} /> Historical Context</h3>
          <p style={{ fontSize: "0.86rem", color: T.onSurfaceVariant, margin: "0 0 0.6rem", lineHeight: 1.6 }}>In <strong style={{ color: T.onSurface }}>{ws.meta.sector}</strong>, your team has submitted <strong style={{ color: T.onSurface }}>{sectorInfo.total}</strong> bids and won <strong style={{ color: T.onSurface }}>{sectorInfo.won}</strong> ({sectorInfo.winRate}%).</p>
          <p style={{ fontSize: "0.86rem", color: T.onSurfaceVariant, margin: 0, lineHeight: 1.6 }}>Typical {ws.meta.sector} contract value: <strong style={{ color: T.onSurface }}>{fmtMoney(sectorInfo.avgBudget)}</strong>. This RFP: <strong style={{ color: T.onSurface }}>{fmtMoney(ws.meta.budget, ws.meta.currency)}</strong>.</p>
        </Card>
        <Card style={{ padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 0.85rem", fontWeight: 800, color: T.onSurface, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><SlidersHorizontal size={16} color={T.primary} /> What-If Simulator</h3>
          <Field label={`Competitor presence risk: ${competitorRisk}`}>
            <input type="range" min="0" max="100" value={competitorRisk} onChange={e => setCompetitorRisk(Number(e.target.value))} style={{ width: "100%", accentColor: T.primary }} />
          </Field>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: T.onSurface, cursor: "pointer", fontWeight: 600 }}>
            <input type="checkbox" checked={assumeFixed} onChange={e => setAssumeFixed(e.target.checked)} />
            Assume all compliance gaps are fixed
          </label>
          {ws.complianceSummary.fail > 0 && !assumeFixed && (
            <div style={{ marginTop: "0.65rem", fontSize: "0.78rem", color: T.partial, background: T.partialBg, padding: "0.5rem 0.7rem", borderRadius: "8px", fontWeight: 600 }}>Fixing {ws.complianceSummary.fail} gap(s) would change the score — try the checkbox above.</div>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ---- Decision tab ---- */
function DecisionTab({ ws, updateWs, pushToast, onGoWorkspaces }) {
  const { logActivity } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const overall = ws.winScore?.overall ?? 0;
  const suggested = ws.winScore?.suggestedDecision ?? "HIGH_RISK";

  const getRecommendation = async () => {
    setLoading(true);
    try {
      const budgetText = ws.meta.budget ? `${ws.meta.currency || "PKR"} ${ws.meta.budget}` : "PKR 50M";
      const params = new URLSearchParams({
        sector: ws.meta.sector || "IT Services",
        budget: budgetText,
        compliance_pct: String(ws.complianceSummary?.score || 0),
      });
      if (overall) params.set("score_pct", String(overall)); // omit when unknown — empty string breaks validation
      const backendDecisionResult = await apiJSON(`/api/rfp/${ws.backendId || ws.id}/decision?${params.toString()}`);
      if (backendDecisionResult.error) throw new Error(backendDecisionResult.error);
      const details = decisionDetailsFromWorkspace(ws, backendDecisionResult);
      updateWs({ ...ws, decisionDetails: details, winProbability: backendDecisionResult.win_probability, actions: Object.fromEntries((details.actions || []).map((_, i) => [i, false])) });
      logActivity("AI recommendation generated", `Decision analysis ready for "${ws.meta.title}"`, Sparkles, "info");
      pushToast("AI recommendation ready — review strengths, risks, and actions below.", "success");
    } catch (e) {
      pushToast("Could not generate recommendation: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const confirm = async (decision) => {
    try {
      await apiJSON(`/api/rfp/${ws.backendId || ws.id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, manager: "Bid Manager", notes: `Confirmed from DecisAI UI with score ${overall}/100.` }),
      });
    } catch (e) {
      pushToast("Decision saved locally, but backend log failed: " + e.message, "warn");
    }
    updateWs({ ...ws, decision, decidedAt: new Date().toISOString() });
    if (decision === "GO") { setConfetti(true); setTimeout(() => setConfetti(false), 2500); }
    logActivity(`Decision: ${decisionLabel(decision)}`, `"${ws.meta.title}" marked ${decisionLabel(decision)}`, decisionIcon(decision), decision === "GO" ? "pass" : decision === "NO-GO" ? "fail" : "partial");
    pushToast(`Decision logged: ${decisionLabel(decision)} — ${new Date().toLocaleString()}`, decision === "NO-GO" ? "warn" : "success");
  };

  const toggleAction = (i) => {
    updateWs({ ...ws, actions: { ...ws.actions, [i]: !ws.actions[i] } });
  };

  const blocks = [
    { key: "strengths", title: "Strengths", icon: CheckCircle2, color: T.pass, bg: T.passBg },
    { key: "risks", title: "Risks", icon: AlertTriangle, color: T.fail, bg: T.failBg },
    { key: "actions", title: "Recommended Actions", icon: ClipboardList, color: T.partial, bg: T.partialBg },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
      {confetti && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 300, overflow: "hidden" }}>
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute", top: "-10px", left: Math.random() * 100 + "%", width: "8px", height: "14px",
              background: [T.pass, T.primary, T.tertiary, T.partial][i % 4], animation: `fall ${1.5 + Math.random()}s linear forwards`,
              animationDelay: (Math.random() * 0.4) + "s", transform: `rotate(${Math.random()*360}deg)`,
            }} />
          ))}
        </div>
      )}

      <Card style={{ padding: "1rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem" }}>
        <div style={{ width: 76, height: 76, borderRadius: "50%", background: decisionBg(suggested), color: decisionColor(suggested), display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "2px solid " + decisionColor(suggested) }}>
          {React.createElement(decisionIcon(suggested), { size: 24 })}
          <span style={{ fontSize: "0.62rem", fontWeight: 900, marginTop: "0.2rem", textAlign: "center", lineHeight: 1.1, padding: "0 0.3rem" }}>{decisionLabel(suggested).toUpperCase()}</span>
        </div>
        <div style={{ flex: 1, minWidth: "220px" }}>
          <h3 style={{ fontWeight: 900, fontSize: "1.1rem", margin: "0 0 0.25rem", color: T.onSurface }}>Recommendation: {decisionLabel(suggested)}</h3>
          <p style={{ fontSize: "0.86rem", color: T.onSurfaceVariant, margin: 0, lineHeight: 1.6 }}>
            Based on a win probability of <strong style={{ color: T.onSurface }}>{overall}/100</strong>, compliance score of <strong style={{ color: T.onSurface }}>{ws.complianceSummary.score}%</strong>, and a {SECTOR_DATA[ws.meta.sector].winRate}% historical win rate in {ws.meta.sector}.
          </p>
          {ws.decision && <div style={{ marginTop: "0.6rem", fontSize: "0.82rem", fontWeight: 800, color: decisionColor(ws.decision), display: "flex", alignItems: "center", gap: "0.35rem" }}><CheckCircle2 size={15} /> Decision confirmed: {decisionLabel(ws.decision)}</div>}
        </div>
      </Card>

      {!ws.decisionDetails ? (
        <Card style={{ textAlign: "center", padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 0.4rem", color: T.onSurface, fontWeight: 800 }}>Ready for a recommendation?</h3>
          <p style={{ color: T.onSurfaceVariant, fontSize: "0.88rem", margin: "0 auto 1.25rem", maxWidth: "440px" }}>DecisAI will combine the compliance results, win probability, and your past performance into a clear GO / NO-GO recommendation.</p>
          <Btn size="lg" variant="ai" icon={loading ? Loader2 : Sparkles} onClick={getRecommendation} disabled={loading}>{loading ? "Preparing recommendation..." : "Get AI Recommendation"}</Btn>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 950 ? "1fr" : "repeat(3,1fr)", gap: "0.8rem" }}>
          {blocks.map(b => (
            <Card key={b.key} style={{ padding: "1rem", borderLeft: "4px solid " + b.color }}>
              <h4 style={{ margin: "0 0 0.75rem", color: b.color, fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "0.35rem" }}><b.icon size={15} /> {b.title}</h4>
              {(ws.decisionDetails[b.key] || []).map((s, i) => (
                b.key === "actions" ? (
                  <label key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", color: T.onSurface, marginBottom: "0.5rem", cursor: "pointer", alignItems: "flex-start" }}>
                    <input type="checkbox" checked={!!ws.actions?.[i]} onChange={() => toggleAction(i)} style={{ marginTop: "0.2rem" }} />
                    <span style={{ textDecoration: ws.actions?.[i] ? "line-through" : "none", opacity: ws.actions?.[i] ? 0.55 : 1 }}>{s}</span>
                  </label>
                ) : (
                  <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", color: T.onSurface, marginBottom: "0.5rem", lineHeight: 1.5 }}>
                    <span style={{ color: b.color, fontWeight: 900 }}>•</span> {s}
                  </div>
                )
              ))}
            </Card>
          ))}
        </div>
      )}

      {ws.decision ? (
        /* Confirmed state — the decision is clearly reflected and saved */
        <Card style={{ padding: "1rem 1.25rem", borderLeft: "5px solid " + decisionColor(ws.decision), background: decisionBg(ws.decision), display: "flex", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#fff", color: decisionColor(ws.decision), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {React.createElement(decisionIcon(ws.decision), { size: 24 })}
          </div>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <div style={{ fontWeight: 900, fontSize: "1.05rem", color: decisionColor(ws.decision) }}>Decision saved: {decisionLabel(ws.decision)}</div>
            <div style={{ fontSize: "0.8rem", color: T.onSurfaceVariant, marginTop: "0.15rem" }}>
              Confirmed by Team X{ws.decidedAt ? ` on ${new Date(ws.decidedAt).toLocaleString()}` : ""} · logged to the decision record.
            </div>
          </div>
          <Btn size="md" variant="secondary" icon={RotateCcw} onClick={() => updateWs({ ...ws, decision: null, decidedAt: null })}>Reset Decision</Btn>
          <Btn size="md" variant="primary" icon={FolderOpen} onClick={onGoWorkspaces}>Go to Workspaces</Btn>
        </Card>
      ) : (
        <Card style={{ padding: "1.25rem", display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontWeight: 800, color: T.onSurface, fontSize: "0.9rem", marginRight: "0.5rem" }}>Final Decision:</span>
          <Btn size="lg" variant="success" icon={CheckCircle2} onClick={() => confirm("GO")}>Confirm GO</Btn>
          <Btn size="lg" variant="danger" icon={XCircle} onClick={() => confirm("NO-GO")}>Mark NO-GO</Btn>
        </Card>
      )}
    </div>
  );
}

/* ============================================================
   WIN DASHBOARD — global analytics
============================================================ */
function WinDashboard({ workspaces }) {
  const totalBids = Object.values(SECTOR_DATA).reduce((s,d) => s + d.total, 0);
  const totalWon = Object.values(SECTOR_DATA).reduce((s,d) => s + d.won, 0);
  const overallRate = Math.round((totalWon / totalBids) * 1000) / 10;
  const sorted = [...BID_MANAGERS].sort((a,b) => (b.wins/b.total) - (a.wins/a.total));

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1500px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <h1 style={{ fontSize: "1.7rem", fontWeight: 900, color: T.onSurface, margin: "0 0 0.35rem" }}>Win Dashboard</h1>
        <p style={{ color: T.onSurfaceVariant, fontSize: "0.95rem", margin: 0 }}>Historical performance across all sectors, bid managers, and active workspaces.</p>
      </div>

      {/* Overview stats */}
      <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 700 ? "1fr 1fr" : "repeat(4,1fr)", gap: "1rem" }}>
        {[
          { label: "Total Bids Submitted", value: totalBids, icon: ClipboardList, color: T.primary },
          { label: "Total Bids Won", value: totalWon, icon: Award, color: T.pass },
          { label: "Overall Win Rate", value: overallRate, suffix: "%", icon: TrendingUp, color: T.primaryContainer },
          { label: "Active Workspaces", value: workspaces.length, icon: FolderOpen, color: T.tertiary },
        ].map(s => (
          <Card key={s.label} style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: T.onSurfaceVariant }}>{s.label}</span>
              <div style={{ width: 32, height: 32, borderRadius: "8px", background: s.color + "18", color: s.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={17} />
              </div>
            </div>
            <div style={{ fontSize: "1.9rem", fontWeight: 900, color: T.onSurface }}><Counter value={s.value} suffix={s.suffix || ""} /></div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 980 ? "1fr" : "1.3fr 1fr", gap: "1.25rem" }}>
        {/* Sector performance */}
        <Card style={{ padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 1rem", fontWeight: 800, color: T.onSurface, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><BarChart3 size={16} color={T.primary} /> Win Rate by Sector</h3>
          {SECTORS.map(sec => {
            const d = SECTOR_DATA[sec];
            return (
              <div key={sec} style={{ marginBottom: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <span style={{ fontSize: "0.84rem", fontWeight: 700, color: T.onSurface }}>{sec}</span>
                  <span style={{ fontSize: "0.8rem", color: T.onSurfaceVariant }}>{d.won}/{d.total} won · <strong style={{ color: T.primary }}>{d.winRate}%</strong></span>
                </div>
                <div style={{ height: "8px", background: T.surfaceContainerHigh, borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${d.winRate}%`, background: `linear-gradient(90deg, ${T.primaryContainer}, ${T.primary})`, borderRadius: "4px" }} />
                </div>
              </div>
            );
          })}
        </Card>

        {/* Leaderboard */}
        <Card style={{ padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 1rem", fontWeight: 800, color: T.onSurface, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Award size={16} color={T.primary} /> Bid Manager Leaderboard</h3>
          {sorted.slice(0,6).map((m, i) => {
            const rate = Math.round((m.wins/m.total)*100);
            return (
              <div key={m.name} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0", borderBottom: i < 5 ? "1px solid " + T.surfaceContainerLow : "none" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: i < 3 ? T.primary : T.surfaceContainerHigh, color: i < 3 ? "#fff" : T.onSurfaceVariant, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 900, flexShrink: 0 }}>{i+1}</div>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${T.primary}, ${T.primaryContainer})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.78rem", flexShrink: 0 }}>{m.name.split(" ").map(p=>p[0]).join("")}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: T.onSurface }}>{m.name}</div>
                  <div style={{ fontSize: "0.74rem", color: T.outline }}>{m.wins} wins / {m.total} bids</div>
                </div>
                <span style={{ fontWeight: 900, color: T.primary, fontSize: "0.95rem" }}>{rate}%</span>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Compliance heatmap by sector */}
      <Card style={{ padding: "1.5rem" }}>
        <h3 style={{ margin: "0 0 1rem", fontWeight: 800, color: T.onSurface, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Target size={16} color={T.primary} /> Sector Bid Value Overview</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}>
            <thead>
              <tr style={{ background: T.surfaceContainerLow }}>
                {["Sector","Bids","Won","Win Rate","Avg. Contract Value"].map(h => <th key={h} style={{ padding: "0.6rem 1rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 800, color: T.onSurfaceVariant, textTransform: "uppercase" }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {SECTORS.map(sec => {
                const d = SECTOR_DATA[sec];
                return (
                  <tr key={sec} style={{ borderBottom: "1px solid " + T.surfaceContainerLow }}>
                    <td style={{ padding: "0.65rem 1rem", fontWeight: 700, color: T.onSurface, fontSize: "0.85rem" }}>{sec}</td>
                    <td style={{ padding: "0.65rem 1rem", fontSize: "0.85rem", color: T.onSurfaceVariant }}>{d.total}</td>
                    <td style={{ padding: "0.65rem 1rem", fontSize: "0.85rem", color: T.onSurfaceVariant }}>{d.won}</td>
                    <td style={{ padding: "0.65rem 1rem" }}><StatusPill status={d.winRate >= 60 ? "PASS" : d.winRate >= 50 ? "PARTIAL" : "FAIL"} label={d.winRate + "%"} size="sm" /></td>
                    <td style={{ padding: "0.65rem 1rem", fontSize: "0.85rem", color: T.onSurfaceVariant }}>{fmtMoney(d.avgBudget)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ============================================================
   ACTIVITY LOGS
============================================================ */
function ActivityLogPage({ activityLog }) {
  return (
    <div style={{ padding: "1.5rem", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h1 style={{ fontSize: "1.7rem", fontWeight: 900, color: T.onSurface, margin: "0 0 0.35rem" }}>Activity Logs</h1>
        <p style={{ color: T.onSurfaceVariant, fontSize: "0.95rem", margin: 0 }}>A real-time record of AI actions and decisions across your workspaces.</p>
      </div>
      <Card style={{ padding: "0.5rem 1.5rem" }}>
        {activityLog.length === 0 && (
          <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: T.outline }}>
            <History size={28} style={{ marginBottom: "0.5rem" }} />
            <p style={{ fontSize: "0.85rem", margin: 0 }}>No activity yet — create an RFP workspace to get started.</p>
          </div>
        )}
        {activityLog.map((a, i) => (
          <div key={a.id} style={{ display: "flex", gap: "0.85rem", padding: "1rem 0", borderBottom: i < activityLog.length - 1 ? "1px solid " + T.surfaceContainerLow : "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: statusBg(a.kind === "pass" ? "PASS" : a.kind === "fail" ? "FAIL" : a.kind === "partial" ? "PARTIAL" : "info") , color: statusColor(a.kind === "pass" ? "PASS" : a.kind === "fail" ? "FAIL" : a.kind === "partial" ? "PARTIAL" : "info"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <a.icon size={16} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.88rem", fontWeight: 800, color: T.onSurface }}>{a.title}</div>
              <div style={{ fontSize: "0.82rem", color: T.onSurfaceVariant, marginTop: "0.1rem" }}>{a.body}</div>
            </div>
            <div style={{ fontSize: "0.74rem", color: T.outline, whiteSpace: "nowrap", flexShrink: 0 }}>{a.time}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ============================================================
   EXPORTS CENTER
============================================================ */
function ExportsPage({ exportsList, pushToast }) {
  const redownload = (item) => {
    const blob = new Blob([item.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = item.name; a.click();
    URL.revokeObjectURL(url);
    pushToast("File downloaded again.", "success");
  };

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h1 style={{ fontSize: "1.7rem", fontWeight: 900, color: T.onSurface, margin: "0 0 0.35rem" }}>Exports</h1>
        <p style={{ color: T.onSurfaceVariant, fontSize: "0.95rem", margin: 0 }}>Every proposal draft and compliance report you've exported, ready to download again.</p>
      </div>
      <Card style={{ overflow: "hidden" }}>
        {exportsList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: T.outline }}>
            <Share2 size={28} style={{ marginBottom: "0.5rem" }} />
            <p style={{ fontSize: "0.85rem", margin: 0 }}>Nothing exported yet. Generate a draft or compliance report and export it from the workspace.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
              <thead>
                <tr style={{ background: T.surfaceContainerLow }}>
                  {["File","Type","Workspace","Date",""].map(h => <th key={h} style={{ padding: "0.75rem 1.25rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 800, color: T.onSurfaceVariant, textTransform: "uppercase" }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {exportsList.map(item => (
                  <tr key={item.id} style={{ borderBottom: "1px solid " + T.surfaceContainerLow }}>
                    <td style={{ padding: "0.85rem 1.25rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, color: T.onSurface, fontSize: "0.85rem" }}><FileText size={15} color={T.primary} /> {item.name}</div>
                    </td>
                    <td style={{ padding: "0.85rem 1.25rem" }}><span style={{ padding: "0.2rem 0.6rem", borderRadius: "999px", background: T.secondaryContainer, color: T.primary, fontSize: "0.7rem", fontWeight: 800 }}>{item.type}</span></td>
                    <td style={{ padding: "0.85rem 1.25rem", fontSize: "0.85rem", color: T.onSurfaceVariant }}>{item.workspace}</td>
                    <td style={{ padding: "0.85rem 1.25rem", fontSize: "0.8rem", color: T.outline }}>{item.date}</td>
                    <td style={{ padding: "0.85rem 1.25rem", textAlign: "right" }}>
                      <button onClick={() => redownload(item)} style={{ background: "none", border: "1px solid " + T.outlineVariant, borderRadius: "8px", padding: "0.35rem 0.7rem", cursor: "pointer", color: T.primary, fontWeight: 700, fontSize: "0.78rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                        <Download size={13} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ============================================================
   PROFILE / SETTINGS
============================================================ */
function ProfileScreen({ user, pushToast, notifPrefs, setNotifPrefs }) {
  return (
    <div style={{ padding: "1.5rem", maxWidth: "900px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <h1 style={{ fontSize: "1.7rem", fontWeight: 900, color: T.onSurface, margin: "0 0 0.35rem" }}>Settings</h1>
        <p style={{ color: T.onSurfaceVariant, fontSize: "0.95rem", margin: 0 }}>Your Team X workspace identity and notification preferences.</p>
      </div>

      {/* Workspace identity */}
      <Card style={{ padding: "1.5rem" }}>
        <h3 style={{ margin: "0 0 1rem", fontWeight: 800, color: T.onSurface, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><User size={16} color={T.primary} /> Workspace Identity</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${T.primary}, ${T.primaryContainer})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.3rem" }}>
            {user.name.split(" ").map(p=>p[0]).slice(0,2).join("")}
          </div>
          <div>
            <div style={{ fontWeight: 800, color: T.onSurface }}>{user.name}</div>
            <div style={{ fontSize: "0.8rem", color: T.outline }}>{user.role} · {user.company}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 700 ? "1fr" : "1fr 1fr", gap: "0.75rem" }}>
          {[["Team", user.name], ["Company", user.company], ["Email", user.email], ["Role", user.role]].map(([label, value]) => (
            <div key={label} style={{ background: T.surfaceContainerLow, borderRadius: "10px", padding: "0.7rem 0.9rem" }}>
              <div style={{ fontSize: "0.65rem", fontWeight: 800, color: T.outline, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.2rem" }}>{label}</div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: T.onSurface, overflowWrap: "anywhere" }}>{value}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "0.78rem", color: T.outline, margin: "0.85rem 0 0" }}>All uploads, extractions, compliance results, drafts, and decisions are stored locally for Team X — no sign-in required, works online and offline.</p>
      </Card>

      {/* Preferences */}
      <Card style={{ padding: "1.5rem" }}>
        <h3 style={{ margin: "0 0 1rem", fontWeight: 800, color: T.onSurface, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}><Settings size={16} color={T.primary} /> Preferences</h3>
        {[
          { key: "deadlines", label: "Deadline reminders", desc: "Notify me when an RFP submission deadline is within 14 days." },
          { key: "compliance", label: "Compliance alerts", desc: "Notify me when a new compliance gap is found." },
          { key: "ai", label: "AI recommendation updates", desc: "Notify me when an AI recommendation is ready." },
        ].map(p => (
          <div key={p.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.7rem 0", borderBottom: "1px solid " + T.surfaceContainerLow }}>
            <div>
              <div style={{ fontWeight: 700, color: T.onSurface, fontSize: "0.9rem" }}>{p.label}</div>
              <div style={{ fontSize: "0.78rem", color: T.outline }}>{p.desc}</div>
            </div>
            <ToggleSwitch checked={notifPrefs[p.key]} onChange={() => setNotifPrefs(prev => ({ ...prev, [p.key]: !prev[p.key] }))} />
          </div>
        ))}
      </Card>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }) {
  return (
    <button onClick={onChange} style={{
      width: 44, height: 24, borderRadius: "999px", border: "none", cursor: "pointer", position: "relative",
      background: checked ? T.primary : T.surfaceContainerHigh, transition: "background .15s", flexShrink: 0,
    }}>
      <div style={{ position: "absolute", top: 3, left: checked ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .15s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    </button>
  );
}

/* ============================================================
   DATASET UPLOAD — company past data -> generated classifiers (JSON)
============================================================ */
function DatasetPage({ datasetInfo, setDatasetInfo, pushToast }) {
  const { logActivity } = useContext(AppContext);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  // Pick up classifiers already generated on the backend (e.g. after a restart)
  useEffect(() => {
    apiJSON("/api/dataset/info").then(d => {
      if (d?.classifiers) setDatasetInfo(d.classifiers);
    }).catch(() => {});
    // eslint-disable-next-line
  }, []);

  const handleFile = async (f) => {
    if (!f) return;
    setError(""); setUploading(true);
    try {
      const form = new FormData();
      form.append("file", f);
      const res = await apiJSON("/api/dataset/upload", { method: "POST", body: form });
      setDatasetInfo(res.classifiers);
      logActivity("Company dataset processed", `Classifiers generated from "${f.name}" and stored as JSON.`, Database, "pass");
      pushToast("Dataset processed — classifiers generated and stored as JSON.", "success");
    } catch (e) {
      setError("Dataset processing failed: " + e.message + ". Make sure the DecisAI backend is running on http://127.0.0.1:8000.");
    } finally {
      setUploading(false);
    }
  };

  const winStats = datasetInfo?.sector_win_classifier?.stats || null;
  const domains = datasetInfo?.domain_classifier?.labels || [];

  return (
    <div style={{ padding: "1.5rem", maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: T.onSurface, margin: "0 0 0.35rem" }}>Upload Dataset</h1>
        <p style={{ color: T.onSurfaceVariant, fontSize: "0.95rem", margin: 0, maxWidth: "680px", lineHeight: 1.6 }}>
          Upload your company's past data so the system can learn from your previous experience and generate
          more accurate compliance and proposal recommendations. DecisAI turns your bid history and past
          projects into classifiers, stores them as JSON, and uses them for every future RFP, RFQ, and Tender analysis.
        </p>
      </div>

      <Card style={{ padding: "1.5rem" }}>
        <div onClick={() => !uploading && fileRef.current.click()}
          onDrop={e => { e.preventDefault(); if (!uploading) handleFile(e.dataTransfer.files[0]); }} onDragOver={e => e.preventDefault()}
          style={{ border: "2px dashed " + T.outlineVariant, borderRadius: "12px", padding: "1.5rem", textAlign: "center", cursor: "pointer", background: T.surfaceContainerLow }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: `${T.primary}14`, color: T.primary, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.6rem" }}>
            {uploading ? <Loader2 size={22} style={{ animation: "spin 1s linear infinite" }} /> : <Database size={22} />}
          </div>
          <div style={{ fontWeight: 800, color: T.onSurface, marginBottom: "0.3rem", fontSize: "1rem" }}>
            {uploading ? "Processing dataset & generating classifiers..." : "Drop your company dataset here"}
          </div>
          <div style={{ fontSize: "0.8rem", color: T.onSurfaceVariant, marginBottom: "0.85rem" }}>
            XLSX (bid history + capability library), CSV, or JSON exports of your past projects.
          </div>
          {!uploading && <Btn size="md" onClick={e => { e.stopPropagation(); fileRef.current.click(); }}>Choose File</Btn>}
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv,.json" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
        </div>
        {error && <div style={{ background: T.errorContainer, color: T.error, padding: "0.65rem 0.85rem", borderRadius: "8px", fontSize: "0.83rem", marginTop: "0.85rem", fontWeight: 600 }}>{error}</div>}
      </Card>

      {!datasetInfo ? (
        <Card style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
          <Layers size={30} color={T.outline} style={{ marginBottom: "0.6rem" }} />
          <h3 style={{ margin: "0 0 0.4rem", color: T.onSurface, fontWeight: 800 }}>Upload your first dataset</h3>
          <p style={{ color: T.onSurfaceVariant, fontSize: "0.88rem", margin: "0 auto", maxWidth: "440px" }}>
            Once processed, the generated classifiers will appear here — and every new document analysis
            will be matched against <strong>your</strong> company's evidence instead of sample data.
          </p>
        </Card>
      ) : (
        <>
          <Card style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontWeight: 800, color: T.onSurface, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <ShieldCheck size={17} color={T.pass} /> Generated Classifiers
              </h3>
              <span style={{ padding: "0.25rem 0.7rem", borderRadius: "999px", background: T.passBg, color: T.pass, fontSize: "0.7rem", fontWeight: 800 }}>
                Stored as JSON · {datasetInfo.source_file || "company dataset"}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: window.innerWidth < 760 ? "1fr 1fr" : "repeat(4, 1fr)", gap: "0.75rem", marginBottom: "1rem" }}>
              {[["Capability records", datasetInfo.capability_records ?? "—"],
                ["Bid records", datasetInfo.bid_records ?? "—"],
                ["Domains learned", domains.length || "—"],
                ["Evidence index", datasetInfo.evidence_index_rebuilt ? "Rebuilt ✓" : "Default"]].map(([label, value]) => (
                <div key={label} style={{ background: T.surfaceContainerLow, borderRadius: "10px", padding: "0.7rem 0.9rem" }}>
                  <div style={{ fontSize: "0.64rem", fontWeight: 800, color: T.outline, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 900, color: T.onSurface }}>{value}</div>
                </div>
              ))}
            </div>
            {domains.length > 0 && (
              <div style={{ marginBottom: "0.85rem" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 800, color: T.outline, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>Domain classifier labels</div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {domains.map(d => <span key={d} style={{ padding: "0.25rem 0.7rem", borderRadius: "999px", background: T.secondaryContainer, color: T.primary, fontSize: "0.74rem", fontWeight: 800 }}>{d}</span>)}
                </div>
              </div>
            )}
            {(datasetInfo.certifications || []).length > 0 && (
              <div>
                <div style={{ fontSize: "0.68rem", fontWeight: 800, color: T.outline, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>Certifications detected</div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {datasetInfo.certifications.map(c => <span key={c} style={{ padding: "0.25rem 0.7rem", borderRadius: "999px", background: T.passBg, color: T.pass, fontSize: "0.74rem", fontWeight: 800 }}>{c}</span>)}
                </div>
              </div>
            )}
          </Card>

          {winStats && (
            <Card style={{ padding: "1.5rem" }}>
              <h3 style={{ margin: "0 0 1rem", fontWeight: 800, color: T.onSurface, fontSize: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <BarChart3 size={16} color={T.primary} /> Sector Win-Rate Classifier (from your data)
              </h3>
              {Object.entries(winStats).map(([sector, s]) => (
                <div key={sector} style={{ marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.84rem", fontWeight: 700, color: T.onSurface }}>{sector}</span>
                    <span style={{ fontSize: "0.78rem", color: T.onSurfaceVariant }}>{s.won}/{s.total} won · <strong style={{ color: T.primary }}>{s.win_rate}%</strong></span>
                  </div>
                  <div style={{ height: "7px", background: T.surfaceContainerHigh, borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${s.win_rate}%`, background: `linear-gradient(90deg, ${T.primaryContainer}, ${T.primary})`, borderRadius: "4px" }} />
                  </div>
                </div>
              ))}
            </Card>
          )}
        </>
      )}
    </div>
  );
}

/* ============================================================
   ROOT APP
============================================================ */
export default function App() {
  // Single fixed identity — no login/signup. Everything belongs to Team X.
  const user = TEAM_X;
  const [view, setView] = useState("dashboard"); // dashboard | upload | dataset | workspace | windashboard | activity | exports | profile
  const [workspaces, setWorkspaces] = useState(() => loadTeamXDB().workspaces || []);
  const [activeWsId, setActiveWsId] = useState(null);
  const [wsTab, setWsTab] = useState("summary");
  const [mobileOpen, setMobileOpen] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [prefillText, setPrefillText] = useState("");
  const [uploadDocType, setUploadDocType] = useState("RFP");
  const [commandOpen, setCommandOpen] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({ deadlines: true, compliance: true, ai: true });
  const [datasetInfo, setDatasetInfo] = useState(() => loadTeamXDB().datasetInfo || null);

  const [notifications, setNotifications] = useState([
    { id: "n1", title: "Welcome to DecisAI", body: "Upload your first RFP to get an AI-powered compliance check.", time: "Just now", read: false, icon: Sparkles, kind: "info" },
    { id: "n2", title: "Capability library ready", body: `${CAPABILITY_LIBRARY.length} past projects indexed for compliance matching.`, time: "5 min ago", read: false, icon: ShieldCheck, kind: "pass" },
  ]);
  const [activityLog, setActivityLog] = useState(() =>
    (loadTeamXDB().activityLog || [{ id: "a0", title: "Welcome to DecisAI", body: "Your Team X workspace is ready.", time: "Just now", kind: "info" }])
      .map(a => ({ ...a, icon: a.icon || Sparkles })));
  const [exportsList, setExportsList] = useState(() => loadTeamXDB().exportsList || []);

  // Team X local database — keeps uploads, results, drafts, decisions, and
  // export history on this machine (works online and offline).
  useEffect(() => {
    saveTeamXDB({
      workspaces,
      exportsList,
      datasetInfo,
      activityLog: activityLog.slice(0, 100).map(({ icon, ...rest }) => rest),
    });
  }, [workspaces, exportsList, activityLog, datasetInfo]);

  // Keyboard shortcut: Cmd/Ctrl+K opens command palette
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCommandOpen(o => !o); }
      if (e.key === "Escape") setCommandOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pushToast = (message, type = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4500);
  };

  const logActivity = (title, body, icon, kind = "info") => {
    setActivityLog(log => [{ id: uid("LOG"), title, body, time: new Date().toLocaleString(), icon: icon || Sparkles, kind }, ...log]);
  };

  const logExport = (name, content, type, workspace) => {
    setExportsList(list => [{ id: uid("EXP"), name, content, type, workspace, date: new Date().toLocaleString() }, ...list]);
  };

  const pushNotification = (title, body, icon, kind = "info") => {
    setNotifications(ns => [{ id: uid("NOTIF"), title, body, time: "Just now", read: false, icon: icon || Bell, kind }, ...ns]);
  };

  const createWorkspace = (ws) => {
    setWorkspaces(w => [ws, ...w]);
    setActiveWsId(ws.id);
    setWsTab("summary");
    setView("workspace");
    setPrefillText("");
    pushToast("Workspace created — AI analysis complete.", "success");
    if (ws.complianceSummary.fail > 0 && notifPrefs.compliance) {
      pushNotification("Compliance gaps found", `${ws.complianceSummary.fail} mandatory gap(s) in "${ws.meta.title}".`, AlertTriangle, "fail");
    }
    const days = daysUntil(ws.meta.deadline);
    if (days !== null && days <= 14 && days >= 0 && notifPrefs.deadlines) {
      pushNotification("Submission deadline approaching", `"${ws.meta.title}" is due in ${days} day${days !== 1 ? "s" : ""}.`, Clock, "partial");
    }
  };

  const openWorkspace = (id) => { setActiveWsId(id); setWsTab("summary"); setView("workspace"); };
  const openWorkspaceTab = (tabId) => {
    let target = activeWsId;
    if (!target && workspaces.length) target = workspaces[0].id;
    setActiveWsId(target);
    setWsTab(tabId);
    setView("workspace");
  };
  const updateWs = (updater) => {
    setWorkspaces(ws => ws.map(w => w.id === activeWsId ? (typeof updater === "function" ? updater(w) : updater) : w));
  };
  const activeWs = workspaces.find(w => w.id === activeWsId);

  const breadcrumbMap = {
    dashboard: "Workspaces", upload: "New RFP", dataset: "Upload Dataset",
    windashboard: "Win Dashboard", activity: "Activity Logs", exports: "Exports",
    profile: "Settings",
  };
  let breadcrumb = breadcrumbMap[view];
  if (view === "workspace" && activeWs) {
    const tabLabel = WS_TABS.find(t => t.id === wsTab)?.label || "";
    breadcrumb = `${activeWs.meta.title} / ${tabLabel}`;
  }

  return (
    <AppContext.Provider value={{ logActivity, logExport }}>
      <GlobalStyle />
      <Toasts toasts={toasts} />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} workspaces={workspaces} openWorkspace={openWorkspace} setView={setView} pushToast={pushToast} />
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Inter',sans-serif", maxWidth: "100vw", overflowX: "hidden" }}>
        <Sidebar view={view} setView={setView} wsTab={wsTab} workspaces={workspaces} activeWsId={activeWsId} openWorkspace={openWorkspace} openWorkspaceTab={openWorkspaceTab} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} pushToast={pushToast} />
        {/* Content shifts right when the fixed sidebar is open on desktop */}
        <div style={{ minWidth: 0, maxWidth: "100%", overflowX: "hidden", marginLeft: mobileOpen && window.innerWidth >= 960 ? "280px" : 0, transition: "margin-left .2s ease" }}>
          <DecisAITopbar user={user} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} setView={setView} openCommandPalette={() => setCommandOpen(true)} notifications={notifications} setNotifications={setNotifications} workspaces={workspaces} openWorkspace={openWorkspace} breadcrumb={breadcrumb} />
          {view === "dashboard" && <Dashboard workspaces={workspaces} openWorkspace={openWorkspace} setView={setView} user={user} setUploadDocType={setUploadDocType} pushToast={pushToast} />}
          {view === "upload" && <UploadScreen onCreate={createWorkspace} pushToast={pushToast} prefillText={prefillText} docType={uploadDocType} setDocType={setUploadDocType} />}
          {view === "dataset" && <DatasetPage datasetInfo={datasetInfo} setDatasetInfo={setDatasetInfo} pushToast={pushToast} />}
          {view === "workspace" && activeWs && <Workspace ws={activeWs} updateWs={updateWs} pushToast={pushToast} tab={wsTab} setTab={setWsTab} onGoWorkspaces={() => setView("dashboard")} />}
          {view === "workspace" && !activeWs && <Dashboard workspaces={workspaces} openWorkspace={openWorkspace} setView={setView} user={user} setUploadDocType={setUploadDocType} pushToast={pushToast} />}
          {view === "windashboard" && <WinDashboard workspaces={workspaces} />}
          {view === "activity" && <ActivityLogPage activityLog={activityLog} />}
          {view === "exports" && <ExportsPage exportsList={exportsList} pushToast={pushToast} />}
          {view === "profile" && <ProfileScreen user={user} pushToast={pushToast} notifPrefs={notifPrefs} setNotifPrefs={setNotifPrefs} />}
        </div>
      </div>
      <AIAssistant activeWs={activeWs} pushToast={pushToast} />
    </AppContext.Provider>
  );
}

function GlobalStyle() {
  return (
    <style>{`
      ${FONTS}
      * { box-sizing: border-box; }
      html, body, #root { margin: 0; max-width: 100%; overflow-x: hidden; }
      body { margin: 0; }
      table { max-width: 100%; }
      th, td { overflow-wrap: anywhere; word-break: break-word; }
      img, svg { max-width: 100%; }
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes slideIn { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fall { to { transform: translateY(100vh) rotate(360deg); opacity: 0.3; } }
      input:focus, textarea:focus, select:focus { outline: 2px solid ${T.primary}; outline-offset: 1px; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-thumb { background: ${T.outlineVariant}; border-radius: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      details > summary::-webkit-details-marker { display: none; }
    `}</style>
  );
}
