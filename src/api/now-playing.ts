import dotenv from "dotenv";
dotenv.config();

import type { GatsbyFunctionRequest, GatsbyFunctionResponse } from "gatsby";
import axios from "axios";
import qs from "qs";

export default async function handler(
  req: GatsbyFunctionRequest,
  res: GatsbyFunctionResponse
) {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN?.trim();
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();

  if (!refreshToken || !clientId || !clientSecret) {
    console.error("Missing Spotify env variables", {
      clientId,
      clientSecret,
      refreshToken,
    });
    return res
      .status(500)
      .json({ error: "Missing Spotify environment variables." });
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  console.log("Refresh token length:", refreshToken.length);

  try {
    // 1. Get a new access token
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      qs.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // 2. Get currently playing track
    const trackResponse = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (
      trackResponse.status === 204 ||
      !trackResponse.data ||
      !trackResponse.data.item
    ) {
      return res.status(200).json({ isPlaying: false });
    }

    const track = trackResponse.data.item;

    return res.status(200).json({
      isPlaying: trackResponse.data.is_playing,
      title: track.name,
      artist: track.artists.map((a: any) => a.name).join(", "),
      albumImageUrl: track.album.images[0]?.url,
      songUrl: track.external_urls.spotify,
    });
  } catch (err: any) {
    console.error("Spotify error:", {
      message: err.message,
      responseData: err.response?.data,
      status: err.response?.status,
    });
    return res
      .status(500)
      .json({ error: "Failed to load now playing data from Spotify." });
  }
}
