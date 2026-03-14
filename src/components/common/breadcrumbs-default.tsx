import { ChevronRight } from "lucide-react";
import Script from "next/script";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from ".././ui/breadcrumb";

interface BreadcrumbsDefaultProps {
  items: {
    label: string;
    href?: string;
  }[];
}

const BreadcrumbsDefault = ({ items }: BreadcrumbsDefaultProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${process.env.NEXT_PUBLIC_DOMAIN}${item.href}`,
    })),
  };
  return (
    <>
      <Breadcrumb className="pt-4">
        <BreadcrumbList className="">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink
                    className="text-primary text-[14px] font-medium lg:text-[16px]"
                    href={item.href}
                  >
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbLink
                    className="text-[14px] font-medium lg:text-[16px]"
                    asChild
                  >
                    <div>{item.label}</div>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {index < items.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRight size={16} />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <Script
        id="breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
        strategy="lazyOnload"
      ></Script>
    </>
  );
};

export default BreadcrumbsDefault;
