const dialog=document.querySelector('#player');document.querySelectorAll('[data-video]').forEach(button=>button.addEventListener('click',()=>{const v=dialog.querySelector('video');v.src=button.dataset.video;document.querySelector('#player-title').textContent=button.dataset.title;document.querySelector('#video-link').href=button.dataset.video;dialog.showModal();v.play().catch(()=>{});}));dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{const v=dialog.querySelector('video');v.pause();v.removeAttribute('src');v.load();});dialog.addEventListener('click',e=>{if(e.target===dialog&&e.offsetX<0)dialog.close()});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});let count=0;document.querySelectorAll('[data-category]').forEach(item=>{const show=button.dataset.filter==='all'||item.dataset.category===button.dataset.filter;item.hidden=!show;if(show)count++;});document.querySelector('.archive-count').textContent=count+'개 기능군';}));
const styleTabs=[...document.querySelectorAll('[data-style]')];
const styleDescriptions={anime:'애니메이션풍 캐릭터와 극적인 조명·액션 연출',chibi:'작은 신체 비율과 과장된 표정의 캐릭터 표현',webtoon:'웹툰풍 인물과 현대적인 배경·드라마 연출'};
function selectStyle(tab){const selected=styleTabs.indexOf(tab);styleTabs.forEach((t,i)=>{const active=t===tab,panel=document.getElementById(t.getAttribute('aria-controls'));t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;panel.hidden=false;panel.setAttribute('aria-hidden',String(!active));panel.inert=!active;const position=(i-selected+styleTabs.length)%styleTabs.length;panel.classList.toggle('is-selected',active);panel.classList.toggle('is-right',position===1);panel.classList.toggle('is-left',position===2);});document.querySelector('.style-stack-description').textContent=styleDescriptions[tab.dataset.style];}
styleTabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectStyle(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%styleTabs.length;if(e.key==='ArrowLeft')next=(i+styleTabs.length-1)%styleTabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=styleTabs.length-1;if(next!==undefined){e.preventDefault();selectStyle(styleTabs[next]);styleTabs[next].focus();}});});
document.querySelectorAll('video[controls]').forEach(video=>video.addEventListener('play',()=>document.querySelectorAll('video[controls]').forEach(other=>{if(other!==video)other.pause();})));

// Section 03 demos start at double speed, including after media reloads.
document.querySelectorAll('#capabilities video').forEach(video=>{
  video.defaultPlaybackRate=2;
  video.playbackRate=2;
  video.addEventListener('loadedmetadata',()=>{video.playbackRate=2;});
});

// The opener starts muted, loops while visible, and offers native playback and sound controls.
const opener=document.querySelector('.intro-film video');
if(opener){
  opener.muted=true;
  let openerVisible=false;
  const syncOpener=()=>{
    if(openerVisible&&!document.hidden)opener.play().catch(()=>{});
    else opener.pause();
  };
  const openerObserver=new IntersectionObserver(([entry])=>{
    openerVisible=entry.isIntersecting;
    syncOpener();
  },{rootMargin:'-64px 0px 0px 0px',threshold:0});
  openerObserver.observe(opener);
  document.addEventListener('visibilitychange',syncOpener);
}

const storyPresentation=document.querySelector('.story-presentation');
if(storyPresentation){
  const slides=[...storyPresentation.querySelectorAll('.story-slide')];
  const buttons=[...storyPresentation.querySelectorAll('[data-story-step]')];
  const toggle=storyPresentation.querySelector('.story-toggle');
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  let current=0,elapsed=0,last=0,visible=false,playing=!reducedMotion.matches,frame=null;
  const duration=4000;
  function selectSlide(index){current=index;elapsed=0;slides.forEach((slide,i)=>{slide.hidden=i!==current;});buttons.forEach((button,i)=>{button.setAttribute('aria-pressed',String(i===current));button.querySelector('.story-progress').style.transform='scaleX(0)';});}
  function updateToggle(){toggle.textContent=playing?'일시정지 Ⅱ':'자동 재생 ▷';toggle.setAttribute('aria-label',playing?'스토리보드 자동 전환 일시정지':'스토리보드 자동 전환 시작');}
  function tick(time){frame=null;if(!visible||!playing||document.hidden)return;elapsed+=last?Math.min(time-last,100):0;last=time;if(elapsed>=duration)selectSlide((current+1)%slides.length);buttons[current].querySelector('.story-progress').style.transform=`scaleX(${elapsed/duration})`;frame=requestAnimationFrame(tick);}
  function sync(){if(frame!==null)cancelAnimationFrame(frame);frame=null;last=0;if(visible&&playing&&!document.hidden)frame=requestAnimationFrame(tick);}
  buttons.forEach((button,i)=>button.addEventListener('click',()=>{selectSlide(i);playing=false;updateToggle();sync();}));
  toggle.addEventListener('click',()=>{playing=!playing;updateToggle();sync();});
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{rootMargin:'-64px 0px 0px 0px',threshold:0}).observe(storyPresentation);
  document.addEventListener('visibilitychange',sync);
  reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){playing=false;updateToggle();sync();}});
  updateToggle();
}

