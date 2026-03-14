"use client";

import { PolicyDetail } from "@/app/types/policy";
import styles from "@/lib/styles/content.module.css";
import DOMPurify from "isomorphic-dompurify";
import { useEffect, useState } from "react";

interface Props {
  policy: PolicyDetail;
}

const PolicyView = ({ policy }: Props) => {
  const [contentSanitized, setContentSanitized] = useState<string>("");

  useEffect(() => {
    const sanitizedContent = DOMPurify.sanitize(policy.content);
    setContentSanitized(sanitizedContent);
  }, [policy]);

  return (
    <div className="p-2 text-gray-800 lg:p-4">
      <h1 className="mb-4 text-gray-800">{policy.title}</h1>
      <div className={styles.content}>
        <div dangerouslySetInnerHTML={{ __html: contentSanitized }}></div>
      </div>
    </div>
  );
};

export default PolicyView;
