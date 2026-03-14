import { cn } from "@/lib/utils";
import DOMPurify from "isomorphic-dompurify";

interface SafeHTMLProps {
  html: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

DOMPurify.addHook("afterSanitizeAttributes", function (node) {
  if (node.tagName === "IMG") {
    node.setAttribute("loading", "lazy");
    node.setAttribute("decoding", "async");
  }
});

export default function SafeHTML({
  html,
  className,
  style,
  children,
}: SafeHTMLProps) {
  return (
    <div className={cn(className, "content")} style={style}>
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
      {children}
    </div>
  );
}
