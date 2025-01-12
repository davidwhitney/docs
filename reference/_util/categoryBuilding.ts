import { DocNode, JsDocTagDoc } from "@deno/doc/types";

export function parseCategories(symbols: DocNode[], categoryDescriptionMap: Record<string, string | undefined>): Map<string, string> {
    const allCategoriesFromJsDocTags = symbols.map((item) =>
        item.jsDoc?.tags?.filter((tag) => tag.kind === "category")
    ).flat() as JsDocTagDoc[];

    const uniqueCategories = Array.from(
        new Set(allCategoriesFromJsDocTags.map((tag) => tag.doc)),
    ).sort();

    const categoriesWithDescriptions = new Map<string, string>();
    uniqueCategories.forEach((category) => {
        if (!category) {
            return;
        }

        const description = categoryDescriptionMap[category] || "";
        categoriesWithDescriptions.set(category, description);
    });

    return categoriesWithDescriptions;
}

export function categoryDataFrom(sections: { path: string, categoryDocs: any }[], packageName: string): Record<string, string | undefined> {
    const categoryDescriptions = sections.filter((x) =>
        x.path === packageName.toLocaleLowerCase()
    )[0]!.categoryDocs as Record<string, string | undefined>;

    return categoryDescriptions;
}