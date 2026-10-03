import {flower, paint} from './materials';
import {PALETTES} from './palettes';
import {ellipse, line, path, random, type Ctx} from './primitives';

export const hasPortrait=(id:string)=>['gothic','ukiyo','impression','post','nouveau','pop','mosaic'].includes(id);

function eye(c:Ctx,x:number,y:number,w:number,open:number,ink:string,iris:string) {
  c.save();c.translate(x,y);c.scale(1,open);
  path(c,`M${-w} 0Q0-4 ${w} 0Q0 4 ${-w} 0Z`,'#f3e5cb',ink,.65);
  ellipse(c,.5,-.1,1.7,2.7,iris);ellipse(c,.5,0,.7,1.7,ink);ellipse(c,0,-1,.45,.55,'#fff7e7');
  path(c,`M${-w} 0Q0-4 ${w} 0`,undefined,ink,.8);c.restore();
}

function brushFace(c:Ctx,shape:Path2D,seed:number) {
  c.save();c.clip(shape);const rng=random(seed);
  const colors=['#e1c592','#f0dab0','#bfa176','#b1b292','#bb9477','#edca9a'];
  for(let i=0;i<420;i++){
    const x=633+rng()*59,y=176+rng()*69,a=Math.atan2(y-211,x-679)*.55;
    line(c,x,y,x+Math.cos(a)*2,y+3+rng()*3,colors[i%colors.length],.45+rng()*.9);
  }
  c.restore();
}

