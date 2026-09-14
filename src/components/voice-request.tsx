"use client";
import { useRef, useState } from "react";
import Link from "next/link";

export default function VoiceRequest() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const sending = useRef(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    setError("");
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) || "").trim();
    if (value("website")) { setError("Aanvraag niet verstuurd. Neem contact met ons op via e-mail."); return; }
    if (value("name").length < 2 || value("businessName").length < 2) { setError("Vul je naam en bedrijfsnaam in (minimaal twee tekens)."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email")) || value("phone").replace(/\D/g, "").length < 7) { setError("Controleer je e-mailadres en telefoonnummer."); return; }
    sending.current = true;
    setBusy(true);
    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        name: value("name"), email: value("email"), source: "contact-form", page: window.location.href,
        message: ["Voice-aanvraag", `Gesprekstype: ${value("callType")}`, `Bedrijfsnaam: ${value("businessName")}`, `Branche: ${value("sector")}`, `Telefoon: ${value("phone")}`, `Toelichting: ${value("details")}`].join("\n"),
      }) });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true || typeof result?.id !== "string") {
        setError(result?.error || "Aanvraag niet bevestigd. Probeer opnieuw of mail info@bonanza-labs.com.");
        return;
      }
      setDone(true);
    } catch { setError("Versturen is niet bevestigd. Neem bij twijfel contact op via info@bonanza-labs.com voordat je opnieuw verstuurt."); }
    finally { sending.current = false; setBusy(false); }
  }
  if (done) return <div role="status" className="voice-form"><h3>Voice-aanvraag ontvangen</h3><p>Je aanvraag is opgeslagen. We beoordelen je situatie en nemen contact op over de vervolgstap.</p></div>;
  return <form onSubmit={submit} className="voice-form" aria-label="Voice-aanvraag">
    <fieldset disabled={busy}><legend>Welk gesprekstype wil je opvangen?</legend>{["Terugbelverzoeken buiten werktijd", "Reserverings- en openingstijdenvragen", "Offerte-aanvragen voor nieuw werk"].map(label => <label className="voice-choice" key={label}><input required type="radio" name="callType" value={label} />{label}</label>)}</fieldset>
    <div className="voice-fields">
      <label>Naam<input name="name" autoComplete="name" minLength={2} maxLength={120} required /></label>
      <label>Bedrijfsnaam<input name="businessName" autoComplete="organization" minLength={2} maxLength={200} required /></label>
      <label>E-mail<input type="email" name="email" autoComplete="email" maxLength={254} required /></label>
      <label>Telefoonnummer<input type="tel" name="phone" autoComplete="tel" maxLength={40} required /></label>
      <label>Branche<select name="sector" defaultValue="" required><option value="" disabled>Kies je branche</option>{["Horeca", "Installatie", "Bouw", "Anders"].map(s => <option key={s}>{s}</option>)}</select></label>
    </div>
    <label>Toelichting (optioneel)<textarea name="details" maxLength={2500} rows={3} /></label>
    <div hidden aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <p className="voice-note">We gebruiken je gegevens om op deze aanvraag te reageren. Lees onze <Link href="/privacy">privacyverklaring</Link>. Je sluit met deze aanvraag geen betaald traject af.</p>
    {error && <p role="alert" className="voice-error">{error}</p>}
    <button className="voice-primary" disabled={busy} type="submit">{busy ? "Versturen…" : "Voice-aanvraag doen"}</button>
  </form>;
}
