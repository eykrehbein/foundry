import {
    validateTool,
    parseToolFunctions,
    ParsedToolRef,
} from "@usefoundry/utils";
import { DynamicTool } from "langchain/tools";

type ClassRef = new (...args: any[]) => any;

export class Foundry {
    private tools: object[] = [];
    private flatFunctions: ParsedToolRef = [];

    constructor({ tools }: { tools: object[] }) {
        for (const tool of tools) {
            if (!validateTool(tool)) {
                throw new Error("Invalid tool");
            }

            // flat push funcitons
            const parsedFunctions = parseToolFunctions(tool);
            this.flatFunctions.push(...parsedFunctions);
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
