# WeatherApiTool

## Functions

### getFutureWeatherForCityAtDate

Gets the weather forecast for a city at a specific date, starting 14 days in the future. So for getting the weather for a day within the next 14 days, use the getNearFutureWeatherForCity function.

Properties:

-   `city` (string)
-   `date` (string): Date in YYYY-MM-DD format

### getNearFutureWeatherForCity

Gets the weather forecast for a city for the next 1-10 days. Always use this function when asked about a date WITHIN the next 14 days.

Properties:

-   `city` (string)
-   `days` (number): Number of days of weather forecast. Value ranges from 1 to 10. 1 is today's weather, 2 is today and tomorrow's weather, and so on.

### getCurrentWeatherForCity

Gets the current weather for a city.

Properties:

-   `city` (string)
