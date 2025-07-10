/** @jsx jsx */

import { css, jsx } from "@emotion/react";
import { useState, useEffect, useRef } from "react";
import Nav from "../../components/Nav";
import Menu from "../../components/Menu";
import {
  MediumSectionWrapper,
  Grid,
  CoverTitle
} from "../../styles/styles";
import Page from "../../components/Page";
import Header from "../../components/Header";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import styled from "@emotion/styled";
import defaultTheme from "../../components/Theme";

// More realistic jewel case with thick plastic borders
const JewelCase = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 280px;
  margin: 0 auto 2.4rem auto;
  perspective: 1200px;
`;

interface CaseFrameProps {
  rotateX: number;
  rotateY: number;
  isActive: boolean;
}

const CaseFrame = styled.div<CaseFrameProps>`
  position: relative;
  width: 100%;
  background: linear-gradient(145deg, #fafafa 0%, #f0f0f0 100%);
  border-radius: 0;
  box-shadow: 
    0 8px 24px rgba(0,0,0,0.2),
    0 2px 6px rgba(0,0,0,0.1),
    inset 0 1px 0 rgba(255,255,255,0.9);
  padding: 0;
  overflow: visible;
  transform: rotateY(${props => props.rotateY}deg) rotateX(${props => props.rotateX}deg);
  transition: transform 0.18s cubic-bezier(0.4, 0.7, 0.2, 1);
  z-index: ${props => (props.isActive ? 2 : 1)};
  /* Remove top/bottom edge and gloss */
  &:before, &:after {
    display: none;
  }
`;

const CaseSpine = styled.div`
  position: absolute;
  left: -16px;
  top: -4px;
  bottom: -4px;
  width: 16px;
  background: 
    /* Horizontal lines texture pattern */
    repeating-linear-gradient(0deg,
      rgba(15,15,15,0.98) 0px,
      rgba(25,25,25,0.95) 0.5px,
      rgba(35,35,35,0.92) 1px,
      rgba(25,25,25,0.95) 1.5px,
      rgba(15,15,15,0.98) 2px
    ),
    /* Base gradient */
    linear-gradient(90deg, 
      rgba(20,20,20,0.95) 0%, 
      rgba(40,40,40,0.9) 30%, 
      rgba(60,60,60,0.85) 70%, 
      rgba(30,30,30,0.9) 100%);
  border-radius: 1px 0 0 1px;
  border: 1px solid rgba(0,0,0,0.3);
  border-right: none;
  box-shadow: 
    inset 2px 0 4px rgba(255,255,255,0.1),
    inset -1px 0 2px rgba(0,0,0,0.4),
    -3px 0 8px rgba(0,0,0,0.3);
  z-index: 1;
  transform: perspective(600px) rotateY(-10deg);
  
  /* Minimal spine highlight */
  &:before {
    content: '';
    position: absolute;
    top: 0; left: 1px; bottom: 0; width: 1px;
    background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%);
    border-radius: 0.5px;
  }
  
  /* Enhanced horizontal lines */
  &:after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(0deg,
      transparent 0px,
      rgba(255,255,255,0.08) 0.5px,
      transparent 1px,
      rgba(0,0,0,0.15) 1.5px,
      transparent 2px
    );
    border-radius: 1px 0 0 1px;
  }
`;

const CaseRightEdge = styled.div`
  position: absolute;
  right: -6px;
  top: 0;
  bottom: 0;
  width: 6px;
  background: linear-gradient(90deg, 
    rgba(200,200,200,0.9) 0%, 
    rgba(180,180,180,0.8) 50%, 
    rgba(160,160,160,0.7) 100%);
  border-radius: 0 1px 1px 0;
  box-shadow: 
    inset -1px 0 2px rgba(255,255,255,0.5),
    2px 0 4px rgba(0,0,0,0.18);
  z-index: 1;
  transform: perspective(600px) rotateY(8deg);
  
  /* Subtle right edge highlight */
  &:before {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0; width: 1px;
    background: linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 100%);
  }
`;

const CaseBase = styled.div`
  position: absolute;
  left: -12px;
  right: -4px;
  bottom: -12px;
  height: 8px;
  background: linear-gradient(180deg, rgba(160,160,160,0.3) 0%, rgba(120,120,120,0.15) 100%);
  border-radius: 0 0 2px 2px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  z-index: -2;
  transform: perspective(400px) rotateX(45deg);
`;

const CDImageFrame = styled.a`
  display: block;
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 2;
  border-radius: 1px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  text-decoration: none !important;
  border-bottom: none !important;
  
  &:hover, &:focus, &:active, &:visited {
    text-decoration: none !important;
    border-bottom: none !important;
  }
`;

const CDImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  border: none;
  background: #fff;
  object-fit: cover;
`;

