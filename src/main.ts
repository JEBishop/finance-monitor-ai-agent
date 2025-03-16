import { Actor } from 'apify';
import log from '@apify/log';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import type { Input, Report } from './types.js'
import { responseSchema } from './types.js'
import { agentTools } from './tools.js'
import { setContextVariable } from "@langchain/core/context";
import { RunnableLambda } from "@langchain/core/runnables";
import { generateMarketReport } from './utils.js';

await Actor.init();

const input = await Actor.getInput<Input>();
if (!input) throw new Error('No input provided.');

await Actor.charge({ eventName: 'init' });

const { OPENAI_API_KEY, researchRequest } = input;

let llmAPIKey;
if(!OPENAI_API_KEY || OPENAI_API_KEY.length == 0) {
  llmAPIKey = process.env.OPENAI_API_KEY;
  await Actor.charge({ eventName: 'llm-input', count: researchRequest.length });
} else {
  llmAPIKey = OPENAI_API_KEY;
}

const agentModel = new ChatOpenAI({ 
  apiKey: llmAPIKey,
  modelName: "gpt-4o-mini",  
}).bind({
  response_format: { type: "json_object" },
  tools: agentTools
});

const agent = createReactAgent({
  llm: agentModel,
  tools: agentTools,
  responseFormat: responseSchema
});

try {
  const handleRunTimeRequestRunnable = RunnableLambda.from(
    async ({ researchRequest: researchRequest }) => {
      setContextVariable("researchRequest", researchRequest);
      const modelResponse = await agent.invoke({
        messages: [new HumanMessage(`
          You are an expert financial analyst. You are tasked with helping a client perform financial research.
          The current date is ${(new Date()).toLocaleDateString()}

          STEP 1: Understand User Requirements:
            - Extract key details from the user's request: "${researchRequest}", including:
                - Companys and/or financial products to research. determine the stock/crypto ticker(s) that represent the companies and/or financial products.
                - !IMPORTANT! If a user request includes a cryptocurrency, focus on the asset itself and not ETFs or wrappers.
                - If the user includes a timeframe in their request, extrapolate it in the form of a start date and end date
                - If the user does not include a timeframe, default to the previous 30 days.

          STEP 2: Gather stock quote date:
            - Retrieve stock quote data using the get_ticker_details tool.
            - Search the web for news related to the company.

          STEP 3: Return the results:
            - Immediately return this in the form of a JSON object and stop any further processing.
        `)]
      }, {
        recursionLimit: 10
      });
      return modelResponse.structuredResponse as Report;
    }
  );

  const output: Report = await handleRunTimeRequestRunnable.invoke({ researchRequest: researchRequest });

  log.info(JSON.stringify(output));

  const formattedOutput = {
    html: generateMarketReport(output),
    json: output
  }

  await Actor.pushData(formattedOutput);
} catch (err: any) {
  log.error(err);
  await Actor.pushData({ error: err.message });
}

await Actor.exit();