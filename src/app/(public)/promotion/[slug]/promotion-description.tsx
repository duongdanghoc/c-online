"use client";
import styles from "@/lib/styles/content.module.css";
import classNames from "classnames";
import DOMPurify from "isomorphic-dompurify";
import { useEffect, useState } from "react";

interface Props {
  description: string;
}

const PromotionDescription = ({ description }: Props) => {
  const [sanitizedHtml, setSanitizedHtml] = useState("");
  useEffect(() => {
    setSanitizedHtml(DOMPurify.sanitize(description));
  }, [description]);

  return (
    <div
      style={{
        maxWidth: "100%",
        padding: "16px",
      }}
      className={classNames(
        styles.content,
        styles.contentContainer,
        "rounded-xl bg-white"
      )}
      dangerouslySetInnerHTML={{
        __html: sanitizedHtml,
      }}
    />
  );
};

export default PromotionDescription;
