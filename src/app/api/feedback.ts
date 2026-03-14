import {
  AvgFeedbackResp,
  CreateFeedbackDto,
  Feedback,
  FeedbackReply,
  GetFeedbacksQuery,
  GetFeedbacksResp,
  GetRepliesQuery,
  GetRepliesResp,
} from "../types/feedback";
import api from "./api";

export async function getFeedbacks(
  request: GetFeedbacksQuery
): Promise<GetFeedbacksResp> {
  const data = await api.get("/feedback", {
    params: {
      ...request,
    },
  });

  return data;
}

export async function getAvgFeedback(
  targetId: string
): Promise<AvgFeedbackResp> {
  const data = await api.get(`/feedback/${targetId}/avg-rating`);
  return data as AvgFeedbackResp;
}

export async function getReplies(
  feedbackId: number,
  query: GetRepliesQuery
): Promise<GetRepliesResp> {
  const data = await api.get(`/feedback/${feedbackId}/replies`, {
    params: {
      ...query,
    },
  });

  return data as GetRepliesResp;
}

export async function createFeedback(
  dto: CreateFeedbackDto
): Promise<Feedback | FeedbackReply> {
  const data = await api.put("/feedback", dto);

  return data as Feedback | FeedbackReply;
}
