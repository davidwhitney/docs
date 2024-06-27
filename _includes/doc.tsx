import Searcher from "lume/core/searcher.ts";
import {
  Sidebar as Sidebar_,
  SidebarCategory as SidebarCategory_,
  SidebarDoc as SidebarDoc_,
  SidebarLink as SidebarLink_,
  SidebarSection as SidebarSection_,
  TableOfContentsItem as TableOfContentsItem_,
} from "../types.ts";

export const layout = "layout.tsx";

export default function Page(props: Lume.Data, helpers: Lume.Helpers) {
  const sidebar = props.sidebar as Sidebar_;
  if (sidebar === undefined) {
    throw new Error("Missing sidebar for " + props.url);
  }
  return (
    <>
      <aside
        class="lg:block absolute top-0 lg:top-12 bottom-0 -left-74 lg:left-0 sidebar-open:left-0 w-74 border-r border-gray-200 bg-white z-50 lg:z-0 transition-all"
        id="sidebar"
        data-open="false"
      >
        <div class="lg:hidden p-4 shadow-sm flex justify-between h-16">
          <a class="flex items-center gap-3 mr-6" href="/">
            <div class="block size-6">
              <img src="/img/logo.svg" alt="Deno Docs" />
            </div>
            <b class="text-xl">Docs</b>
          </a>
          <button
            type="button"
            aria-label="Close navigation bar"
            id="sidebar-close"
          >
            <svg
              viewBox="0 0 15 15"
              width="21"
              height="21"
              class="text-gray-600"
            >
              <g stroke="currentColor" stroke-width="1.2">
                <path d="M.75.75l13.5 13.5M14.25.75L.75 14.25"></path>
              </g>
            </svg>
          </button>
        </div>
        <Sidebar sidebar={sidebar} search={props.search} url={props.url} />
      </aside>
      <div
        class="absolute inset-0 backdrop-brightness-50 z-40 hidden sidebar-open:block sidebar-open:lg:hidden"
        id="sidebar-cover"
        data-open="false"
      >
      </div>
      <div
        class="absolute top-12 bottom-0 left-0 right-0 lg:left-74 overflow-y-auto"
        style={{ scrollbarGutter: "stable" }}
      >
        <main class="mx-auto max-w-screen-xl w-full overflow-x-hidden pt-4 pb-8 flex flex-grow">
          <div class="flex-grow px-4 sm:px-8 max-w-full lg:max-w-[75%]">
            <article class="max-w-[66ch]">
              <Breadcrumbs
                title={props.title!}
                sidebar={sidebar}
                url={props.url}
                sectionTitle={props.sectionTitle!}
                sectionHref={props.sectionHref!}
              />
              <details class="block lg:hidden my-4 bg-gray-100 rounded-md group">
                <summary class="px-3 py-1.5 group-open:border-b border-gray-300">
                  On this page
                </summary>

                <ul class="pl-1 py-1.5">
                  {(props.toc as TableOfContentsItem_[]).map((item) => (
                    <TableOfContentsItemMobile item={item} />
                  ))}
                </ul>
              </details>

              <div class="markdown-body mt-8">
                <h1
                  dangerouslySetInnerHTML={{
                    __html: helpers.md(props.title!, true),
                  }}
                >
                </h1>
                {props.available_since && (
                  <div class="bg-gray-200 rounded-md text-sm py-3 px-4 mb-4 font-semibold">
                    Available since {props.available_since}
                  </div>
                )}
                {props.children}
              </div>
            </article>
          </div>
          <div
            style={{ "flexBasis": "25%" }}
            class="hidden lg:block flex-shrink-0 flex-grow-0 px-8 pb-8"
          >
            <div>
              <div class="sticky top-0 ">
                <ul class="border-l border-gray-200 pl-2">
                  {(props.toc as TableOfContentsItem_[]).map((item) => (
                    <TableOfContentsItem item={item} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </main>
        <props.comp.Footer />
      </div>
    </>
  );
}

function Breadcrumbs(
  props: {
    title: string;
    sidebar: Sidebar_;
    url: string;
    sectionTitle: string;
    sectionHref: string;
  },
) {
  const crumbs = [];
  outer: for (const section of props.sidebar) {
    for (const item of section.items) {
      if (typeof item === "string") {
        if (item === props.url) break outer;
      } else if ("items" in item) {
        crumbs.push(item.label);
        for (const subitem of item.items) {
          if (typeof subitem === "string") {
            if (subitem === props.url) break outer;
          } else if (subitem.id === props.url) {
            break outer;
          }
        }
        crumbs.pop();
      } else if ("id" in item && item.id === props.url) {
        break outer;
      }
    }
  }

  crumbs.push(props.title);

  return (
    <nav class="mb-3">
      <ul class="flex flex-wrap items-center">
        <li class="pr-3 py-1.5 underline underline-offset-4 hover:no-underline hover:text-blue-600 transition duration-100">
          <a href={props.sectionHref}>{props.sectionTitle}</a>
        </li>
        <svg
          class="size-6 rotate-90 -m-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            fill="rgba(0,0,0,0.5)"
            d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
          />
        </svg>
        {crumbs.map((crumb, i) => (
          <>
            <li class="px-2.5 py-1.5">
              {crumb}
            </li>
            {i < crumbs.length - 1 && (
              <svg
                class="size-6 rotate-90"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  fill="rgba(0,0,0,0.5)"
                  d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
                >
                </path>
              </svg>
            )}
          </>
        ))}
      </ul>
    </nav>
  );
}

function TableOfContentsItem(props: { item: TableOfContentsItem_ }) {
  return (
    <li class="m-2 leading-4">
      <a
        href={`#${props.item.slug}`}
        class="text-[13px] text-gray-600 hover:text-indigo-600 transition-colors duration-200 ease-in-out select-none"
      >
        {props.item.text}
      </a>
      {props.item.children.length > 0 && (
        <ul class="ml-2">
          {props.item.children.map((item) => (
            <TableOfContentsItem item={item} />
          ))}
        </ul>
      )}
    </li>
  );
}

function TableOfContentsItemMobile(props: { item: TableOfContentsItem_ }) {
  return (
    <li class="my-1.5 mx-3 leading-4">
      <a
        href={`#${props.item.slug}`}
        class="text-base text-gray-600 hover:text-indigo-600 transition-colors duration-200 ease-in-out select-none"
      >
        {props.item.text}
      </a>
      {props.item.children.length > 0 && (
        <ul class="ml-2">
          {props.item.children.map((item) => (
            <TableOfContentsItemMobile item={item} />
          ))}
        </ul>
      )}
    </li>
  );
}

function Sidebar(props: { sidebar: Sidebar_; search: Searcher; url: string }) {
  return (
    <nav
      class="pt-2 p-2 pr-0 overflow-y-auto h-[calc(100%-4rem)]"
      style={{ scrollbarGutter: "stable", scrollbarWidth: "thin" }}
    >
      <ul>
        {props.sidebar.map((section) => (
          <SidebarSection
            section={section}
            search={props.search}
            url={props.url}
          />
        ))}
      </ul>
    </nav>
  );
}

function SidebarSection(
  props: { section: SidebarSection_; search: Searcher; url: string },
) {
  return (
    <li class="mb-4">
      <h3 class="border-b border-gray-200 uppercase pt-2 pb-0.5 mx-3 my-4 text-xs font-semibold text-gray-3">
        {props.section.title}
      </h3>
      <ul>
        {props.section.items.map((item) => (
          <li class="mx-3 mt-1">
            {typeof item === "object" && "items" in item
              ? (
                <SidebarCategory
                  item={item}
                  url={props.url}
                  search={props.search}
                />
              )
              : (
                <SidebarItem
                  item={item}
                  search={props.search}
                  url={props.url}
                />
              )}
          </li>
        ))}
      </ul>
    </li>
  );
}

const LINK_CLASS =
  "block px-3 py-1.5 text-[.8125rem] leading-4 font-semibold text-gray-500 rounded-md hover:bg-pink-100 current:bg-gray-100 current:text-indigo-600/70 transition-colors duration-200 ease-in-out select-none";

function SidebarItem(props: {
  item: string | SidebarDoc_ | SidebarLink_;
  search: Searcher;
  url: string;
}) {
  let item: SidebarDoc_ | SidebarLink_;
  if (typeof props.item === "string") {
    const data = props.search.data(props.item)!;
    if (!data) {
      throw new Error(`No data found for ${props.item}`);
    }
    item = {
      label: data.sidebar_title ?? data.title!,
      id: data.url!,
    };
  } else {
    item = props.item;
  }

  return (
    <li class="mx-3 mt-1">
      <a
        class={LINK_CLASS}
        href={"id" in item ? item.id : "href" in item ? item.href : undefined}
        aria-current={("id" in item && item.id === props.url)
          ? "page"
          : undefined}
      >
        {item.label}
      </a>
    </li>
  );
}

function SidebarCategory(props: {
  item: SidebarCategory_;
  search: Searcher;
  url: string;
}) {
  const containsCurrent = props.item.items.some((item) => {
    if (typeof item === "string") {
      return item === props.url;
    }
    return item.id === props.url;
  });

  return (
    <>
      <div
        class={LINK_CLASS + " flex justify-between items-center" +
          (containsCurrent ? " text-indigo-600/70" : "")}
        data-accordion-trigger
      >
        {props.item.label}
        <svg
          class="transition duration-300 size-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          style={{
            transform: containsCurrent ? "rotate(180deg)" : "rotate(90deg)",
          }}
        >
          <path
            fill="rgba(0,0,0,0.5)"
            d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
          >
          </path>
        </svg>
      </div>
      <ul
        class={`ml-3 ${containsCurrent ? "" : "hidden"}`}
        data-accordion-content
      >
        {props.item.items.map((item) => (
          <SidebarItem item={item} search={props.search} url={props.url} />
        ))}
      </ul>
    </>
  );
}