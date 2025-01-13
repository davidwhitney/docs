import {
  DocNodeInterface,
  InterfaceDef,
  InterfaceMethodDef,
  InterfacePropertyDef,
  TsTypeDef,
} from "@deno/doc/types";
import { HasFullName, LumeDocument, ReferenceContext } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { MarkdownContent } from "./primitives/MarkdownContent.tsx";
import {
  TableOfContents,
  TocListItem,
  TocSection,
} from "./partials/TableOfContents.tsx";
import { PropertyName } from "./primitives/PropertyName.tsx";
import { NameHeading } from "./partials/NameHeading.tsx";
import { StabilitySummary } from "./partials/StabilitySummary.tsx";
import { JsDocDescription } from "./partials/JsDocDescription.tsx";
import { DetailedSection } from "./partials/DetailedSection.tsx";
import { InterfaceMethodSignature } from "./primitives/InterfaceMethodSignature.tsx";
import { TypeSummary } from "./primitives/TypeSummary.tsx";
import { nbsp } from "../_util/common.ts";
import { MemberSection } from "./partials/MemberSection.tsx";

type Props = {
  data: DocNodeInterface & HasFullName;
  context: ReferenceContext;
};

export default function* getPages(
  item: DocNodeInterface & HasFullName,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/~/${item.fullName}`,
    content: <Interface data={item} context={context} />,
  };
}

export function Interface({ data, context }: Props) {
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
              <NameHeading fullName={data.fullName} headingType="Interface" />
              <ExtendsSummary typeDef={data.interfaceDef.extends} />
              <StabilitySummary jsDoc={data.jsDoc} />
            </div>
          </div>
          <div>
            <JsDocDescription jsDoc={data.jsDoc} />
            <Properties properties={data.interfaceDef.properties} />
            <Methods iface={data.interfaceDef} />
          </div>
        </article>
      </main>
      <TableOfContents>
        <ul>
          <TocSection title="Properties">
            {data.interfaceDef.properties.map((prop) => {
              return <TocListItem item={prop} type="property" />;
            })}
          </TocSection>
          <TocSection title="Methods">
            {data.interfaceDef.methods.map((method) => {
              return <TocListItem item={method} type="method" />;
            })}
          </TocSection>
        </ul>
      </TableOfContents>
    </ReferencePage>
  );
}

function Methods({ iface }: { iface: InterfaceDef }) {
  if (iface.methods.length === 0) {
    return <></>;
  }

  return (
    <MemberSection title={"Methods"}>
      {iface.methods.map((item) => {
        return <MethodSummary method={item} />;
      })}
    </MemberSection>
  );
}

function MethodSummary({ method }: { method: InterfaceMethodDef }) {
  return (
    <div>
      <div>
        <InterfaceMethodSignature method={method} />
      </div>
      <DetailedSection>
        <MarkdownContent text={method.jsDoc?.doc || ""} />
      </DetailedSection>
    </div>
  );
}

function Properties({ properties }: { properties: InterfacePropertyDef[] }) {
  if (properties.length === 0) {
    return <></>;
  }

  return (
    <MemberSection title="Properties">
      {properties.map((prop) => <PropertyItem property={prop} />)}
    </MemberSection>
  );
}

function PropertyItem({ property }: { property: InterfacePropertyDef }) {
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

function ExtendsSummary({ typeDef }: { typeDef: TsTypeDef[] }) {
  if (typeDef.length === 0) {
    return null;
  }

  const spans = typeDef.map((iface) => {
    return <TypeSummary typeDef={iface} />;
  });

  if (spans.length === 0) {
    return null;
  }

  return (
    <div class="symbolSubtitle">
      <div>
        <span class="type">extends{nbsp}</span>
        {spans}
      </div>
    </div>
  );
}
