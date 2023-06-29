// src/foundry.ts
import {
  validateTool,
  parseToolFunctions,
  parseStandaloneFunction,
  validateFunction
} from "@usefoundry/utils";
var Foundry = class {
  tools = [];
  flatFunctions = [];
  constructor({ tools }) {
    for (const entity of tools) {
      if (typeof entity === "function") {
        if (!validateFunction(entity)) {
          throw new Error("Invalid function");
        }
        const parsedFunction = parseStandaloneFunction(
          entity
        );
        this.flatFunctions.push(parsedFunction);
      } else if (Array.isArray(entity)) {
        console.log({
          entity
        });
        for (const el of entity) {
          if (typeof el === "function") {
            if (!validateFunction(el)) {
              throw new Error("Invalid function");
            }
          }
        }
        const parsedFunctions = parseToolFunctions(entity);
        this.flatFunctions.push(...parsedFunctions);
      } else {
        if (!validateTool(entity)) {
          throw new Error("Invalid tool");
        }
        const parsedFunctions = parseToolFunctions(entity);
        this.flatFunctions.push(...parsedFunctions);
      }
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

// src/utils.ts
var pickFromTool = (instance, functionNames) => {
  const functions = functionNames.map((methodName) => {
    const func = instance[methodName];
    func.prototype.fullName = // @ts-ignore
    instance.constructor.name + "__" + methodName;
    return func;
  });
  return functions;
};
export {
  Foundry,
  pickFromTool
};
