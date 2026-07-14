import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  ADMIN_SESSION_COOKIE,
  isValidAdminSessionValue,
} from "@/lib/adminAuth";
import { DEALER_ID_HEADER, DEALER_SLUG_HEADER } from "@/lib/dealer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

async function resolveDealer(host: string) {
  const cleanHost = host.split(":")[0];

  const { data: byDomain } = await supabase
    .from("dealers")
    .select("id, slug, admin_password")
    .eq("domain", cleanHost)
    .maybeSingle();

  if (byDomain) return byDomain;

  const { data: fallback } = await supabase
    .from("dealers")
    .select("id, slug, admin_password")
    .eq("slug", process.env.DEFAULT_DEALER_SLUG ?? "wendhart-demo")
    .maybeSingle();

  return fallback;
}

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const dealer = await resolveDealer(host);

  if (!dealer) {
    return new NextResponse("No dealer configured for this domain.", {
      status: 404,
    });
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(DEALER_ID_HEADER, dealer.id);
  requestHeaders.set(DEALER_SLUG_HEADER, dealer.slug);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = request.nextUrl.pathname.startsWith("/admin/login");

  if (isAdminRoute && !isLoginRoute) {
    const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (!isValidAdminSessionValue(dealer.id, dealer.admin_password, session)) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