// Images hold for three seconds; the canvas advances only after its 2x video ends.
const workflow=document.querySelector('.workflow-presentation');
if(workflow){
  const panels=[...workflow.querySelectorAll('.workflow-panel')];
  const tabs=[...workflow.querySelectorAll('[data-workflow-step]')];
  const toggle=workflow.querySelector('.workflow-toggle');
  const video=workflow.querySelector('video');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let current=0,elapsed=0,last=0,visible=false,playing=!reduced.matches,frame=null;
  video.muted=true;video.defaultPlaybackRate=2;video.playbackRate=2;
  video.addEventListener('loadedmetadata',()=>{video.playbackRate=2;});
  function updateToggle(){toggle.textContent=playing?'일시정지 Ⅱ':'자동 재생 ▷';toggle.setAttribute('aria-label',playing?'워크플로우 자동 전환 일시정지':'워크플로우 자동 전환 시작');}
  function select(index){video.pause();current=index;elapsed=0;video.currentTime=0;panels.forEach((p,i)=>p.hidden=i!==index);tabs.forEach((t,i)=>{t.setAttribute('aria-selected',String(i===index));t.tabIndex=i===index?0:-1;t.querySelector('i').style.transform='scaleX(0)';});sync();}
  function tick(time){frame=null;if(!visible||!playing||document.hidden)return;const delta=last?Math.min(time-last,100):0;last=time;let progress=0;if(current===1){progress=video.duration?video.currentTime/video.duration:0;}else{elapsed+=delta;progress=elapsed/3000;if(elapsed>=3000){select((current+1)%3);return;}}tabs[current].querySelector('i').style.transform=`scaleX(${Math.min(progress,1)})`;frame=requestAnimationFrame(tick);}
  function sync(){if(frame!==null)cancelAnimationFrame(frame);frame=null;last=0;const active=visible&&playing&&!document.hidden;if(active){if(current===1){if(video.ended){select(2);return;}video.play().catch(()=>{playing=false;updateToggle();sync();});}frame=requestAnimationFrame(tick);}else video.pause();}
  video.addEventListener('ended',()=>{if(current===1&&playing&&visible&&!document.hidden)select(2);});
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(i));tab.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%3;if(e.key==='ArrowLeft')n=(i+2)%3;if(e.key==='Home')n=0;if(e.key==='End')n=2;if(n!==undefined){e.preventDefault();select(n);tabs[n].focus();}});});
  toggle.addEventListener('click',()=>{playing=!playing;updateToggle();sync();});
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();},{rootMargin:'-64px 0px 0px 0px',threshold:.15}).observe(workflow);
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',()=>{if(reduced.matches){playing=false;updateToggle();sync();}});
  updateToggle();
}

// Archive motion demos are selected manually; leaving a demo pauses playback.
document.querySelectorAll('.archive-motion-tabs').forEach(archiveMotion=>{
  const tabs=[...archiveMotion.querySelectorAll('[role="tab"]')];
  function selectMotion(tab){
    tabs.forEach(t=>{
      const active=t===tab,panel=document.getElementById(t.getAttribute('aria-controls'));
      t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;
      panel.hidden=!active;if(!active)panel.querySelector('video').pause();
    });
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>selectMotion(tab));
    tab.addEventListener('keydown',event=>{
      let next;
      if(event.key==='ArrowDown')next=(i+1)%tabs.length;
      if(event.key==='ArrowUp')next=(i+tabs.length-1)%tabs.length;
      if(event.key==='Home')next=0;
      if(event.key==='End')next=tabs.length-1;
      if(next!==undefined){event.preventDefault();selectMotion(tabs[next]);tabs[next].focus();}
    });
  });
});
const archiveVideos=[...document.querySelectorAll('#archive video')];
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  archiveVideos.forEach(video=>{if(video.closest('[data-category]').hidden)video.pause();});
}));
document.addEventListener('visibilitychange',()=>{if(document.hidden)archiveVideos.forEach(video=>video.pause());});
