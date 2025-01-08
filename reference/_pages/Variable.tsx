import { DocNodeVariable } from "@deno/doc/types";
import { LumeDocument, ReferenceContext } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";

type Props = { data: DocNodeVariable; context: ReferenceContext };

export default function* getPages(
  item: DocNodeVariable,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  const prefix = context.parentName ? `${context.parentName}.prototype.` : "";
  yield {
    title: item.name,
    url:
      `${context.root}/${context.section.toLocaleLowerCase()}/~/${prefix}${item.name}`,
    content: <Variable data={item} context={context} />,
  };
}

export function Variable({ data, context }: Props) {
  return (
    <ReferencePage context={context}>
      I am a variable, my name is {data.name}

      {data.jsDoc?.doc && <p>{data.jsDoc?.doc}</p>}

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </ReferencePage>
  );
}
