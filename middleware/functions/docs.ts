import { RequestHandler } from "lume/core/server.ts";

const handler: RequestHandler = (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const pathname = url.pathname;
  console.log("API Docs requested for:", pathname);

  return Promise.resolve(new Response("OK ok ok" + pathname, { status: 200 }));
};

export default handler;
