import { ClassMethodDef, ParamDef, ParamIdentifierDef, ParamRestDef, TsTypeDef } from "@deno/doc/types";

export type CodePart = {
    value: string;
    kind: string;
}

export function methodSignature(method: ClassMethodDef) {
    const parts: CodePart[] = [];
    if (method.accessibility) {
        parts.push({ value: method.accessibility, kind: "accessibility" });
    }

    if (method.isStatic) {
        parts.push({ value: "static ", kind: "modifier" });
    }

    if (method.isAbstract) {
        parts.push({ value: "abstract ", kind: "modifier" });
    }

    if (method.isOverride) {
        parts.push({ value: "override ", kind: "modifier" });
    }

    parts.push({ value: method.functionDef.defName || method.name, kind: "name" });

    if (method.functionDef.params.length > 0) {
        parts.push({ value: "(", kind: "name" });

        const params = method.functionDef.params.map((param) => (
            methodParameter(param)
        ));

        for (const param of params) {
            parts.push(...param);
            parts.push({ value: ", ", kind: "separator" });
        }

        parts.pop(); // remove last separator
        parts.push({ value: ")", kind: "name" });

    } else {
        parts.push({ value: "()", kind: "brackets" });
    }

    return parts;
}

export function methodParameter(param: ParamDef): CodePart[] {
    const parts: CodePart[] = [];

    if (param.kind === "rest") {
        parts.push(...restParameter(param));
    }

    if (param.kind === "identifier") {
        parts.push(...identifier(param));
    }

    if (param.kind === "array") {
        parts.push({ value: "[]", kind: "identifier" });
    }

    return parts;
}

export function restParameter(param: ParamRestDef): CodePart[] {
    const parts: CodePart[] = [];
    param.arg.tsType = param.tsType; // Fix bug where TSType is not populated.

    parts.push({ value: "...", kind: "identifier" });
    parts.push(...methodParameter(param.arg));
    return parts;
}

export function identifier(param: ParamIdentifierDef) {
    const parts: CodePart[] = [];
    parts.push({ value: param.name, kind: "identifier" });
    if (param.optional) {
        parts.push({ value: "?", kind: "identifier" });
    }

    if (param.tsType) {
        parts.push(...typeInformation(param.tsType));
    }

    return parts;
}

export function typeInformation(type: TsTypeDef | undefined): CodePart[] {
    if (!type) {
        return [];
    }

    const parts: CodePart[] = [];

    if (type.repr) {
        parts.push({ value: ": " + type.repr, kind: "type" });
    }

    if (type.kind === "array") {
        parts.push({ value: type?.array?.repr || "" + "[]", kind: "identifier" });
        parts.push({ value: "[]", kind: "type" });
    }

    return parts;
}
