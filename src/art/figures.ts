import {clamp, lerp, progress} from '../timeline';
import {PALETTES} from './palettes';
import {clothFold, flower, impasto, paint, textureShape, tint} from './materials';
import {drawPortrait,hasPortrait} from './portraits';
import {ellipse, gradient, line, path, random, rect, type Ctx} from './primitives';

const HEAD='M654 176 Q672 166 687 177 Q699 190 696 213 Q695 235 680 244 Q666 248 653 237 L646 227 645 222 633 218 Q630 215 637 208 L642 200 Q641 183 654 176Z';
const HAIR='M642 184 Q649 163 675 165 Q702 166 709 193 L704 226 Q697 244 681 248 L673 220 686 195 Q670 188 642 184Z';
const TORSO='M670 254 Q695 250 708 273 L717 359 Q685 373 650 358 L652 288 Q654 259 670 254Z';
const SKIRT='M652 351 Q680 364 712 353 Q722 372 693 381 L672 395 Q667 418 682 441 Q636 450 598 439 Q620 410 620 383 Q620 360 652 351Z';
const PANTS='M652 351 Q682 362 712 353 Q727 373 698 386 L657 395 642 435 Q629 445 614 435 L621 388 Q623 361 652 351Z';

const keys:[[number,number],...[number,number][]]=[[0,0],[.30,0],[1.25,.72],[2.2,1],[3.3,.6],[4.1,.05],[4.8,.18],[5.55,1],[6.55,.8],[7.5,.15],[8.2,.2],[9.0,.02],[9.9,.8],[10.8,0],[15,0]];
export function cupMotion(time:number,id:string) {
  if(id==='modern')return {x:508,y:330,sip:0};
  let sip=0;
  for(let i=1;i<keys.length;i++)if(time<=keys[i][0]){sip=lerp(keys[i-1][1],keys[i][1],progress(time,keys[i-1][0],keys[i][0]));break;}
  if(id==='renaissance')return {x:lerp(508,612,sip),y:lerp(319,200,sip),sip};
  return {x:lerp(508,628,sip),y:lerp(337,265,sip),sip};
}

export function armJoint(sx:number,sy:number,hx:number,hy:number) {
  const l1=77,l2=93,dx=hx-sx,dy=hy-sy,d=clamp(Math.hypot(dx,dy),.01,l1+l2-.01);
  const a=(l1*l1-l2*l2+d*d)/(2*d),h=Math.sqrt(Math.max(0,l1*l1-a*a));
  return {x:sx+dx/d*a+dy/d*h,y:sy+dy/d*a-dx/d*h};
}

function limb(c:Ctx,sx:number,sy:number,ex:number,ey:number,hx:number,hy:number,color:string,id:string,width=21) {
  const p=PALETTES[id];
  if(p.outline){line(c,sx,sy,ex,ey,p.ink,width+p.outline*2);line(c,ex,ey,hx,hy,p.ink,width-3+p.outline*2);}
  line(c,sx,sy,ex,ey,color,width);line(c,ex,ey,hx,hy,color,width-3);ellipse(c,ex,ey,width*.43,width*.43,color);
  if(['renaissance','cgi','post','impression'].includes(id)){
    const light=tint(color,.29),shadow=tint(color,-.33);
    c.save();if(id==='renaissance'){c.filter='blur(2px)';c.globalAlpha=.65;}
    line(c,sx-3,sy-1,ex-3,ey-1,light,width*.28);line(c,ex-3,ey-1,hx-2,hy-1,light,width*.22);
    path(c,`M${sx+4} ${sy+2} Q${ex+6} ${ey+3} ${hx+3} ${hy+2}`,undefined,shadow,1.4);
    c.restore();
  }
  path(c,`M${ex-7} ${ey-3} q6 3 13 0`,undefined,tint(color,-.26),.8);
  if(id==='post'||id==='impression')for(const [ax,ay,bx,by,w] of [[sx,sy,ex,ey,width],[ex,ey,hx,hy,width-3]]){
    const a=Math.atan2(by-ay,bx-ax),nx=-Math.sin(a)*w/2,ny=Math.cos(a)*w/2;
    const capsule=new Path2D(`M${ax+nx} ${ay+ny}L${bx+nx} ${by+ny}Q${bx+Math.cos(a)*w} ${by+Math.sin(a)*w} ${bx-nx} ${by-ny}L${ax-nx} ${ay-ny}Q${ax-Math.cos(a)*w} ${ay-Math.sin(a)*w} ${ax+nx} ${ay+ny}Z`);
    impasto(c,capsule,[Math.min(ax,bx)-w,Math.min(ay,by)-w,Math.abs(bx-ax)+w*2,Math.abs(by-ay)+w*2],[color,tint(color,.3),tint(color,-.22),id==='post'?'#7193af':'#e0d2e6'],260,74,()=>a);
  }
}