interface MusicNode {
  id: string;
  title: string;
  properties: {
    Release_Date?: {
      value: {
        start?: string;
      };
    };
    URL?: { value: string };
    Image?: {
      value: Array<{
        name?: string;
        type?: string;
        file?: { url?: string };
      }>;
    };
    Type?: {
      value: {
        name?: string;
        color?: string;
      };
    };
  };
  updatedAt: string;
}

interface MusicProps {
  data: {
    music: {
      edges: Array<{
        node: MusicNode;
      }>;
    };
  };
}

const MusicPage: React.FC<MusicProps> = ({ data }) => {
  const musicItems = data.music.edges.filter(({ node }) =>
    node.properties.Type?.value?.name === "Music"
  );

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (gridRef.current) {
        const rect = gridRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
    };

    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener('mousemove', handleMouseMove);
      gridElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (gridElement) {
        gridElement.removeEventListener('mousemove', handleMouseMove);
        gridElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const calculateTilt = (elementRef: React.RefObject<HTMLDivElement>) => {
    if (!elementRef.current || !gridRef.current) {
      return { rotateX: 0, rotateY: 0 };
    }

    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    const gridRect = gridRef.current.getBoundingClientRect();
    
    // Get element center relative to grid
    const elementCenterX = rect.left - gridRect.left + rect.width / 2;
    const elementCenterY = rect.top - gridRect.top + rect.height / 2;
    
    // Calculate distance from mouse to element center
    const deltaX = mousePosition.x - elementCenterX;
    const deltaY = mousePosition.y - elementCenterY;
    
    // Calculate tilt based on mouse position relative to element
    const maxTilt = 15;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 300; // Maximum distance for effect
    
    if (distance > maxDistance || (mousePosition.x === 0 && mousePosition.y === 0)) {
      return { rotateX: 0, rotateY: 0 };
    }
    
    const intensity = Math.max(0, 1 - distance / maxDistance);
    const rotateY = (deltaX / maxDistance) * maxTilt * intensity;
    const rotateX = -(deltaY / maxDistance) * maxTilt * intensity;
    
    return { rotateX, rotateY };
  };

  return (
    <Page>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Music | Sam Chang</title>
        <meta http-equiv="x-ua-compatible" content="ie=edge; chrome=1" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Helmet>
      <Header>
        <Nav title="Music" />
        <Menu />
      </Header>
      <MediumSectionWrapper>
        <p>
          <p>
            Written and produced by{" "}
            <a href="http://groveralleyway.com">Grover Alleyway</a>.
            All tunes created on a laptop computer using Ableton Live software
            to control and mix VST plugins as well as manipulations of audio
            recordings.
          </p>
        </p>
      </MediumSectionWrapper>
            <Grid ref={gridRef}>
        {musicItems.map(({ node }) => {
          const imageObj = node.properties.Image?.value?.[0];
          const imageUrl = imageObj?.file?.url;
          const caseRef = useRef<HTMLDivElement>(null);
          const [isHovered, setIsHovered] = useState(false);
          const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

          const handleMouseMove = (e: React.MouseEvent) => {
            if (!caseRef.current) return;
            const rect = caseRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const maxTilt = 30;
            const rotateY = ((x - centerX) / centerX) * maxTilt;
            const rotateX = -((y - centerY) / centerY) * maxTilt;
            setTilt({ rotateX, rotateY });
          };

          const handleMouseLeave = () => {
            setIsHovered(false);
            setTilt({ rotateX: 0, rotateY: 0 });
          };

          return (
            <JewelCase key={node.id} ref={caseRef}
              onMouseMove={e => { setIsHovered(true); handleMouseMove(e); }}
              onMouseLeave={handleMouseLeave}
              style={{ perspective: '1200px' }}
            >
              <CaseFrame rotateX={isHovered ? tilt.rotateX : 0} rotateY={isHovered ? tilt.rotateY : 0} isActive={isHovered}>
                <CaseSpine />
                <CaseRightEdge />
                <CDImageFrame href={node.properties.URL?.value} target="_blank" rel="noopener noreferrer">
                {imageUrl && (
                    <CDImage
                    src={imageUrl}
                    alt={node.title}
                  />
                )}
                </CDImageFrame>
                <CaseBase />
              </CaseFrame>
                <CoverTitle>{node.title}</CoverTitle>
              <p>{node.properties.Release_Date?.value?.start}</p>
            </JewelCase>
          );
        })}
      </Grid>
    </Page>
  );
};

export default MusicPage;

export const MusicQuery = graphql`
  query {
    music: allNotion(
      sort: { updatedAt: DESC }
    ) {
      edges {
        node {
          id
          title
          properties {
            Release_Date: Release_Date {
              value {
                start
              }
            }
            URL {
              value
            }
            Image {
              value {
                name
                type
                file {
                  url
                }
              }
            }
            Type {
              value {
                name
                color
              }
            }
          }
          updatedAt
        }
      }
    }
  }
`;
