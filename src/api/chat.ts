import type { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";
import OpenAI from "openai";
import { projectSummaries } from "../../lib/projectSummaries"; // adjust path if needed

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

  try {
    const { userMessage, projectSlug } = req.body;
    console.log("📩 Request Body:", req.body);

    if (!userMessage || !projectSlug) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const project = projectSummaries.find((p) => p.slug === projectSlug);

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    const systemPrompt = project.fullText
      ? `You are a helpful portfolio assistant. Here is the full case study:\n${project.fullText}`
      : `You are a helpful portfolio assistant. Here is the project background:\n${project.summary}`;

    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userMessage,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages,
    });

    const reply =
      completion.choices[0]?.message?.content ??
      "Sorry, I couldn't generate a response.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Error generating response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