function fingers(c:Ctx,x:number,y:number,id:string,angle:number) {
  const p=PALETTES[id];c.save();c.translate(x,y);c.rotate(angle);
  paint(c,'M-6-5 Q-2-9 5-6 L10-3 Q14 1 10 3 L3 2 Q6 5 10 5 Q12 8 7 10 L-2 9 Q-11 6-6-5Z',p.skin,id,'paper');
  for(let i=0;i<3;i++)path(c,`M2 ${i*2.5-1} q4 1 8 2`,undefined,id==='greek'?p.accent:tint(p.skin,-.4),.55);
  c.restore();
}

function hair(c:Ctx,id:string) {
  const p=PALETTES[id];
  paint(c,HAIR,p.hair,id,'paper');
  if(['renaissance','impression','post'].includes(id)) {
    ellipse(c,711,210,15,17,p.hair);
    for(let i=0;i<30;i++){const x=645+i*2.0;path(c,`M${x} 177 Q${673+i*.7} ${157+i*.6} ${699+i*.27} ${194+i*.43} Q${712-i*.3} 227 684 244`,undefined,i%3?tint(p.hair,.17):tint(p.hair,-.3),.55);}
    for(let i=0;i<15;i++)path(c,`M704 ${198+i*.8} q${14+i*.12} 8 ${-1+i*.25} ${13+i*.5}`,undefined,tint(p.hair,.20),.65);
  }
  if(id==='nouveau') {
    const locks='M672 183 Q726 187 714 235 Q691 263 709 281 Q728 304 715 335 Q699 321 690 303 Q672 278 688 252 Q701 229 679 219Z';
    paint(c,locks,p.hair,id,'cloth');
    for(let i=0;i<20;i++)path(c,`M${681+i*.75} 192 Q${720+i*.3} 214 ${701+i*.3} 247 Q${680+i*.7} 274 ${710+i*.2} 320`,undefined,i%2?'#dac096':'#855834',.6);
  }
}

