import React from "npm:@preact/compat";

export function TableOfContents({ children }: { children: React.ReactNode }) {
  return (
    <div class="toc">
      <div>
        <nav class="documentNavigation">
          <h3>Document Navigation</h3>
          {children}
        </nav>
      </div>
    </div>
  );
}

export function TocListItem(
  { item, type }: { item: { name: string }; type: "property" | "method" },
) {
  return (
    <li>
      <a href={`#${type}_${item.name}`} title={item.name}>
        {item.name}
      </a>
    </li>
  );
}
