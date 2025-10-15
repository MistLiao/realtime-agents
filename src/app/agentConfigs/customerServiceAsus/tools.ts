import { tool } from '@openai/agents/realtime';

// Shared Serper-based web lookup tool
export const lookupOnWebTool = tool({
  name: 'lookupOnWeb',
  description:
    'Perform real-time web searches via Serper for up-to-date information not covered in internal docs (availability, pricing, specs, release date, or regional info).',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description:
          'Concise, specific search phrase (include model/series/year/region when relevant).',
      },
      num: {
        type: 'number',
        description:
          'Optional number of results to return (1–10). Default: 5.',
      },
    },
    required: ['query'],
    additionalProperties: false,
  },
  execute: async (input: any) => {
    const { query, num } = input || {};
    try {
      const res = await fetch('/api/websearch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, num }),
      });
      if (!res.ok) return { error: 'lookupOnWeb_failed' };
      return await res.json();
    } catch {
      return { error: 'lookupOnWeb_exception' };
    }
  },
});
