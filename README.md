<p align="center">
  <a href="https://docs.withfoundry.org">
  
  <picture>
    <source height="125" media="(prefers-color-scheme: dark)" srcset="./docs/logo/dark.svg">
    <img height="125" alt="Foundry" src="./docs/logo/light.svg">
  </picture>
</a>
</p>

<h4 align="center">A collection of tools and functions that can be used in conjunction with LLMs.</h4>

<p align="center">
  <a href="https://docs.usefoundry.io">Documentation</a> •
  <a href="https://docs.usefoundry.io/quickstart">Quickstart</a> • 
  <a href="https://docs.usefoundry.io/contributing">Contribute</a> •
  <a href="https://discord.gg/xsZfmakRhw">Discord</a>

</p>

<hr/>

## About

Foundry is working well, but it's still in an early state. Although the variety of tools is limited at the moment, we firmly believe in the power of collective effort – therefore we warmly invite _you_ to contribute! If you are developing custom tools for the use with LLMs, please consider to contribute them into Foundry's library. As the number of tools in Foundry increases, its reach expands, leading to the creation of even more tools and so forth.

## Documentation

This README features a quick overview – for a detailed documentation, go to [docs.usefoundry.io](https://docs.usefoundry.io).

## Quickstart

#### Install the Foundry base package

```bash
npm install @usefoundry/foundry
```

#### Install the Tools you want to use, e.g.

```bash
npm install @usefoundry/tools-api-weather-api @usefoundry/tools-file-csv
```

## Foundry's Workflow

1. You define the tools you want to use using a new instance of `Foundry`

```typescript
import { Foundry, pickFromTool } from '@usefoundry/foundry'
import { Configuration, OpenAIApi } from 'openai'

import WeatherApiTool from '@usefoundry/tools-api-weather-api'
import CsvTool from '@usefoundry/tools-file-csv'

// Create a foundry instance with the tools we want to use
const foundry = new Foundry({
    tools: [
        new WeatherApiTool({
            apiKey: process.env.WEATHER_API_KEY!,
        }),
        new CalculatorTool(),
        pickFromTool(new CsvTool(), ['writeCsvFileSync']),
    ],
})
```

<details>
<summary>2. Foundry will convert the function declaration of each function of the selected tools into a JSON schema LLMs can understand</summary>

```typescript
const functions = foundry.getPreparedFunctions({ target: 'openai' })
/*
[
  {
    "name": "WeatherApiTool__getFutureWeatherForCityAtDate",
    "description": "Gets the weather forecast for a city at a specific date, starting 14 days in the future. So for getting the weather for a day within the next 14 days, use the getNearFutureWeatherForCity function.",
    "parameters": {
      "type": "object",
      "properties": {
        "city": {
          "type": "string"
        },
        "date": {
          "type": "string",
          "description": "Date in YYYY-MM-DD format"
        }
      },
      "required": [
        "city",
        "date"
      ],
      "additionalProperties": false,
      "description": "Gets the weather forecast for a city at a specific date, starting 14 days in the future. So for getting the weather for a day within the next 14 days, use the getNearFutureWeatherForCity function.",
      "$schema": "http://json-schema.org/draft-07/schema#"
    }
  },
  {
    "name": "WeatherApiTool__getNearFutureWeatherForCity",
    "description": "Gets the weather forecast for a city for the next 1-10 days. Always use this function when asked about a date WITHIN the next 14 days.",
    "parameters": {
      "type": "object",
      "properties": {
        "city": {
          "type": "string"
        },
        "days": {
          "type": "number",
          "description": "Number of days of weather forecast. Value ranges from 1 to 10. 1 is today's weather, 2 is today and tomorrow's weather, and so on."
        }
      },
      "required": [
        "city",
        "days"
      ],
      "additionalProperties": false,
      "description": "Gets the weather forecast for a city for the next 1-10 days. Always use this function when asked about a date WITHIN the next 14 days.",
      "$schema": "http://json-schema.org/draft-07/schema#"
    }
  },
  {
    "name": "WeatherApiTool__getCurrentWeatherForCity",
    "description": "Gets the current weather for a city.",
    "parameters": {
      "type": "object",
      "properties": {
        "city": {
          "type": "string"
        }
      },
      "required": [
        "city"
      ],
      "additionalProperties": false,
      "description": "Gets the current weather for a city.",
      "$schema": "http://json-schema.org/draft-07/schema#"
    }
  },
  {
    "name": "CalculatorTool__calculate",
    "description": "Evaluates a mathematical expression and returns the result as string. Always use it do any math",
    "parameters": {
      "type": "object",
      "properties": {
        "expression": {
          "type": "string",
          "description": "The mathematical expression to evaluate"
        }
      },
      "required": [
        "expression"
      ],
      "additionalProperties": false,
      "description": "Evaluates a mathematical expression and returns the result as string. Always use it do any math",
      "$schema": "http://json-schema.org/draft-07/schema#"
    }
  },
  {
    "name": "CsvTool__writeCsvFileSync",
    "description": "Writes data to a csv file",
    "parameters": {
      "type": "object",
      "properties": {
        "path": {
          "type": "string"
        },
        "data": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {},
            "additionalProperties": false
          },
          "description": "The rows to write, as an array of objects, each key representing a column"
        },
        "columns": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Defines the columns to write, in order"
        }
      },
      "required": [
        "path",
        "data",
        "columns"
      ],
      "additionalProperties": false,
      "description": "Writes data to a csv file",
      "$schema": "http://json-schema.org/draft-07/schema#"
    }
  }
]
*/
```

</details>

3. Prompt an LLM with the generated functions to select one to execute based on the prompt

```typescript
// Initialize OpenAI API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY!,
})
const openai = new OpenAIApi(configuration)

const prompt = "What's the current weather in Berlin?"

const llmResponse = await openai.createChatCompletion({
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
```

4. Use Foundry to execute the function

```typescript
const targetFunction = llmResponse.data.choices[0].message?.function_call

// will execute `await WeatherApiTool.getCurrentWeatherForCity({ city: "Berlin" })`
const functionResult = await foundry.runSelectedFunction(targetFunctionProps)
```
