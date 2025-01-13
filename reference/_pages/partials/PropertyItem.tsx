import { ClassPropertyDef, InterfacePropertyDef } from "@deno/doc/types";
import { PropertyName } from "../primitives/PropertyName.tsx";
import { DetailedSection } from "./DetailedSection.tsx";
import { MarkdownContent } from "../primitives/MarkdownContent.tsx";
import { PropertyBadges } from "./Badges.tsx";

export function PropertyItem(
  { property }: { property: ClassPropertyDef | InterfacePropertyDef },
) {
  return (
    <div>
      <h3>
        <PropertyBadges property={property} />
        <PropertyName property={property} />
      </h3>
      <DetailedSection>
        <MarkdownContent text={property.jsDoc?.doc} />
      </DetailedSection>
    </div>
  );
}
