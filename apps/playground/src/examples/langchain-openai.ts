import { Foundry, Tools } from "@usefoundry/foundry";
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
    SystemChatMessage,
    HumanChatMessage,
    AIChatMessage,
} from "langchain/schema";

const foundry = new Foundry({
    tools: [
        new Tools.API.WeatherApi({
            apiKey: process.env.WEATHER_API_KEY!,
        }),
        new Tools.Files.Csv(),
        new Tools.Utils.Calculator(),
    ],
});

const predictFunction = async (
    messages: (SystemChatMessage | HumanChatMessage | AIChatMessage)[],
    llm: ChatOpenAI
) => {
    const stepRes = await llm.predictMessages(messages, {
        functions: foundry.getPreparedFunctions({ target: "openai" }),
        function_call: "auto",
    });

    if (stepRes.additional_kwargs.function_call?.name) {
        return {
            name: stepRes.additional_kwargs.function_call.name,
            arguments: stepRes.additional_kwargs.function_call.arguments,
        };
    }

    return null;
};

export const runLangchainPromptChain = async ({
    prompt,
}: {
    prompt: string;
}) => {
    const model = new ChatOpenAI({
        modelName: "gpt-4-0613",
        temperature: 0,
    });

    const messages = [
        new SystemChatMessage(`
        Context:
        - Current date: ${new Date().toDateString()}
    `),
        new HumanChatMessage(prompt),
    ];

    let run = true;

    const executedFunctions = [];

    while (run) {
        const stepRes = await predictFunction(messages, model);
        console.log({ stepRes });
        if (!stepRes) {
            run = false;
            break;
        }

        const functionCallResult = await foundry.runSelectedFunction(stepRes);
        executedFunctions.push(stepRes);

        messages.push(
            new AIChatMessage(`
            Call function: 
            - name: ${stepRes.name}
            - arguments: ${stepRes.arguments?.toString()}
        `)
        );

        messages.push(
            new SystemChatMessage(`
            Function result:
            ${JSON.stringify(functionCallResult)}
        `)
        );

        messages.push(
            new HumanChatMessage(
                `If you have not solved every sub-task of the prompt yet, please continue. Otherwise, don't call a function.`
            )
        );
    }

    return { executedFunctions };
};
