import { ReferenceDocumentFactoryFunction } from "./types.ts";
import getPagesForNamespace from "./_pages/Namespace.tsx";
import getPagesForNotImplemented from "./_pages/NotImplemented.tsx";
import getPagesForModule from "./_pages/Module.tsx";
import getPagesForClass from "./_pages/Class.tsx";
import getPagesForInterface from "./_pages/Interface.tsx";
import { DocNodeBase } from "@deno/doc/types";

const factories = new Map<string, ReferenceDocumentFactoryFunction<DocNodeBase>>();
factories.set("moduleDoc", getPagesForModule as ReferenceDocumentFactoryFunction<DocNodeBase>);
factories.set("namespace", getPagesForNamespace as ReferenceDocumentFactoryFunction<DocNodeBase>);
factories.set("function", getPagesForNotImplemented as ReferenceDocumentFactoryFunction<DocNodeBase>);
factories.set("variable", getPagesForNotImplemented as ReferenceDocumentFactoryFunction<DocNodeBase>);
factories.set("enum", getPagesForNotImplemented as ReferenceDocumentFactoryFunction<DocNodeBase>);
factories.set("class", getPagesForClass as ReferenceDocumentFactoryFunction<DocNodeBase>);
factories.set("typeAlias", getPagesForNotImplemented as ReferenceDocumentFactoryFunction<DocNodeBase>);
factories.set("interface", getPagesForInterface as ReferenceDocumentFactoryFunction<DocNodeBase>);
factories.set("import", getPagesForNotImplemented as ReferenceDocumentFactoryFunction<DocNodeBase>);

export default function factoryFor<T extends DocNodeBase>(item: T): ReferenceDocumentFactoryFunction<T> {
    return factories.get(item.kind) || getPagesForNotImplemented;
}