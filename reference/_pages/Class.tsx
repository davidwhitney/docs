import { DocNodeClass } from "@deno/doc/types";
import { HasFullName, LumeDocument, ReferenceContext } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";

type Props = { data: DocNodeClass & HasFullName; context: ReferenceContext };

export default function* getPages(
  item: DocNodeClass & HasFullName,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/~/${item.fullName}`,
    content: <Class data={item} context={context} />,
  };
}

export function Class({ data, context }: Props) {
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

  const properties = data.classDef.properties.map((property) => {
    return (
      <div>
        <h3>{property.name}</h3>
      </div>
    );
  });

  return (
    <ReferencePage
      context={context}
      navigation={{
        category: context.packageName,
        currentItemName: data.fullName,
      }}
    >
      <h1>Class: {data.fullName}</h1>
      {isUnstable && <p>UNSTABLE</p>}
      {jsDocParagraphs && jsDocParagraphs}

      <h2>Constructors</h2>
      {constructors && constructors}

      <h2>Properties</h2>
      {properties && properties}

      <h2>Methods</h2>

      <h2>Static Methods</h2>

      <pre>
        {JSON.stringify(data, null, 2)}
      </pre>
    </ReferencePage>
  );
}
