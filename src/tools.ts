import { tool } from '@langchain/core/tools';
import { ApifyClient } from 'apify-client';
import { z } from 'zod';
import log from '@apify/log';
import OpenAI from "openai";

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

const getTickerDetailsTool = tool(
  async (input) => {
    log.info('in get_ticker_details');
    log.info(JSON.stringify(input));
    try {
      // harvest/yahoo-finance-scraper
      const run = await client.actor('WcaJxyaQoz7dJhRUX').call({
        ticker: input.ticker,
        startDate: input.startDate,
        endDate: input.endDate
      });
      const { items: tickerQuotes } = await client.dataset(run.defaultDatasetId).listItems();
      log.info(`Found ${tickerQuotes.length} quotes for ${input.ticker}.`);
      return JSON.stringify(tickerQuotes);
    } catch (err: any) {
      log.error('get_ticker_details error: ' + err.message);
      return JSON.stringify([]);
    }
  },
  {
    name: 'get_ticker_details',
    description: 'Fetch stock/crypto ticker details.',
    schema: 
      z.object({
        ticker: z.string().describe('Stock/crypto ticker symbol'),
        startDate: z.string().describe('Start date in YYYY-MM-DD format'),
        endDate: z.string().describe('End date in YYYY-MM-DD format')
    })
  }
);

/**
 * gpt-4o-search-preview
 */
const webSearchTool = tool(
  async (input) => {
    log.info('in search_query_tool');
    log.info(JSON.stringify(input));
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini-search-preview",
      messages: [{
          "role": "user",
          "content": input.topic,
      }],
    });
    return JSON.stringify(completion.choices[0].message.content);
  }, {
    name: 'search_query_tool',
    description: 'Search the web for news about a topic.',
    schema: z.object({
      topic: z.string().describe("The topic to search for news about")
    })
  }
);

export const agentTools = [
  getTickerDetailsTool,
  webSearchTool
];