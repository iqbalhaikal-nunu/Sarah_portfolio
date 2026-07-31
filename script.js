
/* dot grid generators */
function makeDots(id,count){
  const el=document.getElementById(id);
  if(!el) return;
  for(let i=0;i<count;i++){ const s=document.createElement('span'); el.appendChild(s); }
}
makeDots('dotgridTL',54);
makeDots('dotgridR',24);
makeDots('dotgridBL',30);

/* ---------- gallery data ---------- */
const artworks = [
  {src:'assets/illustrator_1.jpg', title:'Character Study I', tag:'illustration', tall:true},
  {src:'assets/illustrator_2.jpg', title:'Character Study II', tag:'illustration'},
  {src:'assets/poster_1.jpg', title:'Editorial Poster I', tag:'print', tall:true},
  {src:'assets/poster_2.jpg', title:'Editorial Poster II', tag:'print'},
  {src:'assets/packaging_design_1.jpg', title:'Product Packaging I', tag:'packaging'},
  {src:'assets/packaging_design_2.jpg', title:'Product Packaging II', tag:'packaging'},
  {src:'assets/brochure.jpg', title:'Travel Brochure', tag:'print', tall:true},
  {src:'assets/campaign.jpg', title:'Merchandise Campaign', tag:'packaging'},
  {src:'assets/merchandise.jpg', title:'Branded Merchandise', tag:'packaging'},
  {src:'assets/innovative_product_1.jpg', title:'Product Concept I', tag:'packaging'},
  {src:'assets/innovative_product_2.jpg', title:'Product Concept II', tag:'packaging'},
  {src:'assets/photography_1.jpg', title:'Architectural Study', tag:'photography', tall:true},
  {src:'assets/photography_2.jpg', title:'Still Life', tag:'photography'},
  {src:'assets/photography_3.jpg', title:'Food Photography', tag:'photography'},
  {src:'assets/photography_4.jpg', title:'Studio Shot', tag:'photography'},
  {src:'assets/newspaper_1.jpg', title:'Press Feature I', tag:'press', tall:true},
  {src:'assets/newspaper_2.jpg', title:'Press Feature II', tag:'press'},
];

const grid = document.getElementById('galleryGrid');
function renderGallery(filter='all'){
  grid.innerHTML='';
  artworks.filter(a=>filter==='all'||a.tag===filter).forEach((a)=>{
    const div=document.createElement('div');
    div.className='g-item'+(a.tall?' tall':'');
    div.dataset.src=a.src; div.dataset.title=a.title; div.dataset.tag=a.tag;
    div.innerHTML=`<img src="${a.src}" alt="${a.title}" loading="lazy"><div class="g-cap"><div class="g-title">${a.title}</div><div class="g-tag">${a.tag}</div></div>`;
    div.addEventListener('click', ()=>{
      const items=visibleItems().map(el=>({src:el.dataset.src, title:el.dataset.title, tag:el.dataset.tag}));
      const idx=items.findIndex(i=>i.src===a.src);
      openLightboxItems(items, idx);
    });
    grid.appendChild(div);
  });
}
renderGallery();

document.querySelectorAll('.filters button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.filters button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    renderGallery(btn.dataset.filter);
  });
});

/* ---------- lightbox ---------- */
const lightbox=document.getElementById('lightbox');
const lbImg=document.getElementById('lbImg');
const lbTag=document.getElementById('lbTag');
let currentIndex=0;
let currentItems=[];
function visibleItems(){ return Array.from(document.querySelectorAll('#galleryGrid .g-item')); }
function openLightboxItems(items, index){
  currentItems=items;
  currentIndex=index;
  showLightbox();
}
function showLightbox(){
  const item=currentItems[currentIndex];
  if(!item) return;
  lbImg.src=item.src;
  lbTag.textContent=item.title+' — '+item.tag;
  lightbox.classList.add('active');
}
document.getElementById('lbClose').addEventListener('click', ()=>lightbox.classList.remove('active'));
document.getElementById('lbPrev').addEventListener('click', ()=>{ currentIndex=(currentIndex-1+currentItems.length)%currentItems.length; showLightbox(); });
document.getElementById('lbNext').addEventListener('click', ()=>{ currentIndex=(currentIndex+1)%currentItems.length; showLightbox(); });
lightbox.addEventListener('click', (e)=>{ if(e.target===lightbox) lightbox.classList.remove('active'); });

/* home page "Selected Artwork" thumbnails open the same lightbox */
document.querySelectorAll('#home .work-card .thumb').forEach(thumb=>{
  thumb.addEventListener('click', ()=>{
    const items=Array.from(document.querySelectorAll('#home .work-card .thumb')).map(el=>({
      src:el.dataset.src, title:el.dataset.title, tag:el.dataset.tag
    }));
    const idx=items.findIndex(i=>i.src===thumb.dataset.src);
    openLightboxItems(items, idx);
  });
});

/* ---------- about subtabs ---------- */
document.querySelectorAll('.subtabs button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.subtabs button').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.subpanel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-'+btn.dataset.sub).classList.add('active');
  });
});

/* ---------- page navigation: each nav item is its own full page (site-by-site) ---------- */
const pageOrder=['home','about','gallery','contact'];
const pageNames={home:'HOME', about:'ABOUT', gallery:'GALLERY', contact:'CONTACT'};
let currentPage='home';
const pageNumLabel=document.getElementById('pageNumLabel');
const pageNameLabel=document.getElementById('pageNameLabel');

function updateChrome(pageId){
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.toggle('active', l.dataset.nav===pageId));
  const idx=pageOrder.indexOf(pageId);
  pageNumLabel.textContent=String(idx+1).padStart(2,'0');
  pageNameLabel.textContent=pageNames[pageId];
}

function goToPage(pageId){
  if(pageId===currentPage) return;
  document.getElementById(currentPage).classList.remove('active');
  document.getElementById(pageId).classList.add('active');
  window.scrollTo(0,0);
  currentPage=pageId;
  updateChrome(pageId);
  document.getElementById('mainNav').classList.remove('open');
}

document.querySelectorAll('[data-nav]').forEach(el=>{
  el.addEventListener('click', (e)=>{
    e.preventDefault();
    goToPage(el.dataset.nav);
  });
});

/* mobile menu */
document.getElementById('menuToggle').addEventListener('click', ()=>{
  document.getElementById('mainNav').classList.toggle('open');
});

/* contact form (visual only, present only if re-added to the markup later) */
const contactForm=document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const btn=e.target.querySelector('button[type=submit]');
    const original=btn.innerHTML;
    btn.innerHTML='Message Sent ✓';
    setTimeout(()=>{ btn.innerHTML=original; e.target.reset(); }, 2200);
  });
}
