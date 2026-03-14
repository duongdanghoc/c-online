export const getStringArrayParams = (
  params: string | string[] | undefined
): string[] | undefined => {
  if (!params) return undefined;
  if (Array.isArray(params)) return params;
  return [params];
};
