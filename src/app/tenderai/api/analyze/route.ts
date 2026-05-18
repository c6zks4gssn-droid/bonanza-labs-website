import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit } from '@/lib/rate-limit';

// TenderAI API — Tender analysis and response generation

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

export async function POST(req: NextRequest) {
  // Rate limit check
  const rateLimitResponse = applyRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body: TenderAnalysisRequest = await req.json();

    if (!body.tenderText) {
      return NextResponse.json({ error: 'tenderText is required' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const systemPrompt = `Je bent TenderAI, een Nederlandse aanbestedingsexpert. Analyseer de volgende aanbesteding en geef een gestructureerde analyse in JSON formaat.

Geef je antwoord ALS JSON met de volgende velden:
- summary: korte samenvatting (2-3 zinnen)
- requirements: array van belangrijkste eisen
- deadlines: array van deadlines met datums
- evaluationCriteria: array van beoordelingscriteria
- suggestedApproach: voorgestelde aanpak in 2-3 zinnen
- riskPoints: array van risico's
- competitiveAdvantages: array van mogelijke concurrentievoordelen

Gebruik Nederlands. Wees specifiek en actiegericht.`;

    const userPrompt = body.companyName
      ? `Analyseer deze aanbesteding voor ${body.companyName}:\n\n${body.tenderText}`
      : `Analyseer deze aanbesteding:\n\n${body.tenderText}`;

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
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
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

    try {
      const analysis: TenderAnalysisResponse = JSON.parse(content);
      return NextResponse.json(analysis);
    } catch {
      return NextResponse.json({ error: 'Invalid AI response format', raw: content }, { status: 502 });
    }
  } catch (error) {
    console.error('TenderAI analysis error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}