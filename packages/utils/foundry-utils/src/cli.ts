#!/usr/bin/env node
import { Command } from "commander";
import fs from "fs";
import path from "path";
import { parseToolFunctions } from "./parse.js";

const program = new Command();

program
    .name("foundry")
    .description("Foundry CLI")
    .version(JSON.parse(fs.readFileSync("package.json", "utf8")).version);

program
    .command("generate-docs")
    .description("Generate docs for a tool")
    // parse the flag "type"
    .option("-t, --type <type>", "type of tool")
    .action(async (props) => {
        const cwd = process.cwd();
        const type = props.type;
        const Tool = (await import(cwd + "/dist/index.js")).default;

        const instance = new Tool({});
        const name = instance.constructor.name;

        const functions = parseToolFunctions(instance);

        const nameWithoutSuffix = name.endsWith("Tool")
            ? name.slice(0, -4)
            : name;

        const dashCaseName = nameWithoutSuffix
            .replace(/([A-Z])/g, "-$1")
            .replace(/^-/, "")
            .toLowerCase();

        let docs = ``;

        docs += `## Installation\n\n`;
        docs += `<CodeGroup>

\`\`\`bash npm
npm i @usefoundry/tools-${type}-${dashCaseName}
\`\`\`

\`\`\`bash yarn
yarn add  @usefoundry/tools-${type}-${dashCaseName}
\`\`\`

\`\`\`bash pnpm
pnpm add  @usefoundry/tools-${type}-${dashCaseName}
\`\`\`

</CodeGroup>\n\n`;

        docs += `## Functions\n\n`;

        for (const func of functions) {
            docs += `### \`${func.name}\`\n\n`;
            docs += `${func.definition.description}\n\n`;
            console.log(func.definition.schema);

            // json schema into markdown list, recursively
            const schemaToMarkdown = (schema: any, level = 0) => {
                let markdown = "";
                for (const key in schema.properties) {
                    const property = schema.properties[key];
                    markdown += `${"  ".repeat(level)}- \`${key}\` (${
                        property.type
                    })${
                        property.description ? `: ${property.description}` : ""
                    }\n`;
                    if (property.properties) {
                        markdown += schemaToMarkdown(property, level + 1);
                    }
                }
                return markdown;
            };

            docs += `Properties:\n`;
            docs += schemaToMarkdown(func.definition.schema);
        }

        // move up to root, where turbo.json is located
        const walkUp = (dir: string): string => {
            const turboJsonPath = path.join(dir, "turbo.json");
            if (fs.existsSync(turboJsonPath)) {
                return dir;
            }
            return walkUp(path.join(dir, ".."));
        };

        const root = walkUp(cwd);

        fs.writeFileSync(
            path.join(root, "docs", "tools", type, `${nameWithoutSuffix}.mdx`),
            docs
        );

        const mintConfig = JSON.parse(
            fs.readFileSync(path.join(root, "docs", "mint.json"), "utf8")
        );

        const toolConfig = mintConfig.navigation.find((item: any) => {
            if (type === "utils") {
                return item.group === "Utility Tools";
            }
            if (type === "api") {
                return item.group === "API Tools";
            }
            if (type === "file") {
                return item.group === "File Tools";
            }
        });

        if (!toolConfig) {
            throw new Error(`Could not find tool config for type ${type}`);
        }

        if (!toolConfig.pages.includes(`tools/${type}/${nameWithoutSuffix}`)) {
            toolConfig.pages.push(`tools/${type}/${nameWithoutSuffix}`);
            mintConfig.navigation = mintConfig.navigation.map((item: any) => {
                if (type === "utils" && item.group === "Utility Tools") {
                    return toolConfig;
                }
                if (type === "api" && item.group === "API Tools") {
                    return toolConfig;
                }
                if (type === "file" && item.group === "File Tools") {
                    return toolConfig;
                }

                return item;
            });
        }

        fs.writeFileSync(
            path.join(root, "docs", "mint.json"),
            JSON.stringify(mintConfig, null, 4)
        );
    });

program.parse();
