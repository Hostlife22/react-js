import {ART, branch, ellipse, grain, gradient, line, path, random, rect, text, wash, type Ctx} from './primitives';
import {VIDEO} from '../timeline';
import {PALETTES} from './palettes';
import {enrichBackdrop, enrichFurniture} from './scenery';

const backgrounds = new Map<string, HTMLCanvasElement>();

function border(c: Ctx, color: string, inset = 20, width = 3) {rect(c, inset, inset, ART.width - inset * 2, ART.height - inset * 2, 'transparent', 0, color, width);}
function wave(c: Ctx, x: number, y: number, scale = 1) {
  c.save(); c.translate(x, y); c.scale(scale, scale);
  path(c, 'M-100 70 Q-80-35-5-80 Q48-110 84-65 Q109-26 72 12 Q88-28 43-38 Q12-40-9 14 Q-19 44 23 68Z', '#315b7d', '#243f56', 2);
  for (let i = 0; i < 7; i++) path(c, `M${-90 + i * 12} 58 Q${-65 + i * 12} -30 ${5 + i * 9} -62`, undefined, '#e6e4d1', 2);
  path(c, 'M-7-78 Q55-113 85-67 Q101-40 82-12 L75-40 65-26 65-50 55-34 52-58 40-42 40-64 22-50 20-69 1-56Z', '#f6eddb');
  c.restore();
}
function landscape(c: Ctx, x: number, y: number, w: number, h: number, night = false) {
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  c.fillStyle = gradient(c, x, y, x, y + h, night ? ['#123c71','#467ea5'] : ['#b9d5cd','#e3dbbd']); c.fillRect(x, y, w, h);
  path(c, `M${x} ${y+h*.68} L${x+w*.25} ${y+h*.2} L${x+w*.55} ${y+h*.66} L${x+w*.75} ${y+h*.4} L${x+w} ${y+h*.72} L${x+w} ${y+h} L${x} ${y+h}Z`, night ? '#244d68' : '#739d91');
  path(c, `M${x} ${y+h*.78} Q${x+w*.5} ${y+h*.4} ${x+w} ${y+h*.85} L${x+w} ${y+h} L${x} ${y+h}Z`, night ? '#243c58' : '#759465');
  path(c, `M${x+w*.65} ${y+h*.68} Q${x+w*.15} ${y+h*.74} ${x+w*.58} ${y+h*.87} L${x+w*.48} ${y+h} L${x+w*.8} ${y+h} Q${x+w*.32} ${y+h*.8} ${x+w*.71} ${y+h*.71}Z`, night ? '#668994' : '#e3d6b4');
  c.restore();
}
function picture(c: Ctx, x: number, y: number, w: number, h: number, color: string, style: string) {
  rect(c, x - 10, y - 10, w + 20, h + 20, color, 0, '#6e6346', 2); rect(c, x - 3, y - 3, w + 6, h + 6, '#e4cc8b');
  if (style === 'wave') {rect(c,x,y,w,h,'#cbd7cc'); c.save(); c.beginPath(); c.rect(x,y,w,h); c.clip(); wave(c,x+w*.5,y+h*.54,w/200); c.restore();}
  else {landscape(c,x,y,w,h,style==='night'); if (style==='night') {
    for (let i=0;i<8;i++) {const sx=x+15+(i*37)%w, sy=y+22+(i*23)%(h*.55); ellipse(c,sx,sy,8,8,'#f1da78');}
  }}
}
function plant(c: Ctx, x: number, y: number, large = false) {
  if (large) {
    for(let i=0;i<5;i++){
      const angle=(i-2)*.45,len=111+(i%2)*39;
      c.save();c.translate(x,y-30);c.rotate(angle);line(c,0,0,0,-len,'#537963',2);
      const cy=-len+17;
      path(c,`M0 ${cy+39} C-57 ${cy+15}-46 ${cy-35} 0 ${cy-47} C46 ${cy-35} 57 ${cy+15} 0 ${cy+39}Z`,'#537963');
      line(c,0,cy+33,0,cy-37,'#b5c3a8',1);
      for(let j=0;j<4;j++)for(const side of [-1,1])path(c,`M${side*45} ${cy-20+j*13} Q${side*24} ${cy-18+j*13} ${side*7} ${cy-9+j*13} L${side*45} ${cy-13+j*13}Z`,PALETTES.modern.paper);
      c.restore();
    }
  }
  else {for(let i=0;i<7;i++){const xx=x+(i-3)*9; path(c,`M${xx} ${y-18} Q${xx-15} ${y-70} ${xx+(i-3)*7} ${y-140-(i%3)*10} Q${xx+10} ${y-75} ${xx+8} ${y-18}Z`,i%2 ? '#507c66' : '#879956');}}
  path(c,`M${x-30} ${y-32} L${x+30} ${y-32} L${x+22} ${y+25} Q${x} ${y+36} ${x-22} ${y+25}Z`, large ? '#a29bc2' : '#cf795f');
  rect(c,x-34,y-38,68,12,large?'#8e86b1':'#bd644e',5);
}
function gothicWindow(c: Ctx, x: number, y: number, w: number, h: number) {
  const d=`M${x} ${y+h} L${x} ${y+50} Q${x+w*.12} ${y+16} ${x+w*.5} ${y} Q${x+w*.9} ${y+18} ${x+w} ${y+50} L${x+w} ${y+h}Z`;
  const p=path(c,d,'#214a77','#694f38',5); c.save();c.clip(p);
  const colors=['#ad3b3e','#c5a551','#648c72','#40739d'];
  for(let xx=x;xx<x+w;xx+=18) for(let yy=y;yy<y+h;yy+=22) path(c,`M${xx} ${yy+11} L${xx+9} ${yy} L${xx+18} ${yy+11} L${xx+9} ${yy+22}Z`,colors[Math.abs(Math.floor(xx/18+yy/22))%4],'#e8ce84',.7);
  c.restore();
}
function tableAndChair(c: Ctx, id: string) {
  const p=PALETTES[id];
  if(id==='cave') {
    path(c,'M691 365 Q747 350 753 386 L752 437 Q711 448 679 430Z','#a27c4d',p.ink,2);
    path(c,'M485 351 L478 438 Q503 446 533 438 L525 351Z','#af8755',p.ink,2);
    path(c,'M434 339 Q508 328 579 339 Q590 350 578 354 L439 354 Q420 348 434 339Z','#c0a16c',p.ink,2);
    return;
  }
  const chairColor=id==='modern'?'#85a98e':id==='gothic'? '#2e5481':id==='post'?'#ccb050':p.accent;
  rect(c,710,269,15,160,chairColor,4,p.outline ? p.ink:undefined,p.outline);
  rect(c,655,367,79,13,chairColor,2,p.outline ? p.ink:undefined,p.outline);
  line(c,665,380,653,440,chairColor,6);line(c,724,380,736,440,chairColor,6);
  if(id==='ukiyo'||id==='gothic') for(let i=0;i<5;i++) line(c,672+i*10,381,672+i*10,416,p.accent,4);
  if(id==='bauhaus') {rect(c,495,345,8,87,p.ink);rect(c,446,432,124,5,p.ink);rect(c,417,332,180,7,p.ink);return;}
  if(id==='renaissance'||id==='post'||id==='cubism'||id==='ukiyo') {
    line(c,446,352,429,440,p.ink,8);line(c,575,352,589,440,p.ink,8);
    rect(c,433,338,151,18,id==='post'?'#d8bd68':id==='ukiyo'?'#ae5945':'#9a8963',2,p.ink,p.outline);
    if(id==='renaissance'){path(c,'M427 342 L590 342 L596 377 L422 377Z','#ccbf94');for(let i=0;i<12;i++)line(c,430+i*13,343,428+i*13,376,'#a19777',.8);}
  } else {
    const legColor=id==='modern'?p.ink:p.accent;
    rect(c,497,348,12,89,legColor,2);ellipse(c,503,439,51,5,legColor);
    rect(c,415,335,181,12,id==='gothic'?'#e7dab5':p.ink,id==='modern'?6:2);
    if(id==='gothic') {rect(c,415,344,181,24,'#eee6cb');for(let i=0;i<18;i++)line(c,417+i*10,348,425+i*10,362,'#98a7ab',1);}
    if(id==='mosaic') {path(c,'M485 349 Q520 359 485 410 Q468 436 505 441 Q542 436 524 410 Q490 359 525 349Z','#839c9c',p.ink,2);}
  }
}

