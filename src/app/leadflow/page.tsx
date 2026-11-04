import type { Metadata } from "next";
import LeadflowClient from "./LeadflowClient";
import "./leadflow.css";

export const metadata: Metadata = {
  title: "LeadFlow — Leadbeheer voor het MKB",
  description: "Beheer prospects, leadkwalificatie en salesopvolging met BonanzaLabs LeadFlow.",
  robots: { index: false, follow: false },
};

export default function LeadflowPage() {
  return <LeadflowClient />;
}
