import { DocNode, DocNodeModuleDoc } from "@deno/doc/types";
import { LumeDocument, ReferenceContext } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";

type Props = { data: DocNode, context: ReferenceContext };

export default function* getPages(
  item: DocNodeModuleDoc,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.section.toLocaleLowerCase()}/${item.name.toLocaleLowerCase()}`,
    content: <Module data={item} context={context} />,
  };

  console.log("Module found", item);
}

export function Module({ data, context }: Props) {
  return (
    <ReferencePage context={context}>
      I am a module, my name is {data.name}

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </ReferencePage>
  );
}
