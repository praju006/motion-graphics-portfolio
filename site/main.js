import * as THREE from './vendor/three.module.js';
const $=s=>document.querySelector(s), P=window.PROJECTS, N=P.length;
$('#mail').href='mailto:'+window.SITE.email;

/* ============ HERO: 3D character + orbiting logos ============ */
const hero=$('#home'), canvas=$('#gl');
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
const scene=new THREE.Scene(), cam=new THREE.PerspectiveCamera(30,1,.1,100);
const loader=new THREE.TextureLoader();
const head=new THREE.Mesh(new THREE.PlaneGeometry(3.2,4,160,200),new THREE.ShaderMaterial({
  transparent:true,side:THREE.DoubleSide,
  uniforms:{map:{value:loader.load('assets/head.png')},dep:{value:loader.load('assets/depth.png')},amt:{value:.95}},
  vertexShader:`varying vec2 v;uniform sampler2D dep;uniform float amt;void main(){v=uv;vec3 p=position;p.z+=(texture2D(dep,uv).r-.35)*amt;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
  fragmentShader:`varying vec2 v;uniform sampler2D map;void main(){vec4 c=texture2D(map,v);if(c.a<.06)discard;gl_FragColor=c;}`}));
head.scale.setScalar(.92);head.position.y=-.45;scene.add(head);

function tile(txt){const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');
  const gr=g.createLinearGradient(0,0,256,256);gr.addColorStop(0,'#6aaeff');gr.addColorStop(1,'#1740c4');
  g.fillStyle=gr;g.beginPath();g.roundRect(16,16,224,224,54);g.fill();
  g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=6;g.stroke();
  g.fillStyle='rgba(255,255,255,.18)';g.beginPath();g.roundRect(22,22,212,100,46);g.fill();
  g.fillStyle='#fff';g.font='800 124px Manrope,Arial,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,128,140);
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
const claudeTex=loader.load('assets/claude.png');claudeTex.colorSpace=THREE.SRGBColorSpace;
const logos=[tile('Ae'),tile('Pr'),claudeTex].map((map,k)=>{
  const m=new THREE.Mesh(new THREE.PlaneGeometry(.9,.9),new THREE.MeshBasicMaterial({map,transparent:true}));
  m.userData.k=k;scene.add(m);return m});

function resize(){const w=hero.clientWidth,h=hero.clientHeight;renderer.setSize(w,h,false);cam.aspect=w/h;
  cam.position.z=7.5*Math.max(1,.95/cam.aspect);cam.updateProjectionMatrix()}
addEventListener('resize',resize);resize();

let tx=0,ty=0,rx=0,ry=0,drag=false,dx=0,dy=0;
hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();
  const nx=(e.clientX-r.left)/r.width*2-1,ny=(e.clientY-r.top)/r.height*2-1;
  if(drag){dx+=e.movementX*.008;dy+=e.movementY*.006;dx=Math.max(-.9,Math.min(.9,dx));dy=Math.max(-.4,Math.min(.4,dy))}
  tx=nx*.35;ty=ny*.15});
canvas.addEventListener('pointerdown',()=>drag=true);
addEventListener('pointerup',()=>{drag=false});
const clock=new THREE.Clock();
renderer.setAnimationLoop(()=>{
  const t=clock.getElapsedTime();
  if(!drag){dx*=.94;dy*=.94}
  ry+=((tx+dx+Math.sin(t*.6)*.08)-ry)*.08;rx+=((ty+dy)-rx)*.08;
  head.rotation.set(rx,ry,0);head.position.y=-.45+Math.sin(t*.9)*.03;
  logos.forEach((m,i)=>{const a=t*.55+i*Math.PI*2/3;
    m.position.set(Math.cos(a)*2.4,.55-Math.sin(a)*.65,Math.sin(a)*1.8);
    m.quaternion.copy(cam.quaternion);m.scale.setScalar(1+Math.sin(a)*.18)});
  renderer.render(scene,cam)});

/* ============ PROJECTS: final.mp4 folder ============ */
const work=$('#work'),stage=$('#stage'),folder=$('#folder');
const hues=[['#7db8ff','#2f6fe8'],['#b9dcff','#4a8df5'],['#e6f2ff','#7db8ff'],['#5a9cff','#1740c4'],['#cfe5fb','#2f7bf6'],['#9fd0ff','#3b6fd8'],['#f2f8ff','#5aa2ff']];
const art=(p,i)=>p.video?`<div class="art"><video src="${p.video}" muted loop playsinline preload="metadata"></video></div>`:
  `<div class="art" style="--c1:${hues[i%7][0]};--c2:${hues[i%7][1]}"><i></i><i></i><i></i></div>`;
stage.innerHTML=P.map((p,i)=>`<div class="card">${art(p,i)}<b>${p.title}</b><span>${p.tag} · ${p.year}</span></div>`).join('');
const cards=[...stage.children];
let pos=(N-1)/2,target=pos,state='closed',tl;
const gap=()=>Math.min(235,innerWidth*.24), rnd=gsap.utils.random;
const lay=(i,p=pos)=>{const r=i-p,a=Math.abs(r);return{x:r*gap(),y:a*a*12,z:-a*80,rotationX:0,rotationY:-r*15,rotationZ:r*1.5,scale:1-Math.min(a,3)*.06,opacity:Math.max(0,1-Math.max(0,a-3)*.6),transformPerspective:1200}};
const fy=()=>folder.getBoundingClientRect().top+20-stage.getBoundingClientRect().top;

function open(){
  if(state!=='closed')return;state='busy';folder.classList.add('open');work.classList.add('open');$('#sub').textContent='Drag, scroll or use the arrows. Click a card to play.';
  tl&&tl.kill();tl=gsap.timeline({onComplete:()=>{state='open';cards.forEach(c=>c.classList.add('live'))}});
  tl.fromTo('.f-icon',{y:0,scale:.9},{y:-80,scale:1.2,duration:.5,ease:'back.out(2.5)'},.15);
  cards.forEach((c,i)=>{const t=.65+i*.1;
    gsap.set(c,{x:0,y:fy(),z:0,scale:.15,rotationZ:rnd(-40,40),opacity:0,transformPerspective:1200});
    tl.to(c,{opacity:1,duration:.12},t)
      .to(c,{x:rnd(-300,300),y:-rnd(180,420),rotationX:rnd(-80,80),rotationY:rnd(-140,140),rotationZ:rnd(-70,70),scale:rnd(.75,1.05),duration:.85,ease:'power3.out'},t)
      .to(c,{...lay(i),duration:1.1,ease:'expo.inOut'},t+.8)});
  tl.to('.f-icon',{y:0,scale:1,duration:.6,ease:'power2.inOut'},'-=1.2');
}
function close(){
  if(state!=='open')return;state='busy';cards.forEach(c=>c.classList.remove('live'));work.classList.remove('open');$('#sub').textContent='Everything lives inside this folder. Click it.';
  tl&&tl.kill();tl=gsap.timeline({onComplete:()=>{state='closed';folder.classList.remove('open')}});
  tl.to(cards,{x:0,y:fy(),z:0,scale:.15,rotationY:()=>rnd(-90,90),rotationZ:()=>rnd(-40,40),opacity:0,duration:.6,ease:'power3.in',stagger:.05});
}
folder.addEventListener('click',()=>state==='open'?close():open());
folder.addEventListener('keydown',e=>{if(e.key==='Enter'||e===' ')folder.click()});

gsap.ticker.add(()=>{pos+=(target-pos)*.12;if(state==='open')cards.forEach((c,i)=>gsap.set(c,lay(i)))});
const clamp=()=>{target=Math.max(0,Math.min(N-1,target))};
$('#prev').onclick=()=>{target=Math.round(target)-1;clamp()};$('#next').onclick=()=>{target=Math.round(target)+1;clamp()};
let sx=0,moved=0,down=false;
stage.addEventListener('pointerdown',e=>{down=true;sx=e.clientX;moved=0});
addEventListener('pointermove',e=>{if(!down||state!=='open')return;const d=e.clientX-sx;sx=e.clientX;moved+=Math.abs(d);target-=d/gap();clamp()});
addEventListener('pointerup',()=>{if(down){down=false;target=Math.round(target);clamp()}});
work.addEventListener('wheel',e=>{if(state==='open'&&Math.abs(e.deltaX)>Math.abs(e.deltaY)){e.preventDefault();target+=e.deltaX/400;clamp()}},{passive:false});
cards.forEach((c,i)=>c.addEventListener('click',()=>{if(moved>6||state!=='open')return;Math.round(pos)===i?show(i):(target=i)}));
cards.forEach(c=>{const v=c.querySelector('video');if(v){c.onmouseenter=()=>v.play();c.onmouseleave=()=>v.pause()}});

const modal=$('#modal');
function show(i){const p=P[i];$('#player').innerHTML=p.video?`<div class="art"><video src="${p.video}" controls autoplay loop playsinline></video></div>`:art(p,i)+'';
  $('#mt').textContent=p.title;$('#ms').textContent=p.video?`${p.tag} · ${p.year}`:`${p.tag} · ${p.year} — add your video in projects.js`;modal.classList.add('on')}
const hide=()=>{modal.classList.remove('on');$('#player').innerHTML=''};
$('#x').onclick=hide;modal.onclick=e=>{if(e.target===modal)hide()};addEventListener('keydown',e=>{if(e.key==='Escape')hide()});
