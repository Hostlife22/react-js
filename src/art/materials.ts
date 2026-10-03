import {clamp} from '../timeline';
import {PALETTES} from './palettes';
import {ellipse, gradient, line, path, random, type Ctx} from './primitives';

const patterns = new Map<string, HTMLCanvasElement>();

export function tint(hex: string, amount: number) {
  const value=parseInt(hex.slice(1,7),16),target=amount<0?0:255,k=Math.abs(amount);
  return `rgb(${[value>>16,(value>>8)&255,value&255].map(v=>Math.round(v+(target-v)*k)).join(',')})`;
}

export function pigment(id: string) {
  const existing=patterns.get(id);if(existing)return existing;
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;
  const c=canvas.getContext('2d',{willReadFrequently:true})!,rng=random(1527);
  const count=id==='stone'?43000:id==='cloth'?18000:id==='craquelure'?1000:14000;
  for(let i=0;i<count;i++){
    c.fillStyle=i%5===0?'#fff2d4':'#342b20';c.globalAlpha=(id==='stone'?.06:.025)+rng()*(id==='stone'?.19:.13);
    const x=rng()*512,y=rng()*512,s=.2+rng()*(id==='stone'?1.7:.9);c.fillRect(x,y,s,id==='cloth'?s*2.5:s);
  }
  if(id==='cloth')for(let i=0;i<170;i++){c.globalAlpha=.065;line(c,0,i*3,512,i*3,'#ffe3b1',.4);line(c,i*3,0,i*3,512,'#1d2630',.35);}
  if(id==='craquelure') {
    // Voronoi cells share their edges, so cracks form a continuous irregular
    // network instead of repeating isolated hexagonal stamps.
    const cells=new Map<string,{x:number,y:number}>(),step=18,grid=Math.ceil(512/step)+3;
    for(let y=-2;y<grid;y++)for(let x=-2;x<grid;x++)cells.set(`${x},${y}`,{x:x*step+(rng()-.5)*13,y:y*step+(rng()-.5)*13});
    c.globalAlpha=.25;
    for(let y=-1;y<grid-1;y++)for(let x=-1;x<grid-1;x++){
      const center=cells.get(`${x},${y}`)!;
      let vertices=[{x:center.x-55,y:center.y-55},{x:center.x+55,y:center.y-55},{x:center.x+55,y:center.y+55},{x:center.x-55,y:center.y+55}];
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
        if(!dx&&!dy)continue;const neighbor=cells.get(`${x+dx},${y+dy}`)!;
        const nx=neighbor.x-center.x,ny=neighbor.y-center.y,mx=(center.x+neighbor.x)/2,my=(center.y+neighbor.y)/2;
        const distance=(p:{x:number,y:number})=>(p.x-mx)*nx+(p.y-my)*ny;
        const clipped:typeof vertices=[];
        for(let i=0;i<vertices.length;i++){
          const a=vertices[i],b=vertices[(i+1)%vertices.length],da=distance(a),db=distance(b);
          if(da<=0)clipped.push(a);
          if((da<0)!==(db<0)){const t=da/(da-db);clipped.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});}
        }
        vertices=clipped;
      }
      const d=vertices.map((p,i)=>`${i?'L':'M'}${p.x} ${p.y}`).join(' ')+'Z';
      path(c,d,undefined,'#302319',.18);
    }
  }
  patterns.set(id,canvas);return canvas;
}

export function textureShape(c: Ctx, shape: Path2D, medium='paper', opacity=.7) {
  c.save();c.globalAlpha=opacity;c.fillStyle=c.createPattern(pigment(medium),'repeat')!;c.fill(shape);c.restore();
}

