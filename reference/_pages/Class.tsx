import React from "npm:@preact/compat";
import { DocNodeClass } from "@deno/doc/types";
import { HasFullName, LumeDocument, ReferenceContext } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { AnchorableHeading } from "./primatives/AnchorableHeading.tsx";
import {
  insertLinkCodes,
  linkCodeAndParagraph,
} from "./primatives/LinkCode.tsx";

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

  const description = linkCodeAndParagraph(data.jsDoc?.doc || "");

  const constructors = data.classDef.constructors.map((constructor) => {
    return (
      <MemberSection title="Constructors">
        <pre>
          {JSON.stringify(constructor, null, 2)}
        </pre>
      </MemberSection>
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
      <div id={"content"}>
        <main class={"symbolGroup"}>
          <article>
            <div>
              <div>
                <div className={"text-2xl leading-none break-all"}>
                  <span class="text-Class">class</span>
                  <span class="font-bold">
                    &nbsp;
                    {data.fullName}
                  </span>
                </div>
                <div className={"symbolSubtitle"}>
                  {isUnstable && <>UNSTABLE</>}
                </div>
              </div>
            </div>
            <div>
              <div className={"space-y-7"}>
                <section id={"methods"} className={"section"}>
                  <AnchorableHeading anchor="methods">
                    Methods
                  </AnchorableHeading>
                </section>
              </div>
            </div>

            <div className={"space-y-7"}>
              <div
                data-color-mode="auto"
                data-light-theme="light"
                data-dark-theme="dark"
                class="markdown-body"
              >
                {description && description}
              </div>
            </div>

            {constructors && constructors}

            <h2>Properties</h2>
            {properties && properties}

            <h2>Methods</h2>

            <h2>Static Methods</h2>
          </article>
        </main>
      </div>
    </ReferencePage>
  );
}

function MemberSection(
  { title, children }: { title: string; children: React.ReactNode },
) {
  return (
    <div>
      <div className={"space-y-7"}>
        <section id={title} className={"section"}>
          <AnchorableHeading anchor={title}>
            Methods
          </AnchorableHeading>
        </section>
      </div>

      <div className={"space-y-7"}>
        {children}
      </div>
    </div>
  );
}
