"use client";

import classNames from "classnames";
import { useState } from "react";

const PostTocComp = ({ toc }: { toc: { id: string; text: string }[] }) => {
  const [expanded, setExpanded] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-primary/10 mb-4 rounded-lg px-4 py-2 text-blue-500">
      <div
        className="flex items-center justify-between py-2"
        onClick={() => setExpanded((value) => !value)}
      >
        <div className="font-medium text-gray-800">Nội dung bài viết</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={classNames(
            "size-5 transition-transform",
            expanded ? "rotate-180" : "rotate-0"
          )}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </div>
      <ul className="space-y-1">
        {expanded &&
          toc.map((item) => (
            <li
              className="ms-6 list-disc"
              key={item.id}
              onClick={() => scrollToSection(item.id)}
            >
              {item.text}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default PostTocComp;
