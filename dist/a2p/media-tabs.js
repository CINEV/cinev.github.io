const demo=document.querySelector('.pose-demo');
if(demo){
 const tabs=[...demo.querySelectorAll('[role="tab"]')];
 const panels=[...demo.querySelectorAll('[role="tabpanel"]')];
 function select(index){
  panels.forEach((panel,i)=>{panel.querySelector('video').pause();panel.hidden=i!==index;});
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
 }
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>select(i));
  tab.addEventListener('keydown',event=>{
   let next;
   if(event.key==='ArrowRight')next=(i+1)%tabs.length;
   if(event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;
   if(event.key==='Home')next=0;
   if(event.key==='End')next=tabs.length-1;
   if(next!==undefined){event.preventDefault();select(next);tabs[next].focus();}
  });
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)panels.forEach(panel=>panel.querySelector('video').pause());});
}
