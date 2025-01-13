import React from "npm:@preact/compat";
import { DocNodeNamespace } from "@deno/doc/types";
import { LumeDocument, ReferenceContext } from "../types.ts";
import generatePageFor from "../pageFactory.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { NameHeading } from "./primatives/NameHeading.tsx";
import { JsDocDescription } from "./primatives/JsDocDescription.tsx";
import {
  TableOfContents,
  TocListItem,
  TocSection,
} from "./primatives/TableOfContents.tsx";
import { AnchorableHeading } from "./primatives/AnchorableHeading.tsx";
import { SymbolSummaryItem } from "./primatives/SymbolSummaryItem.tsx";
import { sections } from "../_util/common.ts";

type Props = { data: DocNodeNamespace; context: ReferenceContext };

export default function* getPages(
  item: DocNodeNamespace,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  const url =
    `${context.root}/${context.packageName.toLocaleLowerCase()}/~/${item.name}`;
  console.log("Namespace url", url);

  yield {
    title: item.name,
    url: url,
    content: <Namespace data={item} context={context} />,
  };

  for (const element of item.namespaceDef.elements) {
    yield* generatePageFor(element, {
      ...context,
      symbols: item.namespaceDef.elements,
    });
  }
}

export function Namespace({ data, context }: Props) {
  const children = data.namespaceDef.elements.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <ReferencePage
      context={context}
      navigation={{
        category: context.packageName,
        currentItemName: data.name,
      }}
    >
      <main class={"symbolGroup"}>
        <article>
          <div>
            <div>
              <NameHeading fullName={data.name} headingType="Namespace" />
            </div>
          </div>
          <div>
            <JsDocDescription jsDoc={data.jsDoc} />
          </div>
        </article>
        {sections.map(([title, kind]) => {
          return (
            <MemberSection
              title={title}
              children={children.filter((x) => x.kind === kind).map((x) => {
                return <SymbolSummaryItem item={x} />;
              })}
            />
          );
        })}
      </main>
      <TableOfContents>
        <ul>
          {sections.map(([title, kind]) => {
            return (
              <TocSection title={title}>
                  {children.filter((x) => x.kind === kind).map((x) => {
                    return <TocListItem item={x} type={kind} />;
                  })}
              </TocSection>
            );
          })}
        </ul>
      </TableOfContents>
    </ReferencePage>
  );
}

function MemberSection(
  { title, children }: { title: string; children: React.ReactNode },
) {
  if (!children) {
    return null;
  }

  return (
    <div>
      <div className={"space-y-7"}>
        <section className={"section"}>
          <AnchorableHeading anchor={title}>
            {title}
          </AnchorableHeading>
        </section>
      </div>

      <div className={"space-y-7"}>
        {children}
      </div>
    </div>
  );
}
