import { DocNode, DocNodeBase } from "@deno/doc/types";
import { LumeDocument, ReferenceContext } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";

type Props = { data: DocNode, context: ReferenceContext };

export default function* getPages(
  item: DocNodeBase,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  // console.log(
  //   "Not implemented factory encountered",
  //   item.name,
  //   item.kind,
  //   item.location.filename,
  // );

  // console.log("Context", context);

  // yield {
  //   title: item.name,
  //   url: `/${context.root}/${context.section}/~/${item.name}.${item.kind}`,
  //   content: <NotImplemented data={item} />,
  // };
}

export function NotImplemented({ data, context }: Props) {
  return (
    <ReferencePage context={context}>
      I am not yet implemented, but I am supposed to represent:{" "}
      {JSON.stringify(data)}
    </ReferencePage>
  );
}
