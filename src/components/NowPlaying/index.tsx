/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import defaultTheme from "../Theme";

const Wrapper = styled.div`
  margin-top: ${defaultTheme.space[4]};
`;

const SongLink = styled.a`
  color: ${defaultTheme.color.link};
`;

interface Song {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

export default function NowPlaying() {
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    fetch("/api/now-playing")
      .then(res => res.json())
      .then(data => setSong(data))
      .catch(() => setSong(null));
  }, []);

  if (!song) {
    return <Wrapper>Loading current song…</Wrapper>;
  }

  if (!song.isPlaying) {
    return <Wrapper>Not listening to anything right now.</Wrapper>;
  }

  return (
    <Wrapper>
      Now Playing: {" "}
      <SongLink href={song.songUrl} target="_blank" rel="noopener noreferrer">
        {song.title} – {song.artist}
      </SongLink>
    </Wrapper>
  );
}
