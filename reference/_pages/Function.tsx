import { DocNodeFunction } from "@deno/doc/types";
import { HasFullName, LumeDocument, ReferenceContext } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { NameHeading } from "./primatives/NameHeading.tsx";
import { StabilitySummary } from "./primatives/StabilitySummary.tsx";
import { JsDocDescription } from "./primatives/JsDocDescription.tsx";
import { FunctionSignature } from "./primatives/FunctionSignature.tsx";

type Props = { data: DocNodeFunction & HasFullName; context: ReferenceContext };

export default function* getPages(
  item: DocNodeFunction & HasFullName,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/~/${item.fullName}`,
    content: <Function data={item} context={context} />,
  };
}

export function Function({ data, context }: Props) {
  console.log(data);

  const nameOnly = data.fullName.split(".").pop();

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
                <NameHeading fullName={data.fullName} headingType="Function" />
                <StabilitySummary jsDoc={data.jsDoc} />
              </div>
            </div>{" "}
            <div>
              <FunctionSignature
                functionDef={data.functionDef}
                nameOverride={nameOnly}
              />
            </div>
            <div>
              <JsDocDescription jsDoc={data.jsDoc} />
            </div>
          </article>
        </main>
      </div>
    </ReferencePage>
  );

  // return (
  //   <ReferencePage
  //     context={context}
  //     navigation={{ category: context.packageName, currentItemName: data.name }}
  //   >
  //     I am a function, my name is {data.name}

  //     {data.jsDoc?.doc && <p>{data.jsDoc?.doc}</p>}

  //     <pre>
  //       {JSON.stringify(data, null, 2)}
  //     </pre>
  //   </ReferencePage>
  // );
}
