
import { useState, useEffect, useRef, useCallback } from "react";
import Nav from "../../components/Nav";
import Menu from "../../components/Menu";
import {
  MediumSectionWrapper,
  Grid,
  CoverTitle,
  ReleaseDate
} from "../../styles/styles";
import Page from "../../components/Page";
import Header from "../../components/Header";
import { graphql } from "gatsby";
import { Helmet } from "react-helmet";
import styled from "@emotion/styled";
import defaultTheme from "../../components/Theme";

// Safari detection hook
const useIsSafari = () => {
  const [isSafari, setIsSafari] = useState(false);
  
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent);
    setIsSafari(isSafariBrowser);
  }, []);
  
  return isSafari;
};

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsMobile(isMobileDevice || (isTouchDevice && isSmallScreen));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// New realistic jewel case components from scratch

const JewelCaseWrapper = styled.div`
  position: relative;
  width: 280px;
  height: 280px;
  perspective: 1500px;
  margin: 4rem auto;
  cursor: pointer;
  
  /* Mobile-specific styles */
  @media (max-width: 768px) {
    touch-action: none; /* Prevent default touch behaviors like scrolling */
    user-select: none; /* Prevent text selection on touch */
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent; /* Remove tap highlight on mobile */
  }
`;

const JewelCase = styled.div<{ rotateX: number; rotateY: number }>`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transform: rotateX(${props => props.rotateX}deg) rotateY(${props => props.rotateY}deg);
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
`;

const Face = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
`;

const Front = styled(Face)`
  background: 
    /* Subtle plastic texture */
    radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%),
    linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.1) 100%);
  border: 2px solid rgba(0,0,0,0.2);
  border-radius: 1px;
  box-shadow: 
    0 2px 8px rgba(0,0,0,0.3),
    inset 0 1px 2px rgba(255,255,255,0.3),
    inset 0 -1px 1px rgba(0,0,0,0.1);
  transform: translateZ(5px);
`;

const Back = styled(Face)`
  background: 
    radial-gradient(circle at 30% 70%, rgba(255,255,255,0.08) 0%, transparent 50%),
    linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 100%);
  transform: rotateY(180deg) translateZ(5px);
  border: 2px solid rgba(0,0,0,0.4);
  border-radius: 1px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
`;

const Spine = styled(Face)`
  width: 10px;
  height: 100%;
  left: 0;
  background: 
    linear-gradient(90deg, 
      rgba(60,60,60,0.95) 0%, 
      rgba(40,40,40,0.98) 30%, 
      rgba(20,20,20,0.95) 70%, 
      rgba(35,35,35,0.9) 100%);
  transform-origin: center left;
  transform: rotateY(-90deg);
`;

const Right = styled(Face)`
  width: 10px;
  height: 100%;
  right: 0;
  background: 
    linear-gradient(90deg, 
      rgba(100,100,100,0.4) 0%,
      rgba(140,140,140,0.6) 50%, 
      rgba(180,180,180,0.4) 100%);
  transform-origin: center right;
  transform: rotateY(90deg);
`;

const Top = styled(Face)`
  width: 100%;
  height: 10px;
  top: 0;
  background: 
    repeating-linear-gradient(90deg, 
      rgba(0,0,0,0.05) 0px, 
      rgba(0,0,0,0.05) 1px,
      rgba(255,255,255,0.05) 1px,
      rgba(255,255,255,0.05) 2px),
    linear-gradient(0deg, 
      rgba(120,120,120,0.7) 0%,
      rgba(160,160,160,0.5) 50%, 
      rgba(80,80,80,0.5) 100%);
  transform-origin: top center;
  transform: rotateX(90deg);
`;

const Bottom = styled(Face)`
  width: 100%;
  height: 10px;
  bottom: 0;
  background: 
    linear-gradient(0deg, 
      rgba(160,160,160,0.3) 0%,
      rgba(120,120,120,0.5) 50%, 
      rgba(80,80,80,0.7) 100%);
  transform-origin: bottom center;
  transform: rotateX(-90deg);
`;

const SpineText = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-90deg);
  color: rgba(255,255,255,0.9);
  font-size: 0.65em;
  font-weight: 600;
  white-space: nowrap;
  text-shadow: 
    0 1px 2px rgba(0,0,0,0.8),
    0 0 1px rgba(0,0,0,0.5);
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const CoverImage = styled.img`
  position: absolute;
  top: 3px;
  left: 3px;
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  object-fit: cover;
  border-radius: 1px;
  box-shadow: inset 0 0 1px rgba(0,0,0,0.2);
