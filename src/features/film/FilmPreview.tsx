import type { RefObject } from 'react';
import { Player, type PlayerRef } from '@remotion/player';
import { ArtHistory } from '../../video/ArtHistory';
import { VIDEO, type Chapter } from '../../timeline';

type FilmPreviewProps = { player: RefObject<PlayerRef | null>; frame: number; chapter: Chapter };

export function FilmPreview({ player, frame, chapter }: FilmPreviewProps) {
  return (
    <section
      className="film-section"
      id="film"
      tabIndex={-1}
      aria-label="Animation preview"
      aria-describedby="film-description"
    >
      <p id="film-description" className="sr-only">
        A person holding a cup and a cat travel through sixteen art styles, from cave painting to
        contemporary illustration. The person, cat and room details move independently. In the final
        scene the cat jumps onto the table and knocks the cup onto the floor. Playback starts only
        when you choose Play. Use the player controls or the era buttons to pause and explore.
      </p>
      <div className="player-shell">
        <Player
          ref={player}
          component={ArtHistory}
          inputProps={{ withAudio: true }}
          durationInFrames={VIDEO.frames}
          compositionWidth={VIDEO.width}
          compositionHeight={VIDEO.height}
          fps={VIDEO.fps}
          controls
          showVolumeControls
          style={{ width: '100%', aspectRatio: '16 / 9' }}
          moveToBeginningWhenEnded={false}
          clickToPlay
          spaceKeyToPlayOrPause={false}
          errorFallback={({ error }) => (
            <div className="player-error" role="alert">
              Preview unavailable: {error.message}. Reload the page or download the film.
            </div>
          )}
        />
      </div>
      <div className="film-caption">
        <div className="now-playing">
          <span className="chapter-dot" style={{ background: chapter.color }} aria-hidden="true" />
          <span>{chapter.label}</span>
          <span className="caption-year">{chapter.year}</span>
        </div>
        <span className="timecode">
          {(frame / VIDEO.fps).toFixed(1).padStart(4, '0')}{' '}
          <span>{`/ ${VIDEO.duration.toFixed(1)}`}</span>
        </span>
      </div>
    </section>
  );
}
