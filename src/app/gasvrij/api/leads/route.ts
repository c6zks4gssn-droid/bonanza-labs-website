import { NextRequest, NextResponse } from 'next/server';

// GasVrij Lead Capture API — saves leads to Vercel Blob + sends email notification

interface LeadRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  houseType?: string;
  currentHeating?: string;
  interestedIn?: string[];
  message?: string;
}

async function saveLead(lead: any) {
  try {
    const { put } = await import('@vercel/blob');
    const id = lead.id;
    await put(`gasvrij-leads/${id}.json`, JSON.stringify(lead), {
      access: 'public',
      contentType: 'application/json',
    });
    return true;
  } catch (blobError) {
    console.error('Blob save failed, lead stored in email only:', blobError);
    return false;
  }
}

async function getLeads() {
  try {
    const { list } = await import('@vercel/blob');
    const { blobs } = await list({ prefix: 'gasvrij-leads/' });
    const leads = await Promise.all(
      blobs.map(async (blob: any) => {
        const res = await fetch(blob.url);
        return res.json();
      })
    );
    return leads.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: LeadRequest = await req.json();

    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const lead = {
      id: `gv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      data: body,
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    // Save to Vercel Blob for persistence
    await saveLead(lead);

    // Send email notification via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: 'GasVrij <noreply@support.bonanzavitals.com>',
            to: ['clarence@bonanza-labs.com'],
            subject: `🏠 Nieuwe GasVrij lead: ${body.name}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto;">
                <h2 style="color: #059669;">Nieuwe GasVrij lead</h2>
                <table style="border-collapse: collapse; width: 100%;">
                  <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold; width: 140px;">Naam</td><td style="padding: 8px; border: 1px solid #eee;">${body.name}</td></tr>
                  <tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #eee;"><a href="mailto:${body.email}">${body.email}</a></td></tr>
                  ${body.phone ? `<tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Telefoon</td><td style="padding: 8px; border: 1px solid #eee;">${body.phone}</td></tr>` : ''}
                  ${body.address ? `<tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Adres</td><td style="padding: 8px; border: 1px solid #eee;">${body.address}</td></tr>` : ''}
                  ${body.postalCode ? `<tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Postcode</td><td style="padding: 8px; border: 1px solid #eee;">${body.postalCode}</td></tr>` : ''}
                  ${body.houseType ? `<tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Woningtype</td><td style="padding: 8px; border: 1px solid #eee;">${body.houseType}</td></tr>` : ''}
                  ${body.currentHeating ? `<tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Huidige verwarming</td><td style="padding: 8px; border: 1px solid #eee;">${body.currentHeating}</td></tr>` : ''}
                  ${body.interestedIn?.length ? `<tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Interesse in</td><td style="padding: 8px; border: 1px solid #eee;">${body.interestedIn.join(', ')}</td></tr>` : ''}
                  ${body.message ? `<tr><td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Bericht</td><td style="padding: 8px; border: 1px solid #eee;">${body.message}</td></tr>` : ''}
                </table>
                <p style="color: #666; font-size: 12px; margin-top: 20px;">GasVrij Groningen — Lead #${lead.id}</p>
                <p style="color: #999; font-size: 11px;"><a href="https://bonanza-labs.com/gasvrij/dashboard">Bekijk alle leads →</a></p>
              </div>
            `,
          }),
        });
      } catch (emailError) {
        console.error('Failed to send lead notification:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Bedankt! We nemen binnen 24 uur contact met je op.',
      leadId: lead.id,
    });
  } catch (error) {
    console.error('GasVrij lead error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const key = url.searchParams.get('key');
  const adminKey = process.env.ADMIN_TOKEN || 'gasvrij-admin-2026';

  if (key !== adminKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const leads = await getLeads();
  return NextResponse.json({ leads, total: leads.length });
}