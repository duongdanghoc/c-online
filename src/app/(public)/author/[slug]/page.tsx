import { getAuthor } from "@/app/api/author";
import BreadcrumbsDefault from "@/components/common/breadcrumbs-default";
import SafeHTML from "@/components/common/safe-html";
import Image from "next/image";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(props: Props) {
  const slug = (await props.params.then((p) => p.slug)).replace(".html", "");

  const { data: author, error } = await getAuthor(slug);

  if (!author || error) {
    return {
      title: "Author Not Found",
      description: "The author you are looking for does not exist.",
    };
  }

  return {
    title: `${author.position} - ${author.name} - CPC1HN Shop`,
    description: author.bio || "Author biography not available.",
    openGraph: {
      title: author.name,
      description: author.bio || "Author biography not available.",
      images: author.avatar ? [author.avatar] : [],
    },
    alternates: {
      canonical: `https://cpc1hnshop.com/tac-gia/${slug}.html`,
    },
    robots: "index, follow",
  };
}

const Page = async (props: Props) => {
  const slug = (await props.params.then((p) => p.slug)).replace(".html", "");

  const { data: author, error } = await getAuthor(slug);

  if (!author || error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Author Not Found
          </h1>
          <p className="text-gray-600">
            The author you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 pb-12">
      <div className="container mx-auto">
        <div className="mb-4 w-full max-w-[800px]">
          <BreadcrumbsDefault
            items={[
              { label: "Trang chủ", href: "/" },
              { label: `${author.position} ${author.name}` },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="sticky top-8 rounded-lg bg-white p-6">
              <div className="mb-6 flex justify-center">
                <div className="relative h-32 w-32 overflow-hidden rounded-full bg-gray-200">
                  {author.avatar ? (
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <svg
                        className="h-16 w-16"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">
                {author.name}
              </h1>

              {author.position && (
                <p className="mb-4 text-center font-medium text-gray-600">
                  {author.position}
                </p>
              )}

              {author.specialty && (
                <div className="mb-4 flex justify-center">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {author.specialty}
                  </span>
                </div>
              )}

              {author.bio && (
                <div className="text-center">
                  <p className="text-gray-700">{author.bio}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-4 lg:p-6">
              <h3 className="mb-4">Kinh nghiệm</h3>
              <SafeHTML html={author.experience ?? ""} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
