import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit } from '@/lib/rate-limit';

// TenderAI API — Tender analysis and response generation
// Uses OpenRouter (100+ models, one API) with Ollama fallback for local dev

interface TenderAnalysisRequest {
  tenderText: string;
  companyName?: string;
  knowledgeBase?: string[];
}

interface TenderAnalysisResponse {
  summary: string;
  requirements: string[];
  deadlines: string[];
  evaluationCriteria: string[];
  suggestedApproach: string;
  riskPoints: string[];
  competitiveAdvantages: string[];
}

const SYSTEM_PROMPT = `Je bent TenderAI, een Nederlandse aanbestedingsexpert. Analyseer de volgende aanbesteding en geef een gestructureerde analyse in JSON formaat.

Geef je antwoord ALS JSON met de volgende velden:
- summary: korte samenvatting (2-3 zinnen)
- requirements: array van belangrijkste eisen
- deadlines: array van deadlines met datums
- evaluationCriteria: array van beoordelingscriteria
- suggestedApproach: voorgestelde aanpak in 2-3 zinnen
- riskPoints: array van risico's
- competitiveAdvantages: array van mogelijke concurrentievoordelen

Gebruik Nederlands. Wees specifiek en actiegericht.`;

async function callOpenRouter(systemPrompt: string, userPrompt: string): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://bonanza-labs.com',
        'X-Title': 'TenderAI',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      console.error('OpenRouter error:', response.status, await response.text());
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error('OpenRouter fetch error:', err);
    return null;
  }
}

async function callOllama(systemPrompt: string, userPrompt: string): Promise<string | null> {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'gemma4-abliterated:latest';

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        format: 'json',
        stream: false,
        options: { temperature: 0.3, num_predict: 2000 },
      }),
    });

    if (!response.ok) {
      console.error('Ollama error:', response.status);
      return null;
    }

    const data = await response.json();
    return data.message?.content || null;
  } catch (err) {
    console.error('Ollama fetch error:', err);
    return null;
  }
}

function mockAnalysis(tenderText: string, companyName?: string): TenderAnalysisResponse {
  const hasDeadline = /\b(\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}|\d{4}-\d{2}-\d{2})\b/.test(tenderText);
  const wordCount = tenderText.split(/\s+/).length;

  return {
    summary: `${companyName ? `Voor ${companyName}: ` : ''}Aanbesteding van ${wordCount} woorden. Dit lijkt op een middelgrote aanbesteding voor zakelijke dienstverlening. Analyse toont concrete eisen, planning en beoordelingscriteria. Een gestructureerde aanpak wordt aanbevolen.`,
    requirements: [
      'Minimaal 3 jaar aantoonbare ervaring in het vakgebied',
      'KvK-inschrijving en BTW-nummer vereist',
      'Referentieprojecten van vergelijkbare omvang (minimaal 2)',
      'Voldoen aan Europese aanbestedingsrichtlijnen 2014/24/EU',
      'Bewijs van financiële stabiliteit (jaarrekening laatste 2 jaar)',
    ],
    deadlines: [
      hasDeadline ? 'Deadline gedetecteerd in tender — controleer TenderNed of e-Tendering' : 'Geen expliciete deadline gevonden — aanbestedingsdocumenten verder lezen',
      'Verwachte reactietijd: 30-45 dagen na publicatie',
      'Vragenronde: meestal 14 dagen na publicatie',
    ],
    evaluationCriteria: [
      'Prijs (30-40% weging, gebruikelijk)',
      'Kwaliteit plan van aanpak (25-35% weging)',
      'Referentieprojecten en ervaring team (15-20%)',
      'Planning en doorlooptijd (10-15%)',
      'Duurzaamheid en MVO (5-10%, toenemend)',
    ],
    suggestedApproach: `Start met een grondige lezing van het beschrijvend document en de bijlagen. Maak een vraag-aanpak matrix waarin je alle eisen afpunt tegen jouw capaciteiten. Schrijf een plan van aanpak dat specifiek ingaat op de 3 belangrijkste beoordelingscriteria, ondersteund door 2-3 concrete cases.${companyName ? ` Positioneer ${companyName} als specialist met bewezen trackrecord.` : ''}`,
    riskPoints: [
      'Teveel tekst — kans op gemiste details; checklist aanbevolen',
      'Onbekende aanbestedende dienst — check referenties van eerdere gunningen',
      'Strakke deadline zonder vragenronde-buffer',
      'Eisen die ondergrens zijn voor MKB (omzet >€5M of team >20)',
      'Concurrentie van grotere partijen met meer referentiecapaciteit',
    ],
    competitiveAdvantages: [
      'Persoonlijke aanpak en korte lijnen (vs. grote consultancy)',
      'Snelle iteratie en flexibiliteit in uitvoering',
      'Lokale aanwezigheid en kennis van regionale markt',
      'Transparante prijsstructuur zonder verborgen kosten',
      'Bewezen resultaten bij vergelijkbare opdrachtgevers',
    ],
  };
}

export async function POST(req: NextRequest) {
  // Rate limit check
  const rateLimitResponse = applyRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body: TenderAnalysisRequest = await req.json();

    if (!body.tenderText) {
      return NextResponse.json({ error: 'tenderText is required' }, { status: 400 });
    }

    const userPrompt = body.companyName
      ? `Analyseer deze aanbesteding voor ${body.companyName}:\n\n${body.tenderText}`
      : `Analyseer deze aanbesteding:\n\n${body.tenderText}`;

    // Try OpenRouter first (production), then Ollama (local), then mock (always works)
    let content = await callOpenRouter(SYSTEM_PROMPT, userPrompt);

    if (!content) {
      console.log('OpenRouter unavailable, trying Ollama...');
      content = await callOllama(SYSTEM_PROMPT, userPrompt);
    }

    if (!content) {
      console.log('Ollama unavailable, using structured mock analysis');
      const mock = mockAnalysis(body.tenderText, body.companyName);
      return NextResponse.json({
        ...mock,
        _meta: { provider: 'mock', note: 'Configure OPENROUTER_API_KEY for real AI analysis' },
      });
    }

    try {
      const analysis: TenderAnalysisResponse = JSON.parse(content);
      return NextResponse.json({
        ...analysis,
        _meta: { provider: 'openrouter-or-ollama' },
      });
    } catch {
      return NextResponse.json({ error: 'Invalid AI response format', raw: content }, { status: 502 });
    }
  } catch (error) {
    console.error('TenderAI analysis error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
