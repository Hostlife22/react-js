import { FilmPreview } from './FilmPreview';
import { EraNavigation } from './EraNavigation';
import { FilmActions } from './FilmActions';
import { useFilmPlayback } from './useFilmPlayback';

export function FilmExperience() {
  const { player, frame, chapter, seek, replay } = useFilmPlayback();
  return (
    <>
      <FilmPreview player={player} frame={frame} chapter={chapter} />
      <EraNavigation currentChapterId={chapter.id} onSeek={seek} />
      <FilmActions onReplay={replay} />
    </>
  );
}