export function drawPortrait(c:Ctx,id:string,time:number) {
  const p=PALETTES[id],ink=id==='post'?'#244f75':id==='impression'?'#8b797c':p.ink;
  const t=(time+.18)%3.2,b=t>2.78&&t<2.92?Math.max(.06,Math.abs((t-2.85)/.07)):1;
  if(id==='gothic') {
    paint(c,'M648 178Q658 160 680 171Q709 177 711 211L705 238Q696 248 686 237L676 198 650 203Z','#a06e3e',id,'paper');
    for(let i=0;i<9;i++)path(c,`M${651+i*4} ${180-i*.2}Q704 176 700 ${225+i}Q696 240 687 230`,undefined,i%2?'#c29358':'#79512f',.6);
    paint(c,'M651 181Q664 174 678 183Q690 191 686 213Q682 233 667 240Q653 240 647 226L643 210Q644 192 651 181Z','#f0dcb8',id,'paper');
    eye(c,653,204,5.2,b,ink,'#716b4c');eye(c,674,203,5.4,b,ink,'#716b4c');
    path(c,'M648 196q6-5 12 0M669 194q6-3 11 1M661 204l-3 15q5 4 8 0',undefined,ink,.8);
    ellipse(c,676,219,5.6,5.6,'#cc8e79');path(c,'M658 230q6 4 13-1',undefined,ink,.9);
    path(c,'M648 183Q661 173 679 182',undefined,'#e9c991',2);return;
  }
  if(id==='ukiyo'){
    paint(c,'M648 178Q646 158 669 159Q683 163 692 174L696 224Q681 239 671 221L679 190Z','#1f3036',id,'paper');
    ellipse(c,699,176,19,24,'#233238',ink,1);ellipse(c,695,148,18,13,'#233238',ink,1);
    for(let i=0;i<9;i++)path(c,`M680 ${156+i*2}Q706 ${152+i*2} 715 ${170+i*2}`,undefined,'#898276',.45);
    paint(c,'M649 181Q659 177 673 185L682 194 681 217Q675 231 661 237Q648 233 644 221L641 205Z','#f4e7c9',id,'paper');
    eye(c,650,205,5,b,ink,'#383b37');eye(c,671,204,5.6,b,ink,'#383b37');
    path(c,'M646 195q5-3 11 0M666 194q5-3 11 0M660 204l-6 16 5 1',undefined,ink,.7);path(c,'M654 228q4-2 7 0l-3 3Z','#a44e45');
    for(let i=0;i<4;i++){line(c,689,157,664+i*7,136+i*2,'#af8d43',.85);ellipse(c,664+i*7,136+i*2,1.8,1.8,'#b75f52',ink,.4);}return;
  }
  if(id==='nouveau') {
    const locks='M670 176Q706 165 714 192Q711 216 700 237Q730 252 728 277Q725 299 747 296Q762 291 754 278Q744 269 738 280Q754 275 748 286Q735 291 732 273Q730 245 717 237Q720 273 738 311Q750 337 768 327Q780 318 771 311Q762 308 762 319Q754 330 742 305L705 228Z';
    paint(c,locks,'#b87942',id,'paper');
    for(let i=0;i<10;i++)path(c,`M${690+i*1.6} 180Q720 207 ${700+i} 230Q${705+i*1.5} 267 ${730+i*1.8} 309Q759 343 771 318`,undefined,i%2?'#d6a35c':'#794f2f',.7);
    paint(c,'M650 180Q671 168 687 184L690 201 680 222Q672 236 658 236L649 226 641 225 642 221 635 217 643 206Q642 187 650 180Z','#f2dfbf',id,'paper');
    eye(c,650,202,5.4,b,ink,'#686f4d');path(c,'M644 195q5-4 12-1M641 224q5-2 8 1l-4 2M642 231q5 2 10 0',undefined,ink,.7);
    paint(c,'M647 183Q652 160 676 168Q697 171 704 193L681 185 667 177Z','#bd7c3f',id,'paper');
    path(c,'M649 181Q676 169 699 189',undefined,'#d8b571',2.5);
    for(let i=0;i<3;i++)flower(c,680+i*9,170+i*8,5.5,'#bb8575','#7e8c5e',6);
    ellipse(c,685,205,6.4,7,'#d5bd76',ink,1);ellipse(c,685,205,4,4.5,'#bdd0ba',ink,.65);ellipse(c,685,220,2.2,3.5,'#77a185',ink,.6);return;
  }
  if(id==='post'||id==='impression') {
    const face=paint(c,'M650 179Q667 172 682 183Q693 192 689 214L681 236 663 243 651 231 643 231 643 222 632 217 642 207Q640 190 650 179Z',id==='post'?'#d9c08e':'#f2cfb8',id,'paper');
    brushFace(c,face,id==='post'?884:981);eye(c,647,203,5.2,b,ink,id==='post'?'#729990':'#748899');
    path(c,'M643 195q6-3 12 1M638 218q5 2 8 0M641 229q5 2 10 0',undefined,ink,.9);
    const hair=id==='post'?'#b26c35':'#b88259';
    paint(c,'M679 179Q701 177 704 198L699 224 686 235 678 221 685 202Z',hair,id,'paper');
    if(id==='post'){
      paint(c,'M643 222Q654 226 665 217L681 213 685 232Q678 252 661 253L643 239 648 234Z','#b76832',id,'paper');
      for(let i=0;i<38;i++){const x=647+i%13*2.8,y=228+Math.floor(i/13)*7;path(c,`M${x} ${y}l${(x-664)*.12} 8`,undefined,i%3?'#d7a347':'#844f30',.7);}
      paint(c,'M688 196Q701 193 701 210L699 229 689 239 681 233 687 225Z','#eee8cf',id,'paper');
      path(c,'M690 199l7 4-3 16-8 11M684 231l10 4',undefined,'#7b959a',.9);
      line(c,640,226,620,229,'#9b6532',2.3);path(c,'M618 223v12q-7 2-5-5v-7Z','#916a36',ink,.5);
      c.save();c.globalAlpha=.6;path(c,`M615 220q-9-7 0-12q8-5 1-12`,undefined,'#e5e4cf',.8);c.restore();
    } else {
      for(let i=0;i<22;i++){const a=i*.43;path(c,`M${684+Math.sin(a)*11} ${186+i*1.8}q8 4-1 8`,undefined,i%2?'#d5a16d':'#a7744d',1.1);}
      ellipse(c,651,218,3.5,3,'#e5a68d');path(c,'M647 230q4 1 7 0',undefined,'#af746c',.8);
    }
    paint(c,'M644 173Q646 148 674 147Q698 149 702 173Z',id==='post'?'#d8b642':'#e4cf94',id,'cloth');ellipse(c,672,174,48,7,id==='post'?'#e5c954':'#e9d79b',ink,.8);
    path(c,'M648 164Q673 166 699 164',undefined,id==='post'?'#284873':'#6186b3',3);for(let i=0;i<18;i++)line(c,648+i*3,153,647+i*3.1,165,'#a38e49',.6);
    if(id==='impression'){flower(c,661,163,3.5,'#bd655b','#b79748',5);flower(c,668,162,3,'#788baa','#e8ce90',5);}return;
  }
  if(id==='pop') {
    paint(c,'M641 183Q644 160 671 164Q696 165 704 190L703 215Q703 240 717 249Q686 259 676 231L670 196Z','#f3dc43',id,'paper');
    const face=paint(c,'M649 182Q663 173 678 187Q687 198 681 215L674 233 660 240 650 230 641 228 642 223 635 218 643 206Z','#f2c5b0',id,'paper');
    c.save();c.clip(face);for(let x=634;x<690;x+=2.7)for(let y=178;y<244;y+=2.7)ellipse(c,x+(Math.round(y/2.7)%2)*1.35,y,.4,.4,'#a25d61');c.restore();
    eye(c,650,202,5.3,b,ink,'#538ca3');for(let i=0;i<4;i++)line(c,646+i*2,199,644+i*3,195,ink,1.2);
    path(c,'M643 192q6-3 13 1',undefined,ink,1.2);path(c,'M640 225q4-3 9 1l-4 4Z','#b94155',ink,.6);
    for(let i=0;i<14;i++)path(c,`M${648+i*3.4} 176Q${688+i*.3} 187 ${686+i*.7} 227Q${693+i*.6} 246 710 247`,undefined,i%2?'#84763a':ink,.65);return;
  }
  if(id==='mosaic') {
    paint(c,'M650 181Q662 171 681 182Q695 195 689 215L681 232 668 239 650 231 643 218 635 216 643 204Z','#c8ab87',id,'paper');
    paint(c,'M642 185Q643 165 671 166Q695 169 699 190L689 205 683 188 653 187Z','#505445',id,'paper');eye(c,650,202,4.5,b,ink,'#6c6350');path(c,'M644 194q5-3 12 0M644 226q6 4 10 0',undefined,ink,.8);
    path(c,'M649 176Q673 169 691 180',undefined,'#829662',3);
  }
}
