import { validateTool } from "@usefoundry/utils";
import Tool from "../index.js";

import { expect, test } from "vitest";

test("Tool defined correctly", async () => {
    // @ts-ignore
    const instance = new Tool({});

    expect(validateTool(instance)).toBe(true);
});
