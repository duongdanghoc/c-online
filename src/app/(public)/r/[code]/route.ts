import { getLink } from "@/app/api/campaign";
import { normalizeUrl } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const code = (await params).code;
  const headersList = request.headers;
  const headersObj: Record<string, string> = {};

  headersList.forEach((val, key) => {
    if (
      key.toLowerCase() !== "host" &&
      key.toLowerCase() !== "content-length"
    ) {
      headersObj[key] = val;
    }
  });

  if (request.headers.has("host")) {
    headersObj["x-forwarded-host"] = request.headers.get("host") as string;
  }

  const domain = process.env.NEXT_PUBLIC_DOMAIN || "https://cpc1hnshop.com";
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || ".cpc1hnshop.com";

  try {
    const link = await getLink({ code }, headersObj);
    // Set cookies directly on the response object
    const response = NextResponse.redirect(
      new URL(normalizeUrl(`${domain}/${link.landingUrl}`), request.url)
    );

    const cookieConfig = {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 60 * 60 * 24 * 1000 * 7),
      sameSite: "none" as const,
      domain: rootDomain,
    };
    response.cookies.set("linkId", link.id, cookieConfig);
    response.cookies.set("campaignId", link.campaignId, cookieConfig);
    response.cookies.set("clickId", link.clickId, cookieConfig);

    return response;
  } catch (error) {
    console.error("Error fetching link:", error);
    return NextResponse.redirect(new URL(domain, request.url));
  }
}
