import {
    validateTool,
    parseToolFunctions,
    parseStandaloneFunction,
    FunctionRef,
    ParsedFunctionRef,
    validateFunction,
} from "@usefoundry/utils";

export class Foundry {
    private tools: object[] = [];
    private flatFunctions: ParsedFunctionRef[] = [];

    constructor({ tools }: { tools: (object | FunctionRef)[] }) {
        for (const entity of tools) {
            // if it's a function
            if (typeof entity === "function") {
                if (!validateFunction(entity as FunctionRef)) {
                    throw new Error("Invalid function");
                }

                const parsedFunction = parseStandaloneFunction(
                    entity as FunctionRef
                );
                this.flatFunctions.push(parsedFunction);
                // if it's an array
            } else if (Array.isArray(entity)) {
                console.log({
                    entity,
                });
                for (const el of entity) {
                    if (typeof el === "function") {
                        if (!validateFunction(el as FunctionRef)) {
                            throw new Error("Invalid function");
                        }
                    }
                }

                const parsedFunctions = parseToolFunctions(entity);
                this.flatFunctions.push(...parsedFunctions);
            } else {
                if (!validateTool(entity)) {
                    throw new Error("Invalid tool");
                }

                const parsedFunctions = parseToolFunctions(entity);
                this.flatFunctions.push(...parsedFunctions);
            }
        }
    }

    public getFunction(fullName: string) {
        const func = this.flatFunctions.find((el) => el.fullName === fullName);
        if (!func) {
            throw new Error(`Function ${fullName} not found.`);
        }
        return func;
    }

    public getPreparedFunctions({ target }: { target: "openai" }) {
        if (target === "openai") {
            return this.flatFunctions.map((el) => ({
                name: el.fullName,
                description: el.definition.description,
                parameters: el.definition.schema,
            }));
        }

        throw new Error(`Invalid target: ${target}`);
    }

    public async runSelectedFunction({
        name,
        arguments: rawArguments,
    }: {
        name?: string | undefined;
        arguments?: string | undefined;
    }) {
        if (!name) {
            throw new Error(`Invalid name: ${name}`);
        }
        if (!rawArguments) {
            throw new Error(`Invalid arguments: ${rawArguments}`);
        }

        let parsedArgs = null;
        try {
            parsedArgs = JSON.parse(rawArguments);
        } catch (e) {
            throw new Error(`Unable to parse arguments: ${arguments}`);
        }

        const func = this.getFunction(name);

        return await func.call(parsedArgs);
    }
}
