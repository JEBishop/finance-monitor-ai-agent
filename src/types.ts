export interface Input {
  researchRequest: string;
  OPENAI_API_KEY: string;
}

export interface Output {
  analysis: string;
}

export const responseSchema = {
  type: "object",
  properties: {
    analysis: {
      type: "string",
    },
  },
  required: ["analysis"]
};