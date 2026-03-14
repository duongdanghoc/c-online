import { getPostBySlug } from "@/app/api/post";
import BreadcrumbsDefault from "@/components/common/breadcrumbs-default";
import SafeHTML from "@/components/common/safe-html";
import styles from "@/lib/styles/content.module.css";
import { getImageUrl } from "@/lib/utils";
import classNames from "classnames";
import dayjs from "dayjs";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import PostAuthorComp from "./post-author-comp";
import PostTocComp from "./post-toc-comp";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  props: Props
): Promise<Metadata | undefined> {
  const params = await props.params;
  const slug = params.slug.replace(".html", "");

  const { data: post } = await getPostBySlug(slug);

  if (!post) {
    return undefined;
  }

  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.abstract,
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription ?? post.abstract,
      images: post.imageUrl && {
        url: getImageUrl(post.imageUrl, 1200),
        width: 1200,
        height: 900,
      },
    },
    alternates: {
      canonical: `https://cpc1hnshop.com/bai-viet/${slug}.html`,
    },
    authors: post.author && {
      name: "Cửa hàng trực tuyến - CPC1 Hà Nội",
    },
    robots: "index, follow",
    keywords: post.keywords ?? [],
  };
}

const Page = async (props: Props) => {
  const params = await props.params;
  const slug = params.slug.replace(".html", "");

  const postResp = await getPostBySlug(slug);
  if (postResp.error || !postResp.data) {
    return redirect("/");
  }

  const post = postResp.data;
  const tocArr = convertTocToArray(post?.toc ?? "");
  return (
    <div className="container mx-auto flex flex-col items-center pb-12">
      <div className="mt-4 mb-4 w-full max-w-[800px]">
        <BreadcrumbsDefault
          items={[
            { label: "Home", href: "/" },
            ...(post.categories?.map((category) => ({
              label: category.name,
              href: `/chuyen-muc/${category.slug}`,
            })) || []),
            { label: postResp.data.title, href: `` },
          ]}
        />
      </div>
      <div className="w-full max-w-[800px] rounded-xl bg-white">
        <div className="w-full p-4">
          <h1 className="mb-2 text-2xl font-bold">{post.title}</h1>
          {tocArr.length > 0 && <PostTocComp toc={tocArr} />}
          <SafeHTML
            html={post.content}
            className={classNames(styles.content, styles.contentContainer)}
          />

          <div className="h-4"></div>
          {post.author && <PostAuthorComp author={post.author} />}
          <div className="mt-4 text-xs text-gray-500 italic">
            Cập nhật lúc :{" "}
            {dayjs(post.updatedAt ?? post.createdAt).format("DD/MM/YYYY HH:mm")}
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generatePostSchema(post)),
        }}
      />
    </div>
  );
};

const convertTocToArray = (toc: string): { id: string; text: string }[] => {
  try {
    const result = JSON.parse(toc) as { id: string; text: string }[];
    return result;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return [];
  }
};

function generatePostSchema(post: any) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription ?? post.abstract,
    image: post.imageUrl ? getImageUrl(post.imageUrl, 1200) : undefined,
    datePublished: post.createdAt,
    dateModified: post.updatedAt ?? post.createdAt,
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.name,
          description: post.author.description,
          image: post.author.avatarUrl
            ? getImageUrl(post.author.avatarUrl, 400)
            : undefined,
        }
      : {
          "@type": "Organization",
          name: "Cửa hàng trực tuyến - CPC1 Hà Nội",
        },
    publisher: {
      "@type": "Organization",
      name: "Cửa hàng trực tuyến - CPC1 Hà Nội",
    },
    articleSection: post.categories?.map((cat: any) => cat.name).join(", "),
    keywords: post.keywords?.join(", "),
    wordCount: post.content
      ? post.content.replace(/<[^>]*>/g, "").split(/\s+/).length
      : undefined,
  };

  // Remove undefined values
  const cleanedSchema = Object.entries(schema).reduce(
    (acc: Record<string, unknown>, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value;
      }
      return acc;
    },
    {}
  );

  return cleanedSchema;
}

export default Page;
