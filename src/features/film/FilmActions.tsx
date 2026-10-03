import { DownloadIcon } from '../../components/Icons';
import { useFilmDownload } from './useFilmDownload';

export function FilmActions({ onReplay }: { onReplay: () => void }) {
  const { downloadReady, downloadUrl } = useFilmDownload();
  return (
    <div className="closing">
      <p>
        40,000 years later
        <br />
        <span>the cup still has no chance.</span>
      </p>
      <div className="actions">
        <button className="button button-secondary" onClick={onReplay}>
          Play again
        </button>
        {downloadReady ? (
          <a
            className="button button-primary"
            href={downloadUrl}
            download="art-history-with-a-cat.mp4"
          >
            <DownloadIcon />
            Download MP4
          </a>
        ) : (
          <button className="button button-primary" disabled>
            Preparing file
          </button>
        )}
      </div>
    </div>
  );
}
