import type { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";

export default async function handler(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  const urlParam = req.query.url;
  if (!urlParam || typeof urlParam !== "string") {
    res.status(400).json({ error: "Missing url" });
    return;
  }

  try {
    const response = await fetch(urlParam);
    if (!response.ok) {
      res.status(response.status).json({ error: "Failed to fetch image" });
      return;
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).end(buffer);
  } catch (err) {
    res.status(500).json({ error: "Proxy error" });
  }
}
