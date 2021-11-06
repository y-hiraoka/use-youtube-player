import { createElement, CSSProperties, useEffect, VFC } from "react";
import { PlayerContext } from "./PlayerContext";

const YOUTUBE_EMBED_URL = "https://www.youtube.com/embed";

export type YouTubeIFrameProps = {
  // for context
  playerContext?: PlayerContext;

  // for iframe
  className?: string;
  style?: CSSProperties;
  width?: string | number;
  height?: string | number;
  title?: string;

  // for YouTube parameters
  autoplay?: boolean;
  ccLangPref?: string;
  ccLoadPolicy?: boolean;
  color?: "red" | "white";
  controls?: boolean;
  disableKb?: boolean;
  end?: number;
  fs?: boolean;
  hl?: string;
  ivLoadPolicy?: 1 | 3;
  loop?: boolean;
  modestBranding?: boolean;
  playlist?: string[];
  playsInline?: boolean;
  rel?: boolean;
  start?: number;
  widgetReferrer?: string;
} & (
  | {
      videoId: string;
      listType?: never;
      list?: never;
    }
  | {
      videoId?: never;
      listType: "playlist" | "user_uploads" | "search";
      list: string;
    }
);

const maybeBoolToMaybe1or0 = (
  value: boolean | undefined,
): 1 | 0 | undefined => {
  if (value === undefined) return undefined;
  return value ? 1 : 0;
};

export const YouTubeIFrame: VFC<YouTubeIFrameProps> = ({
  playerContext,
  className,
  style,
  width,
  height,
  title = "YouTube video player",
  ...props
}) => {
  const base = props.videoId
    ? `${YOUTUBE_EMBED_URL}/${props.videoId}`
    : YOUTUBE_EMBED_URL;

  const params = {
    autoplay: maybeBoolToMaybe1or0(props.autoplay),
    cc_lang_pref: props.ccLangPref,
    cc_load_policy: maybeBoolToMaybe1or0(props.ccLoadPolicy),
    color: props.color,
    controls: maybeBoolToMaybe1or0(props.controls),
    disablekb: maybeBoolToMaybe1or0(props.disableKb),
    enablejsapi: playerContext !== undefined ? 1 : undefined,
    end: props.end,
    fs: maybeBoolToMaybe1or0(props.fs),
    hl: props.hl,
    iv_load_policy: props.ivLoadPolicy,
    list: props.list,
    listType: props.listType,
    loop: maybeBoolToMaybe1or0(props.loop),
    modestbranding: maybeBoolToMaybe1or0(props.modestBranding),
    playlist: props.playlist?.join(","),
    playsinline: maybeBoolToMaybe1or0(props.playsInline),
    rel: maybeBoolToMaybe1or0(props.rel),
    start: props.start,
    widget_referrer: props.widgetReferrer,
  };

  const queryString = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)] as const),
    ),
  ).toString();

  useEffect(() => {
    if (playerContext !== undefined) {
      playerContext.__notifyIFrameMounted();

      if (playerContext.__player !== undefined) {
        return () => playerContext.__notifyIFrameUnmounted();
      }
    }
  }, [playerContext]);

  return createElement("iframe", {
    ref: playerContext?.__iframeRef,
    className: className,
    width: width,
    height: height,
    style: style,
    title: title,
    allow:
      "fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
    src: queryString !== "" ? base + "?" + queryString : base,
    allowFullScreen: true,
  });
};
