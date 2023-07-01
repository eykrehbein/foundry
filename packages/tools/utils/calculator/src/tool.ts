import { makeFunction } from '@usefoundry/utils'
import { z } from 'zod'
import { evaluate } from 'mathjs'

export class CalculatorTool {
    constructor() {}

    public calculate = makeFunction(
        z
            .object({
                expression: z.string().describe('The mathematical expression to evaluate'),
            })
            .describe(
                'Evaluates a mathematical expression and returns the result as string. Always use it do any math'
            ),
        async ({ expression }) => {
            return evaluate(expression)
        }
    )
}

export default CalculatorTool
