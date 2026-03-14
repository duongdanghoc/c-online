import * as React from "react";

export function useMediaQuery(query: string, initialValue?: boolean) {
  // Avoid hydration mismatch by keeping SSR/client first render consistent
  const [value, setValue] = React.useState<boolean>(initialValue ?? false);

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") {
      return;
    }

    const mql = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setValue(event.matches);

    setValue(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return value;
}
