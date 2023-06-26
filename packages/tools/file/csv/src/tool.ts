import { makeFunction } from "@usefoundry/utils";
import { z } from "zod";

import { stringify as csvStringify } from "csv-stringify/sync";
import { parse as csvParse } from "csv-parse/sync";

import fs from "fs";

export class CsvTool {
    constructor() {}

    public writeCsvFileSync = makeFunction(
        z
            .object({
                path: z.string(),
                data: z
                    .array(z.object({}))
                    .describe(
                        "The rows to write, as an array of objects, each key representing a column"
                    ),
                columns: z
                    .array(z.string())
                    .describe("Defines the columns to write, in order"),
            })
            .describe("Writes data to a csv file"),
        async ({ path, columns, data }) => {
            fs.writeFileSync(
                path,
                csvStringify(data, { columns, header: true }),
                {
                    encoding: "utf-8",
                }
            );
        }
    );

    public appendToCsvFileSync = makeFunction(
        z
            .object({
                path: z.string(),
                data: z
                    .array(z.object({}))
                    .describe(
                        "The rows to append, as an array of objects, each key representing a column. Only use existing columns"
                    ),
            })
            .describe("Appends data to an existing csv file"),
        async ({ path, data }) => {
            const dataAsString = csvStringify(data, {
                header: false,
            }).toString();

            fs.appendFileSync(path, dataAsString, { encoding: "utf-8" });

            return data;
        }
    );

    public getCsvFileColumnsSync = makeFunction(
        z
            .object({
                path: z.string(),
            })
            .describe(
                "Gets the columns of a csv file. Always call before appending to csv file, to know which structure to use"
            ),
        ({ path }) => {
            const file = fs.readFileSync(path, { encoding: "utf-8" });
            const data = csvParse(file, { columns: true, autoParse: true });

            if (data.length === 0) throw new Error("No data in csv file");

            return Object.keys(data[0]);
        }
    );

    public readCsvFileSync = makeFunction(
        z
            .object({
                path: z.string(),
            })
            .describe(
                "Reads data from a csv file into an array of objects, each object representing a row"
            ),
        ({ path }) => {
            const file = fs.readFileSync(path, { encoding: "utf-8" });
            const data = csvParse(file, { columns: true });

            return data;
        }
    );
}

export default CsvTool;
