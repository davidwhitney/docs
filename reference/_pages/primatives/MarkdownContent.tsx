import { markdownRenderer } from "../../../_config.markdown.ts";
import { RawHtml } from "./RawHtml.tsx";

export function MarkdownContext(
  { text }: { text: string },
) {
  const renderedDescription = markdownRenderer.render(text);
  return <RawHtml rendered={renderedDescription} />;
}
