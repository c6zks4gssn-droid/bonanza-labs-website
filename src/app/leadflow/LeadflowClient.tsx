"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  Activity, ArrowDownToLine, ArrowRight, Building2, Check, ChevronDown, CircleHelp,
  Clipboard, Edit2, Filter, Globe2, LayoutDashboard, LogOut, Mail, MapPin, Menu, Plus,
  Search, Sparkles, Target, Trash2, Upload, Users, X,
} from "lucide-react";

type Status = "nieuw" | "gekwalificeerd" | "benaderd" | "gesprek" | "klant" | "verloren";
type Product = "TradeFlow" | "ServeFlow" | "Bonanza Voice" | "Nog bepalen";
interface Lead {
  id: string; company: string; contactName: string; email: string; phone: string;
  website: string; city: string; province: string; industry: string; product: Product;
  status: Status; source: string; notes: string; score: number; scoreReasons: string[];
  createdAt: string; updatedAt: string;
}
interface Session { name: string; companyName: string; email: string }
interface DiscoveryResult { placeId: string; company: string; address: string; website: string; phone: string; industry: string; source: string }

const statuses: Status[] = ["nieuw", "gekwalificeerd", "benaderd", "gesprek", "klant", "verloren"];
const products: Product[] = ["TradeFlow", "ServeFlow", "Bonanza Voice", "Nog bepalen"];
const provinces = ["Groningen", "Friesland", "Drenthe", "Overijssel", "Noord-Holland", "Zuid-Holland", "Utrecht", "Gelderland", "Flevoland", "Zeeland", "Noord-Brabant", "Limburg"];
const statusLabels: Record<Status, string> = { nieuw: "Nieuw", gekwalificeerd: "Gekwalificeerd", benaderd: "Benaderd", gesprek: "Gesprek", klant: "Klant", verloren: "Verloren" };

const blankLead = { company: "", contactName: "", email: "", phone: "", website: "", city: "", province: "Groningen", industry: "", product: "Nog bepalen" as Product, status: "nieuw" as Status, notes: "" };

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...(options?.headers || {}) }, cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Er ging iets mis.");
  return payload as T;
}

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"' && quoted && text[i + 1] === '"') { cell += '"'; i++; }
    else if (ch === '"') quoted = !quoted;
    else if ((ch === "," || ch === ";") && !quoted) { row.push(cell.trim()); cell = ""; }
    else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(cell.trim()); if (row.some(Boolean)) rows.push(row); row = []; cell = "";
    } else cell += ch;
  }
  row.push(cell.trim()); if (row.some(Boolean)) rows.push(row);
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, ""));
  const aliases: Record<string, string[]> = {
    company: ["bedrijf", "bedrijfsnaam", "company", "naam"], contactName: ["contactpersoon", "contact", "contactname"],
    email: ["email", "emailadres", "e-mail"], phone: ["telefoon", "telefoonnummer", "phone"],
    website: ["website", "url", "site"], city: ["plaats", "stad", "city"], province: ["provincie", "province"],
    industry: ["branche", "sector", "industry"], product: ["product", "interesse"], notes: ["notities", "opmerkingen", "notes"],
  };
  return rows.slice(1).map((values) => {
    const record: Record<string, string> = {};
    for (const [field, names] of Object.entries(aliases)) {
      const index = headers.findIndex((header) => names.includes(header));
      if (index >= 0) record[field] = values[index] || "";
    }
    return record;
  }).filter((record) => record.company);
}

