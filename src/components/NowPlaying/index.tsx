/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import defaultTheme from "../Theme";

const Wrapper = styled.div`
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: ${defaultTheme.space[3]};
`;

const AlbumArt = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 4px;
`;

const SongInfo = styled.div`
`;

const SongLink = styled.a`
 
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
   
      <SongInfo>
        <span>Currently listening to:{" "}</span>
        <SongLink href={song.songUrl} target="_blank" rel="noopener noreferrer">
           {song.title} – {song.artist}
        </SongLink>
      </SongInfo>
      {song.albumImageUrl && (
        <AlbumArt src={song.albumImageUrl} alt={`${song.title} album cover`} />
      )}
    </Wrapper>
  );
}
