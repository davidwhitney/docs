import { RequestHandler } from "lume/core/server.ts";

const reference: Record<string, Record<string, any>> = {
  "deno": JSON.parse(Deno.readTextFileSync("./reference_gen/gen/deno.json")),
  "node": JSON.parse(Deno.readTextFileSync("./reference_gen/gen/node.json")),
  "web": JSON.parse(Deno.readTextFileSync("./reference_gen/gen/web.json")),
};

const handler: RequestHandler = (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const parts = url.pathname.split("/api2/");
  const requestedDoc = parts[1];

  const referenceFile = requestedDoc.split("/")[0];
  const everythingElse = requestedDoc.substring(referenceFile.length + 1);

  const lookupPath = "./" + everythingElse + ".json";
  const file = reference[referenceFile];
  const value = file[lookupPath];

  return Promise.resolve(
    new Response(JSON.stringify(value), {
      status: 200,
    }),
  );
};

export default handler;
