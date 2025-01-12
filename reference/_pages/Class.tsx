import React from "npm:@preact/compat";
import {
  ClassMethodDef,
  ClassPropertyDef,
  DocNodeClass,
  JsDoc,
  TsTypeDef,
} from "@deno/doc/types";
import { HasFullName, LumeDocument, ReferenceContext } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { AnchorableHeading } from "./primatives/AnchorableHeading.tsx";
import { methodSignature } from "../_util/methodSignatureRendering.ts";
import { MarkdownContent } from "./primatives/MarkdownContent.tsx";
import { nbsp } from "../_util/common.ts";
import { TableOfContents, TocListItem } from "./primatives/TableOfContents.tsx";
import { PropertyName } from "./primatives/PropertyName.tsx";
import { MethodSignature } from "./primatives/MethodSignature.tsx";

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
  const instanceMethods = data.classDef.methods.filter((method) =>
    !method.isStatic
  );
  const staticMethods = data.classDef.methods.filter((method) =>
    method.isStatic
  );

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
                <ClassNameHeading fullName={data.fullName} />
                <ImplementsSummary typeDef={data.classDef.implements} />
                <StabilitySummary jsDoc={data.jsDoc} />
              </div>
            </div>
            <div>
              <Description jsDoc={data.jsDoc} />
              <Constructors data={data} />
              <Properties properties={data.classDef.properties} />
              <Methods methods={instanceMethods} />
              <Methods methods={staticMethods} label={"Static Methods"} />
            </div>
          </article>
        </main>
        <TableOfContents>
          <ul>
            <li>
              <a href="#properties" title="Properties">Properties</a>
            </li>
            <li>
              <ul>
                {data.classDef.properties.map((prop) => {
                  return <TocListItem item={prop} type="property" />;
                })}
              </ul>
            </li>
            <li>
              <a href="#methods" title="Methods">Methods</a>
            </li>
            <li>
              <ul>
                {instanceMethods.map((method) => {
                  return <TocListItem item={method} type="method" />;
                })}
              </ul>
            </li>
          </ul>
        </TableOfContents>
      </div>
    </ReferencePage>
  );
}

function ClassNameHeading({ fullName }: { fullName: string }) {
  return (
    <div className={"text-2xl leading-none break-all"}>
      <span class="text-Class">class</span>
      <span class="font-bold">
        {nbsp}
        {fullName}
      </span>
    </div>
  );
}

function StabilitySummary({ jsDoc }: { jsDoc: JsDoc | undefined }) {
  const isUnstable = jsDoc?.tags?.some((tag) =>
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

function ImplementsSummary({ typeDef }: { typeDef: TsTypeDef[] }) {
  if (typeDef.length === 0) {
    return null;
  }

  const spans = typeDef.map((iface) => {
    return <span>{iface.repr}</span>;
  });

  return (
    <div class="symbolSubtitle">
      <div>
        <span class="type">implements{nbsp}</span>
        {spans}
      </div>
    </div>
  );
}

function Description({ jsDoc }: { jsDoc: JsDoc | undefined }) {
  if (!jsDoc?.doc) {
    return null;
  }

  return (
    <DetailedSection>
      <MarkdownContent text={jsDoc?.doc || ""} />
    </DetailedSection>
  );
}

function Methods(
  { methods, label = "Methods" }: { methods: ClassMethodDef[]; label?: string },
) {
  if (methods.length === 0) {
    return <></>;
  }

  const items = methods.map((method) => {
    return (
      <div>
        <div>
          <MethodSignature method={method} />
        </div>
        <DetailedSection>
          <MarkdownContent text={method.jsDoc?.doc || ""} />
        </DetailedSection>
      </div>
    );
  });

  return (
    <MemberSection title={label}>
      {items}
    </MemberSection>
  );
}

function Properties({ properties }: { properties: ClassPropertyDef[] }) {
  if (properties.length === 0) {
    return <></>;
  }

  return (
    <MemberSection title="Properties">
      {properties.map((prop) => <PropertyItem property={prop} />)}
    </MemberSection>
  );
}

function PropertyItem({ property }: { property: ClassPropertyDef }) {
  return (
    <div>
      <h3>
        <PropertyName property={property} />
      </h3>
      <DetailedSection>
        <MarkdownContent text={property.jsDoc?.doc} />
      </DetailedSection>
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

function DetailedSection({ children }: { children: React.ReactNode }) {
  return (
    <div class="max-w-[75ch]">
      <div
        data-color-mode="auto"
        data-light-theme="light"
        data-dark-theme="dark"
        class="markdown-body"
      >
        {children}
      </div>
    </div>
  );
}

function MemberSection(
  { title, children }: { title: string; children: React.ReactNode },
) {
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
