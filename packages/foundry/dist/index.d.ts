import { FunctionRef, ParsedFunctionRef } from '@usefoundry/utils'

declare class Foundry {
    private tools
    private flatFunctions
    constructor({ tools }: { tools: (object | FunctionRef)[] })
    getFunction(fullName: string): ParsedFunctionRef
    getPreparedFunctions({ target }: { target: 'openai' }): {
        name: string
        description: string
        parameters: object
    }[]
    runSelectedFunction({
        name,
        arguments: rawArguments,
    }: {
        name?: string | undefined
        arguments?: string | undefined
    }): Promise<any>
}

declare const pickFromTool: <T>(instance: T, functionNames: (keyof T)[]) => any[]

export { Foundry, pickFromTool }
