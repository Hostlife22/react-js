import { useCallback, useEffect, useRef, useState } from 'react';
import type { PlayerRef } from '@remotion/player';
import { clamp } from '../../animation/math';
import { VIDEO, chapterAt } from '../../timeline';

const captionFrameInterval = Math.max(1, Math.round(VIDEO.fps / 10));

export function useFilmPlayback() {
  const player = useRef<PlayerRef>(null);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const current = player.current;
    if (!current) return;

    const onFrame = (event: { detail: { frame: number } }) => {
      if (event.detail.frame % captionFrameInterval === 0) setFrame(event.detail.frame);
    };
    const onEnded = () => setFrame(VIDEO.frames - 1);
    current.addEventListener('frameupdate', onFrame);
    current.addEventListener('ended', onEnded);
    return () => {
      current.removeEventListener('frameupdate', onFrame);
      current.removeEventListener('ended', onEnded);
    };
  }, []);

  const seek = useCallback((seconds: number) => {
    const target = clamp(Math.round(seconds * VIDEO.fps), 0, VIDEO.frames - 1);
    player.current?.pause();
    player.current?.seekTo(target);
    setFrame(target);
  }, []);

  const replay = useCallback(() => {
    seek(0);
    player.current?.play();
  }, [seek]);

  return { player, frame, chapter: chapterAt(frame / VIDEO.fps), seek, replay };
}
