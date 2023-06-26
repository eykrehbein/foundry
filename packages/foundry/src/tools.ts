// API
import WeatherApiTool from "@usefoundry/tools-api-weather-api";

// Files
import CsvTool from "@usefoundry/tools-file-csv";

// Utils
import CalculatorTool from "@usefoundry/tools-utils-calculator";

export const Tools = {
    API: {
        WeatherApi: WeatherApiTool,
    },
    Files: {
        Csv: CsvTool,
    },
    Utils: {
        Calculator: CalculatorTool,
    },
};
