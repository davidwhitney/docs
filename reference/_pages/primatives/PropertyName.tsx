import { typeInformation } from "../../_util/methodSignatureRendering.ts";
import { ClassPropertyDef } from "@deno/doc/types";
import { nbsp } from "../../_util/common.ts";

export function PropertyName({ property }: { property: ClassPropertyDef }) {
  const typeInfoElements = typeInformation(property.tsType).map((part) => {
    const classes = [part.kind, "font-medium", "text-stone-500"].join(" ");
    return <span className={classes}>{part.value}</span>;
  });

  const propertyNameClass = "identifier font-bold font-lg link";
  const propertyTypeClass = "type font-medium text-stone-500";

  return (
    <>
      <span className={propertyNameClass}>{property.name}</span>
      <span className={propertyTypeClass}>:{nbsp}</span>
      {typeInfoElements}
    </>
  );
}
