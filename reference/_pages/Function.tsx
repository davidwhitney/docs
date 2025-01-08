import { DocNodeFunction, DocNodeImport } from "@deno/doc/types";
import { LumeDocument, ReferenceContext } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";

type Props = { data: DocNodeFunction, context: ReferenceContext };

export default function* getPages(
  item: DocNodeFunction,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  const prefix = context.parentName ? `${context.parentName}.` : "";

  yield {
    title: item.name,
    url:
      `${context.root}/${context.section.toLocaleLowerCase()}/~/${prefix}${item.name}`,
    content: <Function data={item} context={context} />,
  };
}

export function Function({ data, context }: Props) {
  return (
    <ReferencePage context={context}>
      I am a function, my name is {data.name}

      {data.jsDoc?.doc && <p>{data.jsDoc?.doc}</p>}

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </ReferencePage>
  );
}
