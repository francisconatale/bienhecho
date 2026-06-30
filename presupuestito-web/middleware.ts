import { type NextRequest, NextResponse } from "next/server";

// ─── Supabase session helpers (inlined para evitar problemas de resolución
//     de módulos en el Edge Runtime de Vercel) ────────────────────────────────

const STORAGE_KEY = "supabase.auth.token";

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return atob(base64);
}

function decodeJwtPayload(token: string) {
  try {
    return JSON.parse(base64UrlDecode(token.split(".")[1]));
  } catch {
    return null;
  }
}

function getSessionFromCookies(request: NextRequest) {
  const allCookies = request.cookies.getAll();

  const chunks: { name: string; index: number; value: string }[] = [];

  for (const cookie of allCookies) {
    if (cookie.name === STORAGE_KEY) {
      chunks.push({ name: cookie.name, index: -1, value: cookie.value });
    } else {
      const match = cookie.name.match(
        new RegExp(
          `^${STORAGE_KEY.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.(\\d+)$`
        )
      );
      if (match) {
        chunks.push({
          name: cookie.name,
          index: parseInt(match[1]),
          value: cookie.value,
        });
      }
    }
  }

  if (chunks.length === 0) return null;

  chunks.sort((a, b) => a.index - b.index);
  let combined = chunks.map((c) => c.value).join("");

  if (combined.startsWith("base64-")) {
    combined = combined.slice("base64-".length);
  }

  try {
    const decoded = base64UrlDecode(combined);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

async function updateSession(request: NextRequest) {
  const session = getSessionFromCookies(request);

  let user = null;
  if (session?.access_token) {
    const payload = decodeJwtPayload(session.access_token);
    if (payload && payload.exp && payload.exp * 1000 > Date.now()) {
      user = {
        id: payload.sub,
        email: payload.email,
        aud: payload.aud,
        role: payload.role,
        app_metadata: payload.app_metadata,
        user_metadata: payload.user_metadata,
      };
    }
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  return { response, user };
}

// ─── Middleware principal ─────────────────────────────────────────────────────

const publicPaths = ["/login", "/register", "/landing"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
