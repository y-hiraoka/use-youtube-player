import { useCallback, useEffect, useMemo, useState } from "react";
import { PlayerContext } from "./PlayerContext";

export const useYouTubePlayerState = (
  playerContext: PlayerContext | undefined,
) => {
  const [playerError, setPlayerError] = useState<YT.PlayerError>();
  const clearPlayerError = useCallback(() => setPlayerError(undefined), []);
  const [playbackQuality, setPlaybackQuality] = useState<string>("");
  const [playbackRate, setPlaybackRate] = useState<number>(0);
  const [playerState, setPlayerState] = useState<YT.PlayerState>();

  const player = playerContext?.__player;
  useEffect(() => {
    if (player === undefined) return;

    player.addEventListener("onReady", () => {
      setPlayerState(player.getPlayerState());
      setPlaybackRate(player.getPlaybackRate());
      setPlaybackQuality(player.getPlaybackQuality());
    });

    player.addEventListener<YT.OnErrorEvent>("onError", event => {
      setPlayerError(event.data);
    });

    player.addEventListener<YT.OnPlaybackQualityChangeEvent>(
      "onPlaybackQualityChange",
      event => {
        setPlaybackQuality(event.data);
      },
    );

    player.addEventListener<YT.OnPlaybackRateChangeEvent>(
      "onPlaybackRateChange",
      event => {
        setPlaybackRate(event.data);
      },
    );

    player.addEventListener<YT.OnStateChangeEvent>("onStateChange", event => {
      setPlayerState(event.data);
    });
  }, [player]);

  return useMemo(
    () => ({
      playerError,
      playbackQuality,
      playbackRate,
      playerState,
      clearPlayerError,
    }),
    [clearPlayerError, playbackQuality, playbackRate, playerError, playerState],
  );
};
