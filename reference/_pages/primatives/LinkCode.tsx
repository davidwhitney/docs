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
    return text;
  }

  const parts = text.split(/(\{@linkcode\s+[^}]+\})/g);

  return parts.map((part, index) => {
    const match = part.match(/\{@linkcode\s+([^}]+)\}/);
    if (!match) {
      return part;
    }

    const symbol = match[1].trim();
    return <LinkCode key={index} symbol={symbol} />;
  });
}

export function linkCodeAndParagraph(text: string) {
  if (!text?.trim()) {
    return null;
  }

  const paragraphs = text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return paragraphs.map((paragraph, index) => (
    <p key={index}>
      {insertLinkCodes(paragraph)}
    </p>
  ));
}
