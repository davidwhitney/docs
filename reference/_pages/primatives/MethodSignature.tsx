import { ClassMethodDef } from "@deno/doc/types";
import { methodSignature } from "../../_util/methodSignatureRendering.ts";
import { FunctionDefinitionParts } from "./FunctionDefinitionParts.tsx";

export function MethodSignature({ method }: { method: ClassMethodDef }) {
  const asParts = methodSignature(method);
  const partElements = FunctionDefinitionParts({
    asParts,
    forceLineBreaks: method.functionDef.params.length > 1,
  });

  return (
    <>
      {partElements}
    </>
  );
}