export function drawFigure(c:Ctx,id:string,time:number) {
  const p=PALETTES[id],cup=cupMotion(time,id),breathe=Math.sin(time*2.0)*.9,portrait=hasPortrait(id);
  const trousers=['post','pixel','cgi','bauhaus'].includes(id);
  c.save();c.translate(0,breathe);
  const cloth=id==='gothic'?'#315793':id==='nouveau'?'#c99795':id==='renaissance'?'#a63233':p.robe;
  const blouse=id==='nouveau'?'#eee4c9':p.robe;
  if(id==='nouveau'){
    paint(c,'M641 335Q686 344 712 334Q719 351 704 374Q699 418 743 438Q737 447 715 445Q660 452 581 440Q604 421 609 390Q608 345 641 335Z','#eee4c9',id);
    paint(c,'M641 333Q678 343 710 333Q723 353 693 368L674 382Q661 408 653 430Q647 437 639 421Q630 444 620 438Q612 434 609 419Q603 437 590 440L602 397Q600 347 641 333Z',cloth,id);
    path(c,'M693 368L674 382Q661 408 653 430Q647 437 639 421Q630 444 620 438Q612 434 609 419Q603 437 590 440',undefined,'#b99b54',4);
    for(let i=0;i<6;i++)clothFold(c,`M${635+i*10} 350Q${619+i*8} 382 ${610+i*7} 424`,cloth,id,.8);
    for(let i=0;i<10;i++)ellipse(c,598+i*6,437+Math.sin(i*.7)*4,1,1,'#f7ebcf',p.ink,.25);
    for(let i=0;i<5;i++)path(c,`M${693+i*6} 378Q${680+i*5} 412 ${700+i*9} 441`,undefined,'#b8a771',.7);
  }else{
    paint(c,trousers?PANTS:SKIRT,trousers?(id==='post'?'#337484':id==='cgi'?'#454cba':p.accent):cloth,id);
    for(let i=0;i<7;i++)clothFold(c,`M${647+i*9} ${369+i%2*6} Q${624+i*7} 402 ${606+i*9} 438`,cloth,id,id==='renaissance'?7:1.25);
  }
  paint(c,'M612 431 Q622 431 632 438 L632 444 596 444 Q596 437 612 431Z',id==='cgi'?'#941c55':p.hair,id,'paper');
  if(id==='gothic'||id==='nouveau') {
    ellipse(c,674,209,id==='gothic'?47:57,id==='gothic'?48:61,'#d2b15c',p.ink,1.8);
    ellipse(c,674,209,id==='gothic'?41:51,id==='gothic'?43:55,'transparent','#ecd68c',1);
    for(let i=0;i<20;i++){const a=i*Math.PI/10;ellipse(c,674+Math.cos(a)*(id==='gothic'?44:54),209+Math.sin(a)*(id==='gothic'?45:58),1.5,1.5,'#f9e9b7');}
  }
  if(!portrait)hair(c,id);
  paint(c,id==='nouveau'?'M670 254Q695 250 708 273L717 334Q685 343 650 334L652 288Q654 259 670 254Z':TORSO,blouse,id);
  for(let i=0;i<6;i++)clothFold(c,`M${660+i*8} 279 Q${659+i*10} 317 ${655+i*10} ${id==='nouveau'?334:358}`,blouse,id,id==='renaissance'?6:1.2);
  path(c,id==='nouveau'?'M652 333Q680 342 715 334':'M654 352Q680 360 712 354',undefined,tint(blouse,-.36),id==='nouveau'?1:3);
  if(id==='nouveau'){path(c,'M653 331Q680 342 716 331',undefined,'#bba35f',4);for(let i=0;i<8;i++)ellipse(c,659+i*7,335+Math.sin(i*.42)*3,1.7,1.7,'#829a85',p.ink,.5);}
  paint(c,'M662 236 L683 236 686 261 Q675 272 660 259Z',p.skin,id,'paper');
  if(portrait){c.save();c.translate(674,235);c.rotate(Math.sin(time*.93)*.012-cup.sip*.015);c.translate(-674,-235);drawPortrait(c,id,time);c.restore();}
  else {
  c.save();c.translate(674,235);c.rotate(Math.sin(time*.93)*.012-cup.sip*.015);c.translate(-674,-235);
  paint(c,HEAD,p.skin,id,'paper');
  if(id==='renaissance'||id==='impression'||id==='cgi') {
    const face=new Path2D(HEAD);c.save();c.clip(face);
    const glow=c.createRadialGradient(650,203,2,658,211,41);glow.addColorStop(0,tint(p.skin,.33));glow.addColorStop(1,'#eacc9d00');c.fillStyle=glow;c.fillRect(628,175,70,75);
    c.save();c.filter='blur(4px)';c.globalAlpha=.6;path(c,'M676 179 Q690 210 681 233 Q671 241 668 236',undefined,tint(p.skin,-.25),11);c.restore();
    c.restore();ellipse(c,677,211,4,7,p.skin,tint(p.skin,-.3),.7);path(c,'M678 206 q-4 5 0 8',undefined,tint(p.skin,-.45),.6);
    c.save();c.filter='blur(2px)';c.globalAlpha=.45;ellipse(c,650,220,6,3.7,id==='cgi'?'#ac8eb9':'#c49278');c.restore();
  }
  if(id==='greek'){path(c,'M653 183 Q668 171 685 184 M654 193 Q675 176 691 191 M660 177 Q682 167 694 190',undefined,p.accent,1);}
  const t=(time+.2)%2.9,blink=t>2.60&&t<2.75?Math.max(.04,Math.abs((t-2.675)/.075)):1;
  if(id==='egypt') {
    path(c,'M640 202 Q648 196 657 204 Q648 209 640 202Z','#e5d1a0',p.ink,1.5);ellipse(c,648,202,2,3*blink,p.ink);
    path(c,'M643 194 Q650 190 657 194',undefined,p.ink,2);line(c,655,202,666,197,p.ink,1.7);
  } else {
    if(id==='renaissance'||id==='impression'||id==='cgi')ellipse(c,647,204,4.0,2.2*blink,'#efe4d0');
    ellipse(c,646,204,1.9,2.2*blink,id==='greek'?p.accent:p.ink);
    path(c,`M642 ${198-cup.sip*.4} q5-3 10 0`,undefined,id==='greek'?p.accent:p.ink,id==='pop'?1.8:.9);
    path(c,'M640 204 q4-3 9 0',undefined,id==='greek'?p.accent:p.ink,id==='pop'?1.7:.75);
    if(id==='pop')for(let i=0;i<3;i++)line(c,644+i*2,202,642+i*3,199,p.ink,1);
  }
  path(c,'M640 229 Q646 231 650 228 M641 233 Q646 236 651 233',undefined,['ukiyo','pop','renaissance'].includes(id)?'#975647':id==='greek'?p.accent:p.ink,id==='pop'?1.6:.75);
  if(id==='post') {
    paint(c,'M647 218 Q656 222 663 219 L663 212 680 216 Q683 239 666 249 Q650 246 645 234 L654 234Z','#b67439',id,'paper');
    const rng=random(714);for(let i=0;i<95;i++){const x=645+rng()*35,y=220+rng()*26;line(c,x,y,x+1,y+4,i%2?'#d5a14c':'#815736',.8);}
  }
  c.restore();
  }
  if(id==='egypt') {
    paint(c,'M654 178 Q680 162 699 177 L711 259 687 263 677 213 683 183Z',p.hair,id,'cloth');
    for(let i=0;i<12;i++)path(c,`M${682+i*1.4} 181 L${689+i*1.7} 258`,undefined,'#9b834f',.65);
    path(c,'M651 180 Q674 172 699 181',undefined,'#d8b365',4);
    path(c,'M657 254 Q674 273 691 254 L699 270 Q675 296 649 270Z','#d8ac44',p.ink,1);
    for(let i=0;i<3;i++)path(c,`M${654-i*2} ${262+i*4} Q674 ${283+i*4} ${694+i*2} ${261+i*4}`,undefined,i%2?'#ba4b37':'#326d83',2);
    paint(c,'M664 175 Q662 149 676 140 Q689 157 690 175Z','#e9d4a1',id,'paper');ellipse(c,675,172,7,4,'#ab4232');
    ellipse(c,685,227,3.5,5.5,'#d3ad4b',p.ink,.7);
  }
  if(id==='gothic'&&!portrait) {
    paint(c,'M642 181 Q656 158 683 172 Q699 188 698 221 L687 241 682 235 Q696 200 679 184 Q653 174 644 199Z','#eee2c7',id,'paper');
    path(c,'M645 183 Q662 166 685 181 L697 218',undefined,'#9b895a',1);
  }
  if(id==='gothic')paint(c,'M690 255Q713 272 708 329L713 355 689 362 680 289Z','#2b5599',id);
  if(id==='ukiyo'&&!portrait) {
    paint(c,'M643 185 Q650 160 680 168 L696 177 700 196 679 197 677 182Z',p.hair,id,'paper');ellipse(c,700,180,21,13,p.hair,p.ink,1);
    for(let i=0;i<5;i++)path(c,`M${683+i*3} 174 q18 6 17 17`,undefined,'#7b7b62',.7);
    for(let i=0;i<3;i++){line(c,685+i*4,176,718+i*4,156+i*5,'#b78a46',1.6);flower(c,719+i*4,156+i*5,2.6,'#bd685e','#e4c276',5);}
  }
  if(id==='ukiyo'){
    paint(c,'M654 260L666 280 687 260 701 271 675 299 649 281Z','#e7d4ab',id,'paper');path(c,'M660 263L675 284 694 266',undefined,'#bb776a',3);
    paint(c,'M698 292Q716 289 717 312L711 344 691 338Z','#c69861',id);
  }
  if((id==='post'||id==='impression')&&!portrait) {
    paint(c,'M645 172 Q647 147 674 146 Q698 146 704 172Z',id==='post'?'#d1ad3d':'#d7bc78',id,'cloth');
    ellipse(c,674,174,48,8,id==='post'?'#e5c453':'#e4cd9a',p.outline?p.ink:undefined,1);
    path(c,'M648 164 Q674 166 701 164',undefined,id==='post'?'#294a76':'#6984ac',4);
    for(let i=0;i<21;i++)line(c,650+i*2.5,152,649+i*2.65,163,'#a08c43',.4);
  }
  if(id==='renaissance') {
    path(c,'M657 259 Q675 269 692 259',undefined,'#aa985f',2.3);
    for(let i=0;i<12;i++){const a=i*Math.PI/16;ellipse(c,658+i*3,258+Math.sin(a)*6,1.7,1.7,'#ead4a7','#65512d',.3);}
    path(c,'M658 277 Q679 287 694 276',undefined,'#9ca575',1.2);
  }
  if(id==='nouveau') {
    for(let i=0;i<7;i++){const a=-Math.PI*.90+i*.38;flower(c,674+Math.cos(a)*47,208+Math.sin(a)*53,5.5,i%2?'#c79882':'#d5bc79','#778b63',5);}
    path(c,'M659 258 Q674 267 691 258',undefined,'#b9a566',2);ellipse(c,677,266,3,4,'#d1ab5d',p.ink,.5);
  }
  if(id==='greek') {for(let i=0;i<12;i++){const a=i*.15;path(c,`M${657+i*2.8} ${175+Math.sin(a)*7} q-4-5 1-8 q4 2 3 5`,undefined,p.accent,.9);}}
  if(id==='bauhaus') {
    ellipse(c,673,205,30,30,p.paper,p.ink,1.7);path(c,'M673 175 A30 30 0 0 1 673 235Z',p.ink);
    rect(c,653,193,5,13,p.accent);line(c,650,215,670,215,p.ink,1.7);rect(c,668,248,23,102,'#245580');
  }
  // Back hand and front shoulder/elbow/wrist are independently animated.
  if(id==='gothic'){
    limb(c,699,279,724,304,735,263,'#2b5599',id,19);fingers(c,735,263,id,-.8);
    line(c,737,258,733,243,p.skin,4);line(c,741,258,740,244,p.skin,3.8);path(c,'M733 243l3 1M740 244l2 1',undefined,p.ink,.5);
  }else{limb(c,699,279,705,322,671,349,blouse,id,19);fingers(c,671,349,id,-.2);}
  const handX=cup.x+(id==='nouveau'?lerp(57,20,cup.sip):20),handY=cup.y-12-breathe,joint=armJoint(671,278,handX,handY);
  const bare=['egypt','greek','mosaic','nouveau'].includes(id),armColor=bare?p.skin:blouse;
  limb(c,671,278,joint.x,joint.y,handX+3,handY,armColor,id,bare?16:21);
  if(id==='nouveau'){
    line(c,671,278,lerp(671,joint.x,.45),lerp(278,joint.y,.45),blouse,19);
    line(c,lerp(671,joint.x,.45),lerp(278,joint.y,.45),lerp(671,joint.x,.47),lerp(278,joint.y,.47),'#bfa25b',3);
    line(c,handX+8,handY-6,handX+8,handY+6,'#b9a15a',2);
  }
  if(!bare)line(c,lerp(joint.x,handX,.88),lerp(joint.y,handY,.88),handX,handY,id==='renaissance'?'#bea26b':p.accent,4);
  fingers(c,handX,handY,id,-.15-cup.sip*.23);
  if(id==='cgi')for(const [x,y] of [[671,278],[joint.x,joint.y],[671,349]]){
    const g=c.createRadialGradient(x-2,y-3,.5,x,y,8);g.addColorStop(0,'#fffbd0');g.addColorStop(.3,'#dcc264');g.addColorStop(1,'#655a38');c.fillStyle=g;c.beginPath();c.arc(x,y,7,0,Math.PI*2);c.fill();
  }
  c.restore();
}

