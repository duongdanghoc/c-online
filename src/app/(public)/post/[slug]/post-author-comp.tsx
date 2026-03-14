import { PostAuthor } from "@/app/types/post";
import { noImagePath } from "@/lib/const";
import Image from "next/image";
import Link from "next/link";

const PostAuthorComp = ({ author }: { author: PostAuthor }) => {
  return (
    <div className="bg-primary/10 flex items-start gap-4 rounded-lg p-2">
      <Image
        className="h-16 w-16 rounded-full"
        src={author.avatar ?? noImagePath}
        width={160}
        height={160}
        alt={author.name ?? ""}
      />
      <div className="flex flex-1 flex-col gap-1">
        <div className="font-medium">
          {author.position} - {author.name}
        </div>
        <div className="text-sm text-gray-600">{author.bio}</div>
        <Link
          href={`/tac-gia/${author.slug}.html`}
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          Xem thông tin
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
              d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default PostAuthorComp;
