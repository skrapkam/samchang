/** @jsx jsx */
import React, { useState } from "react";
import { jsx, css } from "@emotion/react";

const overlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  z-index: 1000;
`;

const zoomedImageStyle = css`
  max-width: 90%;
  max-height: 90%;
`;

const ZoomImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        {...props}
        onClick={() => setOpen(true)}
        css={css`
          cursor: zoom-in;
        `}
      />
      {open && (
        <div css={overlayStyle} onClick={() => setOpen(false)}>
          <img {...props} css={zoomedImageStyle} />
        </div>
      )}
    </>
  );
};

export default ZoomImage;
