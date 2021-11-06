import { useEffect, useMemo, useRef, useState } from "react";
import { PlayerContext } from "./PlayerContext";

type WithOnReady = {
  onYouTubeIframeAPIReady(): void;
};

let scriptHasBeenLoaded = false;

const loadYouTubeFrameAPIScript = (): Promise<void> => {
  const promise = new Promise<void>(resolve => {
    if (typeof window.YT?.Player === "undefined") {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);

      (window as unknown as WithOnReady).onYouTubeIframeAPIReady = () => {
        scriptHasBeenLoaded = true;
        resolve();
      };
    } else {
      resolve();
    }
  });

  return promise;
};

export const useYouTubePlayer = () => {
  const [isLoadingScript, setIsLoadingScript] = useState(!scriptHasBeenLoaded);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeIsMounted, setIframeIsMounted] = useState(false);
  const [youtubePlayer, setYoutubePlayer] = useState<YT.Player>();
  const playerContext = useMemo<PlayerContext>(
    () => ({
      __iframeRef: iframeRef,
      __notifyIFrameMounted: () => setIframeIsMounted(true),
      __notifyIFrameUnmounted: () => setIframeIsMounted(false),
      __player: youtubePlayer,
    }),
    [youtubePlayer],
  );

  useEffect(() => {
    if (iframeRef.current && !isLoadingScript && iframeIsMounted) {
      const instance = new YT.Player(iframeRef.current, {
        playerVars: { origin: window.location.origin },
      });

      setYoutubePlayer(instance);

      return () => instance.destroy();
    } else {
      setYoutubePlayer(undefined);
    }
  }, [iframeIsMounted, isLoadingScript]);

  useEffect(() => console.log(youtubePlayer), [youtubePlayer]);

  useEffect(() => {
    if (!scriptHasBeenLoaded) {
      const effect = async () => {
        await loadYouTubeFrameAPIScript();
        setIsLoadingScript(false);
      };
      effect();
    }
  }, []);

  return {
    youtubePlayer,
    isLoadingScript,
    playerContext,
  };
};
