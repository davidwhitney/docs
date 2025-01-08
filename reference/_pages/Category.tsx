import { DocNodeBase, DocNodeClass } from "@deno/doc/types";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { flattenItems } from "../_util/common.ts";
import {
  HasNamespace,
  LumeDocument,
  MightHaveNamespace,
  ReferenceContext,
} from "../types.ts";

type Props = {
  data: Record<string, string | undefined>;
  context: ReferenceContext;
};

export default function* getPages(
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: context.section,
    url: `${context.root}/${context.section.toLocaleLowerCase()}/`,
    content: (
      <CategoryHomePage data={context.currentCategoryList} context={context} />
    ),
  };

  for (const [key] of Object.entries(context.currentCategoryList)) {
    yield {
      title: key,
      url:
        `${context.root}/${context.section.toLocaleLowerCase()}/${key.toLocaleLowerCase()}`,
      content: <SingleCategoryView categoryName={key} context={context} />,
    };
  }
}

export function CategoryHomePage({ data, context }: Props) {
  const categoryListItems = Object.entries(data).map(([key, value]) => {
    const categoryLinkUrl =
      `${context.root}/${context.section.toLocaleLowerCase()}/${key.toLocaleLowerCase()}`;

    return (
      <li>
        <a href={categoryLinkUrl}>{key}</a>
        <p>{value}</p>
      </li>
    );
  });

  return (
    <ReferencePage context={context}>
      <div>
        <h1>I am a category: {data.name}</h1>
        <ul>
          {categoryListItems}
        </ul>
      </div>
    </ReferencePage>
  );
}

type ListingProps = {
  categoryName: string;
  context: ReferenceContext;
};

export function SingleCategoryView({ categoryName, context }: ListingProps) {
  const allItems = flattenItems(context.dataCollection);

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
      navigation={{ category: context.section, currentItemName: categoryName }}
    >
      <main>
        <div className={"space-y-7"}>
          <section id={"Classes"} className={"section"}>
            <h2 className={"anchorable mb-1"}>Classes</h2>
          </section>
          <div className={"namespaceSection"}>
            <CategoryPageList items={classes} />
          </div>
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
  return (
    <section>
      <h2>{title}</h2>
      <CategoryPageList items={items} />
    </section>
  );
}

function CategoryPageList({ items }: { items: DocNodeBase[] }) {
  return (
    <ul className={"anchorable mb-1"}>
      {items.map((item) => (
        <li>
          <CategoryPageListItem item={item} />
        </li>
      ))}
    </ul>
  );
}

function CategoryPageListItem(
  { item }: { item: DocNodeBase & MightHaveNamespace },
) {
  return (
    <li>
      <a href={`~/${item.fullName || item.name}`}>
        <ItemName item={item} />
      </a>
      <p>
        {item.jsDoc?.doc || ""}
      </p>
      <p>
        <pre>
          {JSON.stringify(item, null, 2)}
        </pre>
      </p>
      <MethodLinks item={item} />
    </li>
  );
}

function ItemName({ item }: { item: DocNodeBase & MightHaveNamespace }) {
  return <>{item.fullName || item.name}</>;
}

function MethodLinks({ item }: { item: DocNodeBase }) {
  if (item.kind !== "class") {
    return <></>;
  }

  const asClass = item as DocNodeClass & HasNamespace;
  const methods = asClass.classDef.methods;
  const methodLinks = methods.map((method) => {
    return (
      <>
        <span>
          <a href={`~/${asClass.fullName}.${method.name}`}>
            {method.name}
          </a>
        </span>
        &nbsp;
      </>
    );
  });

  return (
    <p>
      {methodLinks}
    </p>
  );
}
