"use client";

import { useState, FormEvent, memo, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  disabled?: boolean;
  placeholder?: string;
  onSend: (text: string) => void;
}

function ChatInputBase({ disabled, placeholder, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");

  const canSend = useMemo(() => {
    return !!value.trim() && !disabled;
  }, [value, disabled]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-lg border p-1"
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder || "Nhập câu hỏi của bạn..."}
        disabled={disabled}
        className="border-0 bg-transparent p-0 px-2 shadow-none focus:ring-0"
      />
      <Button type="submit" disabled={!canSend}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
          />
        </svg>
      </Button>
    </form>
  );
}

const ChatInput = memo(ChatInputBase);
export default ChatInput;

