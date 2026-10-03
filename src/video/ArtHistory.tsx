import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  AbsoluteFill,
  Html5Audio,
  cancelRender,
  continueRender,
  delayRender,
  useCurrentFrame,
} from 'remotion';
import { publicAsset } from '../assets';
import { createArtRenderer } from '../art/render';
import { VIDEO } from '../timeline';
import { loadFonts } from '../typography';

export const ArtHistory = ({ withAudio = true }: { withAudio?: boolean }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();
  const [renderFrame] = useState(createArtRenderer);
  const [fontHandle] = useState(() => delayRender('Loading local typefaces'));
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    loadFonts()
      .then(() => {
        setFontsReady(true);
        continueRender(fontHandle);
      })
      .catch(cancelRender);
  }, [fontHandle]);
  useLayoutEffect(() => {
    if (canvas.current && fontsReady) renderFrame(canvas.current, frame);
  }, [frame, fontsReady, renderFrame]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#f4eddc' }}>
      <canvas
        ref={canvas}
        width={VIDEO.width}
        height={VIDEO.height}
        style={{ width: '100%', height: '100%' }}
        role="img"
        aria-label="A person with a cup and a cat travel through art history"
      />
      {withAudio && <Html5Audio src={publicAsset('soundtrack.wav')} />}
    </AbsoluteFill>
  );
};
