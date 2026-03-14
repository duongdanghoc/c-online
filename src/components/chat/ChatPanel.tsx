"use client";

import {
  ChatEvent,
  ChatProcessToken,
  ChatProductsToken,
  ensureSession,
  getHistory,
  newSession,
  streamChat,
} from "@/app/api/chat";
import { Button } from "@/components/ui/button";
import { useChatStore, type MessageEx } from "@/store/chat";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import ChatMessageItem from "./ChatMessageItem";

// Messages and merging logic are managed in Zustand store

interface Props {
  onClose?: () => void;
  desktopMode: "short" | "full";
  onDesktopModeChange: (mode: "short" | "full") => void;
}

export default function ChatPanel({
  onClose,
  desktopMode,
  onDesktopModeChange,
}: Props) {
  const queryClient = useQueryClient();
  const sessionId = useChatStore((s) => s.sessionId);
  const setSessionId = useChatStore((s) => s.setSessionId);
  const sending = useChatStore((s) => s.sending);
  const setSending = useChatStore((s) => s.setSending);
  const messages = useChatStore((s) => s.messages);
  const setMessages = useChatStore((s) => s.setMessages);
  const reset = useChatStore((s) => s.reset);
  const addUserMessage = useChatStore((s) => s.addUserMessage);
  const ensureAssistantStub = useChatStore((s) => s.ensureAssistantStub);
  const mergeAssistantText = useChatStore((s) => s.mergeAssistantText);
  const addProcess = useChatStore((s) => s.addProcess);
  const setProducts = useChatStore((s) => s.setProducts);
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const initialMessages: MessageEx[] = [
    {
      role: "assistant",
      content:
        "Xin chào Anh/Chị! Em là trợ lý AI của CPC1HN. Em có thể giúp gì cho Anh/Chị ạ?",
    },
  ];

  // Session query (client-side)
  const sessionQ = useQuery({
    queryKey: ["chat", "session"],
    queryFn: async () => {
      const r = await ensureSession();
      console.log("ensureSession", r);

      if (r.error || !r.data) throw r.error || new Error("ensureSession error");
      return r.data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // Sync local sessionId when query resolves
  useEffect(() => {
    const sid = sessionQ.data?.sessionId;

    if (sid) setSessionId(sid);
  }, [sessionQ.data?.sessionId, setSessionId]);

  // History query depends on sessionId
  const historyQ = useQuery({
    queryKey: ["chat", "history", sessionId],
    enabled: !!sessionId,
    queryFn: async () => {
      const r = await getHistory(sessionId!);
      if (r.error || !r.data) throw r.error || new Error("history error");
      return r.data as MessageEx[];
    },
  });

  // Initialize messages from history (first load / when session changes)
  useEffect(() => {
    if (historyQ.data && messages.length === 0) {
      setMessages(historyQ.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyQ.data, sessionId]);

  useEffect(() => {
    // Auto scroll to bottom on new messages
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, sending]);

  const newSessionMut = useMutation({
    mutationKey: ["chat", "new-session"],
    mutationFn: async () => {
      const r = await newSession();
      if (r.error || !r.data) throw r.error || new Error("newSession error");
      return r.data; // { sessionId }
    },
    onSuccess: ({ sessionId }) => {
      // Update session query cache and reset history/messages
      queryClient.setQueryData(["chat", "session"], { sessionId });
      setSessionId(sessionId);
      reset();
      queryClient.removeQueries({
        queryKey: ["chat", "history"],
        exact: false,
      });
    },
  });

  async function handleNewSession() {
    if (sending) abortRef.current?.abort();
    setSending(false);
    newSessionMut.mutate();
  }

  async function handleSend(question: string) {
    if (!sessionId || !question.trim()) return;
    addUserMessage(question);
    ensureAssistantStub();

    const controller = new AbortController();
    abortRef.current = controller;
    setSending(true);
    try {
      await streamChat(
        sessionId,
        question,
        ({ event, data }: ChatEvent) => {
          if (event !== "token") return;
          const kind = (data as any)?.type;
          if (kind === "text") {
            mergeAssistantText((data as any).text || "");
          } else if (kind === "process") {
            addProcess(data as ChatProcessToken);
          } else if (kind === "products") {
            console.log("products", data);

            setProducts((data as ChatProductsToken).products);
          }
        },
        { signal: controller.signal }
      );
    } catch {
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  }

  return (
    <div className="flex h-full w-full flex-col">
      <div className="border-b p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="text-base font-semibold">CPC1HN AI</div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleNewSession}
              disabled={sending}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={onClose}
              disabled={sending}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                onDesktopModeChange(desktopMode === "short" ? "full" : "short")
              }
              disabled={sending}
              className="hidden lg:inline-flex"
            >
              {desktopMode === "full" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>
      <div
        ref={listRef}
        className="mx-auto w-full max-w-[1000px] flex-1 overflow-y-auto p-3"
      >
        {sessionQ.isLoading || historyQ.isLoading ? (
          <div className="text-center text-sm text-gray-500">Đang tải...</div>
        ) : (
          <div className="flex w-full flex-col gap-4">
            {[...initialMessages, ...messages].map((m, idx) => (
              <ChatMessageItem key={idx} message={m} />
            ))}
            {sending && (
              <div className="mr-auto max-w-[85%]">
                <div className="rounded-2xl rounded-tl-sm bg-gray-100 p-3 text-gray-900">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.3s]"></span>
                    <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-gray-500 [animation-delay:-0.15s]"></span>
                    <span className="inline-block h-1 w-1 animate-bounce rounded-full bg-gray-500"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mx-auto w-full max-w-[1000px] p-3">
        <ChatInput
          disabled={!sessionId || sending}
          onSend={(text) => handleSend(text)}
        />
        <div className="mt-2 w-full text-center text-xs text-gray-500">
          Thông tin chỉ mang tính chất tham khảo, được tư vấn bởi AI
        </div>
      </div>
    </div>
  );
}
