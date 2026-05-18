'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, Home, MapPin, Thermometer, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Lead {
  id: string;
  data: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    postalCode?: string;
    houseType?: string;
    currentHeating?: string;
    interestedIn?: string[];
    message?: string;
  };
  createdAt: string;
  status: string;
}

export default function GasVrijDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function fetchLeads() {
    try {
      const res = await fetch('/gasvrij/api/leads?key=gasvrij-admin-2026');
      if (!res.ok) throw new Error('Failed to fetch leads');
      const data = await res.json();
      setLeads(data.leads || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchLeads(); }, []);

  const statusIcon = (status: string) => {
    switch (status) {
      case 'contacted': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'qualified': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      default: return <Clock className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#050508]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/gasvrij" className="text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <h1 className="text-xl font-bold">GasVrij Dashboard</h1>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              {leads.length} leads
            </span>
          </div>
          <button
            onClick={fetchLeads}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/60">Leads laden...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
            <XCircle className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-red-300">{error}</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20">
            <Home className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Nog geen leads</h2>
            <p className="text-white/60">Leads verschijnen hier zodra mensen het formulier invullen.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead, i) => (
              <div key={lead.id || i} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {statusIcon(lead.status)}
                    <div>
                      <h3 className="font-semibold text-lg">{lead.data.name}</h3>
                      <p className="text-white/40 text-sm">{new Date(lead.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                    {lead.status === 'new' ? 'Nieuw' : lead.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {lead.data.email && (
                    <div className="flex items-center gap-2 text-white/70">
                      <Mail className="w-4 h-4 text-emerald-400" />
                      <a href={`mailto:${lead.data.email}`} className="hover:text-white transition-colors">{lead.data.email}</a>
                    </div>
                  )}
                  {lead.data.phone && (
                    <div className="flex items-center gap-2 text-white/70">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>{lead.data.phone}</span>
                    </div>
                  )}
                  {lead.data.address && (
                    <div className="flex items-center gap-2 text-white/70">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span>{lead.data.address} {lead.data.postalCode ? `(${lead.data.postalCode})` : ''}</span>
                    </div>
                  )}
                  {lead.data.houseType && (
                    <div className="flex items-center gap-2 text-white/70">
                      <Home className="w-4 h-4 text-emerald-400" />
                      <span>{lead.data.houseType}</span>
                    </div>
                  )}
                  {lead.data.currentHeating && (
                    <div className="flex items-center gap-2 text-white/70">
                      <Thermometer className="w-4 h-4 text-emerald-400" />
                      <span>{lead.data.currentHeating}</span>
                    </div>
                  )}
                </div>

                {lead.data.interestedIn?.length && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {lead.data.interestedIn.map((item, j) => (
                      <span key={j} className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {lead.data.message && (
                  <div className="mt-3 p-3 rounded-lg bg-white/5 text-white/60 text-sm">
                    &ldquo;{lead.data.message}&rdquo;
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {leads.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-2xl font-bold text-emerald-400">{leads.length}</p>
              <p className="text-xs text-white/40 mt-1">Totaal leads</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-2xl font-bold text-amber-400">{leads.filter(l => l.status === 'new').length}</p>
              <p className="text-xs text-white/40 mt-1">Nieuw</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-2xl font-bold text-blue-400">{leads.filter(l => l.data.phone).length}</p>
              <p className="text-xs text-white/40 mt-1">Met telefoon</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-2xl font-bold text-white">{leads.filter(l => l.data.postalCode).length}</p>
              <p className="text-xs text-white/40 mt-1">Met postcode</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}