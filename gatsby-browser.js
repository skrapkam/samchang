import React from "react";
import { inject } from "@vercel/analytics";
import RemoteCursor from "./src/components/RemoteCursor";

// Inject Vercel Analytics
export const onInitialClientRender = () => {
  inject();
};

export const wrapRootElement = ({ element }) => (
  <>
    {element}
    <RemoteCursor />
  </>
);
