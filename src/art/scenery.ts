import {PALETTES} from './palettes';
import {flower, pigment, sandstone, textureShape, tint} from './materials';
import {ellipse, gradient, line, path, random, rect, text, type Ctx} from './primitives';

function vine(c:Ctx,x:number,y:number,h:number,side:number) {
  path(c,`M${x} ${y+h} C${x+side*24} ${y+h*.7} ${x-side*19} ${y+h*.4} ${x+side*11} ${y}`,undefined,'#596b45',1.3);
  for(let i=0;i<15;i++){const yy=y+h*i/15,xx=x+Math.sin(i*.72)*side*13;
    c.save();c.translate(xx,yy);c.rotate(side*(i%2?-.6:.9));path(c,'M0 0 Q-13-17-4-23 Q9-20 5-8Z',i%3?'#648052':'#b59548','#6a6542',.5);c.restore();
    if(i%3===0)flower(c,xx+side*10,yy,4.5,i%2?'#a03b39':'#5374a0','#d4b155',5);
  }
}

function distantLandscape(c:Ctx,x:number,y:number,w:number,h:number) {
  c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
  c.fillStyle=gradient(c,x,y,x,y+h,['#c3d4c2','#e7d9ae','#8a9c76']);c.fillRect(x,y,w,h);
  for(let layer=0;layer<5;layer++) {
    let d=`M${x-1} ${y+h} L${x-1} ${y+h*(.28+layer*.095)}`;for(let i=0;i<11;i++){const xx=x+i*w/10,yy=y+h*(.28+layer*.095)+Math.sin(i*1.76+layer*.7)*h*.07;d+=` Q${xx-w*.04} ${yy-h*.06} ${xx} ${yy}`;}d+=` L${x+w+1} ${y+h}Z`;
    c.filter=layer<3?'blur(1.5px)':'none';
    path(c,d,['#a6b8b0','#98aea1','#8fa592','#7b9478','#6e8769'][layer]);
  }
  c.filter='none';
  path(c,`M${x+w*.63} ${y+h*.63} Q${x+w*.27} ${y+h*.70} ${x+w*.56} ${y+h*.78} Q${x+w*.93} ${y+h*.86} ${x+w*.53} ${y+h} L${x+w*.39} ${y+h} Q${x+w*.83} ${y+h*.85} ${x+w*.43} ${y+h*.80} Q${x+w*.16} ${y+h*.70} ${x+w*.63} ${y+h*.63}Z`,'#dddbc0');
  const rng=random(153);
  for(let i=0;i<63;i++) {
    const xx=x+rng()*w,yy=y+h*(.65+rng()*.32),s=.8+rng()*1.8;
    path(c,`M${xx-s} ${yy} Q${xx-s*2} ${yy-s*4} ${xx} ${yy-s*9} Q${xx+s*2} ${yy-s*4} ${xx+s} ${yy}Z`,i%2?'#5c785e':'#78896b');
    line(c,xx,yy,xx,yy+2,'#7f7961',.5);
  }
  for(let i=0;i<18;i++){const xx=x+w*.20+i*3.1,yy=y+h*.63+Math.sin(i)*3;rect(c,xx,yy,3.8,4.5,'#b3af88');path(c,`M${xx-1} ${yy} l3-2 3 2Z`,'#8e8970');}
  c.globalAlpha=.12;c.fillStyle=c.createPattern(pigment('paper'),'repeat')!;c.fillRect(x,y,w,h);c.restore();
}

function illuminatedWindow(c:Ctx,x:number,y:number,w:number,h:number) {
  const d=`M${x} ${y+h} V${y+50} Q${x+w*.12} ${y+20} ${x+w*.5} ${y} Q${x+w*.88} ${y+20} ${x+w} ${y+50} V${y+h}Z`,shape=path(c,d,'#1e4683','#5c4834',2.8);
  c.save();c.clip(shape);
  for(let yy=y;yy<y+h;yy+=10)for(let xx=x;xx<x+w;xx+=10){const i=Math.floor((xx-x)/10+(yy-y)/10),col=['#a34244','#235784','#668675','#d0a94e'][i%4];path(c,`M${xx} ${yy+5} l5-5 5 5-5 5Z`,col,'#d7bd77',.6);ellipse(c,xx+5,yy+5,1.1,1.1,'#e5cc83');}
  c.restore();path(c,d,undefined,'#d7b551',1.1);
  path(c,`M${x+w*.5} ${y+7} V${y+h} M${x+5} ${y+h*.63} H${x+w-5}`,undefined,'#d5bc70',2.0);
}

