import { DocNodeBase, DocNodeClass } from "@deno/doc/types";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { flattenItems } from "../_util/common.ts";
import { LumeDocument, ReferenceContext } from "../types.ts";
import { AnchorableHeading } from "./primatives/AnchorableHeading.tsx";
import { Package } from "./Package.tsx";
import { SymbolSummaryItem } from "./primatives/SymbolSummaryItem.tsx";

export default function* getPages(
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: context.packageName,
    url: `${context.root}/${context.packageName.toLocaleLowerCase()}/`,
    content: <Package data={context.currentCategoryList} context={context} />,
  };

  for (const [key] of context.currentCategoryList) {
    yield {
      title: key,
      url:
        `${context.root}/${context.packageName.toLocaleLowerCase()}/${key.toLocaleLowerCase()}`,
      content: <CategoryBrowse categoryName={key} context={context} />,
    };
  }
}

type ListingProps = {
  categoryName: string;
  context: ReferenceContext;
};

export function CategoryBrowse({ categoryName, context }: ListingProps) {
  const allItems = flattenItems(context.symbols);

  const itemsInThisCategory = allItems.filter((item) =>
    item.jsDoc?.tags?.some((tag) =>
      tag.kind === "category" &&
      tag.doc.toLocaleLowerCase() === categoryName?.toLocaleLowerCase()
    )
  );

  const classes = itemsInThisCategory.filter((item) => item.kind === "class")
    .sort((a, b) => a.name.localeCompare(b.name));

  const functions = itemsInThisCategory.filter((item) =>
    item.kind === "function"
  ).sort((a, b) => a.name.localeCompare(b.name));

  const interfaces = itemsInThisCategory.filter((item) =>
    item.kind === "interface"
  ).sort((a, b) => a.name.localeCompare(b.name));

  const typeAliases = itemsInThisCategory.filter((item) =>
    item.kind === "typeAlias"
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ReferencePage
      context={context}
      navigation={{
        category: context.packageName,
        currentItemName: categoryName,
      }}
    >
      <main>
        <div className={"space-y-7"}>
          <CategoryPageSection title={"Classes"} items={classes} />
          <CategoryPageSection title={"Functions"} items={functions} />
          <CategoryPageSection title={"Interfaces"} items={interfaces} />
          <CategoryPageSection title={"Type Aliases"} items={typeAliases} />
        </div>
      </main>
    </ReferencePage>
  );
}

function CategoryPageSection(
  { title, items }: { title: string; items: DocNodeBase[] },
) {
  if (items.length === 0) {
    return null;
  }

  const anchorId = title.replace(" ", "-").toLocaleLowerCase();
  return (
    <section id={anchorId} className={"section"}>
      <AnchorableHeading anchor={anchorId}>{title}</AnchorableHeading>
      <div className={"namespaceSection"}>
        {items.map((item) => <SymbolSummaryItem item={item} />)}
      </div>
    </section>
  );
}
