/** @jsx jsx */
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "@emotion/styled";
import { jsx } from "@emotion/react";
import defaultTheme from "../../Theme";

interface ZoomableImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {}

const RegularImage = styled.img`
  cursor: zoom-in;
  max-width: 100%;
  height: auto;
  display: block;
  margin: ${defaultTheme.space[4]} auto;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
`;

const OverlayImage = styled.img`
  cursor: zoom-out;
  max-width: 80vw;
  max-height: 80vh;
  height: auto;
  width: auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  display: block;
  margin: auto;
`;

const ZoomableImage: React.FC<ZoomableImageProps> = props => {
  const [isZoomed, setIsZoomed] = useState(false);

  const toggleZoom = () => setIsZoomed(prev => !prev);

  // Prevent body scroll when image is zoomed
  useEffect(() => {
    if (isZoomed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isZoomed]);

  // When zoomed create a portal overlay so image can escape parent stacking context
  if (isZoomed && typeof window !== "undefined") {
    return ReactDOM.createPortal(
      <Overlay onClick={toggleZoom} role="presentation">
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <OverlayImage {...props} />
      </Overlay>,
      document.body
    );
  }

  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <RegularImage {...props} onClick={toggleZoom} />
  );
};

export default ZoomableImage; 