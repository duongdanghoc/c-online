"use client";

import { memo } from "react";
import classNames from "classnames";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChatProductCard from "./ChatProductCard";
import type { MessageEx } from "@/store/chat";

interface Props {
  message: MessageEx;
}

function ChatMessageItemBase({ message }: Props) {
  return (
    <div
      className={classNames(
        message.role === "user" ? "ml-auto max-w-[85%]" : "mr-auto max-w-[85%]"
      )}
    >
      <div
        className={
          message.role === "user"
            ? "bg-primary rounded-2xl rounded-tr-sm p-3 text-sm text-white"
            : "rounded-2xl rounded-tl-sm bg-gray-100 p-3 text-sm text-gray-900"
        }
      >
        {message.role === "assistant" ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              ul: (props) => <ul className="my-2 list-disc pl-4" {...props} />,
              ol: (props) => <ol className="my-2 list-decimal pl-4" {...props} />,
              a: (props) => <a className="text-blue-600 underline" {...props} />,
              img: (props) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="rounded-lg" alt="" {...props} />
              ),
              table: (props) => (
                <div className="my-2 w-full overflow-auto">
                  <table className="w-full table-auto rounded-lg" {...props} />
                </div>
              ),
              th: (props) => (
                <th className="border px-2 py-1 text-left font-semibold" {...props} />
              ),
              td: (props) => (
                <td className="border px-2 py-1 text-left align-top" {...props} />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        ) : (
          <div className="whitespace-pre-wrap">{message.content}</div>
        )}
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2">
        {message.products &&
          message.products.length > 0 &&
          message.products.map((p) => <ChatProductCard product={p} key={p.id} />)}
      </div>
    </div>
  );
}

// Rely on referential equality of message objects from the store
const ChatMessageItem = memo(ChatMessageItemBase, (prev, next) => prev.message === next.message);

export default ChatMessageItem;

