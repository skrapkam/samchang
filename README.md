# ✨ Sam Chang ✨

This is the code that powers [samchang.design](https://samchang.design).

## Development

Clone the repository:
`git clone https://github.com/skrapkam/samchang.git`

Install [Gatsby](https://www.gatsbyjs.org/): `npm i -g gatsby-cli`

`cd` into the directory:
`cd samchang`

Run `npm install` or `yarn` to install dependencies

Run `gatsby develop`

Open the site:
`localhost:8000`

🎉🎉🎉

## Spotify Now Playing

Create a `.env` file (or `.env.development`/`.env.production` depending on the environment) with the following variables:

```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token
```

These values are used by `api/now-playing.js` to query Spotify's API.

## Remote Mouse Mirroring

Run the WebSocket server:
```bash
npm start
```

In a separate terminal run Gatsby:
```bash
gatsby develop
```
Open multiple tabs at `localhost:8000` to see ghost cursors following other visitors.
