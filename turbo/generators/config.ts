import { PlopTypes } from "@turbo/gen";

const installPackages: PlopTypes.CustomActionFunction = async (props: any) => {
    // run yarn without deps
    const execa = await import("execa");
    await execa.execa("yarn");

    await execa.execa("yarn", [
        "workspace",
        "@usefoundry/foundry",
        "add",
        `@usefoundry/tools-${props.type}-${props.name
            .toLowerCase()
            .replace(/[\s_]+/g, "-")}@0.1.0`,
    ]);

    return 'Installed packages with "yarn"';
};

export default function generator(plop: PlopTypes.NodePlopAPI): void {
    plop.setGenerator("tool", {
        description: "Generates a new tool",
        prompts: [
            {
                type: "input",
                name: "name",
                message:
                    "The name of the tool to create, e.g. 'zoomApi', 'pdf', etc.",
                validate: (input: string) => {
                    if (input.includes(".")) {
                        return "tool name cannot include an extension";
                    }
                    if (input.includes(" ")) {
                        return "tool name cannot include spaces";
                    }
                    if (!input) {
                        return "tool name is required";
                    }
                    return true;
                },
            },
            {
                type: "list",
                name: "type",
                message: "What type of tool is this?",
                choices: ["api", "file", "utils"],
            },
        ],
        actions: [
            {
                type: "addMany",
                destination:
                    "{{ turbo.paths.root }}/packages/tools/{{type}}/{{ camelCase name }}",
                templateFiles: "templates/tool/{{ type }}/**/*.hbs",
                base: "templates/tool/{{ type }}",
            },
            installPackages,
        ],
    });
}