function sunflower(c:Ctx,x:number,y:number,r:number) {
  line(c,x,y,x+3,y+50,'#66813a',2.7);
  path(c,`M${x+2} ${y+25} q-25-18-27-1 q16 13 27 1 M${x+2} ${y+38} q22-19 26-8 q-8 16-26 8`, '#6e913c','#384b38',.65);
  for(let i=0;i<23;i++){const a=i*Math.PI*2/23;c.save();c.translate(x,y);c.rotate(a);path(c,`M-2 0 Q-6 ${-r*.75} 0 ${-r} Q5 ${-r*.75} 2 0Z`,i%3?'#e8c450':'#d69e39','#b28732',.5);c.restore();}
  ellipse(c,x,y,r*.40,r*.40,'#6a5935');for(let i=0;i<43;i++){const a=i*2.399,rr=Math.sqrt(i/43)*r*.38;ellipse(c,x+Math.cos(a)*rr,y+Math.sin(a)*rr,.65,.6,i%2?'#ad8e42':'#413e2c');}
}

export function enrichBackdrop(c:Ctx,id:string) {
  const p=PALETTES[id],rng=random(74);
  if(id==='cave') {
    c.drawImage(sandstone(),0,0,960,540);
    // Pigment rubbings and animal outlines are independent of the mineral noise.
    for(let i=0;i<28;i++){const x=rng()*960,y=rng()*540;path(c,`M${x} ${y} l-9-21 4-16-7-19 13-18-7-21`,undefined,'#3a2c244e',.6);}
    for(const [x,y,a] of [[70,92,-.2],[819,174,.25],[833,385,-.4],[120,383,.2],[502,79,.12]]){
      c.save();c.translate(x,y);c.rotate(a);c.globalAlpha=.23;ellipse(c,0,0,13,18,'#853924');for(let i=0;i<5;i++)line(c,-11+i*6,-5,-16+i*8,-30-Math.sin(i)*8,'#853924',5);c.restore();
    }
    rect(c,198,115,202,170,'transparent',0,'#4a3323',1.8);
    for(let i=0;i<34;i++){const x=207+i%17*11.1,y=i<17?125:278;ellipse(c,x,y,1.5,1.5,'#9c5935');}
    return;
  }
  if(id==='renaissance') {
    c.fillStyle=gradient(c,0,0,960,410,['#302922','#665037','#372b21']);c.fillRect(0,0,960,398);
    const stone=new Path2D('M0 0H960V398H0Z');textureShape(c,stone,'stone',.10);
    c.save();c.globalCompositeOperation='soft-light';c.globalAlpha=.24;c.drawImage(sandstone(),0,0,960,540);c.restore();
    const arch=path(c,'M186 310 V172 Q186 76 286 76 Q386 76 386 172 V310Z','#aa9573','#28251c',13);
    c.save();c.clip(arch);distantLandscape(c,186,86,200,224);c.restore();
    path(c,'M180 311 V170 Q180 68 286 68 Q392 68 392 170 V311',undefined,'#9f926b',3);
    path(c,'M192 310 V172 Q192 83 286 83 Q380 83 380 172 V310',undefined,'#d0bb8c',1.4);
    for(let i=0;i<15;i++){const a=Math.PI+i*Math.PI/14,x=286+Math.cos(a)*107,y=174+Math.sin(a)*100;line(c,x,y,x+Math.cos(a)*12,y+Math.sin(a)*12,'#56483a',1);}
    c.fillStyle=gradient(c,176,304,176,324,['#d8c59b','#81704b']);c.fillRect(174,305,224,14);line(c,175,305,398,305,'#e3d6ad',1.3);
    const light=c.createRadialGradient(301,318,5,301,318,370);light.addColorStop(0,'#efcf8330');light.addColorStop(1,'#ead48b00');c.fillStyle=light;c.fillRect(0,0,960,540);
    for(let i=0;i<12;i++){const x=12+i*86;line(c,x,2,x,398,'#917d5018',.6);}
    // Inlaid wooden chest and small pewter still life give the interior depth.
    rect(c,825,341,102,101,'#59422d',2,'#2c251c',2);rect(c,819,337,114,8,'#8b6845',1);
    for(let i=0;i<3;i++){rect(c,837,355+i*24,77,17,'#705239',1,'#392c20',1);ellipse(c,875,363+i*24,3,2,'#b69d55');}
    ellipse(c,878,333,31,4,'#c2b594');for(let i=0;i<7;i++)ellipse(c,860+i*5,330-i%3*4,5,5,i%2?'#c29b4d':'#6c793f');
    return;
  }
  if(id==='gothic') {
    // Gold relief, cusps, finials, mullions and a populated illuminated margin.
    for(let i=0;i<3;i++) {
      const x=179+i*178;
      path(c,`M${x} 422 V157 Q${x+27} 124 ${x+82} 93 Q${x+137} 124 ${x+164} 157 V422Z`,'#cfb257','#745735',2);
      path(c,`M${x+7} 418 V160 Q${x+39} 127 ${x+82} 103 Q${x+125} 127 ${x+157} 160 V418`,undefined,'#f0d182',3);
      illuminatedWindow(c,x+22,153,121,150);
      for(let j=0;j<7;j++){const xx=x+j*23;path(c,`M${xx} 152 l11-30 11 30`,undefined,'#806735',.8);ellipse(c,xx+11,122,2,3,'#cc543c');}
      for(const xx of [x+9,x+153]){rect(c,xx,179,4,240,'#ad9049');for(let j=0;j<12;j++)line(c,xx-1,190+j*18,xx+5,190+j*18,'#f0d180',1.0);}
      path(c,`M${x+65} 112 q17-23 34 0 q-17 23-34 0Z`,'#365d92','#e7ca68',1);ellipse(c,x+82,112,3,3,'#c3403e');
    }
    vine(c,69,62,393,1);vine(c,911,63,390,-1);
    for(let i=0;i<27;i++){const x=60+i*31;path(c,`M${x} 42 q12-13 26 0`,undefined,'#72834f',.7);if(i%3===0)flower(c,x+12,38,3.3,i%2?'#bd4840':'#537b99','#ccad54',5);}
    for(let i=0;i<24;i++){const x=63+i*34;path(c,`M${x} 487 q15-19 28 0`,undefined,'#6f844e',.75);if(i%3===0)flower(c,x+17,482,3.8,'#ab443b','#d7b464',5);}
    c.save();c.translate(816,379);ellipse(c,0,0,13,8,'#b9c2a4','#615641',.8);path(c,'M-4 2 q12-15 16-1 q-4 11-12 4 q-6-7 4-8',undefined,'#735c3c',1);path(c,'M-17 7 q20 10 44-3',undefined,'#6d6f49',2);c.restore();
    return;
  }
  if(id==='ukiyo') {
    // The decorative wave is carved from nested curves with individual foam tips.
    const clip=path(c,'M283 118 A102 102 0 1 1 282.9 118Z','#bacbc4','#303f4b',4);
    c.save();c.clip(clip);
    path(c,'M181 293 L284 185 321 237 351 209 394 302Z','#ced8ce');
    path(c,'M221 294 Q213 205 282 152 Q321 128 351 161 Q388 198 350 227 Q366 190 324 179 Q290 181 272 228 Q255 268 293 299Z','#28567c');
    for(let i=0;i<15;i++)path(c,`M${203+i*4} 303 Q${202+i*5} 217 ${271+i*3} 161`,undefined,i%2?'#e7e0c6':'#90aab3',.9);
    path(c,'M280 152 Q323 126 353 164 Q369 181 362 210 L354 190 346 201 343 180 332 190 327 173 315 184 311 166 298 176 295 159Z','#f3e7ca');
    for(let i=0;i<28;i++){const x=278+i%7*11,y=159+Math.floor(i/7)*8;path(c,`M${x} ${y} q3-5 6-1`,undefined,'#344e63',.8);}
    for(let i=0;i<11;i++)path(c,`M183 ${285+i*3} q67-15 112 0 q49 9 91-2`,undefined,'#ded9be',1);
    c.restore();
    rect(c,745,105,35,132,'#e3d1a9',0,p.ink,1);path(c,'M755 219 Q760 161 769 128',undefined,'#66816e',1.3);for(let i=0;i<6;i++)flower(c,761+Math.sin(i)*7,130+i*13,3.3,'#be7766','#beaa57',5);
    for(let i=0;i<7;i++)line(c,32,438+i*8,929,438+i*8,'#8f977664',.55);
    return;
  }
  if(id==='impression') {
    const garden=new Path2D('M174 120H402V339H174Z');c.save();c.clip(garden);rect(c,174,120,228,220,'#bccebd');
    for(let i=0;i<2200;i++){
      const x=173+rng()*230,y=125+rng()*215,col=y<205?['#d0dfdc','#adcad0','#eae5cc'][i%3]:['#528855','#84a85d','#aeac58','#bcc77c'][i%4];
      line(c,x,y,x+2+rng()*4,y-2-rng()*4,col,.8+rng()*2.7);
      if(y>233&&i%8===0)ellipse(c,x,y,1.6+rng(),1.4+rng(),i%3?'#c65447':'#e58a69');
    }
    c.restore();line(c,283,119,283,339,'#f9efd9',6);line(c,174,226,402,226,'#f9efd9',6);
    for(let i=0;i<1500;i++){const x=rng()*960,y=432+rng()*108;line(c,x,y,x+3+rng()*12,y-1-rng()*3,['#f2dfa8','#cbb686','#dbc38e','#d0b9a0','#fff0c5'][i%5],1+rng()*3);}
    ellipse(c,491,427,76,5,'#a6968a20');
    for(let i=0;i<26;i++){const x=811+rng()*63,y=303+rng()*136;path(c,`M844 434 Q${x-7} ${y+30} ${x} ${y}`,undefined,'#7b9364',1);ellipse(c,x,y,7+rng()*6,3+rng()*4,['#7e9e66','#8fae79','#b0b77b'][i%3]);}
    path(c,'M820 417 L864 417 858 444 826 444Z','#acc1c0','#74888d',1.0);
    return;
  }
  if(id==='post') {
    for(let i=0;i<5000;i++){const x=rng()*960,y=rng()*435;if(x>175&&x<437&&y>108&&y<358)continue;line(c,x,y,x+Math.sin(y*.05)*3,y+5+rng()*10,['#759ccb','#4773ac','#a7b2bc','#7f98c2','#305786','#78afcb'][i%6],.65+rng()*2);}
    for(let i=0;i<1700;i++){const x=rng()*960,y=440+rng()*100,angle=Math.atan2(y-365,x-480);line(c,x,y,x+Math.cos(angle)*14,y+Math.sin(angle)*14,['#dda668','#ae704e','#4e8290','#b89179','#eed087'][i%5],1+rng()*2.5);}
    for(let i=0;i<5;i++)sunflower(c,451+i*15,280-(i%3)*19,12+(i%2)*4);
    const glow=c.createRadialGradient(500,86,2,500,86,48);glow.addColorStop(0,'#fae36d');glow.addColorStop(1,'#edce5500');c.fillStyle=glow;c.fillRect(450,38,100,96);
    for(let r=12;r<45;r+=3){c.beginPath();c.ellipse(500,86,r,r*.9,0,0,Math.PI*2);c.strokeStyle=r%2?'#efdb68':'#aabc65';c.lineWidth=1.3;c.stroke();}
    line(c,500,0,500,79,'#263c62',1.7);ellipse(c,500,84,7,5,'#fcdd54');
    rect(c,796,337,147,12,'#d9b461');rect(c,803,347,7,99,'#d2ab5a');rect(c,931,347,7,99,'#d2ab5a');
    path(c,'M811 337 Q833 323 886 329 L934 337Z','#bf5242','#6d553e',1.3);
    for(let i=0;i<24;i++)line(c,811+i*5,351,810+i*5,438,i%2?'#e4bb70':'#95623f',.8);
    return;
  }
  if(id==='nouveau') {
    for(let i=0;i<14;i++){const a=i*Math.PI/7;path(c,`M${287+Math.cos(a)*53} ${166+Math.sin(a)*53} L${287+Math.cos(a)*107} ${166+Math.sin(a)*107}`,undefined,'#6c7755',.9);}
    for(let i=0;i<7;i++){const x=187+i*28;path(c,`M${x} 314 Q${x+18} 272 ${x+13} 249`,undefined,'#527851',1.6);flower(c,x+13,249,8,i%2?'#bc8a8b':'#e3d2ac','#d3ae58',5);}
    for(const [x,side] of [[98,1],[860,-1]])for(let i=0;i<4;i++){const y=147+i*67;path(c,`M${x} 456 Q${x-side*30} ${y+56} ${x+side*18} ${y}`,undefined,'#657850',2);flower(c,x+side*18,y,12,i%2?'#d8c99d':'#b5766c','#bdae64',5);}
    for(let i=0;i<42;i++){const x=44+i*21;path(c,`M${x} 456 q8-8 16 0 q-8 8-16 0`,undefined,'#aa9769',.7);}
    return;
  }
  if(id==='egypt') {
    for(let col=0;col<16;col++){const x=35+col*56;if(x>160&&x<430)continue;line(c,x-19,38,x-19,443,'#aa93534a',.7);for(let row=0;row<12;row++){const y=42+row*33;c.save();c.translate(x,y);c.rotate(row%3===0?.06:0);const colr=['#a36d48','#5f8280','#8f8246'][row%3];
      if(row%4===0)path(c,'M-6 3 q4-10 10-3 l-3 4 7 4 M-6 3 l-7 2 m4-1-3 7',undefined,colr,1);
      else if(row%4===1){ellipse(c,0,0,5,5,'transparent',colr,1);line(c,0,5,0,15,colr,.9);line(c,-7,10,7,10,colr,.9);}
      else if(row%4===2)path(c,'M-8 3 q7-10 15 0 q-7 6-15 0 M0 0v5 m-4 5-5 7',undefined,colr,.9);
      else path(c,'M-9 0 q2-6 5 0 q2 6 5 0 q2-6 5 0 M-9 7 q2-6 5 0 q2 6 5 0 q2-6 5 0',undefined,colr,.9);
      c.restore();}}
    for(let i=0;i<48;i++){const x=i*20;rect(c,x,453,18,6,i%3?'#b5864a':'#416e7b');path(c,`M${x} 499 l9 14 9-14Z`,i%2?'#b56c42':'#7d925f');}
    return;
  }
  if(id==='greek') {
    path(c,'M491 200 Q470 167 480 139 Q497 119 505 141 Q518 168 498 201',undefined,p.ink,3);
    for(let i=0;i<5;i++)line(c,480+i*4,139,487+i*2.7,193,p.ink,1);
    ellipse(c,492,201,11,11,p.ink);ellipse(c,492,201,6,6,'transparent',p.paper,.7);
    for(let i=0;i<11;i++){const x=64+i*81,y=i%2?403:365;c.save();c.translate(x,y);for(let j=0;j<7;j++){const a=j*Math.PI*2/7;line(c,Math.cos(a)*3,Math.sin(a)*3,Math.cos(a)*8,Math.sin(a)*8,p.ink,.8);}ellipse(c,0,0,2,2,p.ink);c.restore();}
    return;
  }
  if(id==='cubism') {
    c.save();c.globalAlpha=.12;for(let i=0;i<350;i++){const x=rng()*960,y=rng()*540;line(c,x,y,x+12+rng()*38,y-6-rng()*21,'#514b3c',.6);}c.restore();
    path(c,'M441 280 L476 215 505 235 490 312 479 417 461 419 472 307Z','#766e58','#565448',1.1);
    path(c,'M469 220 L474 308 469 416 M487 233 L483 309 475 415',undefined,'#c4bca3',.7);
    return;
  }
  if(id==='bauhaus') {
    for(let i=0;i<8;i++){c.beginPath();c.arc(681,300,142+i*7,-.9,.75);c.strokeStyle=p.ink;c.lineWidth=i%2?.7:1.2;c.stroke();}
    rect(c,452,74,8,8,'#adac96');rect(c,467,89,4,4,'#d7b748');
    return;
  }
  if(id==='pop') {
    return;
  }
  if(id==='pixel') {
    for(let i=0;i<18;i++){const x=195+i*12,y=240+i%4*12;rect(c,x,y,10,84-(y-240),['#91ad8c','#d49975','#738b9a','#aeb08b'][i%4]);for(let yy=y+6;yy<318;yy+=12)rect(c,x+3,yy,3,4,'#f5d789');}
    line(c,194,225,418,225,'#e7d4a7',6);line(c,303,126,303,324,'#e7d4a7',6);return;
  }
  if(id==='cgi') {
    ellipse(c,853,407,36,5,'#263e514d');
  }
}

