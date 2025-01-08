import ReferencePage from "../_layouts/ReferencePage.tsx";
import { flattenItems } from "../_util/common.ts";
import { LumeDocument, ReferenceContext } from "../types.ts";

type Props = {
  data: Record<string, string | undefined>;
  context: ReferenceContext;
};

export default function* getPages(
  item: Record<string, string | undefined>,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: context.section,
    url: `${context.root}/${context.section.toLocaleLowerCase()}/`,
    content: <CategoryHomePage data={item} context={context} />,
  };

  for (const [key] of Object.entries(item)) {
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
    <ReferencePage>
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

  const itemElements = itemsInThisCategory.map((item) => {
    return (
      <li>
        <a href={`~/${item.fullName || item.name}`}>
          {item.fullName || item.name}
        </a>
      </li>
    );
  });

  return (
    <ReferencePage>
      <h1>I am a category listing page {categoryName}</h1>
      <h2 className={"anchorable mb-1"}>Classes</h2>
      <div className={"namespaceSection"}>
        <ul>
          {classes.map((item) => (
            <li>
              <a href={`~/${item.fullName || item.name}`}>
                {item.fullName || item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <h2 className={"anchorable mb-1"}>Functions</h2>
      <ul>
        {functions.map((item) => (
          <li>
            <a href={`~/${item.fullName || item.name}`}>
              {item.fullName || item.name}
            </a>
          </li>
        ))}
      </ul>

      <h2 className={"anchorable mb-1"}>Interfaces</h2>
      <ul>
        {interfaces.map((item) => (
          <li>
            <a href={`~/${item.fullName || item.name}`}>
              {item.fullName || item.name}
            </a>
          </li>
        ))}
      </ul>

      <h2 className={"anchorable mb-1"}>Type Aliases</h2>
      <ul>
        {typeAliases.map((item) => (
          <li>
            <a href={`~/${item.fullName || item.name}`}>
              {item.fullName || item.name}
            </a>
          </li>
        ))}
      </ul>
    </ReferencePage>
  );
}
