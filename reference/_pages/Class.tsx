import React from "npm:@preact/compat";
import {
  ClassMethodDef,
  ClassPropertyDef,
  DocNodeClass,
} from "@deno/doc/types";
import { HasFullName, LumeDocument, ReferenceContext } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { AnchorableHeading } from "./partials/AnchorableHeading.tsx";
import { MarkdownContent } from "./primitives/MarkdownContent.tsx";
import {
  TableOfContents,
  TocListItem,
  TocSection,
} from "./partials/TableOfContents.tsx";
import { PropertyName } from "./primitives/PropertyName.tsx";
import { MethodSignature } from "./primitives/MethodSignature.tsx";
import { NameHeading } from "./partials/NameHeading.tsx";
import { StabilitySummary } from "./partials/StabilitySummary.tsx";
import { ImplementsSummary } from "./partials/ImplementsSummary.tsx";
import { JsDocDescription } from "./partials/JsDocDescription.tsx";
import { DetailedSection } from "./partials/DetailedSection.tsx";
import { MemberSection } from "./partials/MemberSection.tsx";

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
        <main class={"symbolGroup"}>
          <article>
            <div>
              <div>
                <NameHeading fullName={data.fullName} headingType="Class" />
                <ImplementsSummary typeDef={data.classDef.implements} />
                <StabilitySummary jsDoc={data.jsDoc} />
              </div>
            </div>
            <div>
              <JsDocDescription jsDoc={data.jsDoc} />
              <Constructors data={data} />
              <Properties properties={data.classDef.properties} />
              <Methods methods={instanceMethods} />
              <Methods methods={staticMethods} label={"Static Methods"} />
            </div>
          </article>
        </main>
        <TableOfContents>
          <ul>
            <TocSection title="Properties">
              {data.classDef.properties.map((prop) => {
                return <TocListItem item={prop} type="property" />;
              })}
            </TocSection>
            <TocSection title="Methods">
              {instanceMethods.map((method) => {
                return <TocListItem item={method} type="method" />;
              })}
            </TocSection>
          </ul>
        </TableOfContents>
    </ReferencePage>
  );
}

function Methods(
  { methods, label = "Methods" }: { methods: ClassMethodDef[]; label?: string },
) {
  if (methods.length === 0) {
    return <></>;
  }

  return (
    <MemberSection title={label}>
      {methods.map((method) => {
        return <MethodSummary method={method} />;
      })}
    </MemberSection>
  );
}

function MethodSummary({ method }: { method: ClassMethodDef }) {
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
