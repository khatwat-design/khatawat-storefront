import { NextRequest, NextResponse } from "next/server";

/** Path prefixes that are never treated as store slugs (app routes, system routes). */
const RESERVED_PATHS = new Set([
  "_next",
  "api",
  "favicon.ico",
  "assets",
  "images",
  "admin",
  "cart",
  "checkout",
  "thank-you",
  "products",
  "robots.txt",
  "sitemap.xml",
]);

/** Main SaaS domain (e.g. khatawat.com) - used to detect subdomain vs custom domain. */
const MAIN_DOMAIN = process.env.NEXT_PUBLIC_MAIN_DOMAIN ?? "khatawat.com";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host")?.split(":")[0] ?? "";
  const pathname = url.pathname;

  // Ignore system routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/assets") ||
    pathname.startsWith("/images") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  let domain: string | null = null;

  // Scenario A: Custom domain (hostname is neither main domain nor its subdomain)
  const isMainDomain = hostname === MAIN_DOMAIN;
  const isSubdomainOfMain =
    hostname.endsWith(`.${MAIN_DOMAIN}`) && hostname !== MAIN_DOMAIN;

  if (!isMainDomain && !isSubdomainOfMain) {
    // Custom domain: shop.com -> domain=shop.com
    domain = hostname;
  }
  // Scenario B: Subdomain (store1.khatawat.com -> domain=store1)
  else if (isSubdomainOfMain) {
    domain = hostname.replace(`.${MAIN_DOMAIN}`, "");
  }
  // Scenario C: Subpath on main domain (khatawat.com/store-name -> domain=store-name)
  else if (isMainDomain && pathname.length > 1) {
    const segments = pathname.split("/").filter(Boolean);
    const firstSegment = segments[0] ?? "";

    if (!RESERVED_PATHS.has(firstSegment)) {
      // First segment is a store slug
      domain = firstSegment;
      // Rewrite: /store1/cart -> /cart, /store1 -> /
      const restPath = segments.slice(1).join("/");
      url.pathname = restPath ? `/${restPath}` : "/";
    }
  }

  if (domain) {
    url.searchParams.set("domain", domain);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, etc.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