`;

const VerticalStrip = styled.div<{ isSafari: boolean }>`
  position: absolute;
  left: 0;
  top: 0;
  width: 30px;
  height: 100%;
  border-right: 1px solid rgba(255,255,255,0.1);
  
  /* Safari-specific gradient overlay */
  ${props => props.isSafari ? `
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.08) 50%,
      rgba(255, 255, 255, 0.02) 100%
    );
    box-shadow: inset 1px 0 2px rgba(255, 255, 255, 0.1);
  ` : `
    /* Backdrop-filter for non-Safari browsers */
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    background-color: transparent;
  `}
  
  /* Mobile-specific adjustments */
  @media (max-width: 768px) {
    ${props => props.isSafari ? `
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.12) 0%,
        rgba(255, 255, 255, 0.06) 50%,
        rgba(255, 255, 255, 0.01) 100%
      );
    ` : `
      -webkit-backdrop-filter: blur(3px);
      backdrop-filter: blur(3px);
    `}
  }
`;

const Gloss = styled.div<{ tiltX: number; tiltY: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    /* Dynamic reflection based on tilt */
    linear-gradient(${props => 135 + (props.tiltY * 0.8)}deg, 
      rgba(255,255,255,0.6) 0%, 
      rgba(255,255,255,0.2) 30%, 
      transparent 70%),
    /* Secondary highlight */
    radial-gradient(ellipse at ${props => 30 + (props.tiltY * 0.3)}% ${props => 30 + (props.tiltX * 0.3)}%, 
      rgba(255,255,255,0.3) 0%, 
      transparent 60%);
  opacity: ${props => 0.8 + (Math.abs(props.tiltX + props.tiltY) * 0.005)};
  pointer-events: none;
  border-radius: 1px;
  
  /* Subtle scratches and imperfections */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%),
      linear-gradient(-45deg, transparent 49%, rgba(255,255,255,0.05) 50%, transparent 51%);
    background-size: 40px 40px, 60px 60px;
    opacity: 0.3;
  }
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
        external?: { url?: string };
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
  const isSafari = useIsSafari();
  const isMobile = useIsMobile();
  const musicItems = data.music.edges
    .filter(({ node }) => node.properties.Type?.value?.name === "Music")
    .sort((a, b) => {
      const dateA = a.node.properties.Release_Date?.value?.start;
      const dateB = b.node.properties.Release_Date?.value?.start;
      
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1; // items without dates go to the end
      if (!dateB) return -1;
      
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

  return (
    <Page>
      <Helmet
        meta={[
          { charSet: "utf-8" },
          { httpEquiv: "x-ua-compatible", content: "ie=edge; chrome=1" },
          { name: "viewport", content: "width=device-width, initial-scale=1.0, minimum-scale=1, viewport-fit=cover" },
          { name: "apple-mobile-web-app-capable", content: "yes" }
        ]}
        title="Music | Sam Chang"
      />
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
      <Grid>
        {musicItems.map(({ node }) => {
          const imageUrl = node.properties.Image?.value?.[0]?.external?.url;
          const caseRef = useRef<HTMLDivElement>(null);
          
          // New tap/hold mobile interaction
          const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
          const animationFrameRef = useRef<number | null>(null);
          const touchStartPos = useRef<{ x: number; y: number } | null>(null);
          const touchStartTime = useRef<number>(0);
          const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
          const isHolding = useRef(false);
          const hasMoved = useRef(false);

          // Cleanup animation frame and timeout on unmount
          useEffect(() => {
            return () => {
              if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
              }
              if (holdTimeoutRef.current) {
                clearTimeout(holdTimeoutRef.current);
              }
            };
          }, []);

          // Generate random tilt direction with fixed degree
          const generateRandomTilt = useCallback(() => {
            const fixedDegree = 35; // Fixed tilt degree
            const randomDirectionX = Math.random() > 0.5 ? 1 : -1;
            const randomDirectionY = Math.random() > 0.5 ? 1 : -1;
            
            return {
              rotateX: randomDirectionX * fixedDegree, // Either +35 or -35 degrees
              rotateY: randomDirectionY * fixedDegree  // Either +35 or -35 degrees
            };
          }, []);

          // Smooth animation to target tilt
          const animateToTilt = useCallback((targetTilt: { rotateX: number; rotateY: number }) => {
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
            
            const startTilt = tilt;
            const startTime = Date.now();
            const duration = 300; // 300ms animation
            
            const animate = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              // Smooth easing function
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              
              const newTilt = {
                rotateX: startTilt.rotateX + (targetTilt.rotateX - startTilt.rotateX) * easeProgress,
                rotateY: startTilt.rotateY + (targetTilt.rotateY - startTilt.rotateY) * easeProgress
              };
              
              setTilt(newTilt);
              
              if (progress < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
              }
            };
            
            animationFrameRef.current = requestAnimationFrame(animate);
          }, [tilt]);

          const handleMouseMove = (e: React.MouseEvent) => {
            if (isMobile) return; // Don't handle mouse events on mobile
            if (!caseRef.current) return;
            
            const rect = caseRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const maxTilt = 30;
            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;
            const rotateY = percentX * maxTilt;
            const rotateX = -percentY * maxTilt;
            
            setTilt({ rotateX, rotateY });
          };

          const handleMouseLeave = () => {
            if (isMobile) return; // Don't handle mouse events on mobile
            setTilt({ rotateX: 0, rotateY: 0 });
          };

          const handleTouchStart = useCallback((e: React.TouchEvent) => {
            if (!isMobile) return;
            
            const touch = e.touches[0];
            touchStartPos.current = { x: touch.clientX, y: touch.clientY };
            touchStartTime.current = Date.now();
            isHolding.current = false;
            hasMoved.current = false;
            
            // Don't prevent default on touch start - allow scrolling to work
            
            // Start hold timeout for 200ms
            holdTimeoutRef.current = setTimeout(() => {
              if (!hasMoved.current) {
                // Trigger hold effect - animate to random tilt
                isHolding.current = true;
                const randomTilt = generateRandomTilt();
                animateToTilt(randomTilt);
                
                // Add haptic feedback
                if ('vibrate' in navigator) {
                  navigator.vibrate(50);
                }
              }
            }, 200);
          }, [isMobile, generateRandomTilt, animateToTilt]);

          const handleTouchMove = useCallback((e: React.TouchEvent) => {
            if (!isMobile || !touchStartPos.current) return;
            
            const touch = e.touches[0];
            const dx = touch.clientX - touchStartPos.current.x;
            const dy = touch.clientY - touchStartPos.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // If moved more than 12px, cancel hold and allow scroll
            if (distance > 12) {
              hasMoved.current = true;
              
              // Cancel hold timeout
              if (holdTimeoutRef.current) {
                clearTimeout(holdTimeoutRef.current);
                holdTimeoutRef.current = null;
              }
              
              // If was holding, animate back to center
              if (isHolding.current) {
                animateToTilt({ rotateX: 0, rotateY: 0 });
                isHolding.current = false;
              }
              
              // Don't prevent default - allow scroll
              return;
            }
            
            // Only prevent default if we haven't moved much AND we're not holding yet
            // This allows scrolling to work even when starting over artwork
            if (!isHolding.current && distance < 5) {
              e.preventDefault();
            }
          }, [isMobile, animateToTilt]);

          const handleTouchEnd = useCallback((e: React.TouchEvent) => {
            if (!isMobile) return;
            
            e.preventDefault();
            
            // Clear hold timeout
            if (holdTimeoutRef.current) {
              clearTimeout(holdTimeoutRef.current);
              holdTimeoutRef.current = null;
            }
            
            const touchDuration = Date.now() - touchStartTime.current;
            
            if (isHolding.current) {
              // Was holding - animate back to center, don't open link
              animateToTilt({ rotateX: 0, rotateY: 0 });
              isHolding.current = false;
            } else if (!hasMoved.current && touchDuration < 300) {
              // Quick tap without movement - open link
              if (node.properties.URL?.value) {
                // Add haptic feedback
                if ('vibrate' in navigator) {
                  navigator.vibrate(30);
                }
                window.open(node.properties.URL.value, '_blank', 'noopener,noreferrer');
              }
            }
            
            // Reset state
            touchStartPos.current = null;
            hasMoved.current = false;
          }, [isMobile, node.properties.URL?.value, animateToTilt]);

          return (
            <JewelCaseWrapper key={node.id} ref={caseRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <JewelCase rotateX={tilt.rotateX} rotateY={tilt.rotateY}>
                <Front>
                  {imageUrl && (
                    isMobile ? (
                      <CoverImage src={imageUrl} alt={node.title} />
                    ) : (
                      <a href={node.properties.URL?.value} target="_blank" rel="noopener noreferrer">
                        <CoverImage src={imageUrl} alt={node.title} />
                      </a>
                    )
                  )}
                  <VerticalStrip isSafari={isSafari} />
                  <Gloss tiltX={tilt.rotateX} tiltY={tilt.rotateY} />
                </Front>
                <Back />
                <Spine>
                  <SpineText>{node.title}</SpineText>
                </Spine>
                <Right />
                <Top />
                <Bottom />
              </JewelCase>
              <CoverTitle>
                {node.properties.URL?.value ? (
                  <a href={node.properties.URL.value} target="_blank" rel="noopener noreferrer">
                    {node.title}
                  </a>
                ) : (
                  node.title
                )}
              </CoverTitle>
              <ReleaseDate>
                {node.properties.Release_Date?.value?.start 
                  ? new Date(node.properties.Release_Date.value.start).getFullYear()
                  : null
                }
              </ReleaseDate>
            </JewelCaseWrapper>
          );
        })}
      </Grid>
    </Page>
  );
};

export default MusicPage;

export const MusicQuery = graphql`
  query {
    music: allNotion {
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
                external {
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
