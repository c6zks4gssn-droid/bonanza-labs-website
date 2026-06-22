'use client';

import { useState } from 'react';
import { FileText, Upload, Zap, Check, Brain, ArrowRight, Loader2, AlertCircle, Copy, Download } from 'lucide-react';

type Step = 'input' | 'analyzing' | 'analysis' | 'generating' | 'result';

interface Analysis {
  summary: string;
  requirements: string[];
  deadlines: string[];
  evaluationCriteria: string[];
  suggestedApproach: string;
  riskPoints: string[];
  competitiveAdvantages: string[];
}

interface VisualResult {
  article_id: number;
  title: string;
  url: string;
  score: number;
  tile_index: number;
  chunk_index: number;
}

export default function TenderAIDemo() {
  const [step, setStep] = useState<Step>('input');
  const [tenderText, setTenderText] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDesc, setCompanyDesc] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [offer, setOffer] = useState<string>('');
  const [error, setError] = useState('');
  const [visualQuery, setVisualQuery] = useState('');
  const [visualResults, setVisualResults] = useState<VisualResult[]>([]);
  const [visualLoading, setVisualLoading] = useState(false);

  async function handleVisualSearch() {
    if (!visualQuery.trim()) return;
    setVisualLoading(true);
    try {
      const res = await fetch('/tenderai/api/visual-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: visualQuery.trim(), n_docs: 5 }),
      });
      const data = await res.json();
      setVisualResults(data.results || []);
    } catch {
      setVisualResults([]);
    }
    setVisualLoading(false);
  }

  async function handleAnalyze() {
    if (!tenderText.trim()) return;
    setStep('analyzing');
    setError('');

    try {
      const res = await fetch('/tenderai/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenderText: tenderText.trim(),
          companyName: companyName.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Analyse mislukt');
      }

      const data: Analysis = await res.json();
      setAnalysis(data);
      setStep('analysis');
    } catch (err: any) {
      setError(err.message);
      setStep('input');
    }
  }

  async function handleGenerate() {
    if (!analysis) return;
    setStep('generating');
    setError('');

    try {
      const res = await fetch('/tenderai/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenderAnalysis: analysis,
          companyName: companyName.trim() || 'Uw Bedrijf',
          companyDescription: companyDesc.trim() || undefined,
          tone: 'professioneel',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Generatie mislukt');
      }

      const data = await res.json();
      setOffer(data.offer);
      setStep('result');
    } catch (err: any) {
      setError(err.message);
      setStep('analysis');
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(offer);
  }

  function handleDownload() {
    const blob = new Blob([offer], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `offerte-${companyName || 'tender'}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setStep('input');
    setAnalysis(null);
    setOffer('');
    setError('');
  }

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#050508]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/tenderai" className="flex items-center gap-2 text-white hover:text-amber-400 transition-colors">
            <Brain className="w-5 h-5 text-amber-400" />
            <span className="font-bold">TenderAI</span>
          </a>
          <button onClick={handleReset} className="text-sm text-white/50 hover:text-white transition-colors">
            ← Opnieuw
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Step: Input */}
        {step === 'input' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Plak je <span className="text-amber-400">aanbesteding</span>
              </h1>
              <p className="text-white/60">TenderAI analyseert de eisen en schrijft een offerte in jouw stijl.</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Bedrijfsnaam</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="Bijv. Bouwbedrijf Jansen"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Korte beschrijving (optioneel)</label>
                  <input
                    type="text"
                    value={companyDesc}
                    onChange={e => setCompanyDesc(e.target.value)}
                    placeholder="Bijv. 20 jaar ervaring in utiliteitsbouw"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Aanbestedingstekst *</label>
                <textarea
                  value={tenderText}
                  onChange={e => setTenderText(e.target.value)}
                  placeholder="Plak hier de volledige aanbesteding, RFQ of tenderbrief..."
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder:text-white/30 focus:outline-none focus:border-amber-500 transition-colors resize-y"
                />
                <p className="text-xs text-white/30 mt-1">{tenderText.length} tekens</p>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!tenderText.trim()}
                className="w-full py-4 rounded-xl bg-amber-500 text-black font-bold text-lg hover:bg-amber-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Brain className="w-5 h-5" />
                Analyseer aanbesteding
              </button>
            </div>
          </div>
        )}

        {/* Step: Analyzing */}
        {step === 'analyzing' && (
          <div className="max-w-xl mx-auto text-center py-20">
            <Loader2 className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3">Aanbesteding analyseren...</h2>
            <p className="text-white/60">TenderAI leest de eisen, deadlines en criteria.</p>
          </div>
        )}

        {/* Step: Analysis */}
        {step === 'analysis' && analysis && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Analyse <span className="text-amber-400">voltooid</span>
              </h1>
              <p className="text-white/60">Hier is wat TenderAI gevonden heeft.</p>
            </div>

            <div className="space-y-6">
              {/* Summary */}
              <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-2">Samenvatting</h3>
                <p className="text-white/80 leading-relaxed">{analysis.summary}</p>
              </div>

              {/* Requirements */}
              {analysis.requirements?.length > 0 && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">Eisen</h3>
                  <ul className="space-y-2">
                    {analysis.requirements.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/70">
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Deadlines */}
              {analysis.deadlines?.length > 0 && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">Deadlines</h3>
                  <ul className="space-y-2">
                    {analysis.deadlines.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/70">
                        <FileText className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Evaluation Criteria */}
              {analysis.evaluationCriteria?.length > 0 && (
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">Beoordelingscriteria</h3>
                  <ul className="space-y-2">
                    {analysis.evaluationCriteria.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/70">
                        <Zap className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risks */}
              {analysis.riskPoints?.length > 0 && (
                <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
                  <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-3">Risico&apos;s</h3>
                  <ul className="space-y-2">
                    {analysis.riskPoints.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/70">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Advantages */}
              {analysis.competitiveAdvantages?.length > 0 && (
                <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/20">
                  <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-3">Concurrentievoordelen</h3>
                  <ul className="space-y-2">
                    {analysis.competitiveAdvantages.map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-white/70">
                        <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={handleGenerate}
                className="w-full py-4 rounded-xl bg-amber-500 text-black font-bold text-lg hover:bg-amber-400 transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Genereer offerte
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step: Generating */}
        {step === 'generating' && (
          <div className="max-w-xl mx-auto text-center py-20">
            <Loader2 className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3">Offerte schrijven...</h2>
            <p className="text-white/60">TenderAI stelt een professionele offerte op in jouw stijl.</p>
          </div>
        )}

        {/* Step: Result */}
        {step === 'result' && offer && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Jouw offerte is <span className="text-amber-400">klaar</span>
              </h1>
              <p className="text-white/60">Bekijk, kopieer of download de gegenereerde offerte.</p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Gegenereerde Offerte</h3>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Kopieer
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-black text-sm font-semibold hover:bg-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
              </div>
              <div className="prose prose-invert prose-amber max-w-none whitespace-pre-wrap text-white/80 leading-relaxed text-sm">
                {offer}
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full mt-6 py-3 rounded-xl border border-white/20 text-white/70 font-semibold hover:border-amber-500/50 transition-colors"
            >
              Nieuwe aanbesteding analyseren
            </button>
          </div>
        )}

        {/* Visual Search Section */}
        {step === 'input' && (
          <div className="max-w-3xl mx-auto mt-12">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-3">
                🔍 Visual Search (PixelRAG)
              </h3>
              <p className="text-white/50 text-sm mb-4">
                Zoek door geïndexeerde websites visueel — geen tekst parsing, maar screenshot-based retrieval.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={visualQuery}
                  onChange={(e) => setVisualQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVisualSearch()}
                  placeholder="bijv. zilveren ringen, aanbesteding, automation..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-amber-500/50 focus:outline-none text-sm"
                />
                <button
                  onClick={handleVisualSearch}
                  disabled={visualLoading || !visualQuery.trim()}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition-colors disabled:opacity-30"
                >
                  {visualLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Zoek'
                  )}
                </button>
              </div>
              {visualResults.length > 0 && (
                <div className="mt-4 space-y-2">
                  {visualResults.map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                      <div>
                        <div className="text-white/80 text-sm font-medium">{r.title}</div>
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-amber-400/60 text-xs hover:text-amber-400">
                          {r.url}
                        </a>
                      </div>
                      <div className="text-right">
                        <div className="text-amber-400 text-sm font-mono">{(r.score * 100).toFixed(1)}%</div>
                        <div className="text-white/30 text-xs">tile {r.tile_index} · chunk {r.chunk_index}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {visualResults.length === 0 && visualQuery && !visualLoading & (
                <div className="mt-4 text-white/40 text-sm">Geen resultaten. Probeer een andere zoekterm.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}