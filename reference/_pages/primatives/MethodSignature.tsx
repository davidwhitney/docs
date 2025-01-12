import { ClassMethodDef } from "@deno/doc/types";
import { methodSignature } from "../../_util/methodSignatureRendering.ts";

export function MethodSignature({ method }: { method: ClassMethodDef }) {
  const asParts = methodSignature(method);

  const partElements = [];
  for (const part of asParts) {
    if (
      part.kind === "method-brace" && part.value.trim() === ")" &&
      method.functionDef.params.length > 1
    ) {
      partElements.push(<br />);
    }

    partElements.push(<span className={part.kind}>{part.value}</span>);

    if (
      part.kind === "method-brace" && part.value.trim() === "(" &&
      method.functionDef.params.length > 1
    ) {
      partElements.push(<br />);
    }

    if (part.kind === "param-separator") {
      partElements.push(<br />);
    }
  }

  return (
    <>
      {partElements}
    </>
  );
}
