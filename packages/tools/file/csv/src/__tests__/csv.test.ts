import { validateTool } from "@usefoundry/utils";
import Tool from "../index.js";
import fs from "fs";
import { stringify as csvStringify } from "csv-stringify/sync";
import { parse as csvParse } from "csv-parse/sync";

import { expect, test } from "vitest";

test("Tool defined correctly", async () => {
    const instance = new Tool();

    expect(validateTool(instance)).toBe(true);
});

test("writeCsvFile", async () => {
    const instance = new Tool();

    const path = "/tmp/test.csv";

    instance.writeCsvFileSync({
        path,
        data: [
            { name: "John", age: 21 },
            { name: "Jane", age: 22, city: "New York" },
        ],
        columns: ["name", "age"],
    });

    const rawFile = fs.readFileSync(path, { encoding: "utf-8" });
    const parsedFile = csvParse(rawFile, {
        columns: true,
    });

    expect(parsedFile).toEqual([
        { name: "John", age: "21" },
        { name: "Jane", age: "22" },
    ]);
});

test("appendToCsvFile", async () => {
    const instance = new Tool();

    const path = "/tmp/test.csv";

    instance.writeCsvFileSync({
        path,
        data: [
            { name: "John", age: 21 },
            { name: "Jane", age: 22 },
        ],
        columns: ["name", "age"],
    });

    instance.appendToCsvFileSync({
        path,
        data: [
            { name: "Bob", age: 25 },
            { name: "Alice", age: 26 },
        ],
    });

    const rawFile = fs.readFileSync(path, { encoding: "utf-8" });
    const parsedFile = csvParse(rawFile, {
        columns: true,
    });

    expect(parsedFile).toEqual([
        { name: "John", age: "21" },
        { name: "Jane", age: "22" },
        { name: "Bob", age: "25" },
        { name: "Alice", age: "26" },
    ]);
});

test("readCsvFile", async () => {
    const instance = new Tool();

    const path = "/tmp/test.csv";

    instance.writeCsvFileSync({
        path,
        data: [
            { name: "John", age: 21 },
            { name: "Jane", age: 22 },
        ],
        columns: ["name", "age"],
    });

    const parsedFile = instance.readCsvFileSync({
        path,
    });

    expect(parsedFile).toEqual([
        { name: "John", age: "21" },
        { name: "Jane", age: "22" },
    ]);
});

test("get columns", async () => {
    const instance = new Tool();

    const path = "/tmp/test.csv";

    instance.writeCsvFileSync({
        path,
        data: [{ name: "Jane", age: 22 }],
        columns: ["name", "age"],
    });

    const columns = instance.getCsvFileColumnsSync({
        path,
    });

    expect(columns).toEqual(["name", "age"]);
});
