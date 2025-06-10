/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import defaultTheme from "../Theme";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.space[3]};
  min-height: 64px; /* Reserve space to prevent jump */
`;

const AlbumArtWrapper = styled.div`
  width: 64px;
  height: 64px;
  flex-shrink: 0;
`;

const SongInfo = styled.div`
  flex-direction: column;
  min-width: 0;
`;

const SongLink = styled.a`
  color: ${defaultTheme.color.link};
  text-decoration: none;
`;

const AlbumArt = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
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
      .then((res) => res.json())
      .then((data) => setSong(data))
      .catch(() => setSong(null));
  }, []);

  if (!song) {
    return <Wrapper>Loading current song…</Wrapper>;
  }

  if (!song.isPlaying) {
    return null;
  }

  return (
    <Wrapper>
      <SongInfo>
        <span>Currently listening to: </span>
        <SongLink href={song.songUrl} target="_blank" rel="noopener noreferrer">
          {song.title} – {song.artist}
        </SongLink>
      </SongInfo>
      <AlbumArtWrapper>
        {song.albumImageUrl && (
          <AlbumArt
            src={song.albumImageUrl}
            alt={`${song.title} album cover`}
          />
        )}
      </AlbumArtWrapper>
    </Wrapper>
  );
}
