import type { RequestHandler } from "lume/core/server.ts";
import healthRequestHandler from "./health.ts";
import feedbackRequestHandler from "./feedback.ts";
import apiDocsRequestHandler from "./docs.ts";

export default {
  "/_api/health": healthRequestHandler,
  "/_api/send-feedback": feedbackRequestHandler,
  "/api2/*": apiDocsRequestHandler,
} satisfies Record<string, RequestHandler>;
