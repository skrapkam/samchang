import type { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";
import { OpenAI } from "openai";
import {
  samPersona,
  samAnswerStyle,
  samPrinciples,
  samFunFacts,
  projectSummaries,
} from "../../lib/projectSummaries";

// This is fine!
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { userMessage } = req.body;

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
    {
      role: "user",
      content: userMessage,
    },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
      temperature: 0.7,
    });

    const reply = response.choices[0].message?.content || "Sorry, no response generated.";
    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate response" });
  }
}
