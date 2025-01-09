import React from "npm:@preact/compat";
import { DocNodeClass, TsTypeDef } from "@deno/doc/types";
import { HasFullName, LumeDocument, ReferenceContext } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { AnchorableHeading } from "./primatives/AnchorableHeading.tsx";
import { linkCodeAndParagraph } from "./primatives/LinkCode.tsx";

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
                <ClassNameHeading data={data} />
                <ImplementsSummary _implements={data.classDef.implements} />
                <StabilitySummary data={data} />
              </div>
            </div>
            <div>
              <Description data={data} />

              <div className={"space-y-7"}>
                <section id={"methods"} className={"section"}>
                  <AnchorableHeading anchor="methods">
                    Methods
                  </AnchorableHeading>
                </section>
              </div>
            </div>

            <Constructors data={data} />

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

function ClassNameHeading({ data }: { data: DocNodeClass & HasFullName }) {
  return (
    <div className={"text-2xl leading-none break-all"}>
      <span class="text-Class">class</span>
      <span class="font-bold">
        &nbsp;
        {data.fullName}
      </span>
    </div>
  );
}

function StabilitySummary({ data }: { data: DocNodeClass }) {
  const isUnstable = data.jsDoc?.tags?.some((tag) =>
    tag.kind === "experimental" as string
  );

  if (!isUnstable) {
    return null;
  }

  return (
    <div class="space-x-2 !mt-2">
      <div class="text-unstable border border-unstable/50 bg-unstable/5 inline-flex items-center gap-0.5 *:flex-none rounded-md leading-none font-bold py-2 px-3">
        Unstable
      </div>
    </div>
  );
}

function ImplementsSummary({ _implements }: { _implements: TsTypeDef[] }) {
  if (_implements.length === 0) {
    return null;
  }

  const spans = _implements.map((iface) => {
    return <span>{iface.repr}</span>;
  });

  return (
    <div class="symbolSubtitle">
      <div>
        <span class="type">implements</span>
        {spans}
      </div>
    </div>
  );
}

function Description({ data }: { data: DocNodeClass }) {
  const description = linkCodeAndParagraph(data.jsDoc?.doc || "") || [];
  if (description.length === 0) {
    return null;
  }

  return (
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
  );
}

function Constructors({ data }: { data: DocNodeClass }) {
  if (data.classDef.constructors.length === 0) {
    return <></>;
  }

  return (
    <MemberSection title="Constructors">
      <pre>
        {JSON.stringify(data.classDef.constructors, null, 2)}
      </pre>
    </MemberSection>
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
