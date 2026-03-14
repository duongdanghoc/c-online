import SafeHTML from "@/components/common/safe-html";
import styles from "@/lib/styles/content.module.css";

interface Props {
  highlights: string;
}

const ProductHighlights = ({ highlights }: Props) => {
  return (
    <div className="border-primary/10 bg-primary/5 rounded-lg border p-2">
      <SafeHTML html={highlights} style={styles} />
    </div>
  );
};

export default ProductHighlights;
