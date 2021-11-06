import { RefObject } from "react";

export interface PlayerContext {
  __iframeRef?: RefObject<HTMLIFrameElement>;
  __player?: YT.Player;
  __notifyIFrameMounted: () => void;
  __notifyIFrameUnmounted: () => void;
}
