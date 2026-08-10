(function(){const article=document.querySelector('.movie-review');if(!article)return;const slug=location.pathname.split('/').pop().replace(/\.html?$/,'');const dataset=(typeof allReviews!=='undefined'&&allReviews)||(typeof allComics!=='undefined'&&allComics)||(typeof allGames!=='undefined'&&allGames)||[];const combinedIndex=[].concat(typeof allReviews!=='undefined'?allReviews:[]).concat(typeof allComics!=='undefined'?allComics:[]).concat(typeof allGames!=='undefined'?allGames:[]);const data=dataset.find(function(d){return d.slug===slug;});if(!data||!data.scores)return;(function trackRecentlyViewed(){const KEY='rt_recently_viewed';let list=[];try{list=JSON.parse(localStorage.getItem(KEY)||'[]');}catch(e){list=[];}
list=list.filter(function(r){return r.url!==data.url;});list.unshift({title:data.title,url:data.url});localStorage.setItem(KEY,JSON.stringify(list.slice(0,8)));})();const REC_LABELS={'watch-now':['Watch It Now','rt-rec-watch-now'],'wait-for-streaming':['Wait for Streaming','rt-rec-wait'],'skip':['Skip It','rt-rec-skip'],};function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function buildTags(){const mood=(data.moodTags||[]).map(function(t){return'<span class="rt-tag">'+esc(t)+'</span>';}).join('');const aud=(data.audienceTags||[]).map(function(t){return'<span class="rt-tag rt-tag-audience">'+esc(t)+'</span>';}).join('');if(!mood&&!aud)return'';return'<div class="rt-tag-row reveal" style="max-width:800px;margin:16px auto 0;padding:0 20px;">'+mood+aud+'</div>';}
function buildMiniCards(){const cards=[];if(data.favoriteScene){cards.push('<div class="rt-mini-card rt-glass rt-card reveal">'+
'<span class="rt-mini-card-icon">🎬</span>'+
'<span class="rt-mini-card-label rt-eyebrow">Favorite Scene</span>'+
'<p class="rt-mini-card-body">'+esc(data.favoriteScene)+'</p>'+
'</div>');}
if(data.bestPerformance){cards.push('<div class="rt-mini-card rt-glass rt-card reveal">'+
'<span class="rt-mini-card-icon">🏆</span>'+
'<span class="rt-mini-card-label rt-eyebrow">Best Performance</span>'+
'<p class="rt-mini-card-body">'+esc(data.bestPerformance)+'</p>'+
'</div>');}
if(data.bestQuote){cards.push('<div class="rt-mini-card rt-glass rt-card reveal">'+
'<span class="rt-mini-card-icon">💬</span>'+
'<span class="rt-mini-card-label rt-eyebrow">Best Quote</span>'+
'<p class="rt-mini-card-body rt-quote">'+esc(data.bestQuote)+'</p>'+
'</div>');}
if(data.comicConnections){cards.push('<div class="rt-mini-card rt-glass rt-card reveal">'+
'<span class="rt-mini-card-icon">📖</span>'+
'<span class="rt-mini-card-label rt-eyebrow">Source Material Connections</span>'+
'<p class="rt-mini-card-body">'+esc(data.comicConnections)+'</p>'+
'</div>');}
if(!cards.length)return'';return'<div class="rt-card-grid">'+cards.join('')+'</div>';}
function buildListBlock(title,icon,items,cls){if(!items||!items.length)return'';const lis=items.map(function(t){return'<li>'+esc(t)+'</li>';}).join('');return('<div class="'+cls+' rt-glass rt-card reveal">'+
'<span class="rt-eyebrow">'+icon+' '+title+'</span>'+
'<ul>'+lis+'</ul>'+
'</div>');}
function buildVerdict(){if(!data.verdict)return'';const rec=REC_LABELS[data.verdict.recommendation]||REC_LABELS['watch-now'];const audience=(data.verdict.bestAudience||[]).map(function(a){return'<span class="rt-verdict-pill">'+esc(a)+'</span>';}).join('');return('<section class="rt-verdict rt-verdict-top reveal">'+
'<span class="rt-verdict-label rt-eyebrow">The Verdict</span>'+
'<div class="rt-verdict-meta">'+
'<span class="rt-verdict-pill '+rec[1]+'">'+rec[0]+'</span>'+
audience+
'</div>'+
'<p class="rt-verdict-body">'+esc(data.verdict.verdictText)+'</p>'+
'</section>');}
function relatedCardHTML(item){return('<a href="'+(item.url.startsWith('Reviews/')||item.url.startsWith('Comic/')||item.url.startsWith('Games/')?'../'+item.url:item.url)+'" class="related-card">'+
'<img src="'+('../'+item.poster)+'" alt="'+esc(item.title)+'" loading="lazy" decoding="async" onerror="rtImgFallback(this)">'+
'<span class="related-title">'+esc(item.title)+'</span>'+
'</a>');}
function buildRelatedGrid(){let picks=(data.similarSlugs||[]).map(function(s){return combinedIndex.find(function(d){return d.slug===s;});}).filter(Boolean);if(!picks.length){picks=dataset.filter(function(d){return d.slug!==slug;}).sort(function(a,b){return rtScoreOf(b)-rtScoreOf(a);}).slice(0,3);}
if(!picks.length)return'';return('<section class="related-reviews reveal">'+
'<p class="related-heading">More Reviews</p>'+
'<div class="related-grid">'+picks.slice(0,3).map(relatedCardHTML).join('')+'</div>'+
'</section>');}
function rtScoreOf(item){if(!item.scores)return 0;const vals=Object.keys(item.scores).map(function(k){return item.scores[k];}).filter(function(v){return v>0;});return vals.length?vals.reduce(function(a,b){return a+b;},0)/vals.length:0;}
function buildPrevNext(){const sorted=dataset.slice().sort(function(a,b){return new Date(a.date)-new Date(b.date);});const idx=sorted.findIndex(function(d){return d.slug===slug;});if(idx===-1||sorted.length<2)return'';const prev=sorted[(idx-1+sorted.length)%sorted.length];const next=sorted[(idx+1)%sorted.length];return('<nav class="rt-prevnext reveal" aria-label="More reviews">'+
'<a href="'+next.slug+'.html" class="rt-prevnext-link rt-prevnext-prev"><span class="rt-prevnext-label">&#8592; Newer</span><span class="rt-prevnext-title">'+esc(next.title)+'</span></a>'+
'<a href="'+prev.slug+'.html" class="rt-prevnext-link rt-prevnext-next"><span class="rt-prevnext-label">Older &#8594;</span><span class="rt-prevnext-title">'+esc(prev.title)+'</span></a>'+
'</nav>');}
(function injectStructuredData(){const scoreVals=Object.keys(data.scores).map(function(k){return data.scores[k];}).filter(function(v){return v>0;});const overall=scoreVals.reduce(function(a,b){return a+b;},0)/scoreVals.length;const itemType=data.type==='Comic Review'?'CreativeWork':(data.type==='Game Review'?'VideoGame':'Movie');const ld={'@context':'https://schema.org','@type':'Review',itemReviewed:{'@type':itemType,name:data.title,genre:data.genre||undefined},reviewRating:{'@type':'Rating',ratingValue:overall.toFixed(1),bestRating:'10',worstRating:'0'},author:{'@type':'Organization',name:'Reel Talk'},publisher:{'@type':'Organization',name:'Reel Talk'},datePublished:data.date,description:data.desc,};const script=document.createElement('script');script.type='application/ld+json';script.textContent=JSON.stringify(ld);document.head.appendChild(script);})();const panelReserve=document.getElementById('rt-panel-reserve');const ratingBlock=article.querySelector('.review-rating');const topHTML=buildTags()+buildVerdict();if(panelReserve){panelReserve.outerHTML=topHTML;}else if(ratingBlock){ratingBlock.insertAdjacentHTML('afterend',topHTML);}
const bottomHTML=buildMiniCards()+
buildListBlock('Trivia','🎞️',data.trivia,'rt-trivia-list')+
buildListBlock('Behind the Scenes','🎥',data.behindTheScenes,'rt-bts-list');article.insertAdjacentHTML('beforeend',bottomHTML);const footerHTML=buildPrevNext()+buildRelatedGrid();const mount=document.getElementById('rt-related-mount');if(mount){mount.outerHTML=footerHTML;}else{article.insertAdjacentHTML('afterend',footerHTML);}
if('IntersectionObserver'in window){const io=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target);}});},{threshold:0.15});document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});}else{document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('is-visible');});}})();
