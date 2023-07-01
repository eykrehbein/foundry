import { Foundry } from '@usefoundry/foundry'
import { Configuration, OpenAIApi } from 'openai'

import WeatherApiTool from '@usefoundry/tools-api-weather-api'
import CsvTool from '@usefoundry/tools-file-csv'
import CalculatorTool from '@usefoundry/tools-utils-calculator'

// Create a foundry instance with the tools we want to use
const foundry = new Foundry({
    tools: [
        new WeatherApiTool({
            apiKey: process.env.WEATHER_API_KEY!,
        }),
        new CsvTool(),
        new CalculatorTool(),
    ],
})

// Initialize OpenAI API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY!,
})
const openai = new OpenAIApi(configuration)

const runPrompt = async ({ userPrompt }: { userPrompt: string }) => {
    // Set some context for the prompt
    const prompt = `
        Context:
        - Current date: ${new Date().toDateString()}
        
        Prompt:
        ${userPrompt}
    `

    //! Get all functions from the Foundry tools defined above
    // They are formatted in the way OpenAI expects them
    const functions = foundry.getPreparedFunctions({ target: 'openai' })

    // Run the prompt against the OpenAI model
    const response = await openai.createChatCompletion({
        functions: functions,
        function_call: 'auto',
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
        model: 'gpt-4-0613',
        temperature: 0,
    })

    const targetFunctionProps = response.data.choices[0].message?.function_call

    if (!targetFunctionProps) {
        throw new Error('No function found in response')
    }

    const functionResult = foundry.runSelectedFunction(targetFunctionProps)

    return functionResult
}

await runPrompt({ userPrompt: 'What is the weather in Berlin today?' })
await runPrompt({ userPrompt: 'What is 2 + 2?' })
await runPrompt({
    userPrompt: 'Write a list of the latest 10 US presidents into ./presidents.csv',
})
await runPrompt({ userPrompt: 'Get a random number between 30 and 60' })
