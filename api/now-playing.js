const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

async function getAccessToken() {
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    })
  });
  const data = await resp.json();
  return data.access_token;
}

export default async function handler(req, res) {
  try {
    const accessToken = await getAccessToken();
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    });

    if (response.status === 204 || response.status > 400) {
      return res.status(200).json({ isPlaying: false });
    }

    const data = await response.json();
    const item = data.item;
    const song = {
      isPlaying: data.is_playing,
      title: item.name,
      artist: item.artists.map(a => a.name).join(', '),
      albumImageUrl: item.album.images[0].url,
      songUrl: item.external_urls.spotify,
    };

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
    return res.status(200).json(song);
  } catch (e) {
    return res.status(500).json({ error: 'Failed to fetch now playing' });
  }
}
