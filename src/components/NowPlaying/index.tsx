/** @jsx jsx */
import { jsx } from "@emotion/react";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import defaultTheme from "../Theme";

const Wrapper = styled.div<{ bgColor?: string }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${defaultTheme.space[3]};
  min-height: 64px;
  margin-bottom: ${defaultTheme.space[3]};
  padding: ${defaultTheme.space[2]};
  border-radius: 8px;
  background: ${defaultTheme.color.background || "#ffffff"};
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: ${({ bgColor }) =>
    bgColor
      ? `linear-gradient(rgba(${bgColor}, 0.3), rgba(${bgColor}, 0.3))`
      : "transparent"};
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const AlbumArtWrapper = styled.div`
  width: 64px;
  height: 64px;
  flex-shrink: 0;
`;



const AlbumArt = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
  display: block;
`;

const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  justify-content: center;
`;

const TextBlock = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;

  max-height: 2.8em; /* ~2 lines of text */
  line-height: 1.4em;
`;

const NowPlayingLabel = styled.div`
font-size: ${defaultTheme.fontSizes[1]};
margin-bottom: 0.25rem;
  color: ${defaultTheme.color.text || "inherit"};
`;

const SongLink = styled.a`
  display: inline-block;
  color: ${defaultTheme.color.link};
  text-decoration: none !important;
  border-bottom: none !important;  /* 👈 This is the fix */

  -webkit-text-decoration: none !important;
  line-height: 1.4;

  &:hover,
  &:visited,
  &:active {
    text-decoration: none !important;
    -webkit-text-decoration: none !important;
  }
`;

const BarsContainer = styled.div`
  display: inline-flex;
  align-items: end;
  gap: 2px;
  margin-left: 8px;
  height: 14px;
`;

const ContentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
`;

const Bar = styled.div<{ delay: string }>`
  width: 3px;
  height: 100%;
  border-radius: 2px;
  background-color: ${defaultTheme.color.link};
  animation: bounce 1s infinite ease-in-out;
  animation-delay: ${({ delay }) => delay};

  @keyframes bounce {
    0%, 100% {
      transform: scaleY(0.3);
    }
    50% {
      transform: scaleY(1);
    }
  }
`;

interface Song {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

const LiveBars = () => {
  return (
    <BarsContainer>
      <Bar delay="0s" />
      <Bar delay="0.2s" />
      <Bar delay="0.4s" />
    </BarsContainer>
  );
};

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
            setBgColor(`${r}, ${g}, ${b}`);
          } catch (e) {
            console.error("Color extraction error:", e);
          }
        };
      })
      .catch((err) => console.error("Failed to load color-thief:", err));

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
      <AlbumArtWrapper>
        {song.albumImageUrl && (
          <AlbumArt
            src={`/api/image-proxy?url=${encodeURIComponent(song.albumImageUrl)}`}
            alt={`${song.title} album cover`}
            crossOrigin="anonymous"
          />
        )}
      </AlbumArtWrapper>
      <ContentRow>
        <SongInfo>
          <NowPlayingLabel>Sam is jamming to</NowPlayingLabel>
          <SongLink href={song.songUrl} target="_blank" rel="noopener noreferrer">
            <TextBlock>
              {song.title} by {song.artist}
            </TextBlock>    </SongLink>
        </SongInfo>
        <LiveBars />
      </ContentRow>
    </Wrapper>
  );
}
