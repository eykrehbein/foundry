import { validateTool } from '@usefoundry/utils'
import Tool from '../index.js'

import { expect, test } from 'vitest'

test('Tool defined correctly', async () => {
    const instance = new Tool({ apiKey: '' })

    expect(validateTool(instance)).toBe(true)
})
