const ALLOWED_WIDTHS = [
  48, 96, 160, 240, 320, 480, 640, 960, 1200, 1440, 1920, 2560,
];

function normalizeWidth(w: number) {
  return ALLOWED_WIDTHS.find((x) => x >= w) || 1280;
}

export default function thumborLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const url = process.env.NEXT_PUBLIC_THUMBOR_URL;
  const params = [
    `${normalizeWidth(width)}x0`,
    `filters:quality(${quality || 90})`,
  ];
  const path = `${params.join("/")}/${src}`.replace("//", "/");
  return `${url}/${path}`;
}