function catSurface(c:Ctx,d:string,color:string,id:string,fur=false,seed=218) {
  const p=PALETTES[id],shape=new Path2D(d),rich=['renaissance','cgi'].includes(id);
  c.fillStyle=rich?gradient(c,-32,-105,43,-8,[tint(color,.26),color,tint(color,-.48)]):color;c.fill(shape);
  if(id!=='cgi')textureShape(c,shape,'paper',.5);
  if(id==='renaissance')textureShape(c,shape,'craquelure',.48);
  if(fur&&['renaissance','impression','post'].includes(id)) {
    c.save();c.clip(shape);const rng=random(seed);
    for(let i=0;i<2300;i++){const x=-40+rng()*90,y=-144+rng()*149,theta=Math.atan2(y+80,x)*.65,dx=Math.sin(theta)*1.4,dy=.8+rng()*2.8;
      line(c,x,y,x+dx,y+dy,i%3===0?tint(color,.25):i%3===1?tint(color,-.12):tint(color,.06),id==='renaissance'?.23:.6+rng()*.7);
    }
    c.restore();
  }
  if(p.outline)path(c,d,undefined,p.ink,p.outline);
}

export function drawHistoricalCat(c:Ctx,id:string,time:number) {
  const p=PALETTES[id],w=Math.sin(time*2.9)*7,breathe=Math.sin(time*2.5)*.4,body='M-19-79 Q-39-59-32-25 Q-34-6-21-3 L35-3 Q45-13 33-36 Q26-64 12-79Z';
  c.save();c.translate(317,438+breathe);
  ellipse(c,7,2,46,5,'#22231b20');
  path(c,`M23-14 C${72+w*.35} 5 87 ${-43+w} 62 ${-42+w} Q47 ${-36+w} 59 ${-29+w}`,undefined,p.cat,10);
  if(p.outline)path(c,`M23-14 C${72+w*.35} 5 87 ${-43+w} 62 ${-42+w} Q47 ${-36+w} 59 ${-29+w}`,undefined,p.ink,.8);
  catSurface(c,body,p.cat,id,true);
  if(['ukiyo','impression','post','pixel'].includes(id))catSurface(c,'M-17-71 Q-29-57-24-32 Q-18-12-9-5 L2-7 Q8-27 1-57Z','#f1e7c9',id,true,38);
  if(id==='ukiyo'){catSurface(c,'M17-64 Q31-49 33-25 L10-36Z','#bd754b',id);catSurface(c,'M-30-39 Q-15-48-7-33 L-13-17-31-19Z','#323b39',id);}
  if(id==='gothic'){catSurface(c,'M-23-73 Q-13-84 5-79 L17-55-8-49Z','#8da6b5',id);path(c,'M-19-72 Q-6-65 9-71',undefined,'#d4ba64',1.5);}
  for(let i=0;i<3;i++)if(['post','impression','egypt','greek','pixel'].includes(id))path(c,`M20 ${-58+i*13} q13 3 14 12`,undefined,id==='greek'?p.accent:tint(p.cat,-.3),1.6);
  catSurface(c,'M-26-2 Q-23-13-10-9 L-2-4-2 1-26 1Z',id==='renaissance'||id==='ukiyo'?'#ece5cd':p.cat,id,true,107);
  catSurface(c,'M13-3 Q19-13 33-7 L36 1 13 1Z',id==='renaissance'||id==='ukiyo'?'#ece5cd':p.cat,id,true,17);
  for(let i=0;i<3;i++)line(c,-21+i*6,-3,-21+i*6,0,id==='greek'?p.accent:tint(p.cat,-.3),.55);
  c.save();c.translate(0,Math.sin(time*1.6)*.75);c.rotate(Math.sin(time*1.13)*.027);
  catSurface(c,'M-28-100 L-30-126-12-113 Q1-118 12-111 L28-125 26-96 Q30-80 14-72 Q-6-65-23-78 Q-31-87-28-100Z',p.cat,id,true,143);
  path(c,'M-26-116 L-26-121-18-113Z',id==='greek'?p.accent:'#c88f89');path(c,'M17-113 L25-121 24-109Z',id==='greek'?p.accent:'#c88f89');
  if(!['greek','cave','nouveau','renaissance'].includes(id))for(let i=0;i<3;i++)path(c,`M${-12+i*8}-115 l1 9`,undefined,tint(p.cat,-.35),1.7);
  const bt=(time+.75)%3.25,blink=bt>2.85&&bt<3.0?Math.max(.03,Math.abs((bt-2.925)/.075)):1;
  for(const x of [-15,9]) {
    ellipse(c,x,-95,6,4.5*blink,['egypt','greek','nouveau'].includes(id)?'#c4b15a':'#b8c395',p.ink,.8);
    ellipse(c,x+.7,-95,1.5,3.8*blink,p.ink);ellipse(c,x+2,-96.5,1.0,blink,'#fff5d9');
    path(c,`M${x-6}-98 q6-5 12 0`,undefined,p.ink,.75);
  }
  if(!['greek','cave'].includes(id)) {
    ellipse(c,-8,-84,7,4,id==='renaissance'?'#ddd6bc':tint(p.cat,.20));ellipse(c,5,-84,7,4,id==='renaissance'?'#ddd6bc':tint(p.cat,.20));
  }
  path(c,'M-7-88 Q-2-91 2-88 L-2-84Z',id==='greek'?p.accent:'#ab7871',p.ink,.6);
  path(c,'M-2-84 Q-7-77-11-83 M-2-84 Q4-77 8-83',undefined,id==='greek'?p.accent:p.ink,.75);
  for(let i=0;i<3;i++){line(c,-12,-83+i*3,-35,-87+i*6,id==='greek'?p.accent:p.ink,.45);line(c,11,-83+i*3,35,-87+i*6,id==='greek'?p.accent:p.ink,.45);}
  if(id==='egypt'||id==='nouveau'||id==='greek'){
    path(c,'M-22-73 Q-4-61 20-74 L19-67 Q-4-54-23-66Z',id==='nouveau'?'#ac553e':'#c3983a',p.ink,.8);
    for(let i=0;i<9;i++)ellipse(c,-18+i*4,-67+Math.sin(i*.39)*5,1.3,1.3,'#dacc76');
  }
  c.restore();c.restore();
}
