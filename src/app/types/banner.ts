export interface Banner {
  name: string;
  imageUrl: string;
  url: string;
}

export interface GetBannersResp {
  banners: Banner[];
  topRight?: Banner;
  bottomRight?: Banner;
}
