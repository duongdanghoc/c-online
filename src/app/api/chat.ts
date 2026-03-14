import { BaseError, getErrorFromException } from "@/app/types/base-error";
import { Resp } from "@/app/types/response";
import api from "./api";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string | number;
}

export interface ChatProcessToken {
  type: "process";
  status: "start" | "end";
  tool: string;
  input?: string;
  mentions?: string[];
}

export interface ChatProductsToken {
  type: "products";
  sessionId: string;
  mentions: {
    id: string | number;
    name: string;
    slug: string;
    score?: number;
  }[];
  products: any[];
}

export type ChatTextToken = { type: "text"; text: string };
export type ChatStatusToken = { type: "status"; message: string };
export type ChatToken =
  | ChatTextToken
  | ChatStatusToken
  | ChatProcessToken
  | ChatProductsToken;

export type ChatEvent =
  | { event: "start"; data: { sessionId: string } }
  | { event: "token"; data: ChatToken }
  | { event: "done"; data: { sessionId: string; error?: string } };
const COOKIE_NAME = "chat_session_id";
const API_BASE =
  (typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_BASE_URL as string)
    : process.env.NEXT_PUBLIC_API_BASE_URL) || "";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const v = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(name + "="));
  if (!v) return undefined;
  try {
    return decodeURIComponent(v.split("=")[1]);
  } catch {
    return undefined;
  }
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === "undefined") return;
  const attrs = [
    `${name}=${encodeURIComponent(value)}`,
    `Path=/`,
    `Max-Age=${maxAgeSeconds}`,
    `SameSite=Lax`,
  ];
  if (location.protocol === "https:") attrs.push("Secure");
  document.cookie = attrs.join("; ");
}

export async function ensureSession(): Promise<Resp<{ sessionId: string }>> {
  try {
    const existing = getCookie(COOKIE_NAME);
    if (existing) return { data: { sessionId: existing } };

    const data = await newSession();
    const sessionId = data.data?.sessionId || "";
    setCookie(COOKIE_NAME, sessionId, 60 * 60 * 24 * 30);
    return { data: { sessionId } };
  } catch (e) {
    return { error: getErrorFromException(e) };
  }
}

export async function newSession(): Promise<Resp<{ sessionId: string }>> {
  try {
    // Uses shared axios instance `api` with baseURL from NEXT_PUBLIC_API_BASE_URL
    const data = (await api.put(`chat/session`, {})) as { sessionId?: string };
    const sessionId = (data as any)?.sessionId;
    if (!sessionId) return { error: new BaseError(502, "Missing sessionId") };
    setCookie(COOKIE_NAME, sessionId, 60 * 60 * 24 * 30);
    return { data: { sessionId } };
  } catch (e) {
    return { error: getErrorFromException(e) };
  }
}

export async function getHistory(
  sessionId: string
): Promise<Resp<ChatMessage[]>> {
  try {
    const data = (await api.get(
      `chat/${encodeURIComponent(sessionId)}/history`
    )) as ChatMessage[];
    return { data };
  } catch (e) {
    return { error: getErrorFromException(e) };
  }
}

export async function streamChat(
  sessionId: string,
  message: string,
  onEvent: (evt: ChatEvent) => void,
  opts?: { signal?: AbortSignal }
): Promise<void> {
  const res = await fetch(
    `${API_BASE}/chat/${encodeURIComponent(sessionId)}/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({ message }),
      // CORS streaming
      mode: "cors",
      credentials: "omit",
      signal: opts?.signal,
    }
  );

  if (!res.ok) {
    throw new Error(`Stream error: ${res.status} ${res.statusText}`);
  }
  if (!res.body) throw new Error("No stream body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let currentEvent: string | null = null;
  let currentData: string[] = [];

  const flush = () => {
    if (!currentEvent && currentData.length === 0) return;
    const name = (currentEvent || "message") as ChatEvent["event"] | "message";
    try {
      const data = JSON.parse(currentData.join("\n"));
      if (name === "start" || name === "token" || name === "done") {
        onEvent({ event: name, data } as ChatEvent);
      }
    } catch {
      // ignore malformed JSON line
    }
    currentEvent = null;
    currentData = [];
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, idx).replace(/\r$/, "");
      buffer = buffer.slice(idx + 1);
      if (line === "") {
        flush();
        continue;
      }
      if (line.startsWith("event:")) {
        currentEvent = line.slice(6).trim();
        continue;
      }
      if (line.startsWith("data:")) {
        currentData.push(line.slice(5).trim());
        continue;
      }
    }
  }
}
