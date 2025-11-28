import { tool } from '@openai/agents';
import z from 'zod';

export const weatherTool = tool({
  name: 'weather',
  description: 'useful for when you want to get the current weather in a given location',
  parameters: z.object({
    city: z.string().describe('the city and state, e.g. San Francisco, CA'),
  }),
  execute: async ({ city }) => {
    return `the weather in ${city} is 70 degrees`;
  },
});
