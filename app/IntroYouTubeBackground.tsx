"use client";

import { useEffect, useId, useRef } from "react";

type PlayerLike = {
  mute: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  destroy: () => void;
};

type PlayerEvent = {
  data?: number;
  target: PlayerLike;
};

type YouTubeNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady: (event: PlayerEvent) => void;
        onStateChange: (event: PlayerEvent) => void;
      };
    }
  ) => PlayerLike;
  PlayerState?: {
    ENDED?: number;
  };
};

declare global {
  interface Window {
    YT?: YouTubeNamespace;
  }
}

const API_SCRIPT_ID = "bas-youtube-iframe-api";

export default function IntroYouTubeBackground({ videoId }: { videoId: string }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<PlayerLike | null>(null);
  const reactId = useId().replace(/:/g, "");

  useEffect(() => {
    let cancelled = false;
    let pollTimer: number | undefined;

    const createPlayer = () => {
      if (cancelled || playerRef.current || !mountRef.current || !window.YT?.Player) return false;

      const origin = window.location.origin;
      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          playsinline: 1,
          rel: 0,
          iv_load_policy: 3,
          cc_load_policy: 0,
          enablejsapi: 1,
          origin,
        },
        events: {
          onReady: ({ target }) => {
            target.mute();
            target.playVideo();
          },
          onStateChange: ({ data, target }) => {
            const endedState = window.YT?.PlayerState?.ENDED ?? 0;
            if (data === endedState) {
              target.seekTo(0, true);
              target.playVideo();
            }
          },
        },
      });
      return true;
    };

    if (!createPlayer()) {
      if (!document.getElementById(API_SCRIPT_ID)) {
        const script = document.createElement("script");
        script.id = API_SCRIPT_ID;
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.appendChild(script);
      }

      pollTimer = window.setInterval(() => {
        if (createPlayer() && pollTimer) {
          window.clearInterval(pollTimer);
          pollTimer = undefined;
        }
      }, 80);
    }

    return () => {
      cancelled = true;
      if (pollTimer) window.clearInterval(pollTimer);
      try {
        playerRef.current?.destroy();
      } catch {
        // The Intro can unmount safely even if YouTube tears down first.
      }
      playerRef.current = null;
    };
  }, [videoId]);

  return <div ref={mountRef} id={`bas-intro-youtube-${reactId}`} className="bas-intro-youtube-player" />;
}
