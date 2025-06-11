/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import defaultTheme from "../Theme";

const Wrapper = styled.div<{ bgColor?: string }>`
  display: flex;
  align-items: center;
  gap: ${defaultTheme.space[3]};
  min-height: 64px; /* Reserve space to prevent jump */
  margin-bottom:  ${defaultTheme.space[3]};
  padding: ${defaultTheme.space[2]};
  border-radius: 8px;
  background: ${props => props.bgColor || "transparent"};
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
  const [bgColor, setBgColor] = useState<string | null>(null);

  useEffect(() => {
    const fetchSong = () => {
      fetch("/api/now-playing")
        .then((res) => res.json())
        .then((data) => setSong(data))
        .catch(() => setSong(null));
    };

    fetchSong();
    const interval = setInterval(fetchSong, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!song?.albumImageUrl) return;

    let canceled = false;
    import("color-thief-browser")
      .then(({ default: ColorThief }) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = `/api/image-proxy?url=${encodeURIComponent(song.albumImageUrl!)}`;
        img.onload = () => {
          if (canceled) return;
          try {
            const thief = new ColorThief();
            const [r, g, b] = thief.getColor(img);
            setBgColor(`rgb(${r}, ${g}, ${b})`);
          } catch (e) {
            console.error(e);
          }
        };
      })
      .catch((err) => console.error(err));

    return () => {
      canceled = true;
    };
  }, [song?.albumImageUrl]);

  if (!song) {
    return <Wrapper>Loading current song…</Wrapper>;
  }

  if (!song.isPlaying) {
    return null;
  }

  return (
    <Wrapper bgColor={bgColor || undefined}>
      <SongInfo>
        <span>Currently listening to: </span>
        <SongLink href={song.songUrl} target="_blank" rel="noopener noreferrer">
          {song.title} – {song.artist}
        </SongLink>
      </SongInfo>
      <AlbumArtWrapper>
        {song.albumImageUrl && (
          <AlbumArt
            src={`/api/image-proxy?url=${encodeURIComponent(song.albumImageUrl)}`}
            alt={`${song.title} album cover`}
            crossOrigin="anonymous"
          />
        )}
      </AlbumArtWrapper>
    </Wrapper>
  );
}
