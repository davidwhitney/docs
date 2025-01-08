export function LinkCode({ symbol }: { symbol: string }) {
  const root = symbol.split(".")[0];
  const target = "/api/" + root + "/~/" + symbol;

  return (
    <a href={target}>
      <code>{symbol}</code>
    </a>
  );
}

export function insertLinkCodes(text: string) {
  // replace each text occurance of {@linkcode foo} with <LinkCode symbol="foo" />
  const tokens = text.split(/(\{@linkcode [^\}]+\})/);
  const firstLineOfJsDocWithLinks = tokens.map((token, index) => {
    if (token.startsWith("{@linkcode ")) {
      const symbol = token.slice(11, -1);
      return <LinkCode symbol={symbol} key={index} />;
    }
    return token;
  });

  const merge = firstLineOfJsDocWithLinks.reduce(
    // deno-lint-ignore no-explicit-any
    (acc: any, curr: any) => {
      return acc === null ? [curr] : [...acc, " ", curr];
    },
    null,
  );

  return merge;
}
