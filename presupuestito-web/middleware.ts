import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const publicPaths = ["/login", "/register", "/landing"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // We need to get the response and the user status from a modified updateSession,
  // or we can just fetch the user here. But wait, updateSession handles cookies.
  const { response, user } = await updateSession(request);

  const isPublicPath = publicPaths.includes(pathname);

  // Si no está logueado y la ruta NO es pública, mandarlo al login
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Si YA está logueado y quiere entrar a /login o /register, mandarlo al dashboard
  if (user && (pathname === "/login" || pathname === "/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
