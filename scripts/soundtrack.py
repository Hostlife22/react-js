"""Original score and foley; event times come from the animation's timeline."""
import json
import math
from pathlib import Path
import subprocess
import tempfile
import wave

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
TIMELINE = json.loads((ROOT / 'src/timeline.json').read_text())
SR = 48000
DURATION = TIMELINE['duration']
MIX = np.zeros((SR * DURATION, 2), dtype=np.float64)
RNG = np.random.default_rng(7341)


def add(sound, at, gain=1.0, pan=0.0):
    start = round(at * SR)
    end = min(len(MIX), start + len(sound))
    if end <= start or start < 0:
        return
    sound = sound[:end-start] * gain
    MIX[start:end, 0] += sound * math.sqrt((1 - pan) / 2)
    MIX[start:end, 1] += sound * math.sqrt((1 + pan) / 2)


def tone(midi, duration, kind, gain=.2):
    t = np.arange(round(duration * SR)) / SR
    freq = 440 * 2 ** ((midi - 69) / 12)
    phase = 2 * np.pi * freq * t
    if kind == 'flute':
        vibrato = .025 * np.sin(2*np.pi*5*t)
        sound = np.sin(phase + vibrato) + .12 * np.sin(phase * 2)
        env = np.minimum(t / .035, 1) * np.minimum((duration-t)/.07, 1) * np.exp(-t*1.5)
    elif kind == 'pluck':
        sound = sum(np.sin(phase*n + .04*n) / n**1.3 for n in range(1, 9))
        env = (1-np.exp(-t*400)) * np.exp(-t*7)
    elif kind == 'strings':
        sound = sum(np.sin(phase*n + .07*np.sin(2*np.pi*4*t)) / n**1.7 for n in range(1, 7))
        env = np.minimum(t/.05, 1) * np.minimum((duration-t)/.1, 1) * np.exp(-t*2)
    elif kind == 'chip':
        sound = np.where(np.sin(phase) > .2, .65, -.65) + .2*np.sin(phase*.5)
        env = np.minimum(t/.004, 1) * np.minimum((duration-t)/.014, 1) * np.exp(-t*3)
    elif kind == 'fm':
        sound = np.sin(phase + 2.5*np.sin(phase*2)*np.exp(-t*8))
        env = (1-np.exp(-t*300))*np.exp(-t*5)
    else:
        sound = np.sin(phase) + .42*np.sin(phase*2)*np.exp(-t*4) + .2*np.sin(phase*3)*np.exp(-t*6)
        env = (1-np.exp(-t*220))*np.exp(-t*4.6)
    return sound * np.clip(env, 0, 1) * gain


def drum(duration=.22, freq=125):
    t=np.arange(round(duration*SR))/SR
    return .5*np.sin(2*np.pi*(freq*t+12*(1-np.exp(-t*35))))*np.exp(-t*22) + RNG.normal(0,.03,len(t))*np.exp(-t*45)


def chime(at, freq=1800, gain=.18):
    t=np.arange(round(.28*SR))/SR
    sound=sum(np.sin(2*np.pi*freq*ratio*t)*np.exp(-t*(15+i*4))/(i+1) for i,ratio in enumerate([1,2.71,4.08]))
    add(sound, at, gain, -.15)


instrument = {
    'cave':'flute','egypt':'pluck','greek':'pluck','mosaic':'flute','gothic':'strings',
    'renaissance':'strings','ukiyo':'pluck','impression':'piano','post':'piano',
    'nouveau':'strings','cubism':'piano','bauhaus':'fm','pop':'fm','pixel':'chip','cgi':'fm','modern':'piano',
}
motif = [62, 65, 69, 72, 69, 67, 65, 69]
for index, chapter in enumerate(TIMELINE['chapters']):
    start, end = chapter['start'], chapter['end']
    count = 3 if end-start > .7 else 2
    if chapter['id'] == 'modern':
        count = 12
    step = (end-start)/count
    for beat in range(count):
        at = start + beat*step + .015
        if chapter['id']=='modern' and at > 13.1:
            continue
        midi = motif[(index+beat)%len(motif)]
        kind = instrument[chapter['id']]
        duration = min(.6, step*1.7)
        add(tone(midi,duration,kind,.14),at,1,(-1 if beat%2 else 1)*.25)
        if beat%2==0:
            add(tone(midi-24,min(.65,duration*1.2),'piano',.105),at)
        if chapter['id'] in ['cave','egypt','greek','pop','pixel','modern']:
            add(drum(), at, .14)
    if index:
        duration=min(chapter['transition']['duration'],(end-start)*TIMELINE['transitions']['maxEraShare'])
        t=np.arange(round(duration*SR))/SR
        noise=RNG.normal(0,1,len(t))
        noise=np.convolve(noise,np.ones(8)/8,mode='same')
        add(noise*np.sin(np.pi*t/duration)**2,start,.024,(index%3-1)*.3)

# Cat jump: a soft rising glissando, then paws on wood.
events=TIMELINE['events']
t=np.arange(round(.36*SR))/SR
add(np.sin(2*np.pi*(310*t+650*t*t))*np.sin(np.pi*t/.36)**2,events['jump'],.075,-.2)
add(drum(.13,180),events['land'],.22,-.1)
chime(events['swat'],2100,.13)

# A little expectant breath, ceramic fragments, and a final playful cadence.
t=np.arange(round(.38*SR))/SR
noise=RNG.normal(0,1,len(t))
crash=noise*np.exp(-t*22)*.4
for freq in [1250,2170,3350,4870,6280]:
    crash+=.15*np.sin(2*np.pi*freq*t)*np.exp(-t*(12+freq/1000))
add(crash,events['impact'],.45,-.28)
for i in range(5):
    chime(events['impact']+.025+i*.025,2200+i*510,.028)
for midi,at in [(65,14.05),(69,14.2),(74,14.35)]:
    add(tone(midi,.55,'pluck',.16),at,1,.1)

# A small room reverb; this is an original synthesized score, with no samples.
for delay,gain in [(.041,.1),(.083,.075),(.137,.045)]:
    shift=round(delay*SR)
    MIX[shift:]+=MIX[:-shift].copy()*gain
MIX=np.tanh(MIX*1.25)
MIX[:round(.008*SR)]*=np.linspace(0,1,round(.008*SR))[:,None]
MIX[-round(.16*SR):]*=np.linspace(1,0,round(.16*SR))[:,None]
peak=np.max(np.abs(MIX))
if peak:
    MIX*=.85/peak
(ROOT/'public').mkdir(exist_ok=True)
output=ROOT/'public/soundtrack.wav'
with tempfile.TemporaryDirectory(prefix='cat-score-') as folder:
    raw=Path(folder)/'score.wav'
    with wave.open(str(raw),'wb') as stream:
        stream.setnchannels(2);stream.setsampwidth(2);stream.setframerate(SR)
        stream.writeframes((np.clip(MIX,-1,1)*32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(raw),'-af','loudnorm=I=-16:TP=-1.5:LRA=9','-ar',str(SR),str(output)],check=True)
print(f'Original soundtrack: {output} (15s, 48kHz stereo)')
