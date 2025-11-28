import { OpenAI } from 'openai';
import { setDefaultOpenAIClient, setOpenAIAPI, setTracingDisabled } from '@openai/agents';
import { env } from '@/config';

const client = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  baseURL: env.OPENAI_API_BASE_URL,
});
setDefaultOpenAIClient(client);
setTracingDisabled(true);
setOpenAIAPI('chat_completions');
