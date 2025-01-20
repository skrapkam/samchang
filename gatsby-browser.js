import { inject } from "@vercel/analytics";

// Inject Vercel Analytics
export const onInitialClientRender = () => {
  inject();
};
