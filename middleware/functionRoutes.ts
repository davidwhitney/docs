import type { RequestHandler } from "lume/core/server.ts";
import defaultRoutes from "./functions/routes.ts";

export default function createRoutingMiddleware(
  routeObject: Record<string, RequestHandler> = defaultRoutes,
) {
  return function functionRoutesMiddleware(
    req: Request,
    next: RequestHandler,
  ): Promise<Response> {
    const url = new URL(req.url);
    const pathname = url.pathname;

    const exact = routeObject[pathname];
    if (exact) {
      return exact(req);
    }

    let bestMatch: { handler: RequestHandler; score: number } | undefined;

    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const matchesPattern = (path: string, pattern: string): boolean => {
      if (pattern.endsWith("/*")) {
        const baseWithSlash = pattern.slice(0, -1); // keep the slash, drop the *
        if (path.startsWith(baseWithSlash)) {
          return true;
        }
        if (
          baseWithSlash.endsWith("/") && path === baseWithSlash.slice(0, -1)
        ) {
          return true;
        }
        return false;
      }

      if (!pattern.includes("*")) {
        return path === pattern;
      }

      // Generic * support: convert to regex once per check
      const regexStr = "^" + pattern.split("*").map(escapeRegex).join(".*") +
        "$";
      return new RegExp(regexStr).test(path);
    };

    for (const [pattern, handler] of Object.entries(routeObject)) {
      if (!pattern.includes("*")) {
        continue;
      }

      if (matchesPattern(pathname, pattern)) {
        // Score by length without * (longer base => more specific)
        const score = pattern.replaceAll("*", "").length;
        if (!bestMatch || score > bestMatch.score) {
          bestMatch = { handler, score };
        }
      }
    }

    if (bestMatch) {
      return bestMatch.handler(req);
    }

    return next(req);
  };
}
