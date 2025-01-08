import { DocNodeClass } from "@deno/doc/types";
import { LumeDocument, ReferenceContext } from "../types.ts";
import factoryFor from "../pageFactory.ts";

type Props = { data: DocNodeClass; context: ReferenceContext };

export default function* getPages(
  item: DocNodeClass,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  const prefix = context.parentName ? `${context.parentName}.` : "";

  yield {
    title: item.name,
    url: `${context.root}/${context.section}/~/${prefix}${item.name}`,
    content: <Class data={item} context={context} />,
  };
}

export function Class({ data, context }: Props) {
  const fullName = context.parentName
    ? `${context.parentName}.${data.name}`
    : data.name;

  const isUnstable = data.jsDoc?.tags?.some((tag) =>
    tag.kind === "experimental" as string
  );

  const jsDocParagraphs = data.jsDoc?.doc?.split("\n\n").map((paragraph) => (
    <p>{paragraph}</p>
  ));

  const constructors = data.classDef.constructors.map((constructor) => {
    return (
      <div>
        <h3>Constructor</h3>
        <pre>
          {JSON.stringify(constructor, null, 2)}
        </pre>
      </div>
    );
  });

  return (
    <div>
      <h1>Class: {fullName}</h1>
      {isUnstable && <p>UNSTABLE</p>}
      {jsDocParagraphs && jsDocParagraphs}

      <h2>Constructors</h2>
      {constructors && constructors}

      <h2>Properties</h2>

      <h2>Methods</h2>

      <h2>Static Methods</h2>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
