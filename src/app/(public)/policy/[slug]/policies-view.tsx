import { Policy } from "@/app/types/policy";
import classNames from "classnames";
import Link from "next/link";

interface Props {
  policies: Policy[];
  currentSlug: string;
}

const PoliciesView: React.FC<Props> = ({ policies, currentSlug }) => {
  return (
    <div className="sticky top-4 h-fit rounded-xl bg-white p-2">
      <h3 className="p-2">Về chúng tôi</h3>
      <div className="flex flex-col gap-1">
        {policies.map((policy) => (
          <Link
            key={policy.id}
            href={`/ve-chung-toi/${policy.slug}`}
            className={classNames(
              "flex items-center gap-2 rounded-lg p-2 text-sm font-medium",
              currentSlug === policy.slug
                ? "bg-primary/10 text-primary"
                : "hover:bg-primary/10 text-gray-800"
            )}
          >
            <div>{policy.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PoliciesView;
