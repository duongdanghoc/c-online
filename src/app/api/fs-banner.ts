import api from "./api";

export interface FsBanner {
  startAt: string;
  imagePath: string;
  durationInSeconds: number;
  textColor?: string;
}

export async function getFsBannerOfProduct(
  slug: string
): Promise<FsBanner | null> {
  const resp = await api.get(`fs/banners/${slug}`);
  return resp;
}
