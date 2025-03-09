import { tool } from '@langchain/core/tools';
import { ApifyClient } from 'apify-client';
import { z } from 'zod';
import log from '@apify/log';

const client = new ApifyClient({
  token: process.env.APIFY_TOKEN,
});

const getTickerDetailsTool = tool(
  async (input) => {
    log.info('in get_ticker_details');
    log.info(JSON.stringify(input));
    try {
      const tickerPromises = input.tickers.map(async (ticker) => {
        // harvest/yahoo-finance-scraper
        const run = await client.actor('ePrlj3ncTVblYLYzQ').call({
          ticker: ticker.ticker,
          startDate: ticker.startDate,
          endDate: ticker.endDate
        });
        const { items: tickerQuotes } = await client.dataset(run.defaultDatasetId).listItems();
      
        log.info(`Found ${tickerQuotes.length} quotes for ${ticker.ticker}.`);
        return tickerQuotes;
      });

      const quotes = await Promise.all(tickerPromises);
      return JSON.stringify(quotes);
    } catch (err: any) {
      log.error('get_ticker_details error: ' + err.message);
      return JSON.stringify([]);
    }
  },
  {
    name: 'get_ticker_details',
    description: 'Fetch stock/crypto ticker details.',
    schema: z.object({
      tickers: z.array(
        z.object({
          ticker: z.string().describe('Stock/crypto ticker symbol'),
          startDate: z.string().describe('Start date in YYYY-MM-DD format'),
          endDate: z.string().describe('End date in YYYY-MM-DD format')
        })
      )
    })
  }
);

export const agentTools = [
  getTickerDetailsTool
];