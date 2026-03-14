import { getAllPolicies, getPolicyDetail } from "@/app/api/policy";
import BreadcrumbsDefault from "@/components/common/breadcrumbs-default";
import { redirect } from "next/navigation";
import PoliciesView from "./policies-view";
import PolicyView from "./policy-view";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(props: Props) {
  const slug = (await props.params.then((p) => p.slug)).replace(".html", "");

  const [policyDetailResp] = await Promise.all([await getPolicyDetail(slug)]);

  if (!policyDetailResp.data || policyDetailResp.error) {
    return undefined;
  }

  return {
    title: policyDetailResp.data.seoTitle,
    description: policyDetailResp.data.seoMeta,
    openGraph: {
      title: policyDetailResp.data.seoTitle,
      description: policyDetailResp.data.seoMeta,
    },
  };
}

const Page: React.FC<Props> = async ({ params }) => {
  const slug = (await params.then((p) => p.slug)).replace(".html", "");

  const [policyDetailResp, allPoliciesResp] = await Promise.all([
    await getPolicyDetail(slug),
    await getAllPolicies(),
  ]);

  if (!policyDetailResp.data || policyDetailResp.error) {
    return redirect("/");
  }

  return (
    <div className="container mx-auto pb-8">
      <BreadcrumbsDefault
        items={[
          { label: "Trang chủ", href: "/" },
          { label: policyDetailResp.data.title, href: `` },
        ]}
      />
      <div className="mt-4 grid grid-cols-4 gap-4">
        <div className="col-span-full row-start-2 lg:col-span-1 lg:row-start-1">
          <PoliciesView
            policies={allPoliciesResp.data ?? []}
            currentSlug={slug}
          />
        </div>
        <div className="col-span-full rounded-xl bg-white lg:col-span-3">
          <PolicyView policy={policyDetailResp.data} />
        </div>
      </div>
    </div>
  );
};

export default Page;
