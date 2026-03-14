import { BaseError } from "../types/base-error";
import { Resp } from "../types/response";
import api from "./api";
import apiWithAuth from "./api-with-auth";

export interface LuckyWheelProgram {
  id: string;
}

export interface LuckyWheelSegment {
  id: string;
  title: string;
  segmentOrder: number;
  colorCode: string;
  imagePath: string;
}

export interface LuckyWheel {
  id: string;
  name: string;
  description: string;
  spinTime: number;
  bgImagePath: string;
  centerImagePath: string;
  centerSize: number;
  segments: LuckyWheelSegment[];
  program: LuckyWheelProgram;
  onlyBackground: boolean;
  frameImagePath?: string;
  mobileFramePath?: string;
  desktopFramePath?: string;
}

export interface SegmentProbability {
  id: string;
  probability: number;
}

export interface LuckyWheelGift {
  segmentId: string;
  giftCode: string;
  giftDefinition: GiftDefinition;
}

export interface GiftDefinition {
  id: string;
  name: string;
  promotionId?: string;
  framePath?: string;
}

export async function getLuckyWheelInfo(
  wheelId: string
): Promise<Resp<LuckyWheel>> {
  try {
    const wheel = (await api.get(`/lucky-wheel/${wheelId}`)) as LuckyWheel;
    return {
      data: wheel,
    };
  } catch (error) {
    return {
      error: error as BaseError,
    };
  }
}

export async function spinLuckyWheel(
  wheelId: string
): Promise<Resp<LuckyWheelGift>> {
  try {
    const gift = (await apiWithAuth.post(
      `/lucky-wheel/${wheelId}/spin`
    )) as LuckyWheelGift;
    return {
      data: gift,
    };
  } catch (error) {
    return {
      error: error as BaseError,
    };
  }
}
