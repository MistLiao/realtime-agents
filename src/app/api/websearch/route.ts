import { NextRequest, NextResponse } from 'next/server';

// Proxy to serper.dev to keep SERPER_API_KEY secret
export async function POST(req: NextRequest) {
  try {
    const { query, num = 5 } = await req.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const payload = {
      q: query,
      gl: "tw",
      num: Math.max(1, Math.min(10, Number(num) || 5)) 
    };

    const resp = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: 'serper_error', details: text }, { status: 500 });
    }

    const data = await resp.json();

    // Normalize minimal fields for the supervisor to cite
    const results = Array.isArray(data?.organic)
      ? data.organic.map((r: any) => ({
          title: r.title,
          url: r.link,
          snippet: r.snippet ?? '',
          position: r.position,
        }))
      : [];

    return NextResponse.json({ query, count: results.length, results });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


