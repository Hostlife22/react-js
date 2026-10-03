import {useEffect, useRef, useState} from 'react';
import {Player, type PlayerRef} from '@remotion/player';
import {ArtHistory} from './video/ArtHistory';
import {CHAPTERS, VIDEO, chapterAt, chapterPreviewTime} from './timeline';
import './styles.css';

const Arrow = () => <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v12m-5-5 5 5 5-5M5 19h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const CatMark = () => <svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="M9 22V8l9 7h5l9-7v14c0 8-5 12-12 12S9 30 9 22Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/><path d="m16 26 4 3 4-3M6 23l8 2m12 0 8-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/><circle cx="15" cy="21" r="1.5" fill="currentColor"/><circle cx="25" cy="21" r="1.5" fill="currentColor"/></svg>;

export default function App() {
  const player=useRef<PlayerRef>(null),[frame,setFrame]=useState(0),[downloadReady,setDownloadReady]=useState(false);
  const chapter=chapterAt(frame/VIDEO.fps);
  useEffect(()=>{
    let alive=true;
    const check=async()=>{try{const response=await fetch('/art-history.mp4',{method:'HEAD'});if(alive)setDownloadReady(response.ok&&Boolean(response.headers.get('content-type')?.includes('video/mp4')));}catch{if(alive)setDownloadReady(false);}};
    void check();const timer=setInterval(check,5000);
    return()=>{alive=false;clearInterval(timer);};
  },[]);
  useEffect(() => {
    const current=player.current;if(!current)return;
    const onFrame=(event: {detail:{frame:number}})=>{if(event.detail.frame%6===0)setFrame(event.detail.frame);};
    const onEnded=()=>setFrame(VIDEO.frames-1);
    current.addEventListener('frameupdate',onFrame);current.addEventListener('ended',onEnded);
    return ()=>{current.removeEventListener('frameupdate',onFrame);current.removeEventListener('ended',onEnded);};
  },[]);
  const seek=(seconds:number)=>{const target=Math.min(VIDEO.frames-1,Math.round(seconds*VIDEO.fps));player.current?.pause();player.current?.seekTo(target);setFrame(target);};
  return <div className="site-shell">
    <a className="skip-link" href="#film">Skip to film</a>
    <header className="masthead">
      <a className="wordmark" href="/" aria-label="A cat through time — home"><CatMark /><span>A cat through time</span></a>
      <span className="edition">Study No. 001 <span aria-hidden="true">/</span> 2026</span>
    </header>
    <main>
      <section className="intro" aria-labelledby="title">
        <div><p className="eyebrow">A short story through art history</p><h1 id="title">Eras change.<br/><em>Cats remain.</em></h1></div>
        <div className="intro-note"><p>From cave walls to contemporary illustration. One table, one cup, and a very curious cat.</p><div className="film-spec"><span>16 eras</span><span>15 seconds</span><span>With sound</span></div></div>
      </section>
      <section className="film-section" id="film" aria-label="Animation preview">
        <div className="player-shell"><Player ref={player} component={ArtHistory} inputProps={{withAudio:true}} durationInFrames={VIDEO.frames} compositionWidth={VIDEO.width} compositionHeight={VIDEO.height} fps={VIDEO.fps} controls showVolumeControls style={{width:'100%',aspectRatio:'16 / 9'}} moveToBeginningWhenEnded={false} clickToPlay spaceKeyToPlayOrPause errorFallback={({error})=><div className="player-error" role="alert">Preview unavailable: {error.message}. Reload the page or download the film.</div>} /></div>
        <div className="film-caption"><div className="now-playing"><span className="chapter-dot" style={{background:chapter.color}} aria-hidden="true"/><span>{chapter.label}</span><span className="caption-year">{chapter.year}</span></div><span className="timecode">{(frame/VIDEO.fps).toFixed(1).padStart(4,'0')} <span>/ 15.0</span></span></div>
      </section>
      <section className="chapters-section" aria-labelledby="chapters-title">
        <div className="section-caption"><h2 id="chapters-title">A journey through art</h2><p>Choose an era to explore</p></div>
        <ol className="chapter-grid">{CHAPTERS.map((item,index)=><li key={item.id}><button className={`chapter-button ${item.id===chapter.id?'is-active':''}`} aria-pressed={item.id===chapter.id} onClick={()=>seek(index===0?0:chapterPreviewTime(item))}><span className="chapter-number">{String(index+1).padStart(2,'0')}</span><span className="chapter-name">{item.label}<span>{item.year}</span></span><span className="chapter-color" style={{background:item.color}} aria-hidden="true"/></button></li>)}</ol>
      </section>
      <div className="closing"><p>40,000 years later<br/><span>the cup still has no chance.</span></p><div className="actions"><button className="button button-secondary" onClick={()=>{seek(0);player.current?.play();}}>Play again</button>{downloadReady?<a className="button button-primary" href="/art-history.mp4" download="art-history-with-a-cat.mp4"><Arrow />Download MP4</a>:<button className="button button-primary" disabled>Preparing file</button>}</div></div>
    </main>
    <footer><span>A cat through art history</span><span>Animated study · 1920 × 1080 · 60 fps</span></footer>
  </div>;
}
