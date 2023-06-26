// src/tools.ts
import WeatherApiTool from "@usefoundry/tools-api-weather-api";
import CsvTool from "@usefoundry/tools-file-csv";
import CalculatorTool from "@usefoundry/tools-utils-calculator";
var Tools = {
  API: {
    WeatherApi: WeatherApiTool
  },
  Files: {
    Csv: CsvTool
  },
  Utils: {
    Calculator: CalculatorTool
  }
};

// src/foundry.ts
import {
  validateTool,
  parseToolFunctions
} from "@usefoundry/utils";
var Foundry = class {
  tools = [];
  flatFunctions = [];
  constructor({ tools }) {
    for (const tool of tools) {
      if (!validateTool(tool)) {
        throw new Error("Invalid tool");
      }
      const parsedFunctions = parseToolFunctions(tool);
      this.flatFunctions.push(...parsedFunctions);
    }
  }
  getFunction(fullName) {
    const func = this.flatFunctions.find((el) => el.fullName === fullName);
    if (!func) {
      throw new Error(`Function ${fullName} not found.`);
    }
    return func;
  }
  getPreparedFunctions({ target }) {
    if (target === "openai") {
      return this.flatFunctions.map((el) => ({
        name: el.fullName,
        description: el.definition.description,
        parameters: el.definition.schema
      }));
    }
    throw new Error(`Invalid target: ${target}`);
  }
  async runSelectedFunction({
    name,
    arguments: rawArguments
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
};
export {
  Foundry,
  Tools
};
