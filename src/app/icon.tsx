import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 192,
  height: 192,
};
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "hsl(213, 75%, 40%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "0%",
        }}
      >
        {}
        <img
          src="https://cdn.cpc1hn.com/unsafe/192x0/filters:quality(90)/white-logo.png"
          alt="Icon"
          width="128"
          height="128"
          style={{
            objectFit: "contain",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
