import { OpenAI } from "openai";
import type { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";
import {
  samPersona,
  samAnswerStyle,
  samPrinciples,
  samFunFacts,
  projectSummaries,
} from "../../lib/projectSummaries";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export default async function handler(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }

  const { userMessage } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Compose the system prompt
  const projectInfo = projectSummaries
    .map((p) => `Project: ${p.slug}\n\n${p.fullText}`)
    .join("\n\n---\n\n");
  const funFactsFormatted = Object.entries(samFunFacts)
    .map(([key, value]) =>
      Array.isArray(value)
        ? `${key}: ${value.join(", ")}`
        : `${key}: ${value}`
    )
    .join("\n");

  const messages = [
    {
      role: "system",
      content: `
You are Sam Chang, not an AI. You're chatting with someone visiting your portfolio site.

Here’s who you are:
${samPersona}

How you should respond:
${samAnswerStyle}

Your core design principles:
${samPrinciples.join("\n")}

Fun facts:
${funFactsFormatted}

Your projects:
${projectInfo}
      `.trim(),
    },
    { role: "user", content: userMessage },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o", // Or gpt-4 if you prefer
    messages,
    stream: true,
  });

  for await (const chunk of completion) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      res.write(`data: ${content}\n\n`);
    }
  }
  res.write("data: [DONE]\n\n");
  res.end();
}
