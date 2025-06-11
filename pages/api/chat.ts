import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import { getProjectContext } from '../../lib/projectData';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { userMessage, projectSlug } = req.body as {
    userMessage?: string;
    projectSlug?: string;
  };

  if (!userMessage) {
    return res.status(400).json({ error: 'Missing userMessage' });
  }

  const projectContext = getProjectContext(projectSlug || '');

  const messages = [
    {
      role: 'system',
      content:
        "You are Sam's portfolio chatbot. Answer as if you're Sam — casual, thoughtful, and helpful. Here's project context: " +
        projectContext,
    },
    { role: 'user', content: userMessage },
  ];

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    });

    const assistantReply =
      completion.data.choices[0].message?.content?.trim() || '';

    return res.status(200).json({ reply: assistantReply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch reply' });
  }
}
