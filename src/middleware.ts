import { NextRequest, NextResponse } from "next/server";

async function getDestination(source: string): Promise<{
  destination: string;
  code?: number;
} | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}/redirect/destination`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ source }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data?.data || null;
  } catch (error) {
    console.error("Error fetching redirect destination:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const cleanPathname = pathname.includes(".")
      ? pathname.substring(0, pathname.lastIndexOf("."))
      : pathname;

    const subPath = pathname.includes(".")
      ? pathname.substring(pathname.lastIndexOf("."))
      : "";

    const redirectData = await getDestination(cleanPathname);

    if (redirectData?.destination) {
      const { destination, code = 301 } = redirectData;
      if (destination === cleanPathname) {
        return NextResponse.next();
      }

      let redirectUrl: URL;

      if (
        destination.startsWith("http://") ||
        destination.startsWith("https://")
      ) {
        redirectUrl = new URL(destination + subPath);
      } else {
        redirectUrl = new URL(destination + subPath, request.url);
      }

      if (request.nextUrl.search) {
        redirectUrl.search = request.nextUrl.search;
      }

      return NextResponse.redirect(redirectUrl, code);
    }
  } catch (error) {
    console.error("Redirect middleware error:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/san-pham/:slug*", "/bai-viet/:slug"],
};
