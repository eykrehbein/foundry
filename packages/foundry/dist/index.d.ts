import WeatherApiTool from '@usefoundry/tools-api-weather-api';
import CsvTool from '@usefoundry/tools-file-csv';
import CalculatorTool from '@usefoundry/tools-utils-calculator';
import * as _usefoundry_utils from '@usefoundry/utils';

declare const Tools: {
    API: {
        WeatherApi: typeof WeatherApiTool;
    };
    Files: {
        Csv: typeof CsvTool;
    };
    Utils: {
        Calculator: typeof CalculatorTool;
    };
};

declare class Foundry {
    private tools;
    private flatFunctions;
    constructor({ tools }: {
        tools: object[];
    });
    getFunction(fullName: string): {
        tool: string;
        name: string;
        fullName: string;
        definition: {
            description: string;
            schema: object;
        };
        call: _usefoundry_utils.FunctionRef;
    };
    getPreparedFunctions({ target }: {
        target: "openai";
    }): {
        name: string;
        description: string;
        parameters: object;
    }[];
    runSelectedFunction({ name, arguments: rawArguments, }: {
        name?: string | undefined;
        arguments?: string | undefined;
    }): Promise<any>;
}

export { Foundry, Tools };
