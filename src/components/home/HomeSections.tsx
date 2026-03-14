import { getHomeSections } from "@/app/api/home-section";
import { noImagePath } from "@/lib/const";
import Image from "next/image";
import HomeSectionProducts from "./HomeSectionProducts";

const HomeSections = async () => {
  const { data: sections, error } = await getHomeSections();
  if (!sections || error) {
    return null;
  }

  return (
    <div className="mt-8 flex flex-col gap-8">
      {sections.map((section) => (
        <div key={section.slug}>
          <div className="flex items-center gap-2">
            <Image
              src={section.icon || noImagePath}
              alt={section.title}
              width={48}
              height={48}
              className="h-8 w-8"
            />
            <h2 className="flex-1">{section.title}</h2>
          </div>
          <HomeSectionProducts productsRecord={section.products} />
        </div>
      ))}
    </div>
  );
};

export default HomeSections;