function decorate(c: Ctx, id: string) {
  const p=PALETTES[id],rng=random(103+Object.keys(PALETTES).indexOf(id)*53);
  wash(c,p.paper);
  if(id==='cave') {
    const g=c.createRadialGradient(510,305,20,480,290,580);g.addColorStop(0,'#c3a06a');g.addColorStop(.7,'#82603c');g.addColorStop(1,'#3c3024');c.fillStyle=g;c.fillRect(0,0,960,540);
    const stone=document.createElement('canvas');stone.width=480;stone.height=270;const sc=stone.getContext('2d',{willReadFrequently:true})!,pixels=sc.createImageData(480,270);
    for(let y=0;y<270;y++)for(let x=0;x<480;x++){const at=(y*480+x)*4,n=128+24*Math.sin(x*.09+Math.sin(y*.08)*3)+16*Math.sin(y*.18+x*.015)+18*Math.sin(x*.25-y*.13)+(rng()-.5)*26;pixels.data[at]=n+19;pixels.data[at+1]=n+5;pixels.data[at+2]=n-12;pixels.data[at+3]=190;}
    sc.putImageData(pixels,0,0);c.save();c.globalCompositeOperation='soft-light';c.drawImage(stone,0,0,960,540);c.restore();
    for(let i=0;i<13;i++){const x=rng()*960,y=rng()*540;path(c,`M${x} ${y} l-10-32 6-17-16-28 9-17`,undefined,'#4b3726',.8);}
    for(const [x,y,r] of [[84,102,-.3],[807,238,.4],[850,409,.5],[131,365,.1],[491,81,.3]]){c.save();c.translate(x,y);c.rotate(r);c.globalAlpha=.22;ellipse(c,0,0,15,20,'#8e3e2b');for(let i=0;i<5;i++)line(c,-14+i*7,-5,-19+i*9,-35-Math.sin(i)*7,'#8e3e2b',6);c.restore();}
    rect(c,195,129,201,148,'transparent',0,p.ink,2);
    for(let i=0;i<15;i++){ellipse(c,205+i*12,139,2,2,'#9d5738');ellipse(c,205+i*12,265,2,2,'#9d5738');}
    return;
  }
  if(id==='egypt') {
    for(let i=0;i<32;i++)rect(c,i*30,16,28,10,[p.accent,'#bd5e44','#ceb050'][i%3]);
    rect(c,180,117,240,210,'#efe3b7',0,p.ink,2);rect(c,194,130,212,184,'transparent',0,p.accent,7);
    ellipse(c,300,168,24,24,'#b9573f');
    for(let col=0;col<16;col++){if(col>2&&col<8)continue;for(let row=0;row<7;row++){const x=41+col*54,y=65+row*46;c.save();c.translate(x,y);c.strokeStyle=[p.accent,'#b87648','#887547'][row%3];c.lineWidth=1.3;const symbol=(row+col)%5;if(symbol===0){ellipse(c,0,-8,4,7,'transparent',c.strokeStyle);line(c,0,-1,0,15,c.strokeStyle,1.2);line(c,-8,5,8,5,c.strokeStyle,1.2);}else if(symbol===1){path(c,'M-8 0 Q0-13 8 0 Q0 7-8 0 M0-3 L0 4 M-3 5 L-6 12',undefined,c.strokeStyle,1.3);}else if(symbol===2){path(c,'M-7 8 L0-9 7 8 M-8 13 L8 13 M-4 8 L-4 13 M4 8 L4 13',undefined,c.strokeStyle,1.2);}else if(symbol===3){path(c,'M-6-7 Q6-12 7-3 Q5 1-4 0 L-8 9 7 9 M-1 9 L-1 14',undefined,c.strokeStyle,1.3);}else{line(c,-7,-9,7,9,c.strokeStyle,1.3);line(c,7,-9,-7,9,c.strokeStyle,1.3);ellipse(c,0,0,8,8,'transparent',c.strokeStyle,1);}c.restore();}}
    for(let i=0;i<3;i++){const x=80+i*70;path(c,`M${x-8} 380 L${x-15} 402 Q${x-20} 430 ${x} 440 Q${x+20} 430 ${x+15} 402 L${x+8} 380Z`,'#b48357',p.ink,1.5);line(c,x-13,408,x+13,408,p.accent,4);}
    rect(c,0,459,960,9,p.accent);rect(c,0,472,960,6,'#b75840');rect(c,0,486,960,10,'#a88f50');
    return;
  }
  if(id==='greek') {
    c.fillStyle=gradient(c,0,0,960,540,['#9a3e28','#cd7948','#a54229']);c.fillRect(0,0,960,540);
    for(let i=0;i<32;i++){const x=i*30;path(c,`M${x} 32 h24 v-15 h-15 v9 h7 M${x} 495 h24 v15 h-15 v-9 h7`,undefined,p.ink,3);}
    rect(c,196,129,221,170,p.ink,0,'#e0a367',2);ellipse(c,306,213,91,48,'#c47b4c');
    path(c,'M242 232 L353 232 371 243 247 246Z',p.ink);path(c,'M273 226 L272 165 282 179 281 226Z',p.ink);

    path(c,'M821 347 Q854 326 859 357 L848 370 Q872 385 868 417 L860 443 810 443 802 417 Q798 385 819 370Z',p.ink);ellipse(c,833,369,14,4,p.paper);rect(c,815,397,41,24,p.paper);path(c,'M827 418 l0-12 5-6 7 6 0 12Z',p.ink);
    for(let i=0;i<49;i++){path(c,`M${i*20} 467 l10 17 10-17Z`,p.ink);}
    text(c,'ΧΑΙΡΕ ΚΑΙ ΠΙΕ',502,179,15,p.ink,'Georgia','center');
    return;
  }
  if(id==='mosaic') {
    wash(c,'#d9d6c1');border(c,'#5c655a',21,16);border(c,'#878773',39,3);
    for(let i=0;i<38;i++){const x=28+i*24;ellipse(c,x,23,9,8,'#dedac7','#4d5c52',2);ellipse(c,x,518,9,8,'#dedac7','#4d5c52',2);}
    picture(c,198,121,188,190,'#8c674c','landscape');
    path(c,'M815 338 L830 331 836 340 824 348 Q843 388 827 438 L810 438 Q794 388 815 349Z','#a1644e',p.ink,2);
    line(c,65,451,895,451,'#9f9d87',2);text(c,'CAVE · CATTUM',298,490,22,p.ink,'Georgia','center');
    return;
  }
  if(id==='gothic') {
    border(c,'#b0934a',23,2);
    for(let i=0;i<44;i++){const x=42+i*20;path(c,`M${x} 36 q10 12 20 0 M${x} 510 q10-12 20 0`,undefined,'#82935f',1);ellipse(c,x+10,41,2,4,'#c84944');}
    path(c,'M163 433 L163 146 190 156 267 92 342 148 406 98 470 145 536 99 610 150 662 116 750 172 750 433Z','#d8bb61',p.ink,2);
    for(let i=0;i<6;i++){const x=185+i*105;path(c,`M${x} 147 L${x+30} 102 ${x+64} 148`,undefined,'#b28634',4);ellipse(c,x+30,100,4,4,'#c34c3c');}
    gothicWindow(c,202,156,177,165);gothicWindow(c,461,165,139,137);
    ellipse(c,288,172,25,25,'#d6b85e','#584633',3);for(let i=0;i<5;i++)ellipse(c,288+Math.cos(i*Math.PI*.4)*14,172+Math.sin(i*Math.PI*.4)*14,6,6,'#b13c3f','#334b74',2);
    for(let i=0;i<14;i++)line(c,170+i*43,421,210+i*43,145,'#ba9a49',.5);
    rect(c,164,434,586,18,'#577b58',0,p.ink);text(c,'Ars longa, vita brevis.',788,200,16,p.ink);text(c,'Felis semper curiosus.',788,226,15,p.ink);text(c,'Tempus fugit.',788,252,15,p.ink);
    return;
  }
  if(id==='renaissance') {
    c.fillStyle=gradient(c,0,0,960,440,['#38372b','#756548','#44392a']);c.fillRect(0,0,960,540);
    const win=path(c,'M189 310 L189 168 Q189 83 287 83 Q385 83 385 168 L385 310Z','#baa882','#3a3229',11);
    c.save();c.clip(win);landscape(c,190,95,196,218);c.restore();rect(c,177,309,220,12,'#c7b795',2);
    for(let row=0;row<6;row++){const y0=398+Math.pow(row/6,1.8)*142,y1=398+Math.pow((row+1)/6,1.8)*142;for(let col=-7;col<15;col++){const a=18+row*15,b=18+(row+1)*15,x0=510+(col-4)*a,x1=510+(col-4)*b;path(c,`M${x0} ${y0} L${x0+a} ${y0} L${x1+b} ${y1} L${x1} ${y1}Z`,(row+col)%2?'#403a2d':'#a99872');}}
    for(let i=0;i<11;i++)line(c,24+i*90,10,24+i*90,398,'#8a7956',.3);
    const light=c.createRadialGradient(310,290,5,310,290,430);light.addColorStop(0,'#f8e0a422');light.addColorStop(1,'#00000000');c.fillStyle=light;c.fillRect(0,0,960,540);
    return;
  }
  if(id==='ukiyo') {
    rect(c,31,39,898,462,'#ecddb6',0,p.ink,2);rect(c,31,435,898,66,'#b9b38d');
    for(let i=0;i<6;i++)line(c,34,441+i*10,926,441+i*10,'#969d80',.7);
    line(c,310,438,225,501,p.ink,1);line(c,634,438,678,501,p.ink,1);
    picture(c,194,121,215,191,'#536e80','wave');
    rect(c,107,72,36,189,'#b85b4a',0,p.ink);for(let i=0;i<4;i++)text(c,['猫','と','茶','時'][i],125,108+i*38,25,p.ink,'Georgia','center');
    rect(c,836,295,48,107,'#e5d4a1',0,p.ink,2);line(c,841,288,841,408,p.ink,2);line(c,879,288,879,408,p.ink,2);line(c,836,317,884,317,p.ink,2);rect(c,845,408,30,7,p.ink);
    return;
  }
  if(id==='impression') {
    wash(c,'#eddacb');rect(c,0,432,960,108,'#d9c397');
    rect(c,156,106,265,252,'#d1cbdb',2);landscape(c,174,120,228,219);line(c,283,119,283,339,'#f8f2d9',8);line(c,174,227,402,227,'#f8f2d9',8);rect(c,164,336,253,13,'#f8efd7',3);
    for(let i=0;i<5;i++)branch(c,840+i*12,434,125+i*12,(i-2)*.12,['#8aa476','#abc09a','#e2c280'][i%3],2);
    ellipse(c,708,148,50,13,'#deca9a');picture(c,459,114,89,62,'#cfa68b','landscape');
    return;
  }
  if(id==='post') {
    wash(c,'#547cab');rect(c,0,436,960,104,'#b38a63');
    const cols=['#4373a8','#628bbe','#608aab','#90adc6'];for(let i=0;i<1700;i++){const x=rng()*960,y=rng()*435;line(c,x,y,x+3+(rng()-.5)*8,y+9+rng()*13,cols[i%4],2+rng()*3);}
    rect(c,176,111,260,247,'#c1b359',0,'#243f6e',5);landscape(c,191,125,230,217,true);
    c.save();c.beginPath();c.rect(191,125,230,217);c.clip();for(let i=0;i<8;i++){const x=210+(i*57)%200,y=143+(i*39)%128;for(let r=6;r<26;r+=4){c.beginPath();c.ellipse(x,y,r*1.4,r*.7, i*.3,0,Math.PI*1.6);c.strokeStyle=i%2?'#f4d77a':'#91b7cf';c.lineWidth=2;c.stroke();}}c.restore();
    line(c,307,124,307,343,'#5b965c',5);line(c,191,224,421,224,'#5b965c',5);rect(c,172,345,266,12,'#5b965c');
    for(let i=0;i<23;i++)line(c,480+(i-11)*45,440,480+(i-11)*80,540,i%2?'#cbaa73':'#7d6766',3);
    for(let i=0;i<3;i++){const x=471+i*18;line(c,x,330,x+(i-1)*10,263,'#7c8b3b',3);ellipse(c,x+(i-1)*10,266,13,13,'#dfb846');ellipse(c,x+(i-1)*10,266,7,7,'#665438');}path(c,'M459 308 L506 308 501 334 466 334Z','#c5a548','#314c69',2);
    rect(c,792,345,150,99,'#bf793f',2,p.ink,3);rect(c,791,332,160,18,'#d8ab51',2,p.ink,3);
    return;
  }
  if(id==='nouveau') {
    border(c,'#7c8659',25,4);border(c,'#bba566',33,1);
    const win=path(c,'M176 324 L176 171 Q176 95 287 95 Q398 95 398 171 L398 324Z','#b8c1a3','#5c6549',5);c.save();c.clip(win);
    ellipse(c,287,166,53,53,'#dab96b','#6d7555',2);for(let i=0;i<15;i++){const a=i*Math.PI*2/15;line(c,287+Math.cos(a)*54,166+Math.sin(a)*54,287+Math.cos(a)*112,166+Math.sin(a)*112,'#6d7555',2);}rect(c,176,253,222,71,'#899f78');c.restore();
    for(const [x,flip] of [[103,1],[852,-1]]){path(c,`M${x} 475 C${x+flip*91} 360 ${x-flip*52} 306 ${x+flip*43} 192 C${x+flip*66} 161 ${x+flip*14} 139 ${x+flip*28} 92`,undefined,p.ink,3);for(let i=0;i<5;i++){const y=129+i*68;ellipse(c,x+flip*(i%2?40:9),y,17,16,i%2?'#eadfbd':'#b87065',p.ink,1.5);ellipse(c,x+flip*(i%2?40:9),y,5,5,'#c6ad6f');}}
    rect(c,39,464,882,34,'#b0b08b',0,p.ink,1);text(c,'LE CHAT ET LE TEMPS',480,488,20,p.ink,'Georgia','center');
    return;
  }
  if(id==='cubism') {
    const colors=['#c7bda6','#ada993','#d3c8ad','#8f9386','#b2a58c','#c6b897'];
    for(let i=0;i<56;i++){const x=rng()*960,y=rng()*540,s=70+rng()*230;path(c,`M${x} ${y} L${x+s} ${y+(rng()-.5)*s} L${x+s*.5} ${y+s}Z`,colors[i%colors.length],'#77786b',.4);}
    rect(c,188,118,233,211,'#b0b4a6',0,'#615e51',5);path(c,'M198 319 L238 206 275 265 318 164 407 309Z','#7d9294');path(c,'M201 128 L299 275 399 125 399 322 201 322Z','#c6c2a7');line(c,299,122,278,323,'#5c625b',5);line(c,196,231,409,209,'#5c625b',5);
    text(c,'CAFÉ',453,184,29,'#595a50','Georgia','left','700');c.save();c.translate(117,407);c.rotate(-.1);rect(c,0,0,131,91,'#ded5b8');text(c,'LE JOUR',9,25,21,p.ink,'Georgia','left','700');for(let i=0;i<10;i++)line(c,9,34+i*4,119,34+i*4,'#8f8c75',.6);c.restore();
    return;
  }
  if(id==='bauhaus') {
    ellipse(c,681,300,139,139,'#c6493f');rect(c,198,117,221,209,'#f0ebd9',0,p.ink,4);
    for(let i=0;i<4;i++)for(let j=0;j<4;j++)rect(c,201+i*54,120+j*51,51,48, i===j?'#b9c4c4':i===2&&j===1?'#dcb947':i===1&&j===3?'#486f8d':'#e9e3cf',0,p.ink,2);
    c.save();c.translate(111,450);c.rotate(-Math.PI/2);text(c,'bauhaus',0,0,62,p.ink,'"Outfit"','left','700');c.restore();
    line(c,46,66,432,66,p.ink,4);line(c,448,204,767,57,p.ink,8);line(c,457,219,779,70,p.ink,1);
    path(c,'M844 433 L875 382 907 433Z','#d4ac42');line(c,179,450,910,450,p.ink,4);text(c,'FORM · FARBE · FELIS',194,491,21,p.ink,'"Outfit"','left','700');
    return;
  }
  if(id==='pop') {
    wash(c,'#e7edf1');for(let x=0;x<960;x+=3.2)for(let y=0;y<437;y+=3.2)ellipse(c,x+(Math.floor(y/3.2)%2)*1.6,y,1.05,1.05,'#395b91');rect(c,0,438,960,102,'#efd340');line(c,0,438,960,438,p.ink,4);border(c,p.ink,20,4);
    rect(c,175,112,260,235,'#f8ead4',0,p.ink,4);const colors=['#d9667d','#e6b549','#558fa4','#98a96c'];for(let i=0;i<4;i++){const x=185+(i%2)*122,y=122+Math.floor(i/2)*108;rect(c,x,y,115,102,colors[i]);ellipse(c,x+58,y+57,25,22,['#eed554','#7a739e','#ee8f77','#dcba64'][i]);path(c,`M${x+35} ${y+40} l1-20 15 15 M${x+66} ${y+35} l14-15 1 24`,undefined,p.ink,3);ellipse(c,x+48,y+53,3,5,p.ink);ellipse(c,x+66,y+53,3,5,p.ink);}
    rect(c,44,47,155,36,'#e8c73b',0,p.ink,3);text(c,'MEANWHILE…',56,72,20,p.ink,'"Bangers"','left','400');
    path(c,'M529 145 Q503 126 515 108 Q518 88 543 92 Q559 72 578 87 Q605 81 612 103 Q637 110 624 131 Q624 148 599 148 Q576 167 560 150Z','#faf3dd',p.ink,3);text(c,'…',569,129,32,p.ink,'Arial','center','700');
    return;
  }
  if(id==='pixel') {
    rect(c,0,436,960,104,'#b8704d');for(let x=0;x<960;x+=47)for(let y=438;y<540;y+=22){rect(c,x+(y%44?0:23),y,44,19,'#c78b5b',0,'#724b3c',2);}
    for(let x=0;x<960;x+=32)for(let y=50;y<436;y+=32)rect(c,x+14,y,4,4,'#266773');
    rect(c,181,113,249,223,'#162f3e',0,'#88a798',6);landscape(c,194,125,223,198);line(c,303,126,303,324,'#e5d7b1',8);line(c,194,225,418,225,'#e5d7b1',8);
    text(c,'CAT × 9',48,50,12,'#f1d797','"Press Start 2P"','left','400');text(c,'WORLD 1-1',481,50,11,'#f1d797','"Press Start 2P"','center','400');plant(c,837,418);
    return;
  }
  if(id==='cgi') {
    c.fillStyle=gradient(c,0,0,960,540,['#83b8b2','#498894']);c.fillRect(0,0,960,540);
    for(let row=0;row<7;row++){const y0=407+Math.pow(row/7,1.7)*133,y1=407+Math.pow((row+1)/7,1.7)*133;for(let col=-12;col<20;col++){const a=18+row*15,b=18+(row+1)*15,x0=480+(col-4)*a,x1=480+(col-4)*b;path(c,`M${x0} ${y0} L${x0+a} ${y0} L${x1+b} ${y1} L${x1} ${y1}Z`,(row+col)%2?'#385260':'#c8d0c8');}}
    rect(c,181,110,253,231,'#d0d7df',3,'#576878',3);c.fillStyle=gradient(c,190,120,420,330,['#b1abd4','#e193c6','#e6b975']);c.fillRect(192,123,230,206);path(c,'M192 295 L263 175 311 258 364 203 422 315 422 329 192 329Z','#6970a6');line(c,307,120,307,331,'#f3eee2',5);line(c,192,223,422,223,'#f3eee2',5);
    path(c,'M797 407 L827 327 857 407Z','#467965');
    return;
  }
  // The last chapter gets room to breathe: warm paper, an open window, and houseplants.
  rect(c,0,441,960,99,p.floor);ellipse(c,295,268,239,170,'#ecd3bb');ellipse(c,664,319,199,190,'#e0d7e9');
  rect(c,177,115,269,238,'#faf6e8',18);rect(c,191,128,241,206,'#bee0de',9);
  ellipse(c,380,168,26,26,'#e1b853');for(let i=0;i<10;i++){const a=i*Math.PI/5;line(c,380+Math.cos(a)*33,168+Math.sin(a)*33,380+Math.cos(a)*38,168+Math.sin(a)*38,'#e1b853',2);}
  path(c,'M209 168 Q205 154 218 151 Q220 134 237 141 Q253 138 254 152 Q266 153 264 165Z','#faf8ed');
  const buildingColors=['#b4a3ca','#ce9c8e','#91b291','#d4b378','#646589'];for(let i=0;i<7;i++){const x=194+i*33,h=45+(i*23)%62;rect(c,x,334-h,35,h,buildingColors[i%5],i%2?9:1);for(let yy=339-h;yy<328;yy+=14)for(let xx=x+8;xx<x+30;xx+=12)rect(c,xx,yy,5,6,'#f1d594',1);}
  line(c,308,128,308,334,'#faf7e9',7);line(c,191,220,432,220,'#faf7e9',7);rect(c,167,344,288,12,'#faf7e9',6);
  plant(c,111,426);plant(c,842,440,true);line(c,512,0,512,114,p.ink,2);ellipse(c,512,132,36,27,'#ce6c55');rect(c,476,132,72,8,'#ce6c55');ellipse(c,512,141,9,6,'#e9bf6a');
  for(let i=0;i<14;i++){const x=58+rng()*850,y=74+rng()*270;if(i%3===0){line(c,x-3,y-3,x+3,y+3,p.accent,2);line(c,x+3,y-3,x-3,y+3,p.accent,2);}else if(i%3===1)ellipse(c,x,y,3,3,'#cc8c70');}
}

export function background(id: string) {
  const existing=backgrounds.get(id);if(existing)return existing;
  const canvas=document.createElement('canvas');canvas.width=VIDEO.width;canvas.height=VIDEO.height;
  const c=canvas.getContext('2d',{willReadFrequently:true})!;c.scale(VIDEO.width/ART.width,VIDEO.height/ART.height);decorate(c,id);enrichBackdrop(c,id);
  c.save();c.translate(506,450);c.scale(1.1,1.30);c.translate(-506,-438);tableAndChair(c,id);enrichFurniture(c,id);c.restore();
  if(!['pixel','cgi','bauhaus','pop'].includes(id))grain(c,601+Object.keys(PALETTES).indexOf(id),id==='cave'?18000:7000,id==='post'?'#d8d6b0':'#4e4033',id==='cave'?.16:.085);
  backgrounds.set(id,canvas);return canvas;
}

export {wave};
