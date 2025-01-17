import { DocNodeInterface, TsTypeDef } from "@deno/doc/types";
import { HasFullName, LumeDocument, ReferenceContext } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { NameHeading } from "./partials/NameHeading.tsx";
import { StabilitySummary } from "./partials/Badges.tsx";
import { TypeSummary } from "./primitives/TypeSummary.tsx";
import { nbsp } from "../_util/common.ts";
import { getSymbolDetails } from "./partials/SymbolDetails.tsx";

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
  const { details, contents } = getSymbolDetails(data);

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
            {details}
          </div>
        </article>
      </main>
      {contents}
    </ReferencePage>
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
