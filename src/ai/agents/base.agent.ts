import { Agent, run } from '@openai/agents';
import { env } from '@/config';
import { weatherTool } from '../';
export const agent = new Agent({
  name: 'Base Agent',
  instructions: 'You are a helpful assistant. say hello to user',
  model: env.OPENAI_API_MODEL,
  tools: [weatherTool],
});

const runAgent = async (prompt: string) => {
  const result = await run(agent, prompt);
  console.log(result.finalOutput);

  return result.finalOutput;
};

// runAgent('Write a haiku about recursion in programming.');
runAgent(
  'Hello, My name is Mirza Ali Baig. I am a programmer and I am using you inside my Node.js application.',
);
