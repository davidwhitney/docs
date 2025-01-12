import ReferencePage from "../_layouts/ReferencePage.tsx";
import { ReferenceContext } from "../types.ts";
import { AnchorableHeading } from "./primatives/AnchorableHeading.tsx";
import { linkCodeAndParagraph } from "./primatives/LinkCode.tsx";

type Props = {
  data: Map<string, string>;
  context: ReferenceContext;
};

export function Package({ data, context }: Props) {
  const categoryElements = data.entries().map(
    ([key, value]) => {
      return (
        <CategoryListSection
          title={key}
          href={`${context.root}/${context.packageName.toLocaleLowerCase()}/${key.toLocaleLowerCase()}`}
          summary={value || ""}
        />
      );
    },
  ).toArray();

  return (
    <ReferencePage
      context={context}
      navigation={{
        category: context.packageName,
        currentItemName: "",
      }}
    >
      <main>
        <section>
          <div class="space-y-2 flex-1 ">
            <div class="space-y-7" id="module_doc"></div>
          </div>
        </section>
        <div className={"space-y-7"}>
          {categoryElements}
        </div>
      </main>
    </ReferencePage>
  );
}

function CategoryListSection(
  { title, href, summary }: { title: string; href: string; summary: string },
) {
  const anchorId = title.replace(" ", "-").toLocaleLowerCase();
  const processedDescription = linkCodeAndParagraph(summary);

  return (
    <section id={anchorId} className={"section"}>
      <AnchorableHeading anchor={anchorId}>
        <a href={href}>{title}</a>
      </AnchorableHeading>
      <div
        data-color-mode="auto"
        data-light-theme="light"
        data-dark-theme="dark"
        class="markdown-body"
      >
        {processedDescription}
      </div>
    </section>
  );
}
