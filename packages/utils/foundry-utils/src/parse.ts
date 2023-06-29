import { DefinitionProps, FunctionRef } from "./factory.js";

export const validateTool = (toolInstance: any) => {
    if (!toolInstance) {
        throw new Error("Tool instance is undefined");
    }

    const attributes = Object.getOwnPropertyNames(toolInstance);
    const functions = attributes
        .filter(
            // @ts-ignore
            (name) => typeof toolInstance[name] === "function" && name
        )
        .filter((name) => name !== "constructor" && name !== "apiClient")
        .map((name) => ({
            name: name,
            // @ts-ignore
            func: toolInstance[name],
        }));

    for (const el of functions) {
        validateFunction(el.func);
    }
    return true;
};

export const validateFunction = (func: FunctionRef) => {
    const definition = func.prototype.getDefinition();

    if (!definition) {
        throw new Error(`Function ${func.name} does not have a definition.`);
    }

    if (!definition.schema) {
        throw new Error(`Function ${func.name} does not have a schema.`);
    }

    if (!definition.description) {
        throw new Error(`Function ${func.name} does not have a description.`);
    }

    return true;
};

export const parseStandaloneFunction = (
    func: FunctionRef
): ParsedFunctionRef => {
    const definition = func.prototype.getDefinition();

    return {
        tool: null,
        name: func.name,
        fullName: func.name,
        definition,
        call: func,
    };
};

export const parseToolFunctions = (toolInstance: any): ParsedFunctionRef[] => {
    const attributes = Object.getOwnPropertyNames(toolInstance);
    const functions = attributes
        .filter(
            // @ts-ignore
            (name) => typeof toolInstance[name] === "function" && name
        )
        .filter((name) => name !== "constructor" && name !== "apiClient")
        .map((name) => ({
            tool: toolInstance.constructor.name as string,
            name: name as string,
            fullName:
                toolInstance[name].prototype?.fullName ||
                `${toolInstance.constructor.name}__${name}`,
            definition: toolInstance[
                name
            ]?.prototype?.getDefinition() as DefinitionProps,
            call: toolInstance[name] as FunctionRef,
        }));

    return functions;
};

export type ParsedFunctionRef = {
    tool: string | null;
    name: string;
    fullName: string;
    definition: DefinitionProps;
    call: FunctionRef;
};
