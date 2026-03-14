import type {
  ChatMessage,
  ChatProcessToken,
  ChatProductsToken,
} from "@/app/api/chat";
import { ProductInfo } from "@/app/types/product";
import { create } from "zustand";

export type MessageEx = ChatMessage & {
  processes?: ChatProcessToken[];
  products?: ChatProductsToken["products"];
};

function mergeStreamText(current: string, nextChunk: string): string {
  if (!nextChunk) return current;
  if (nextChunk.startsWith(current)) return nextChunk; // cumulative full text
  if (current.endsWith(nextChunk)) return current; // duplicate chunk
  const max = Math.min(current.length, nextChunk.length);
  for (let m = max; m > 0; m--) {
    if (current.slice(-m) === nextChunk.slice(0, m)) {
      return current + nextChunk.slice(m);
    }
  }
  return current + nextChunk;
}

interface ChatStore {
  sessionId?: string;
  messages: MessageEx[];
  sending: boolean;
  setSessionId: (id?: string) => void;
  setMessages: (m: MessageEx[]) => void;
  reset: () => void;
  setSending: (v: boolean) => void;
  addUserMessage: (content: string) => void;
  ensureAssistantStub: () => void;
  mergeAssistantText: (chunk: string) => void;
  addProcess: (token: ChatProcessToken) => void;
  setProducts: (products: ProductInfo[]) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  sessionId: undefined,
  messages: [],
  sending: false,

  setSessionId: (id) => set({ sessionId: id }),
  setMessages: (m) => set({ messages: m }),
  reset: () => set({ messages: [] }),
  setSending: (v) => set({ sending: v }),

  addUserMessage: (content) =>
    set((state) => ({
      messages: [...state.messages, { role: "user", content }],
    })),

  ensureAssistantStub: () =>
    set((state) => {
      const last = state.messages[state.messages.length - 1];
      if (last && last.role === "assistant") return state;
      return {
        messages: [...state.messages, { role: "assistant", content: "" }],
      };
    }),

  mergeAssistantText: (chunk) =>
    set((state) => {
      const msgs = [...state.messages];
      const last = msgs[msgs.length - 1];
      if (!last || last.role !== "assistant") return state;
      const merged = mergeStreamText(last.content || "", chunk);
      msgs[msgs.length - 1] = { ...last, content: merged };
      return { messages: msgs };
    }),

  addProcess: (token) =>
    set((state) => {
      const msgs = [...state.messages];
      const last = msgs[msgs.length - 1];
      if (!last || last.role !== "assistant") return state;
      msgs[msgs.length - 1] = {
        ...last,
        processes: [...(last.processes || []), token],
      };
      return { messages: msgs };
    }),

  setProducts: (products) =>
    set((state) => {
      const msgs = [...state.messages];
      const last = msgs[msgs.length - 1];
      if (!last || last.role !== "assistant") return state;
      msgs[msgs.length - 1] = {
        ...last,
        products,
      };
      return { messages: msgs };
    }),
}));

export { mergeStreamText };
