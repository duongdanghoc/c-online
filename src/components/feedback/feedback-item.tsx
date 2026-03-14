import { Feedback } from "@/app/types/feedback";
import classNames from "classnames";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { Stars } from "./stars";

interface Props {
  feedback: Feedback;
  isLoading: boolean;
  onLoadMoreReplies: (feedback: Feedback) => void;
  onReplyClick: (feedback: Feedback) => void;
}

const FeedbackItem = ({
  feedback,
  onLoadMoreReplies,
  onReplyClick,
  isLoading,
}: Props) => {
  return (
    <div>
      <div className="flex gap-2 lg:gap-4">
        <div className="flex min-h-full flex-col items-center justify-start">
          <div className="bg-gray-150 flex h-12 w-12 items-center justify-center rounded-full font-medium text-gray-600">
            {feedback.avatarText}
          </div>
          {feedback.replies && feedback.replies.length > 0 && (
            <div className="w-[2px] flex-1 bg-gray-300"></div>
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="mb-2 flex items-center gap-2 font-medium text-gray-800">
            {feedback.name}{" "}
          </div>
          <Stars rate={feedback.rate} />
          <div className="text-sm text-gray-700">{feedback.content}</div>
          <div className="mt-2 mb-4 flex items-center gap-2 text-sm text-gray-500">
            {feedback.createdAtDisplay}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25v13.5m-7.5-13.5v13.5"
              />
            </svg>
            <Button
              size={"sm"}
              variant={"link"}
              className="px-0"
              onClick={() => {
                onReplyClick(feedback);
              }}
            >
              Trả lời
            </Button>
          </div>
        </div>
      </div>

      {feedback.replies && feedback.replies.length > 0 && (
        <div>
          {feedback.replies.map((reply, index) => (
            <div key={index} className="flex items-stretch gap-2">
              <div
                className={classNames({
                  "relative ml-[23px] flex min-h-full w-6 flex-col": true,
                })}
              >
                {index < feedback.replies.length - 1 && (
                  <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-gray-300"></div>
                )}
                <div className="h-6 w-6 rounded-bl-xl border-b-2 border-l-2 border-gray-300"></div>
              </div>
              {reply.isAdmin ? (
                <AdminAvatar />
              ) : (
                <div className="bg-gray-150 flex h-12 w-12 items-center justify-center rounded-full font-medium text-gray-600">
                  {reply.avatarText}
                </div>
              )}
              <div className="flex-1 space-y-1">
                <div className="font-medium text-gray-800">
                  {reply.isAdmin ? "CPC1 Hà Nội" : reply.name}
                </div>
                <div className="text-sm text-gray-700">{reply.content}</div>
                <div className="mt-2 mb-4 flex items-center gap-2 text-sm text-gray-500">
                  {reply.createdAtDisplay}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 text-gray-300"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                    />
                  </svg>

                  <Button
                    size={"sm"}
                    variant={"link"}
                    className="px-0"
                    onClick={() => {
                      onReplyClick(feedback);
                    }}
                  >
                    Trả lời
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex w-full ps-12 pb-4">
        {feedback.replies &&
          feedback.replies.length < feedback.totalReplies && (
            <Button
              size={"sm"}
              variant={"link"}
              className="w-fit"
              disabled={isLoading}
              onClick={() => {
                onLoadMoreReplies(feedback);
              }}
            >
              {isLoading ? (
                <Loader2Icon className="animate-spin" />
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
                    d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
                  />
                </svg>
              )}
              Xem thêm phản hồi
            </Button>
          )}
      </div>
    </div>
  );
};

function AdminAvatar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`from-primary to-primary/80 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b ${className ?? ""}`}
    >
      <Image
        className="h-8 w-8"
        alt="admin-avatar"
        src={"white-logo.png"}
        width={64}
        height={64}
      />
    </div>
  );
}

export default FeedbackItem;
