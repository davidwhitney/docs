export function LinkCode({ symbol }: { symbol: string }) {
  const target = "~/" + symbol;

  return (
    <a href={target}>
      <code>{symbol}</code>
    </a>
  );
}

export function insertLinkCodes(text: string) {
  // replace each text occurance of {@linkcode foo} with <LinkCode symbol="foo" />
  if (!text) {
    return "";
  }

  const parts = text.split(/(\{@linkcode\s+[^}]+\})/g);

  const partsAfterSub = parts.map((part) => {
    const match = part.match(/\{@linkcode\s+([^}]+)\}/);
    if (!match) {
      return part;
    }

    const symbol = match[1].trim();
    const target = "~/" + symbol;

    return `<a href="${target}"><code>${symbol}</code></a>`;
  });

  return partsAfterSub.join("");
}

export function linkCodeAndParagraph(text: string) {
  if (!text?.trim()) {
    return null;
  }

  const withLinkCode = insertLinkCodes(text);

  const paragraphs = withLinkCode
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const elements = paragraphs.map((paragraph, index) => (
    <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }}>
    </p>
  ));

  return elements;
}
