import {bundle} from '@remotion/bundler';
import {openBrowser, renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import {mkdir, readFile, copyFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root=process.cwd();
const timeline=JSON.parse(await readFile(path.join(root,'src/timeline.json'),'utf8'));
await mkdir(path.join(root,'out/stills'),{recursive:true});
const chrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const executable=existsSync(chrome)?path.join(root,'scripts/render-chrome.sh'):undefined;
if(executable) process.env.ART_HISTORY_CHROME_BINARY=chrome;
console.log('Preparing composition…');
const serveUrl=await bundle({entryPoint:path.join(root,'src/video/Root.tsx'),publicDir:path.join(root,'public')});
const browser=await openBrowser('chrome',{browserExecutable:executable});
try {
  const composition=await selectComposition({serveUrl,id:'ArtHistory',puppeteerInstance:browser});
  const renderSamples=async()=>{
    const samples=[...timeline.chapters.map(chapter=>({id:chapter.id,time:chapter.id==='modern'?timeline.events.land+.8:chapter.start+Math.min(chapter.end-chapter.start-1/timeline.fps,Math.max(.3,Math.min(chapter.transition?.duration??0,(chapter.end-chapter.start)*timeline.transitions.maxEraShare)+.04))})),{id:'cat-jump',time:timeline.events.jump+.2},{id:'cat-swat',time:timeline.events.swat+.04},{id:'ending',time:14.7}];
    for(const sample of samples){await renderStill({composition,serveUrl,puppeteerInstance:browser,frame:Math.round(sample.time*timeline.fps),output:path.join(root,`out/stills/${sample.id}.png`),imageFormat:'png',inputProps:{withAudio:false}});console.log(`Still: ${sample.id}`);}
    execFileSync('python3',[path.join(root,'scripts/storyboard.py')],{stdio:'inherit'});
  };
  if(process.argv.includes('--transition-probe')) {
    await mkdir(path.join(root,'out/checks/transitions'),{recursive:true});
    await renderMedia({composition,serveUrl,puppeteerInstance:browser,outputLocation:path.join(root,'out/checks/transitions/probe.mp4'),codec:'h264',crf:16,concurrency:3,frameRange:[300,490],inputProps:{withAudio:false}});console.log('Finished transition probe.');
  } else if(process.argv.includes('--stills')) {await renderSamples();} else {
    let last=-1;
    await renderMedia({composition,serveUrl,puppeteerInstance:browser,outputLocation:path.join(root,'out/art-history.mp4'),codec:'h264',crf:16,pixelFormat:'yuv420p',audioCodec:'aac',audioBitrate:'192k',concurrency:3,onProgress:({progress})=>{const percent=Math.floor(progress*100);if(percent>=last+10){last=percent;console.log(`Rendering ${percent}%`);}}});
    execFileSync('python3',[path.join(root,'scripts/check-export.py')],{stdio:'inherit'});
    await copyFile(path.join(root,'out/art-history.mp4'),path.join(root,'public/art-history.mp4'));
    console.log('Finished: out/art-history.mp4');
    await renderSamples();
  }
} finally {await browser.close({silent:true});}
