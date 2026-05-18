import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit } from '@/lib/rate-limit';

// TenderAI — Generate a tender response/offer document

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

export async function POST(req: NextRequest) {
  // Rate limit check
  const rateLimitResponse = applyRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body: GenerateRequest = await req.json();

    if (!body.tenderAnalysis && !body.companyName) {
      return NextResponse.json({ error: 'tenderAnalysis and companyName are required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.5,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      return NextResponse.json({ error: 'AI service error' }, { status: 502 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 502 });
    }

    return NextResponse.json({
      offer: content,
      wordCount: content.split(/\s+/).length,
      generatedAt: new Date().toISOString(),
      model: 'gpt-4o-mini',
      companyName: body.companyName,
    });
  } catch (error) {
    console.error('TenderAI generate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}