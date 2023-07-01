declare class RandomTool {
    constructor();
    randomInteger: (args: {
        type: "positive" | "negative" | "any";
    }) => any;
}

export { RandomTool as default };
