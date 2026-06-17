import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit } from '@/lib/rate-limit';

// TenderAI — Generate a tender response/offer document
// Uses OpenRouter with Ollama fallback, mock template as last resort

interface GenerateRequest {
  tenderAnalysis: {
    summary: string;
    requirements: string[];
    evaluationCriteria: string[];
  };
  companyName: string;
  companyDescription?: string;
  tone?: 'professioneel' | 'vlot' | 'formeel';
  maxPrice?: number;
  knowledgeBase?: string[];
}

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
        temperature: 0.5,
        max_tokens: 3000,
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
        stream: false,
        options: { temperature: 0.5, num_predict: 3000 },
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

function mockOffer(body: GenerateRequest): string {
  const { companyName, companyDescription, tenderAnalysis, maxPrice } = body;
  const reqs = tenderAnalysis.requirements?.join('\n- ') || 'Niet opgegeven';
  const criteria = tenderAnalysis.evaluationCriteria?.join('\n- ') || 'Niet opgegeven';

  return `# Offerte — ${companyName}

**Datum:** ${new Date().toLocaleDateString('nl-NL')}
**Referentie:** TenderAI gegenereerd

---

## 1. Introductie

${companyName}${companyDescription ? ` (${companyDescription})` : ''} is een gespecialiseerde partij met bewezen ervaring in het vakgebied. Wij onderscheiden ons door een combinatie van vakinhoudelijke diepgang, transparante communicatie en bewezen resultaten bij vergelijkbare opdrachtgevers.

Wij hebben de aanbesteding zorgvuldig bestudeerd en zien dit als een opdracht die past bij onze expertise en capaciteit. In deze offerte lichten wij toe hoe wij de gevraagde eisen concreet gaan invullen en waarom wij de juiste partner zijn.

## 2. Uitvoering

Op basis van de gestelde eisen voorzien wij de volgende aanpak:

**Kernpunten uit de aanbesteding:**
- ${reqs}

**Onze invulling:**

- **Fase 1 — Analyse & planvorming (week 1-2):** Grondige doorlichting, stakeholder-gesprekken en een gedetailleerd plan van aanpak met SMART-doelstellingen.
- **Fase 2 — Uitvoering (week 3-X):** Iteratieve uitvoering in korte sprints, met wekelijkse voortgangsrapportages en mogelijkheid tot bijsturing.
- **Fase 3 — Oplevering & evaluatie:** Eindrapportage, kennisoverdracht en een formele evaluatie met aanbevelingen voor de toekomst.

Wij werken met een vast kernteam dat aantoonbare ervaring heeft met vergelijkbare opdrachten. Bij knelpunten schalen wij flexibel op of bij.

## 3. Planning

| Fase | Doorlooptijd | Mijlpaal |
|------|-------------|----------|
| 1. Analyse & planvorming | 2 weken | Goedgekeurd plan van aanpak |
| 2. Uitvoering | X weken | Voortgangsrapportages elke 2 weken |
| 3. Oplevering | 1 week | Eindrapport + kennisoverdracht |

Doorlooptijden worden in onderling overleg definitief vastgesteld na gunning.

## 4. Prijsindicatie

${maxPrice ? `Wij hanteren een indicatie van maximaal **€${maxPrice}** voor de gevraagde werkzaamheden. Een gedetailleerde prijsopbouw met uren en tarieven wordt op verzoek aangeleverd.` : `Wij bieden een concurrerende prijs op basis van onze actuele tarieven. Een gedetailleerde prijsopbouw ontvangt u op verzoek.`}

Alle bedragen zijn exclusief BTW. Prijzen gelden voor 12 maanden vanaf offertedatum.

## 5. Waarom ${companyName}

Wij geloven dat ${companyName} de juiste partner is voor deze opdracht vanwege:

- **Bewezen expertise:** Aantoonbare ervaring in het vakgebied, met referentieprojecten van vergelijkbare omvang.
- **Transparante werkwijze:** Geen verborgen kosten, vaste prijsafspraken en heldere communicatie.
- **Korte lijnen:** U werkt direct met de uitvoerende professionals, niet met tussenlagen.
- **Kwaliteitsgarantie:** Wij staan achter ons werk — onze reputatie is ons belangrijkste bezit.

## 6. Afsluiting

Wij danken u voor de mogelijkheid om een offerte uit te brengen. Voor vragen of een toelichting kunt u contact opnemen via onderstaande gegevens. Wij zien uit naar een prettige samenwerking.

Met vriendelijke groet,

**${companyName}**

---

*Deze offerte is gegenereerd door TenderAI (Bonanza Labs) op basis van de aanbestedingsanalyse. De inhoud is een concept — controleer altijd de feiten en pas aan waar nodig.*`;
}

export async function POST(req: NextRequest) {
  // Rate limit check
  const rateLimitResponse = applyRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body: GenerateRequest = await req.json();

    if (!body.tenderAnalysis || !body.companyName) {
      return NextResponse.json({ error: 'tenderAnalysis and companyName are required' }, { status: 400 });
    }

    const tone = body.tone || 'professioneel';

    const systemPrompt = `Je bent TenderAI, een Nederlandse offerte-expert. Genereer een professionele offerte op basis van de aanbestedingsanalyse.

Schrijf de offerte in het Nederlands. Toon: ${tone}.

Structuur de offerte als volgt:
1. Introductie — wie is ${body.companyName} en waarom zij de beste keuze zijn
2. Uitvoering — hoe jullie de eisen invullen, concreet en specifiek
3. Planning — realistische tijdslijn
4. Prijsindicatie — als maxPrice is gegeven, blijf daaronder
5. Waarom ${body.companyName} — differentiators en concurrentievoordelen
6. Afsluiting — call to action

Gebruik heldere, actieve taal. Vermijd vage beloften. Wees concreet.`;

    const userPrompt = `Genereer een offerte voor:

Bedrijf: ${body.companyName}
${body.companyDescription ? `Beschrijving: ${body.companyDescription}` : ''}

Aanbestedingsanalyse:
- Samenvatting: ${body.tenderAnalysis.summary}
- Eisen: ${body.tenderAnalysis.requirements?.join(', ') || 'Niet opgegeven'}
- Beoordelingscriteria: ${body.tenderAnalysis.evaluationCriteria?.join(', ') || 'Niet opgegeven'}
${body.maxPrice ? `Maximumprijs: €${body.maxPrice}` : ''}

${body.knowledgeBase?.length ? `Kennisbank:\n${body.knowledgeBase.map((k, i) => `${i + 1}. ${k}`).join('\n')}` : ''}

Schrijf een overtuigende, concrete offerte.`;

    // Try OpenRouter first, then Ollama, then structured template
    let content = await callOpenRouter(systemPrompt, userPrompt);

    let provider = 'openrouter';
    if (!content) {
      console.log('OpenRouter unavailable, trying Ollama...');
      content = await callOllama(systemPrompt, userPrompt);
      provider = 'ollama';
    }

    if (!content) {
      console.log('Ollama unavailable, using structured template offer');
      content = mockOffer(body);
      provider = 'mock';
    }

    return NextResponse.json({
      offer: content,
      wordCount: content.split(/\s+/).length,
      generatedAt: new Date().toISOString(),
      model: provider,
      companyName: body.companyName,
    });
  } catch (error) {
    console.error('TenderAI generate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
