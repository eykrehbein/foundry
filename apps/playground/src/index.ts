import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import { runLangchainPromptChain } from "./examples/langchain-openai.js";

const app = express();

app.use(bodyParser.json());

app.post("/langchain/openai", async (req, res) => {
    const promptRes = await runLangchainPromptChain({
        prompt: req.body.prompt,
    });

    res.json({
        promptRes,
    });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Example app listening on port " + PORT);
});
