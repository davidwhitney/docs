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
import { HasNamespace } from "./types.ts";
import { mergeSymbolsWithCollidingNames } from "./_util/symbolMerging.ts";

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
let skipped = 0;

export default async function* () {
  try {
    if (Deno.env.has("SKIP_REFERENCE")) {
      throw new Error();
    }

    const allSymbols = await getAllSymbols();

    for (const [packageName, symbols] of allSymbols.entries()) {
      const currentCategoryList = sections.filter((x) =>
        x.path === packageName.toLocaleLowerCase()
      )[0]!.categoryDocs as Record<string, string | undefined>;

      const context = {
        root,
        packageName,
        symbols,
        currentCategoryList: currentCategoryList,
      };

      for (const p of getCategoryPages(context)) {
        yield p;
        generated.push(p.url);
      }

      for (const item of symbols) {
        const pages = generatePageFor(item, context);

        for await (const page of pages) {
          if (generated.includes(page.url)) {
            console.warn(`⚠️ Skipping duplicate page: ${page.url}!`);
            skipped++;
            continue;
          }

          yield page;
          generated.push(page.url);
        }
      }
    }
  } catch (ex) {
    console.warn("⚠️ Reference docs were not generated." + ex);
  }

  console.log(
    "Generated",
    generated.length,
    "reference pages",
    skipped,
    "skipped",
  );
}

async function getAllSymbols() {
  const allSymbols = new Map<string, DocNode[]>();
  for await (const { packageName, symbols } of getSymbols()) {
    const cleanedSymbols = populateItemNamespaces(
      symbols,
    ) as (DocNode & HasNamespace)[];

    const symbolsByName = new Map<string, (DocNode & HasNamespace)[]>();

    for (const symbol of cleanedSymbols) {
      const existing = symbolsByName.get(symbol.fullName) || [];
      symbolsByName.set(symbol.name, [...existing, symbol]);
    }

    const mergedSymbols = mergeSymbolsWithCollidingNames(symbolsByName);

    allSymbols.set(packageName, mergedSymbols);
  }

  return allSymbols;
}
