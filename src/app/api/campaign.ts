import api from "./api";

export interface GetLinkDto {
  code: string;
}
export interface CampaignLinkResponseDto {
  id: string;
  campaignId: string;
  clickId: string;
  code: string;
  landingUrl: string;
  referrerId: string;
  createdAt: Date;
}

export async function getLink(
  dto: GetLinkDto,
  headers?: any
): Promise<CampaignLinkResponseDto> {
  try {
    const data = await api.get(`/campaign/links`, {
      params: {
        ...dto,
      },
      headers,
    });
    return data;
  } catch (e) {
    throw e;
  }
}
