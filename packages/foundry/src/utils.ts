export const pickFromTool = <T>(instance: T, functionNames: (keyof T)[]) => {
    const functions = functionNames.map((methodName: keyof T) => {
        const func = instance[methodName] as any
        func.prototype.fullName =
            // @ts-ignore
            instance.constructor.name + '__' + (methodName as string)
        return func
    })

    return functions
}
