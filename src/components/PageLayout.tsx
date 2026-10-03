import type { ReactNode } from 'react';
import { publicAsset } from '../assets';
import { CatMark } from './Icons';

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#film">
        Skip to film
      </a>
      <header className="masthead">
        <a className="wordmark" href={publicAsset('')} aria-label="A cat through time — home">
          <CatMark />
          <span>A cat through time</span>
        </a>
        <span className="edition">
          Study No. 001 <span aria-hidden="true">/</span> 2026
        </span>
      </header>
      <main>{children}</main>
      <footer>
        <span>A cat through art history</span>
        <span>Animated study · 1920 × 1080 · 60 fps</span>
      </footer>
    </div>
  );
}
