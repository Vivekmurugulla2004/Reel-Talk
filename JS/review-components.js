(function(){const article=document.querySelector('.movie-review');if(!article)return;const slug=location.pathname.split('/').pop().replace(/\.html?$/,'');const dataset=(typeof allReviews!=='undefined'&&allReviews)||(typeof allComics!=='undefined'&&allComics)||(typeof allGames!=='undefined'&&allGames)||[];const data=dataset.find(function(d){return d.slug===slug;});if(!data||!data.scores)return;(function trackRecentlyViewed(){const KEY='rt_recently_viewed';let list=[];try{list=JSON.parse(localStorage.getItem(KEY)||'[]');}catch(e){list=[];}
list=list.filter(function(r){return r.url!==data.url;});list.unshift({title:data.title,url:data.url});localStorage.setItem(KEY,JSON.stringify(list.slice(0,8)));})();const SCORE_LABELS={story:'Story',characters:'Characters',acting:'Acting',visuals:'Visuals',music:'Music',direction:'Direction',rewatchability:'Rewatchability',emotionalImpact:'Emotional Impact',entertainmentValue:'Entertainment Value',};const REC_LABELS={'watch-now':['Watch It Now','rt-rec-watch-now'],'wait-for-streaming':['Wait for Streaming','rt-rec-wait'],'skip':['Skip It','rt-rec-skip'],};function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function buildScorePanel(){const entries=Object.keys(data.scores).filter(function(k){return data.scores[k]>0;});const overall=(entries.reduce(function(sum,k){return sum+data.scores[k];},0)/entries.length).toFixed(1);const bars=entries.map(function(k){const val=data.scores[k];return('<div class="rt-score-item">'+
'<div class="rt-score-item-top"><span>'+SCORE_LABELS[k]+'</span><strong>'+val.toFixed(1)+'</strong></div>'+
'<div class="rt-score-bar"><div class="rt-score-bar-fill" data-target="'+(val*10)+'"></div></div>'+
'</div>');}).join('');return('<section class="rt-score-panel rt-glass rt-card reveal">'+
'<div class="rt-score-heading">'+
'<h2>Reel Talk Score</h2>'+
'<span class="rt-score-overall">'+overall+'<span style="font-size:0.9rem;opacity:0.7"> / 10</span></span>'+
'</div>'+
'<div class="rt-score-grid">'+bars+'</div>'+
'</section>');}
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
function buildVerdict(){if(!data.verdict)return'';const rec=REC_LABELS[data.verdict.recommendation]||REC_LABELS['watch-now'];const audience=(data.verdict.bestAudience||[]).map(function(a){return'<span class="rt-verdict-pill">'+esc(a)+'</span>';}).join('');return('<section class="rt-verdict reveal">'+
'<span class="rt-verdict-label rt-eyebrow">The Reel Talk Verdict</span>'+
'<h2 class="rt-verdict-heading">'+esc(data.verdict.finalRating)+'</h2>'+
'<p class="rt-verdict-body">'+esc(data.verdict.verdictText)+'</p>'+
'<div class="rt-verdict-meta">'+
'<span class="rt-verdict-pill '+rec[1]+'">'+rec[0]+'</span>'+
audience+
'</div>'+
'</section>');}
const REACTIONS=[{key:'love',icon:'🔥',label:'Loved it'},{key:'mindblown',icon:'🤯',label:'Mind blown'},{key:'cry',icon:'😢',label:'Made me cry'},{key:'funny',icon:'😂',label:'Hilarious'},];function buildCommunity(){const reactBtns=REACTIONS.map(function(r){return'<button type="button" class="rt-reaction-btn" data-reaction="'+r.key+'" aria-pressed="false">'+r.icon+' <span>'+r.label+'</span></button>';}).join('');const stars=[1,2,3,4,5].map(function(n){return'<button type="button" data-star="'+n+'" aria-label="Rate '+n+' star'+(n>1?'s':'')+'">★</button>';}).join('');return('<section class="rt-community rt-glass rt-card reveal">'+
'<div class="rt-reactions" role="group" aria-label="React to this review">'+reactBtns+'</div>'+
'<div class="rt-my-rating">'+
'<span class="rt-my-rating-label">Your Rating</span>'+
'<div class="rt-star-input" role="radiogroup" aria-label="Your personal rating">'+stars+'</div>'+
'</div>'+
'</section>');}
function wireCommunity(root){const reactionKey='rt_reactions_'+slug;const ratingKey='rt_rating_'+slug;let active=[];try{active=JSON.parse(localStorage.getItem(reactionKey)||'[]');}catch(e){active=[];}
let rating=parseInt(localStorage.getItem(ratingKey)||'0',10);root.querySelectorAll('.rt-reaction-btn').forEach(function(btn){const key=btn.dataset.reaction;const isActive=active.indexOf(key)!==-1;btn.classList.toggle('is-active',isActive);btn.setAttribute('aria-pressed',String(isActive));btn.addEventListener('click',function(){const idx=active.indexOf(key);if(idx===-1){active.push(key);}else{active.splice(idx,1);}
localStorage.setItem(reactionKey,JSON.stringify(active));const nowActive=active.indexOf(key)!==-1;btn.classList.toggle('is-active',nowActive);btn.setAttribute('aria-pressed',String(nowActive));});});const starBtns=root.querySelectorAll('.rt-star-input button');function paintStars(n){starBtns.forEach(function(b){b.classList.toggle('is-filled',parseInt(b.dataset.star,10)<=n);});}
paintStars(rating);starBtns.forEach(function(btn){btn.addEventListener('click',function(){rating=parseInt(btn.dataset.star,10);localStorage.setItem(ratingKey,String(rating));paintStars(rating);});});}
(function injectStructuredData(){const scoreVals=Object.keys(data.scores).map(function(k){return data.scores[k];}).filter(function(v){return v>0;});const overall=scoreVals.reduce(function(a,b){return a+b;},0)/scoreVals.length;const itemType=data.type==='Comic Review'?'CreativeWork':(data.type==='Game Review'?'VideoGame':'Movie');const ld={'@context':'https://schema.org','@type':'Review',itemReviewed:{'@type':itemType,name:data.title,genre:data.genre||undefined},reviewRating:{'@type':'Rating',ratingValue:overall.toFixed(1),bestRating:'10',worstRating:'0'},author:{'@type':'Organization',name:'Reel Talk'},publisher:{'@type':'Organization',name:'Reel Talk'},datePublished:data.date,description:data.desc,};const script=document.createElement('script');script.type='application/ld+json';script.textContent=JSON.stringify(ld);document.head.appendChild(script);})();const ratingBlock=article.querySelector('.review-rating');if(ratingBlock){ratingBlock.insertAdjacentHTML('afterend',buildTags()+buildScorePanel());}
const bottomHTML=buildMiniCards()+
buildListBlock('Trivia','🎞️',data.trivia,'rt-trivia-list')+
buildListBlock('Behind the Scenes','🎥',data.behindTheScenes,'rt-bts-list')+
buildVerdict()+
buildCommunity();article.insertAdjacentHTML('beforeend',bottomHTML);const communitySection=article.querySelector('.rt-community');if(communitySection)wireCommunity(communitySection);const scoreFills=article.querySelectorAll('.rt-score-bar-fill');if('IntersectionObserver'in window){const io=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('is-visible');if(entry.target.classList.contains('rt-score-panel')){scoreFills.forEach(function(f){f.style.width=f.dataset.target+'%';});}
io.unobserve(entry.target);}});},{threshold:0.15});article.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});}else{article.querySelectorAll('.reveal').forEach(function(el){el.classList.add('is-visible');});scoreFills.forEach(function(f){f.style.width=f.dataset.target+'%';});}})();