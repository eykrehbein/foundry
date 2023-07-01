import { validateTool } from '@usefoundry/utils'
import Tool from '../index.js'

import { expect, test } from 'vitest'

test('Tool defined correctly', async () => {
    const instance = new Tool()

    expect(validateTool(instance)).toBe(true)
})

test('do math', async () => {
    const instance = new Tool()

    expect(await instance.calculate({ expression: '1+1' })).toBe(2)
})

test('do math', async () => {
    const instance = new Tool()

    expect(await instance.calculate({ expression: '10/20' })).toBe(0.5)
})
