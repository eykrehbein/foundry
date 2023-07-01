import { makeFunction } from '@usefoundry/utils'
import { z } from 'zod'
import crypto from 'crypto'

export class RandomTool {
    constructor() {}

    public randomInteger = makeFunction(
        z
            .object({
                type: z.enum(['positive', 'negative', 'any']),
            })
            .describe('Generates a random integer number without specific boundaries'),
        async ({ type }) => {
            if (type === 'positive') {
                return crypto.randomInt(0, Number.MAX_SAFE_INTEGER)
            }
            if (type === 'negative') {
                return crypto.randomInt(Number.MIN_SAFE_INTEGER, 0)
            }
            return crypto.randomInt(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
        }
    )
}

export default RandomTool