export function enrichFurniture(c:Ctx,id:string) {
  const p=PALETTES[id];
  if(id==='renaissance') {
    const floor=new Path2D('M0 398H960V540H0Z');textureShape(c,floor,'craquelure',.45);
    c.save();c.filter='blur(6px)';ellipse(c,514,442,116,10,'#251b1b70');ellipse(c,662,443,77,9,'#241a1970');c.restore();
    // Polished timber has a cylindrical highlight, a mortise and a round finial.
    c.fillStyle=gradient(c,710,0,725,0,['#322418','#b08a53','#674627','#241c16']);c.fillRect(710,262,15,172);
    const finial=c.createRadialGradient(716,260,1,718,264,8);finial.addColorStop(0,'#d5ad68');finial.addColorStop(.45,'#90653b');finial.addColorStop(1,'#302315');c.fillStyle=finial;c.beginPath();c.ellipse(718,264,8,7,0,0,Math.PI*2);c.fill();
    rect(c,651,367,84,11,'#6d4629',2);line(c,663,378,650,438,'#553a23',6);line(c,725,378,737,439,'#704b29',6);
    for(const x of [429,589,653,736]){line(c,x-2,380,x-2,439,'#9f7950',1.1);line(c,x+2,380,x+2,439,'#35281e',1.1);}
    const cloth=path(c,'M430 338 H584 L592 374 Q570 372 562 376 Q551 371 544 376 Q530 372 522 375 Q504 371 493 376 Q482 372 473 376 Q453 371 424 376Z','#d9caa1');
    c.save();c.clip(cloth);c.fillStyle=gradient(c,431,340,596,340,['#e6dbb6','#b7a77d','#d7caa5']);c.fillRect(423,339,177,40);
    for(let x=429;x<595;x+=14){line(c,x,339,x-3,375,'#b3aa88',1.9);line(c,x+5,339,x+2,375,'#efe3bf',.7);}for(let y=345;y<377;y+=9)line(c,423,y,598,y,'#bdaf87',1.5);c.restore();
    for(let i=0;i<18;i++)line(c,428+i*9,375,428+i*9,378,'#d4c497',.6);
  }
  if(id==='egypt') {
    path(c,'M490 350 H519 L513 429 526 440 H483 L496 429Z','#eadcaa',p.ink,1);
    rect(c,413,333,183,9,'#f1e6ba',0,p.ink,1);rect(c,420,342,168,4,'#42747c');
    for(let i=0;i<6;i++)rect(c,497-i*.1,353+i*12,16+i*.2,2,i%2?'#b98549':'#97a68a');
    for(let i=0;i<5;i++)ellipse(c,718,284+i*18,2,2,'#d4b257');
  }
  if(id==='gothic') {
    for(let i=0;i<23;i++){const x=416+i*8;path(c,`M${x} 365 q4 9 8 0`,undefined,'#8d96a1',.8);path(c,`M${x+1} 348 l6 10`,undefined,'#aebbc0',.5);}
    ellipse(c,460,339,13,3,'#d1b659',p.ink,.7);ellipse(c,460,338,9,1.5,'#eee1a8');
  }
  if(['greek','ukiyo','post','nouveau'].includes(id))for(let i=0;i<4;i++)path(c,`M${710+i*3} 272 L${710+i*3} 355`,undefined,id==='greek'?p.accent:tint(p.accent,-.30),.6);
  if(id==='nouveau') {path(c,'M418 344 Q463 348 503 344 Q548 350 596 344',undefined,'#485941',1);path(c,'M503 347 Q527 378 505 404 Q483 415 494 438 M503 347 Q479 378 501 404 Q523 415 512 438',undefined,'#637953',4);}
}

