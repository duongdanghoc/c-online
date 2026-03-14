export interface Policy {
  id: number;
  title: string;
  slug: string;
}

export interface PolicyDetail extends Policy {
  seoTitle: string;
  seoMeta: string;
  content: string;
  abstract: string;
}
