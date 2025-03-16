export interface Input {
  researchRequest: string;
  OPENAI_API_KEY: string;
}

export interface Report {
  results: { summaryDetail: SummaryDetail; price: Price };
  chart: Chart;
  news: News[];
}

export const responseSchema = {
  type: "object",
  properties: {
      results: {
          type: "object",
          properties: {
              summaryDetail: { type: "object" },
              price: { type: "object" }
          },
          required: ["summaryDetail", "price"]
      },
      chart: {
          type: "object",
          properties: {
              meta: { type: "object" },
              quotes: {
                  type: "array",
                  items: {
                      type: "object",
                      properties: {
                          date: { type: "string", format: "date-time" },
                          high: { type: "number" },
                          volume: { type: "integer" },
                          open: { type: "number" },
                          low: { type: "number" },
                          close: { type: "number" },
                          adjclose: { type: "number" }
                      },
                      required: ["date", "high", "volume", "open", "low", "close", "adjclose"]
                  }
              },
              events: {
                  type: "object",
                  properties: {
                      dividends: {
                          type: "array",
                          items: {
                              type: "object",
                              properties: {
                                  amount: { type: "number" },
                                  date: { type: "integer" }
                              },
                              required: ["amount", "date"]
                          }
                      }
                  }
              }
          },
          required: ["meta", "quotes"]
      },
      news: {
          type: "array",
          items: {
              type: "object",
              properties: {
                  uuid: { type: "string" },
                  title: { type: "string" },
                  publisher: { type: "string" },
                  link: { type: "string", format: "uri" },
                  providerPublishTime: { type: "string", format: "date-time" },
                  type: { type: "string" },
                  thumbnail: {
                      type: "object",
                      properties: {
                          resolutions: {
                              type: "array",
                              items: {
                                  type: "object",
                                  properties: {
                                      url: { type: "string", format: "uri" },
                                      width: { type: "integer" },
                                      height: { type: "integer" },
                                      tag: { type: "string" }
                                  },
                                  required: ["url", "width", "height", "tag"]
                              }
                          }
                      }
                  },
                  relatedTickers: {
                      type: "array",
                      items: { type: "string" }
                  }
              },
              required: ["uuid", "title", "publisher", "link", "providerPublishTime", "type"]
          }
      }
  },
  required: ["results", "chart", "news"]
};

interface SummaryDetail {
  maxAge: number;
  priceHint: number;
  previousClose: number;
  open: number;
  dayLow: number;
  dayHigh: number;
  regularMarketPreviousClose: number;
  regularMarketOpen: number;
  regularMarketDayLow: number;
  regularMarketDayHigh: number;
  dividendRate: number;
  dividendYield: number;
  exDividendDate: string;
  payoutRatio: number;
  fiveYearAvgDividendYield: number;
  beta: number;
  trailingPE: number;
  forwardPE: number;
  volume: number;
  regularMarketVolume: number;
  averageVolume: number;
  averageVolume10days: number;
  averageDailyVolume10Day: number;
  bid: number;
  ask: number;
  bidSize: number;
  askSize: number;
  marketCap: number;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
  priceToSalesTrailing12Months: number;
  fiftyDayAverage: number;
  twoHundredDayAverage: number;
  trailingAnnualDividendRate: number;
  trailingAnnualDividendYield: number;
  currency: string;
}

interface Price {
  maxAge: number;
  volume: string;
  preMarketSource: string;
  postMarketChangePercent: number;
  postMarketChange: number;
  postMarketTime: string;
  postMarketPrice: number;
  regularMarketChangePercent: number;
  regularMarketChange: number;
  regularMarketTime: string;
  priceHint: number;
  regularMarketPrice: number;
  exchange: string;
  exchangeName: string;
  symbol: string;
  shortName: string;
  longName: string;
  currency: string;
  marketCap: number;
}

interface ChartMeta {
  currency: string;
  symbol: string;
  exchangeName: string;
  regularMarketTime: string;
  regularMarketPrice: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
}

interface Quote {
  date: string;
  high: number;
  volume: number;
  open: number;
  low: number;
  close: number;
  adjclose: number;
}

interface Chart {
  meta: ChartMeta;
  quotes: Quote[];
  events: { dividends: { amount: number; date: number }[] };
}

interface News {
  uuid: string;
  title: string;
  publisher: string;
  link: string;
  providerPublishTime: string;
  type: string;
  relatedTickers: string[];
}