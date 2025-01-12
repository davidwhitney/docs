import generatePageFor from "./pageFactory.ts";
import getCategoryPages from "./_pages/Category.tsx";
import { populateItemNamespaces } from "./_util/common.ts";
import { getSymbols } from "./_dataSources/dtsSymbolSource.ts";
import webCategoryDocs from "./_categories/web-categories.json" with {
  type: "json",
};
import denoCategoryDocs from "./_categories/deno-categories.json" with {
  type: "json",
};
import { DocNode } from "@deno/doc/types";

export const layout = "raw.tsx";

const root = "/api";
const sections = [
  { name: "Deno APIs", path: "deno", categoryDocs: denoCategoryDocs },
  { name: "Web APIs", path: "web", categoryDocs: webCategoryDocs },
  { name: "Node APIs", path: "node", categoryDocs: undefined },
];

export const sidebar = [
  {
    items: sections.map((section) => ({
      label: section.name,
      id: `${root}/${section.path}/`,
    })),
  },
];

const generated: string[] = [];

export default async function* () {
  try {
    if (Deno.env.has("SKIP_REFERENCE")) {
      throw new Error();
    }

    const allSymbols = await getAllSymbols();

    for (const [packageName, symbols] of allSymbols.entries()) {
      const cleanedSymbols = populateItemNamespaces(symbols) as DocNode[];

      const currentCategoryList = sections.filter((x) =>
        x.path === packageName.toLocaleLowerCase()
      )[0]!.categoryDocs as Record<string, string | undefined>;

      const context = {
        root,
        packageName,
        symbols: cleanedSymbols,
        currentCategoryList: currentCategoryList,
      };

      for (const p of getCategoryPages(context)) {
        yield p;
        generated.push(p.url);
      }

      for (const item of cleanedSymbols) {
        const pages = generatePageFor(item, context);

        for await (const page of pages) {
          if (generated.includes(page.url)) {
            console.warn(`⚠️ Skipping duplicate page: ${page.url}!`);
            continue;
          }

          yield page;
          generated.push(page.url);
          console.log("Generated", page.url);
        }
      }
    }
  } catch (ex) {
    console.warn("⚠️ Reference docs were not generated." + ex);
  }

  console.log("Generated", generated.length, "reference pages");
}

async function getAllSymbols() {
  const allSymbols = new Map<string, DocNode[]>();
  for await (const { packageName, symbols } of getSymbols()) {
    // Group symbols by name
    const symbolsByName = new Map<string, DocNode[]>();

    for (const symbol of symbols) {
      const existing = symbolsByName.get(symbol.name) || [];
      symbolsByName.set(symbol.name, [...existing, symbol]);
    }

    // Merge symbols with same name
    const mergedSymbols = Array.from(symbolsByName.values()).map((items) => {
      if (items.length === 1) {
        return items[0];
      }

      // Sort by priority (class > interface > other)
      const sorted = items.sort((a, b) => {
        if (a.kind === "class") return -1;
        if (b.kind === "class") return 1;
        if (a.kind === "interface") return -1;
        if (b.kind === "interface") return 1;
        return 0;
      });

      // Merge docs if available
      const primary = sorted[0];
      const jsDoc = sorted
        .map((s) => s.jsDoc?.doc)
        .filter(Boolean)
        .join("\n\n");

      if (jsDoc) {
        primary.jsDoc = { ...primary.jsDoc, doc: jsDoc };
      }

      return primary;
    });

    allSymbols.set(packageName, mergedSymbols);
  }

  // TODO: merge symbols that share names here

  return allSymbols;
}
