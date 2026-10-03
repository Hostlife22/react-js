import { useEffect, useState } from 'react';
import { publicAsset } from '../../assets';

const pollIntervalMs = 5000;

export function useFilmDownload() {
  const downloadUrl = publicAsset('art-history.mp4');
  const [downloadReady, setDownloadReady] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;

    const check = async () => {
      try {
        const response = await fetch(downloadUrl, { method: 'HEAD', signal: controller.signal });
        if (!controller.signal.aborted) {
          setDownloadReady(
            response.ok && Boolean(response.headers.get('content-type')?.includes('video/mp4')),
          );
        }
      } catch {
        if (!controller.signal.aborted) setDownloadReady(false);
      } finally {
        // Wait for this request to finish before starting another poll.
        if (!controller.signal.aborted) timer = setTimeout(check, pollIntervalMs);
      }
    };

    void check();
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [downloadUrl]);

  return { downloadUrl, downloadReady };
}
