/* Interface enhancements; no external network dependency */
(()=>{
  const opts=[['inicio','⌂','Panel principal'],['tareas','☑','Organizador de tareas'],['calendario','▦','Calendario académico'],['estudio','◷','Técnicas de estudio'],['convivencia','♡','Convivencia escolar'],['seguridad','♢','Seguridad digital'],['xbot','🤖','Hablar con X-BOT'],['recorrido','🏫','Recorrido del colegio'],['equipo','✦','Nuestros superhéroes'],['info','ⓘ','Sobre el proyecto']];
  const nav=document.getElementById('sidebarNav');const lbl=document.getElementById('currentPageName');const sound=document.getElementById('soundToggle');const date=document.getElementById('realtimeDate');let muted=true,audio;
  date.textContent=new Intl.DateTimeFormat('es-PE',{weekday:'long',day:'numeric',month:'long'}).format(new Date()).toUpperCase();
  function update(page){nav.innerHTML=opts.map(([id,icon,name])=>`<button data-go="${id}" class="${page===id?'active':''}"><span style="font-size:21px">${icon}</span><span>${name}</span></button>`).join('');lbl.textContent=(opts.find(x=>x[0]===page)||opts[0])[2].toUpperCase();}
  window.updateSideNav=update;update('inicio');
  nav.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b&&typeof go==='function')go(b.dataset.go)});
  function tone(kind='click'){
    if(muted)return;
    try{
      const AudioContextClass=window.AudioContext||window.webkitAudioContext;if(!AudioContextClass)return;
      audio=audio||new AudioContextClass();if(audio.state==='suspended')audio.resume();
      const presets={click:[500,680,.055],navigate:[370,650,.095],success:[540,1050,.22],tour:[320,770,.11],error:[260,190,.12]};const p=presets[kind]||presets.click;
      const osc=audio.createOscillator(),gain=audio.createGain();osc.type=kind==='success'?'sine':'triangle';osc.frequency.setValueAtTime(p[0],audio.currentTime);osc.frequency.exponentialRampToValueAtTime(p[1],audio.currentTime+p[2]);gain.gain.setValueAtTime(.0001,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.05,audio.currentTime+.012);gain.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+p[2]);osc.connect(gain).connect(audio.destination);osc.start();osc.stop(audio.currentTime+p[2]+.02);
    }catch(err){console.debug('Audio no disponible',err)}
  }
  window.xSfx=tone;
  sound.addEventListener('click',()=>{muted=!muted;sound.textContent=muted?'🔇 Sonido':'🔊 Sonido activo';sound.setAttribute('aria-pressed',String(!muted));tone('success')});
  document.addEventListener('click',ev=>{
    const b=ev.target.closest('button');if(b&&!b.closest('#intro')&&!b.closest('#sidebarNav')&&b.id!=='soundToggle'&&!b.dataset.scene)tone('click');
  });
  // Modern browsers only allow audio after direct user interaction.
  const introSound=document.getElementById('introSound'),video=document.getElementById('introVideo');
  introSound.addEventListener('click',()=>{muted=false;video.muted=false;const res=video.play();if(res?.catch)res.catch(()=>{});introSound.textContent='🔊 Video con sonido';sound.textContent='🔊 Sonido activo'});
  // Enable zoom and drag inside the photo explorer. This is photo pan/zoom, not genuine 360 photography.
  let dragging=false,startX=0,startPan=0;
  document.addEventListener('pointerdown',e=>{if(e.target.id==='tourPhoto'){dragging=true;startX=e.clientX;startPan=viewerPan;e.target.setPointerCapture?.(e.pointerId)}});
  document.addEventListener('pointermove',e=>{if(dragging){viewerPan=Math.max(-35,Math.min(35,startPan+(e.clientX-startX)/9));applyTourView()}});
  document.addEventListener('pointerup',()=>dragging=false);
  document.addEventListener('wheel',e=>{if(e.target.closest('#tourStage')){e.preventDefault();viewerZoom=Math.max(1,Math.min(2.8,viewerZoom+(e.deltaY<0?.15:-.15)));applyTourView()}},{passive:false});
  let touchX=null;document.addEventListener('touchstart',e=>{if(e.target.closest('#tourStage'))touchX=e.touches[0]?.clientX},{passive:true});document.addEventListener('touchend',e=>{if(touchX!==null&&e.changedTouches[0]){const dist=e.changedTouches[0].clientX-touchX;if(Math.abs(dist)>95 && page==='recorrido' && viewerZoom===1)showScene(scene+(dist<0?1:-1));touchX=null}},{passive:true});
  document.addEventListener('keydown',e=>{if(page==='recorrido'&&!['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)){if(e.key==='ArrowRight')showScene(scene+1);if(e.key==='ArrowLeft')showScene(scene-1)}});
  const toasty=document.getElementById('toast');let toastTO;window.xToast=(msg)=>{toasty.textContent=msg;toasty.classList.add('show');clearTimeout(toastTO);toastTO=setTimeout(()=>toasty.classList.remove('show'),2800)};
})();
