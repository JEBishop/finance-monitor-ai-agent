import type { Report } from './types.js'

export const generateMarketReport = (data: Report) => {
  // Extract symbol from the data
  const symbol = data?.ticker;

  // Extract price data
  const currentPrice = data?.results?.summaryDetail?.regularMarketPrice ?? data?.results?.price?.regularMarketPrice;
  const previousClose = data?.results?.summaryDetail?.previousClose ?? data?.results?.price?.regularMarketPreviousClose;
  const priceChange = data?.results?.price?.regularMarketChange ?? data?.results?.summaryDetail?.regularMarketChange;
  const percentChange = data?.results?.price?.regularMarketChangePercent ?? data?.results?.summaryDetail?.regularMarketChangePercent;
  
  // Extract other metrics
  const marketCap = data?.results?.summaryDetail?.marketCap ?? data?.results?.price?.marketCap;
  const fiftyTwoWeekLow = data?.results?.summaryDetail?.fiftyTwoWeekLow ?? data?.results?.price?.fiftyTwoWeekLow;
  const fiftyTwoWeekHigh = data?.results?.summaryDetail?.fiftyTwoWeekHigh ?? data?.results?.price?.fiftyTwoWeekHigh;
  const trailingPE = data?.results?.summaryDetail?.trailingPE ?? data?.results?.price?.trailingPE;
  const dividendRate = data?.results?.summaryDetail?.dividendRate ?? data?.results?.price?.dividendRate;
  const dividendYield = (data?.results?.summaryDetail?.dividendYield ?? data?.results?.price?.dividendYield) * 100;
  const beta = data?.results?.summaryDetail?.beta ?? data?.results?.price?.beta;
  const volume = data?.results?.summaryDetail?.volume ?? data?.results?.price?.volume;
  
  const quotes = data?.chart?.quotes;
  const startDate = new Date(quotes?.[0]?.date);
  const endDate = new Date(quotes?.[quotes?.length - 1]?.date);
  
  const formatDate = (date: Date) => {
    return `${date?.getMonth() + 1}/${date?.getDate()}/${date?.getFullYear()}`;
  };
  
  const dateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;
  
  const newsItems = data?.news?.map((item: any) => {
    return `<li><a href='${item.link}' target='_blank'>${item?.title}</a></li>`;
  })?.join('');
  
  const html = `
    <!DOCTYPE html>
    <html lang='en'>
    <head>
      <meta charset='UTF-8'>
      <meta name='viewport' content='width=device-width, initial-scale=1.0'>
      <title>Market Summary: ${symbol}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 20px;
          max-width: 800px;
        }
        h1, h2 {
          margin-bottom: 10px;
        }
        ul {
          padding-left: 20px;
        }
        .report-footer {
          margin-top: 20px;
          font-size: 0.9em;
          color: #666;
        }
      </style>
    </head>
    <body>
      <h1>Market Summary: ${symbol}</h1>
      <h2>${dateRange}</h2>
      <h3>Price Movement</h3>
      <ul>
        <li>Starting Price: $${quotes?.[0]?.close}</li>
        <li>Current Price: $${currentPrice}</li>
        <li>Previous Closing Price: $${previousClose}</li>
        <li>Change: ${priceChange >= 0 ? 'up' : 'down'} ${priceChange} (${percentChange}%)</li>
        <li>Trading Volume: ${volume}</li>
      </ul>
      <h3>Key Headlines</h3>
      <ul>
        ${newsItems}
      </ul>
      <h3>Market Metrics</h3>
      <ul>
        <li>Market Cap: ${marketCap}</li>
        <li>52-Week Range: $${fiftyTwoWeekLow} - $${fiftyTwoWeekHigh}</li>
        <li>P/E Ratio: ${trailingPE}</li>
        <li>Dividend Rate: ${dividendRate}%</li>
        <li>Dividend Yield: ${dividendYield.toFixed(2)}%</li>
      </ul>
      <div class='report-footer'>Report generated on ${formatDate(new Date())}</div>
    </body>
    </html>
  `;
  
  return html?.replace(/\n/g, '');
};