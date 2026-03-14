"use client";

import { getAvgFeedback, getFeedbacks, getReplies } from "@/app/api/feedback";
import { Feedback, GetFeedbacksQuery } from "@/app/types/feedback";
import AddFeedbackDialog from "@/components/feedback/add-feedback-dialog";
import FeedbackItem from "@/components/feedback/feedback-item";
import { Stars } from "@/components/feedback/stars";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface Props {
  productId: string;
}

const generateNewFeedbackList = (
  current: Feedback[],
  newValues: Feedback[]
) => {
  const newFeedbacks = [...current];
  newValues.forEach((newFeedback) => {
    const existingIndex = newFeedbacks.findIndex(
      (f) => f.id === newFeedback.id
    );
    if (existingIndex !== -1) {
      newFeedbacks[existingIndex] = newFeedback;
    } else {
      newFeedbacks.push(newFeedback);
    }
  });
  return newFeedbacks;
};

const FeedbackComp = ({ productId }: Props) => {
  const queryClient = useQueryClient();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { data: avgFeedback } = useQuery({
    queryKey: ["avgFeedback", productId],
    queryFn: () => getAvgFeedback(productId),
  });
  const [starFilter, setStarFilter] = useState<number | null>(null);

  const { mutate, isPending: isLoadingFeedbacks } = useMutation({
    mutationKey: ["feedbacks", productId],
    mutationFn: (dto: GetFeedbacksQuery) => {
      return getFeedbacks(dto);
    },
    onSuccess: (data) => {
      setFeedbacks(generateNewFeedbackList(feedbacks, data.feedbacks));
      setTotal(data.total);
    },
    onError: (error) => {
      console.error("Error fetching feedbacks:", error);
    },
  });

  const { mutate: loadMoreReplies, isPending } = useMutation({
    mutationKey: ["feedbacks", "loadMoreReplies"],
    mutationFn: (feedback: Feedback) => {
      return getReplies(feedback.id, {
        replySkip: feedback.replies ? feedback.replies.length : 0,
      });
    },
    onSuccess: (data) => {
      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === data.feedbackId
            ? {
                ...f,
                replies: [...f.replies, ...data.replies],
                totalReplies: data.total,
              }
            : f
        )
      );
    },
  });

  const loadMore = useMemo(() => {
    if (!feedbacks || feedbacks.length === 0) return false;
    return total > feedbacks.length;
  }, [feedbacks, total]);

  useEffect(() => {
    mutate({
      targetId: productId,
    });
  }, [productId, mutate]);

  return (
    <div className="mt-4 rounded-xl bg-white p-2 lg:p-4">
      <div className="flex gap-12">
        <h2 className="mb-4 flex-1">Đánh giá sản phẩm</h2>
        <Button
          className="mb-4"
          onClick={() => {
            setSelectedFeedback(null);
            setIsAddDialogOpen(true);
          }}
        >
          Thêm đánh giá
        </Button>
      </div>
      {avgFeedback?.avgRate && (
        <div className="flex">
          <div className="w-40">
            <div className="flex gap-1 text-4xl font-bold">
              {avgFeedback.avgRate?.toFixed(1)}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-8 text-orange-400"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div className="text-sm font-normal text-gray-500">
              / {avgFeedback.total} đánh giá
            </div>
          </div>

          <div className="w-full max-w-[500px]">
            <RateCount
              total={avgFeedback.total}
              rate={5}
              count={avgFeedback.ratingLevel?.totalLevel5}
            />
            <RateCount
              total={avgFeedback.total}
              rate={4}
              count={avgFeedback.ratingLevel?.totalLevel4}
            />
            <RateCount
              total={avgFeedback.total}
              rate={3}
              count={avgFeedback.ratingLevel?.totalLevel3}
            />
            <RateCount
              total={avgFeedback.total}
              rate={2}
              count={avgFeedback.ratingLevel?.totalLevel2}
            />
            <RateCount
              total={avgFeedback.total}
              rate={1}
              count={avgFeedback.ratingLevel?.totalLevel1}
            />
          </div>
        </div>
      )}

      {!avgFeedback?.avgRate && (
        <div className="text-gray-500">
          Chưa có đánh giá nào cho sản phẩm này.
        </div>
      )}

      {avgFeedback?.avgRate && (
        <div className="mt-4 border-t border-t-gray-300">
          <div className="mt-4 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                size={"sm"}
                variant={starFilter === star ? "default" : "outline"}
                className="me-2 mb-2 rounded-full shadow-none"
                onClick={() => {
                  setStarFilter(starFilter === star ? null : star);
                  setFeedbacks([]);
                  mutate({
                    targetId: productId,
                    skip: 0,
                    filterRate: starFilter === star ? undefined : star,
                  });
                }}
              >
                {star}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`size-4 fill-orange-400 text-orange-400`}
                >
                  <path
                    fillRule="evenodd"
                    d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            ))}
          </div>

          {feedbacks.map((item) => (
            <FeedbackItem
              isLoading={isPending && selectedFeedback?.id === item.id}
              key={item.id}
              feedback={item}
              onLoadMoreReplies={(feedback) => {
                setSelectedFeedback(feedback);
                loadMoreReplies(feedback);
              }}
              onReplyClick={(feedback) => {
                setSelectedFeedback(feedback);
                setIsAddDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}
      {loadMore && (
        <Button
          disabled={isLoadingFeedbacks}
          onClick={() => {
            mutate({
              targetId: productId,
              skip: feedbacks.length,
            });
          }}
          variant="link"
        >
          {isLoadingFeedbacks ? (
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
          Xem thêm {total - feedbacks.length} đánh giá
        </Button>
      )}

      <AddFeedbackDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        productId={productId}
        feedbackId={selectedFeedback?.id}
        onSuccess={() => {
          setFeedbacks([]);
          mutate({
            targetId: productId,
            skip: 0,
          });
          queryClient.invalidateQueries({
            queryKey: ["avgFeedback", productId],
          });
        }}
      />
    </div>
  );
};

function RateCount({
  count,
  rate,
  total,
}: {
  count: number;
  total: number;
  rate: number;
}) {
  return (
    <div className="flex items-center gap-4">
      <Stars rate={rate} />
      <div className="bg-gray-150 relative h-3 flex-1 rounded-full">
        <div
          className="h-3 rounded-full bg-orange-400"
          style={{ width: `${(count / total) * 100}%` }}
        ></div>
      </div>
      <div>
        <span className="text-sm text-gray-500">{count}</span>
      </div>
    </div>
  );
}

export default FeedbackComp;
