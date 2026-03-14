Chat Module — SSE Streaming API

This document describes the chat endpoints exposed by this NestJS service and how to consume the SSE stream from a Next.js app.

Endpoints

- PUT `/chat/session`
  - Purpose: Create a chat session upstream.
  - Response: JSON from upstream (includes a session identifier).

- GET `/chat/:sessionId/history`
  - Purpose: Fetch message history for a session.
  - Response: Array of `{ role, content, timestamp }`.

- GET `/chat/agent/sessions/:sessionId/stream`
  - Purpose: SSE stream (debug/no-body). Prefer using the POST version below.
  - Notes: Emits the same events as the POST version; `message` is empty.

- POST `/chat/agent/sessions/:sessionId/stream`
  - Purpose: SSE stream with request body.
  - Request body: `{ "message": "<user question>" }`
  - Response: Server-Sent Events (Content-Type: `text/event-stream`).

SSE Event Contract

- `start`: `{ sessionId: string }`
- `token`: union of
  - Text token: `{ type: 'text', text: string }`
  - Status: `{ type: 'status', message: string }`
  - Process (tool progress): `{ type: 'process', status: 'start'|'end', tool: string, input?: string, mentions?: string[] }`
  - Products (post-processing): `{ type: 'products', sessionId: string, mentions: {id,name,slug,score?}[], products: any[] }`
- `done`: `{ sessionId: string }` or `{ sessionId: string, error: string }`

Flow & Behavior

- Proxies upstream SSE at `CHAT_API_URL/agent/sessions/:sessionId/stream` using POST and the provided `message`.
- Maps upstream internal events into external events limited to: `start`, `token`, `done`.
- Captures `mention_products` from `tool_end` chunks and, after upstream closes, fetches product details via `/products/:slug` (max 8), then emits a `token` with `type: 'products'` before `done`.
- Process visibility: `tool_start`/`tool_end` are surfaced as `token` with `type: 'process'` for UI progress.

Example: curl

- `curl -N -X POST "http://localhost:4000/chat/agent/sessions/<sessionId>/stream" \
   -H "Content-Type: application/json" \
   -d '{"message":"So sánh 2 sản phẩm Ph balance mois intimate với bio intimate"}'`

Next.js Client (fetch streaming)

Below is a minimal browser-safe parser using `fetch` + ReadableStream to consume the SSE POST endpoint.

```ts
async function streamChat(sessionId: string, message: string, onEvent: (evt: { event: string; data: any }) => void) {
  const res = await fetch(`/chat/agent/sessions/${encodeURIComponent(sessionId)}/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify({ message }),
  });
  if (!res.body) throw new Error('No body');

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let currentEvent: string | null = null;
  let currentData: string[] = [];

  const flush = () => {
    if (!currentEvent && currentData.length === 0) return;
    const event = currentEvent || 'message';
    try { onEvent({ event, data: JSON.parse(currentData.join('\n')) }); } catch {}
    currentEvent = null; currentData = [];
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, idx).replace(/\r$/, '');
      buffer = buffer.slice(idx + 1);
      if (line === '') { flush(); continue; }
      if (line.startsWith('event:')) { currentEvent = line.slice(6).trim(); continue; }
      if (line.startsWith('data:')) { currentData.push(line.slice(5).trim()); continue; }
    }
  }
}

// Usage example
streamChat('your-session-id', 'Câu hỏi của bạn', ({ event, data }) => {
  switch (event) {
    case 'start': /* show session start */ break;
    case 'token': {
      if (data.type === 'text') {/* append text */}
      if (data.type === 'status') {/* show status */}
      if (data.type === 'process') {/* show tool progress */}
      if (data.type === 'products') {/* render mentions and product cards */}
      break;
    }
    case 'done': /* finalize UI */ break;
  }
});
```

APM Notes

- SSE keeps HTTP 200 while emitting in-band errors; those won’t be auto-captured by the APM middleware (which checks status codes).
- The chat service explicitly calls `apm.captureError(...)` for upstream connection/stream errors, with custom context for traceability.
- Ensure env vars for APM are set (e.g., `APM_SERVICE_NAME`, `APM_SERVER_URL`, etc.).

Environment

- `CHAT_API_URL` must point to the upstream chat service.
- CORS: configure `ALLOWED_ORIGINS` or `ALLOW_ALL_ORIGINS` to allow your Next.js origin.

