import { zodToJsonSchema } from 'zod-to-json-schema'
import { z } from 'zod'

export const makeFunction = <T extends z.ZodType<any, any>>(
    properties: T,
    call: (args: z.infer<T>) => any
) => {
    const returnFunction = call

    returnFunction.prototype = {
        getDefinition: () => {
            return {
                description: properties._def.description,
                schema: zodToJsonSchema(properties),
            }
        },
    }

    return returnFunction
}

export type FunctionRef = ReturnType<typeof makeFunction> & {
    prototype: {
        getDefinition: () => DefinitionProps
    }
}

export type DefinitionProps = {
    description: string
    schema: object
}