export function atmosphere(c:Ctx,id:string,time:number) {
  if(id==='renaissance') {
    const rng=random(24);for(let i=0;i<28;i++){c.save();c.globalAlpha=.10+rng()*.10;const x=202+rng()*345,y=(rng()*510+time*(3+rng()*5))%510;ellipse(c,x,y,.45,.65,'#ffeac0');c.restore();}
    for(let i=0;i<4;i++){const x=220+(time*8+i*29)%140,y=155+i*14+Math.sin(time*.7+i)*2,wing=2+Math.sin(time*7+i)*1.4;path(c,`M${x-4} ${y-wing} q3-2 4 ${wing} q2-3 4 ${-wing}`,undefined,'#677c71',.6);}
  }
  if(id==='cave') {
    const g=c.createRadialGradient(856,428,8,856,428,280);g.addColorStop(0,`rgba(233,145,50,${.10+Math.sin(time*8)*.025})`);g.addColorStop(1,'#efb44b00');c.fillStyle=g;c.fillRect(0,0,960,540);
  }
  if(id==='post') {const g=c.createRadialGradient(500,85,1,500,85,36);g.addColorStop(0,`rgba(255,239,111,${.09+.04*Math.sin(time*3)})`);g.addColorStop(1,'#ffe97100');c.fillStyle=g;c.fillRect(460,45,80,80);}
}