function downloadCsv(leads: Lead[]) {
  const columns: (keyof Lead)[] = ["company", "contactName", "email", "phone", "website", "city", "province", "industry", "product", "status", "score", "source", "notes", "createdAt"];
  const quote = (value: unknown) => '"' + String(value ?? "").replace(/"/g, '""') + '"';
  const content = [columns.join(";"), ...leads.map((lead) => columns.map((key) => quote(lead[key])).join(";"))].join("\r\n");
  const url = URL.createObjectURL(new Blob(["\ufeff" + content], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = "bonanzalabs-leadflow.csv"; anchor.click(); URL.revokeObjectURL(url);
}

function outreachDraft(lead: Lead) {
  const first = lead.contactName.trim().split(/\s+/)[0] || "goedemiddag";
  const intro = lead.product === "ServeFlow"
    ? "We helpen horecabedrijven om reserveringsaanvragen, bevestigingen en herinneringen in één duidelijke flow af te handelen."
    : lead.product === "TradeFlow"
      ? "We helpen bouw- en installatiebedrijven om aanvragen, offertes en opvolging overzichtelijker te organiseren."
      : lead.product === "Bonanza Voice"
        ? "We richten AI-telefonie in die oproepen opvangt, basisvragen beantwoordt en terugbelverzoeken vastlegt."
        : "We helpen MKB-bedrijven om terugkerend klantcontact en handmatige processen slimmer in te richten.";
  return `Onderwerp: Een praktische procesverbetering voor ${lead.company}\n\nHallo ${first},\n\nIk kwam ${lead.company} tegen en wilde kort kennismaken. ${intro}\n\nWe starten bewust klein: eerst bekijken we samen één proces en bepalen we of automatisering daar zinvol is. Geen grote systeemvervanging of verplicht vervolg.\n\nZou een korte kennismaking van 15 minuten passen?\n\nMet vriendelijke groet,\nBonanzaLabs\ninfo@bonanza-labs.com`;
}

export default function LeadflowClient() {
  const [session, setSession] = useState<Session | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [auth, setAuth] = useState({ name: "", companyName: "", email: "", password: "" });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [section, setSection] = useState<"dashboard" | "leads" | "discover">("dashboard");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("alle");
  const [productFilter, setProductFilter] = useState("alle");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [leadForm, setLeadForm] = useState(blankLead);
  const [saving, setSaving] = useState(false);
  const [discoveryQuery, setDiscoveryQuery] = useState("horeca restaurant");
  const [region, setRegion] = useState("Groningen");
  const [discoveryResults, setDiscoveryResults] = useState<DiscoveryResult[]>([]);
  const [discoverBusy, setDiscoverBusy] = useState(false);
  const [draftLead, setDraftLead] = useState<Lead | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadLeads = useCallback(async () => {
    const data = await api<{ leads: Lead[] }>("/api/leadflow/leads");
    setLeads(data.leads || []);
  }, []);

  useEffect(() => {
    let active = true;
    api<{ authenticated: boolean; session: Session | null }>("/api/leadflow/auth/session")
      .then(async (data) => { if (!active) return; setSession(data.session); if (data.authenticated) await loadLeads(); })
      .catch((e) => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [loadLeads]);

  const filtered = useMemo(() => leads.filter((lead) => {
    const needle = query.toLowerCase();
    const matchesQuery = !needle || [lead.company, lead.contactName, lead.email, lead.city, lead.industry].join(" ").toLowerCase().includes(needle);
    return matchesQuery && (statusFilter === "alle" || lead.status === statusFilter) && (productFilter === "alle" || lead.product === productFilter);
  }), [leads, query, statusFilter, productFilter]);

  const stats = useMemo(() => ({
    total: leads.length,
    qualified: leads.filter((l) => ["gekwalificeerd", "benaderd", "gesprek"].includes(l.status)).length,
    customers: leads.filter((l) => l.status === "klant").length,
    average: leads.length ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length) : 0,
  }), [leads]);

  async function submitAuth(event: FormEvent) {
    event.preventDefault(); setError(""); setAuthBusy(true);
    try {
      const endpoint = authMode === "signup" ? "/api/leadflow/auth/signup" : "/api/leadflow/auth/login";
      const data = await api<{ session: Session }>(endpoint, { method: "POST", body: JSON.stringify(auth) });
      setSession(data.session); await loadLeads(); setNotice("Je LeadFlow-werkruimte is geopend.");
    } catch (e) { setError(e instanceof Error ? e.message : "Inloggen is niet gelukt."); }
    finally { setAuthBusy(false); }
  }

  async function logout() {
    await api("/api/leadflow/auth/logout", { method: "POST" });
    setSession(null); setLeads([]); setAuth({ name: "", companyName: "", email: "", password: "" });
  }

  async function saveLead(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      if (editingLeadId) {
        await api(`/api/leadflow/leads/${editingLeadId}`, { method: "PATCH", body: JSON.stringify(leadForm) });
      } else {
        await api("/api/leadflow/leads", { method: "POST", body: JSON.stringify(leadForm) });
      }
      await loadLeads(); setShowLeadForm(false); setEditingLeadId(null); setLeadForm(blankLead); setNotice(editingLeadId ? "Lead bijgewerkt." : "Lead opgeslagen in jouw werkruimte.");
    } catch (e) { setError(e instanceof Error ? e.message : "Lead opslaan is niet gelukt."); }
    finally { setSaving(false); }
  }

  async function changeStatus(lead: Lead, status: Status) {
    try {
      const data = await api<{ lead: Lead }>(`/api/leadflow/leads/${lead.id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      setLeads((current) => current.map((item) => item.id === lead.id ? data.lead : item));
    } catch (e) { setError(e instanceof Error ? e.message : "Status wijzigen is niet gelukt."); }
  }

  function editLead(lead: Lead) {
    setEditingLeadId(lead.id);
    setLeadForm({ company: lead.company, contactName: lead.contactName, email: lead.email, phone: lead.phone, website: lead.website, city: lead.city, province: lead.province || "Groningen", industry: lead.industry, product: lead.product, status: lead.status, notes: lead.notes });
    setShowLeadForm(true);
  }

  async function deleteLead(lead: Lead) {
    if (!window.confirm(`Weet je zeker dat je ${lead.company} wilt verwijderen?`)) return;
    try { await api(`/api/leadflow/leads/${lead.id}`, { method: "DELETE" }); setLeads((current) => current.filter((item) => item.id !== lead.id)); setNotice("Lead verwijderd."); }
    catch (e) { setError(e instanceof Error ? e.message : "Verwijderen is niet gelukt."); }
  }

  async function importCsv(file?: File) {
    if (!file) return;
    setError(""); setNotice("");
    try {
      const rows = parseCsv(await file.text());
      if (!rows.length) throw new Error("Geen leads gevonden. Gebruik een kolom 'Bedrijf' of 'Bedrijfsnaam'.");
      let imported = 0;
      for (let i = 0; i < rows.length; i += 100) {
        const batch = rows.slice(i, i + 100);
        const data = await api<{ created: number }>("/api/leadflow/leads", { method: "POST", body: JSON.stringify({ leads: batch }) });
        imported += data.created;
      }
      await loadLeads(); setNotice(`${imported} leads geïmporteerd.`);
    } catch (e) { setError(e instanceof Error ? e.message : "CSV import is niet gelukt."); }
    finally { if (fileRef.current) fileRef.current.value = ""; }
  }

  async function discover() {
    setDiscoverBusy(true); setError(""); setDiscoveryResults([]);
    try {
      const data = await api<{ results: DiscoveryResult[] }>("/api/leadflow/discover", { method: "POST", body: JSON.stringify({ query: discoveryQuery, region }) });
      setDiscoveryResults(data.results || []);
      if (!data.results?.length) setNotice("Geen bedrijven gevonden voor deze zoekopdracht.");
    } catch (e) { setError(e instanceof Error ? e.message : "Zoeken is niet gelukt."); }
    finally { setDiscoverBusy(false); }
  }

  async function addDiscoveryResult(item: DiscoveryResult) {
    try {
      const addressParts = item.address.split(",").map((part) => part.trim());
      await api("/api/leadflow/leads", { method: "POST", body: JSON.stringify({ company: item.company, website: item.website, phone: item.phone, city: addressParts.at(-2) || "", province: region, industry: item.industry, source: item.source, product: "Nog bepalen" }) });
      await loadLeads(); setNotice(`${item.company} toegevoegd aan je leads.`);
    } catch (e) { setError(e instanceof Error ? e.message : "Bedrijf toevoegen is niet gelukt."); }
  }

  if (loading) return <div className="lf-loading"><div className="lf-spinner"/><span>LeadFlow wordt geladen…</span></div>;

  if (!session) return (
    <main className="lf-auth-shell">
      <div className="lf-auth-brand"><a href="/" className="lf-wordmark"><span className="lf-mark">B</span>BonanzaLabs</a><span className="lf-product-tag">LeadFlow</span></div>
      <div className="lf-auth-layout">
        <section className="lf-auth-intro">
          <p className="lf-eyebrow">LEAD MANAGEMENT VOOR HET MKB</p>
          <h1>Van eerste contact naar <em>nieuwe klant.</em></h1>
          <p>Houd je prospects, opvolging en commerciële kansen overzichtelijk bij. Eén werkruimte voor je salesproces.</p>
          <div className="lf-auth-points"><span><Check size={17}/> Eigen beveiligde werkruimte</span><span><Check size={17}/> Leads en salespipeline op één plek</span><span><Check size={17}/> CSV-import en export</span></div>
        </section>
        <form className="lf-auth-card" onSubmit={submitAuth}>
          <div className="lf-auth-tabs"><button type="button" className={authMode === "signup" ? "active" : ""} onClick={() => { setAuthMode("signup"); setError(""); }}>Account aanmaken</button><button type="button" className={authMode === "login" ? "active" : ""} onClick={() => { setAuthMode("login"); setError(""); }}>Inloggen</button></div>
          <div><h2>{authMode === "signup" ? "Start met LeadFlow" : "Welkom terug"}</h2><p>{authMode === "signup" ? "Maak je eigen bedrijfswerkruimte aan." : "Log in op je bestaande werkruimte."}</p></div>
          {authMode === "signup" && <><label>Jouw naam<input required minLength={2} autoComplete="name" value={auth.name} onChange={(e) => setAuth({ ...auth, name: e.target.value })} placeholder="Voor- en achternaam"/></label><label>Bedrijfsnaam<input required minLength={2} value={auth.companyName} onChange={(e) => setAuth({ ...auth, companyName: e.target.value })} placeholder="Bedrijfsnaam"/></label></>}
          <label>E-mailadres<input type="email" required autoComplete="email" value={auth.email} onChange={(e) => setAuth({ ...auth, email: e.target.value })} placeholder="jij@bedrijf.nl"/></label>
          <label>Wachtwoord<input type="password" required minLength={authMode === "signup" ? 12 : 1} autoComplete={authMode === "signup" ? "new-password" : "current-password"} value={auth.password} onChange={(e) => setAuth({ ...auth, password: e.target.value })} placeholder={authMode === "signup" ? "Minimaal 12 tekens" : "Je wachtwoord"}/></label>
          {error && <p className="lf-alert error">{error}</p>}
          <button className="lf-primary lf-full" disabled={authBusy}>{authBusy ? "Even geduld…" : authMode === "signup" ? "Werkruimte aanmaken" : "Inloggen"} <ArrowRight size={17}/></button>
          <small>Door een account aan te maken ga je akkoord met de privacyvoorwaarden van BonanzaLabs. Je gegevens zijn alleen zichtbaar binnen jouw werkruimte.</small>
        </form>
      </div>
      <footer className="lf-auth-footer">© {new Date().getFullYear()} BonanzaLabs · <a href="/privacy">Privacy</a> · <a href="/">Terug naar de website</a></footer>
    </main>
  );

  return (
    <main className="lf-app">
      <aside className="lf-sidebar">
        <a href="/" className="lf-wordmark"><span className="lf-mark">B</span>BonanzaLabs</a>
        <div className="lf-sidebar-product">LEADFLOW <span>SALES WORKSPACE</span></div>
        <div className="lf-workspace"><span className="lf-workspace-icon"><Building2 size={17}/></span><span><strong>{session.companyName}</strong><small>Jouw werkruimte</small></span><ChevronDown size={15}/></div>
        <nav className="lf-nav">
          <p>WERKRUIMTE</p>
          <button className={section === "dashboard" ? "active" : ""} onClick={() => setSection("dashboard")}><LayoutDashboard size={18}/> Overzicht</button>
          <button className={section === "leads" ? "active" : ""} onClick={() => setSection("leads")}><Users size={18}/> Leads <span className="lf-nav-count">{leads.length}</span></button>
          <button className={section === "discover" ? "active" : ""} onClick={() => setSection("discover")}><Target size={18}/> Bedrijven zoeken</button>
          <p>BEHEER</p>
          <a href="/privacy"><CircleHelp size={18}/> Privacy & hulp</a>
        </nav>
        <div className="lf-sidebar-bottom"><div className="lf-profile"><span className="lf-avatar">{session.name.slice(0,1).toUpperCase()}</span><span><strong>{session.name}</strong><small>{session.email}</small></span></div><button className="lf-logout" onClick={logout}><LogOut size={17}/> Uitloggen</button></div>
      </aside>
      <section className="lf-main">
        <header className="lf-topbar"><div className="lf-breadcrumb">BonanzaLabs <span>/</span> LeadFlow <span>/</span> {section === "dashboard" ? "Overzicht" : section === "leads" ? "Leads" : "Bedrijven zoeken"}</div><div className="lf-top-actions"><span className="lf-live-dot"/> Werkruimte actief <button onClick={() => setShowLeadForm(true)} className="lf-primary lf-small"><Plus size={16}/> Nieuwe lead</button></div></header>
        <nav className="lf-mobile-nav" aria-label="LeadFlow navigatie"><button className={section === "dashboard" ? "active" : ""} onClick={() => setSection("dashboard")}><LayoutDashboard size={15}/> Overzicht</button><button className={section === "leads" ? "active" : ""} onClick={() => setSection("leads")}><Users size={15}/> Leads</button><button className={section === "discover" ? "active" : ""} onClick={() => setSection("discover")}><Target size={15}/> Zoeken</button></nav>
        <div className="lf-content">
          {error && <div className="lf-alert error"><span>{error}</span><button onClick={() => setError("")}><X size={16}/></button></div>}
          {notice && <div className="lf-alert success"><Check size={16}/><span>{notice}</span><button onClick={() => setNotice("")}><X size={16}/></button></div>}
          {section === "dashboard" && <>
            <div className="lf-page-heading"><div><p className="lf-eyebrow">JOUW SALESOVERZICHT</p><h1>Goedemorgen, {session.name.split(" ")[0]}.</h1><p>Dit is de stand van zaken binnen {session.companyName}.</p></div><button className="lf-outline" onClick={() => downloadCsv(leads)}><ArrowDownToLine size={16}/> Exporteer leads</button></div>
            <div className="lf-stat-grid">
              <article><span className="lf-stat-icon blue"><Users size={19}/></span><small>Totaal leads</small><strong>{stats.total}</strong><em>In jouw werkruimte</em></article>
              <article><span className="lf-stat-icon green"><Target size={19}/></span><small>Actieve kansen</small><strong>{stats.qualified}</strong><em>Gekwalificeerd t/m gesprek</em></article>
              <article><span className="lf-stat-icon amber"><Check size={19}/></span><small>Nieuwe klanten</small><strong>{stats.customers}</strong><em>Gemarkeerd als klant</em></article>
              <article><span className="lf-stat-icon violet"><Activity size={19}/></span><small>Gemiddelde leadscore</small><strong>{stats.average}<small className="lf-outof">/100</small></strong><em>Op basis van fit en data</em></article>
            </div>
            <div className="lf-section-title"><div><h2>Recente leads</h2><p>De laatst toegevoegde bedrijven en contactpersonen.</p></div><button className="lf-text-button" onClick={() => setSection("leads")}>Alle leads bekijken <ArrowRight size={15}/></button></div>
            <LeadTable leads={leads.slice(0, 6)} onStatus={changeStatus} onDelete={deleteLead} onDraft={setDraftLead} onEdit={editLead}/>
            <div className="lf-bottom-grid"><article className="lf-tip-card"><span className="lf-tip-icon"><Sparkles size={19}/></span><div><h3>Maak opvolging concreet</h3><p>Geef elke gekwalificeerde lead een volgende stap. Zo blijven kansen niet liggen.</p></div><button onClick={() => setSection("leads")}>Bekijk pipeline <ArrowRight size={15}/></button></article><article className="lf-source-card"><h3>Leads toevoegen</h3><p>Voeg bedrijven handmatig toe of importeer een bestaande lijst.</p><div><button onClick={() => setShowLeadForm(true)}><Plus size={15}/> Handmatig</button><button onClick={() => fileRef.current?.click()}><Upload size={15}/> CSV import</button></div></article></div>
          </>}
          {section === "leads" && <>
            <div className="lf-page-heading"><div><p className="lf-eyebrow">RELATIES & OPVOLGING</p><h1>Jouw leads</h1><p>Beheer contactgegevens, productinteresse en de volgende stap.</p></div><div className="lf-heading-actions"><button className="lf-outline" onClick={() => fileRef.current?.click()}><Upload size={16}/> Importeren</button><button className="lf-primary" onClick={() => setShowLeadForm(true)}><Plus size={16}/> Nieuwe lead</button></div></div>
            <div className="lf-toolbar"><div className="lf-search"><Search size={17}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zoek bedrijf, contact of branche…"/></div><label className="lf-select-wrap"><Filter size={15}/><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="alle">Alle statussen</option>{statuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}</select></label><label className="lf-select-wrap"><select value={productFilter} onChange={(e) => setProductFilter(e.target.value)}><option value="alle">Alle producten</option>{products.map((p) => <option key={p}>{p}</option>)}</select></label><span className="lf-result-count">{filtered.length} resultaten</span></div>
            <LeadTable leads={filtered} onStatus={changeStatus} onDelete={deleteLead} onDraft={setDraftLead}/>
          </>}
          {section === "discover" && <>
            <div className="lf-page-heading"><div><p className="lf-eyebrow">NIEUWE BEDRIJVEN VINDEN</p><h1>Bedrijven zoeken</h1><p>Zoek lokale bedrijven en voeg relevante organisaties toe aan je pipeline.</p></div></div>
            <div className="lf-discover-panel"><div className="lf-discover-form"><label>Branche of zoekterm<input value={discoveryQuery} onChange={(e) => setDiscoveryQuery(e.target.value)} placeholder="Bijv. installatiebedrijven"/></label><label>Regio<select value={region} onChange={(e) => setRegion(e.target.value)}>{provinces.map((p) => <option key={p}>{p}</option>)}</select></label><button className="lf-primary" onClick={discover} disabled={discoverBusy}><Search size={16}/>{discoverBusy ? "Zoeken…" : "Zoek bedrijven"}</button></div><p className="lf-source-note"><Globe2 size={15}/> Bedrijfsresultaten worden opgehaald via Google Places wanneer de API-koppeling is geactiveerd. Controleer gegevens voordat je contact opneemt.</p></div>
            {discoveryResults.length > 0 && <div className="lf-discovery-results"><div className="lf-section-title"><div><h2>Zoekresultaten</h2><p>{discoveryResults.length} bedrijven gevonden in {region}.</p></div></div>{discoveryResults.map((item) => <article key={item.placeId} className="lf-result-card"><span className="lf-result-icon"><Building2 size={19}/></span><div><h3>{item.company}</h3><p><MapPin size={13}/>{item.address || region}</p><div className="lf-result-meta">{item.industry}{item.phone && <span> · {item.phone}</span>}</div>{item.website && <a href={item.website} target="_blank" rel="noreferrer">{item.website}</a>}</div><button className="lf-outline" onClick={() => addDiscoveryResult(item)}><Plus size={15}/> Toevoegen</button></article>)}</div>}
          </>}
          <footer className="lf-app-footer">BonanzaLabs LeadFlow <span>·</span> Jouw gegevens blijven gescheiden van andere werkruimtes. <a href="/privacy">Privacy</a></footer>
        </div>
      </section>
      <input ref={fileRef} type="file" accept=".csv,text/csv" hidden onChange={(e) => importCsv(e.target.files?.[0])}/>
      {showLeadForm && <div className="lf-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowLeadForm(false); }}><form className="lf-modal" onSubmit={saveLead}><div className="lf-modal-heading"><div><p className="lf-eyebrow">{editingLeadId ? "LEAD BEWERKEN" : "NIEUWE RELATIE"}</p><h2>{editingLeadId ? "Lead aanpassen" : "Lead toevoegen"}</h2><p>Vul de belangrijkste bedrijfsgegevens in.</p></div><button type="button" className="lf-icon-button" onClick={() => setShowLeadForm(false); setEditingLeadId(null); setLeadForm(blankLead);}><X size={19}/></button></div><div className="lf-form-grid"><label className="wide">Bedrijfsnaam *<input required minLength={2} value={leadForm.company} onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })} placeholder="Bedrijfsnaam"/></label><label>Contactpersoon<input value={leadForm.contactName} onChange={(e) => setLeadForm({ ...leadForm, contactName: e.target.value })} placeholder="Naam contactpersoon"/></label><label>E-mailadres<input type="email" value={leadForm.email} onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })} placeholder="naam@bedrijf.nl"/></label><label>Telefoon<input value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} placeholder="+31…"/></label><label>Website<input type="url" value={leadForm.website} onChange={(e) => setLeadForm({ ...leadForm, website: e.target.value })} placeholder="https://"/></label><label>Branche<input value={leadForm.industry} onChange={(e) => setLeadForm({ ...leadForm, industry: e.target.value })} placeholder="Bijv. installatie"/></label><label>Plaats<input value={leadForm.city} onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })} placeholder="Groningen"/></label><label>Provincie<select value={leadForm.province} onChange={(e) => setLeadForm({ ...leadForm, province: e.target.value })}>{provinces.map((p) => <option key={p}>{p}</option>)}</select></label><label>Productinteresse<select value={leadForm.product} onChange={(e) => setLeadForm({ ...leadForm, product: e.target.value as Product })}>{products.map((p) => <option key={p}>{p}</option>)}</select></label><label className="wide">Notities<textarea rows={3} value={leadForm.notes} onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })} placeholder="Aanleiding, behoefte of volgende stap…"/></label></div><div className="lf-modal-actions"><button type="button" className="lf-outline" onClick={() => { setShowLeadForm(false); setEditingLeadId(null); setLeadForm(blankLead); }}>Annuleren</button><button className="lf-primary" disabled={saving}>{saving ? "Opslaan…" : editingLeadId ? "Wijzigingen opslaan" : "Lead opslaan"} <ArrowRight size={16}/></button></div></form></div>}
      {draftLead && <div className="lf-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setDraftLead(null); }}><section className="lf-modal lf-draft-modal"><div className="lf-modal-heading"><div><p className="lf-eyebrow">CONCEPTBERICHT</p><h2>Persoonlijke eerste benadering</h2><p>Controleer en pas dit bericht aan voordat je het verstuurt.</p></div><button className="lf-icon-button" onClick={() => setDraftLead(null)}><X size={19}/></button></div><textarea className="lf-draft-text" rows={15} readOnly value={outreachDraft(draftLead)}/><div className="lf-modal-actions"><button className="lf-outline" onClick={() => setDraftLead(null)}>Sluiten</button><button className="lf-primary" onClick={() => { void navigator.clipboard.writeText(outreachDraft(draftLead)); setNotice("Conceptbericht gekopieerd."); setDraftLead(null); }}><Clipboard size={16}/> Kopieer bericht</button></div></section></div>}
    </main>
  );
}

function LeadTable({ leads, onStatus, onDelete, onDraft, onEdit }: { leads: Lead[]; onStatus: (lead: Lead, status: Status) => void; onDelete: (lead: Lead) => void; onDraft: (lead: Lead) => void; onEdit: (lead: Lead) => void }) {
  if (!leads.length) return <div className="lf-empty"><span><Users size={23}/></span><h3>Nog geen leads in dit overzicht</h3><p>Voeg een bedrijf toe of importeer je bestaande contacten via CSV.</p></div>;
  return <div className="lf-table-wrap"><table className="lf-table"><thead><tr><th>Bedrijf</th><th>Product</th><th>Leadscore</th><th>Status</th><th>Contact</th><th></th></tr></thead><tbody>{leads.map((lead) => <tr key={lead.id}><td><div className="lf-company-cell"><span className="lf-company-avatar">{lead.company.slice(0,1).toUpperCase()}</span><span><strong>{lead.company}</strong><small>{[lead.industry, lead.city].filter(Boolean).join(" · ") || "Branche niet ingevuld"}</small></span></div></td><td><span className="lf-product-pill">{lead.product}</span></td><td><div className="lf-score-cell"><strong title={lead.scoreReasons.join(" · ") || "Basisscore; vul branche en contactgegevens aan"}>{lead.score}</strong><span title={lead.scoreReasons.join(" · ")}><i style={{ width: lead.score + "%" }}/></span></div></td><td><select className={"lf-status-select status-" + lead.status} value={lead.status} onChange={(e) => onStatus(lead, e.target.value as Status)}>{statuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}</select></td><td><div className="lf-contact-cell">{lead.email && <a href={"mailto:" + lead.email}><Mail size={13}/>{lead.email}</a>}{lead.phone && <span>{lead.phone}</span>}{!lead.email && !lead.phone && <span>Geen contactgegevens</span>}</div></td><td><div className="lf-row-actions"><button title="Lead bewerken" onClick={() => onEdit(lead)}><Edit2 size={16}/></button><button title="Maak conceptbericht" onClick={() => onDraft(lead)}><Sparkles size={16}/></button><button title="Verwijder lead" onClick={() => onDelete(lead)}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div>;
}
