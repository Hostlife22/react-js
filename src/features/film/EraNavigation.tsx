import { CHAPTERS, chapterPreviewTime } from '../../timeline';

type EraNavigationProps = { currentChapterId: string; onSeek: (seconds: number) => void };

export function EraNavigation({ currentChapterId, onSeek }: EraNavigationProps) {
  return (
    <section className="chapters-section" aria-labelledby="chapters-title">
      <div className="section-caption">
        <h2 id="chapters-title">A journey through art</h2>
        <p>Choose an era to explore</p>
      </div>
      <ol className="chapter-grid">
        {CHAPTERS.map((item, index) => (
          <li key={item.id}>
            <button
              className={`chapter-button ${item.id === currentChapterId ? 'is-active' : ''}`}
              aria-pressed={item.id === currentChapterId}
              onClick={() => onSeek(index === 0 ? 0 : chapterPreviewTime(item))}
            >
              <span className="chapter-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="chapter-name">
                {item.label}
                <span>{item.year}</span>
              </span>
              <span
                className="chapter-color"
                style={{ background: item.color }}
                aria-hidden="true"
              />
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}
