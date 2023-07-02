import type { AxiosInstance } from 'axios'

import { makeFunction } from '@usefoundry/utils'
import { z } from 'zod'
import { createApi } from './api.js'

export class WeatherApiTool {
    public description = 'Tool to get weather data from weatherapi.com'

    private apiKey: string = ''
    private apiClient: AxiosInstance
    constructor({ apiKey }: { apiKey: string }) {
        this.apiKey = apiKey
        this.apiClient = createApi({ apiKey })
    }

    public getFutureWeatherForCityAtDate = makeFunction(
        z
            .object({
                city: z.string(),
                date: z.string().describe('Date in YYYY-MM-DD format'),
            })
            .describe(
                'Gets the weather forecast for a city at a specific date, starting 14 days in the future. So for getting the weather for a day within the next 14 days, use the getNearFutureWeatherForCity function.'
            ),
        async ({ city, date }) => {
            const res = await this.apiClient.get(
                `/v1/future.json?key=${this.apiKey}&q=${city}&dt=${date}`
            )

            if (res.data?.forecast?.forecastDay?.[0]) {
                return res.data.forecast.forecastDay[0].day
            }

            return res.data
        }
    )

    public getNearFutureWeatherForCity = makeFunction(
        z
            .object({
                city: z.string(),
                days: z
                    .number()
                    .describe(
                        "Number of days of weather forecast. Value ranges from 1 to 10. 1 is today's weather, 2 is today and tomorrow's weather, and so on."
                    ),
            })
            .describe(
                'Gets the weather forecast for a city for the next 1-10 days. Always use this function when asked about a date WITHIN the next 14 days.'
            ),
        async ({ city, days }) => {
            const res = await this.apiClient.get(
                `/v1/forecast.json?key=${this.apiKey}&q=${city}&days=${days}`
            )

            if (res.data?.forecast?.forecastday?.length) {
                return res.data.forecast.forecastday.map((day: any) => ({
                    date: day.date,
                    weather: day.day,
                }))
            }

            return res.data
        }
    )

    public getCurrentWeatherForCity = makeFunction(
        z
            .object({
                city: z.string(),
            })
            .describe('Gets the current weather for a city.'),
        async ({ city }) => {
            const res = await this.apiClient.get(`/v1/current.json?key=${this.apiKey}&q=${city}`)

            if (res.data?.current) {
                return res.data.current
            }

            return res.data
        }
    )
}

export default WeatherApiTool
