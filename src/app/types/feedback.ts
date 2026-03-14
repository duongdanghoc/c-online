export interface Feedback {
  avatarText: string;
  id: number;
  name: string;
  rate: number;
  content: string;
  createdAtDisplay: string;
  phone: string;
  email?: string;
  totalReplies: number;
  replies: FeedbackReply[];
}

export interface FeedbackReply {
  id: number;
  content: string;
  createdAtDisplay: string;
  name: string;
  isAdmin: boolean;
  email?: string;
  phone: string;
  avatarText: string;
}

export interface GetFeedbacksQuery {
  targetId: string;
  skip?: number;
  take?: number;
  replySkip?: number;
  replyTake?: number;
  filterRate?: number;
}

export interface GetRepliesQuery {
  replySkip?: number;
  replyTake?: number;
}

export interface GetFeedbacksResp {
  feedbacks: Feedback[];
  total: number;
}

export interface GetRepliesResp {
  replies: FeedbackReply[];
  total: number;
  feedbackId: number;
}

export interface CreateFeedbackDto {
  targetId: string;
  rate?: number;
  content: string;
  name: string;
  phone: string;
  email?: string;
  replyId?: number;
}

export interface AvgFeedbackResp {
  avgRate: number;
  total: number;
  ratingLevel: {
    totalLevel1: number;
    totalLevel2: number;
    totalLevel3: number;
    totalLevel4: number;
    totalLevel5: number;
  };
}
