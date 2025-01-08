import React from "npm:@preact/compat";
import { ReferenceContext } from "../types.ts";

export default function Layout(
  { context, children }: {
    context: ReferenceContext;
    children: React.ReactNode;
  },
) {
  const categories = context.currentCategoryList;
  const categoryListItems = Object.entries(categories).map(([key, value]) => {
    const categoryLinkUrl =
      `${context.root}/${context.section.toLocaleLowerCase()}/${key.toLocaleLowerCase()}`;

    return (
      <li>
        <a href={categoryLinkUrl}>{key}</a>
      </li>
    );
  });

  return (
    <>
      {/* sorry mum, put these somewhere good */}
      <link rel="stylesheet" href="/reference-styles/styles.css" />
      <link rel="stylesheet" href="/reference-styles/page.css" />

      <div className={"ddoc"}>
        <div id={"categoryPanel"}>
          <ul>
            {categoryListItems}
          </ul>
        </div>
        <main>
          {children}
        </main>
      </div>
    </>
  );
}