export function paint(c: Ctx,d:string,color:string,id:string,kind='cloth',seed=13) {
  const p=PALETTES[id],shape=new Path2D(d),dimensional=['renaissance','cgi'].includes(id);
  c.fillStyle=dimensional?gradient(c,628,190,724,345,[tint(color,kind==='paper'?.20:.30),color,tint(color,-.48)]):color;c.fill(shape);
  if(id!=='pixel'&&id!=='cgi')textureShape(c,shape,kind,id==='renaissance'?.6:.9);
  if(id==='renaissance')textureShape(c,shape,'craquelure',.6);
  c.save();c.clip(shape);
  if(id==='ukiyo'&&kind==='cloth') {
    for(let x=595;x<746;x+=12)for(let y=244;y<445;y+=15){
      for(let i=0;i<6;i++){const a=i*Math.PI/3,xx=x+Math.cos(a)*6,yy=y+Math.sin(a)*6;line(c,x,y,xx,yy,'#e6d9b7',.6);path(c,`M${xx} ${yy} L${x+Math.cos(a+Math.PI/3)*6} ${y+Math.sin(a+Math.PI/3)*6}`,undefined,'#e6d9b7',.5);}
    }
  } else if(id==='post'||id==='impression') {
    impasto(c,shape,[592,163,154,282],[color,tint(color,.23),tint(color,-.25),id==='post'?'#689fb1':p.accent],kind==='paper'?650:1900,seed,(x,y)=>Math.PI/2+Math.sin((x-665)*.035+(y-260)*.017)*.45);
  } else if(id==='gothic'&&kind==='cloth') {
    for(let x=605;x<738;x+=18)for(let y=251;y<444;y+=23){path(c,`M${x} ${y} q-5-8-7-2 q0 5 7 4 q7 1 7-4 q-2-6-7 2 M${x} ${y-2} v13 M${x-4} ${y+8} h8`,undefined,'#d9b958',.8);}
  } else if(id==='greek'&&kind==='cloth') {
    for(let x=605;x<738;x+=16)for(let y=257;y<444;y+=23){path(c,`M${x} ${y-5} l0 10 m-5-5 h10 m-9-4 8 8 m-8 0 8-8`,undefined,p.accent,.7);}
  }
  if(id==='cgi'){c.globalAlpha=.45;c.fillStyle=gradient(c,600,0,729,0,['#cbedee','#ffffff00','#27045e']);c.fillRect(0,0,960,540);}
  c.restore();
  if(p.outline)path(c,d,undefined,p.ink,p.outline);
  return shape;
}

export function clothFold(c:Ctx,d:string,color:string,id:string,width=5) {
  const painted=['renaissance','post','impression','cgi'].includes(id);
  c.save();
  if(id==='renaissance'||id==='cgi'){c.filter='blur(1.7px)';c.globalAlpha=.6;}
  path(c,d,undefined,painted?tint(color,-.37):tint(color,-.18),width);
  path(c,d,undefined,painted?tint(color,.26):tint(color,.10),Math.max(.65,width*.32));
  c.restore();
}

export function flower(c:Ctx,x:number,y:number,r:number,color:string,center:string,petals=8) {
  for(let i=0;i<petals;i++){const a=i*Math.PI*2/petals;c.save();c.translate(x,y);c.rotate(a);ellipse(c,0,-r*.65,r*.39,r*.66,color,'#60472f',.35);c.restore();}
  ellipse(c,x,y,r*.32,r*.32,center,'#705b36',.5);
}

export function impasto(c:Ctx,shape:Path2D,box:readonly[number,number,number,number],colors:readonly string[],count:number,seed:number,flow:(x:number,y:number)=>number=()=>Math.PI/2) {
  const rng=random(seed);c.save();c.clip(shape);c.lineCap='round';
  for(let i=0;i<count;i++){
    const x=box[0]+rng()*box[2],y=box[1]+rng()*box[3],a=flow(x,y)+(rng()-.5)*.25,len=3+rng()*9,w=.8+rng()*1.8,dx=Math.cos(a)*len,dy=Math.sin(a)*len;
    const color=colors[i%colors.length];
    path(c,`M${x} ${y}q${dx*.45-dy*.05} ${dy*.45+dx*.05} ${dx} ${dy}`,undefined,color,w);
    c.globalAlpha=.42;path(c,`M${x-dy/len*.5} ${y+dx/len*.5}q${dx*.45-dy*.05} ${dy*.45+dx*.05} ${dx} ${dy}`,undefined,tint(color,.45),.32);c.globalAlpha=1;
  }
  c.restore();
}

const hash=(x:number,y:number)=>{let n=Math.imul(x,374761393)+Math.imul(y,668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;};
function noise(x:number,y:number) {
  const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);
  const a=hash(ix,iy)*(1-sx)+hash(ix+1,iy)*sx,b=hash(ix,iy+1)*(1-sx)+hash(ix+1,iy+1)*sx;
  return a*(1-sy)+b*sy;
}

let rock: HTMLCanvasElement | undefined;
export function sandstone() {
  if(rock)return rock;rock=document.createElement('canvas');rock.width=960;rock.height=540;
  const c=rock.getContext('2d',{willReadFrequently:true})!,pixels=c.createImageData(960,540),rng=random(378);
  for(let y=0;y<540;y++)for(let x=0;x<960;x++){
    const at=(y*960+x)*4,n=noise(x*.012,y*.016)*.50+noise(x*.043,y*.05)*.26+noise(x*.14,y*.13)*.16+noise(x*.38,y*.4)*.08;
    const light=1-clamp(Math.hypot((x-505)/950,(y-305)/600));
    const v=42+n*103+light*45+(rng()-.5)*7;pixels.data[at]=v+24;pixels.data[at+1]=v-2;pixels.data[at+2]=v-35;pixels.data[at+3]=255;
  }
  c.putImageData(pixels,0,0);return rock;
}
