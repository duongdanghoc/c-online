"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  shortText?: string;
}

interface Props {
  toc: TocItem[];
}

const ProductDescriptionToc = ({ toc }: Props) => {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!toc.length) {
      setActiveId("");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -80% 0px",
      }
    );

    toc.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [toc]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-4">
      <ul className="space-y-2">
        {toc.map(({ id, shortText }) => (
          <li key={id}>
            <button
              onClick={() => scrollToSection(id)}
              className={`w-full rounded-lg px-4 py-2 text-left text-sm transition-colors duration-200 hover:bg-gray-100 ${
                activeId === id
                  ? "bg-blue-50 font-medium text-blue-600"
                  : "text-gray-600"
              }`}
            >
              {shortText}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ProductDescriptionToc;
