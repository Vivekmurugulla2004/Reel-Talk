function rtEscapeHtml(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function rtBuildMediaIndex(){return[].concat((typeof allReviews!=='undefined'?allReviews:[]).map(function(d){return Object.assign({mediaLabel:'Movie'},d);})).concat((typeof allComics!=='undefined'?allComics:[]).map(function(d){return Object.assign({mediaLabel:'Comic'},d);})).concat((typeof allGames!=='undefined'?allGames:[]).map(function(d){return Object.assign({mediaLabel:'Game'},d);}));}
function rtOverallScore(item){if(!item.scores)return 0;const vals=Object.keys(item.scores).map(function(k){return item.scores[k];}).filter(function(v){return v>0;});return vals.reduce(function(a,b){return a+b;},0)/vals.length;}
function rtPosterCard(item){const score=rtOverallScore(item);return('<a href="'+item.url+'" class="rt-poster-card">'+
'<div class="rt-poster rt-card">'+
'<img src="'+item.poster+'" alt="'+rtEscapeHtml(item.title)+' poster" loading="lazy" width="225" height="337">'+
(score?'<span class="rt-poster-score">'+score.toFixed(1)+'</span>':'')+
'</div>'+
'<span class="rt-poster-type">'+rtEscapeHtml(item.mediaLabel)+'</span>'+
'<span class="rt-poster-title">'+rtEscapeHtml(item.title)+'</span>'+
'</a>');}
function rtCardRow(id,eyebrow,heading,sub,items){if(!items.length)return'';return('<section class="rt-section reveal" id="'+id+'">'+
'<div class="rt-section-head">'+
'<div><span class="rt-eyebrow">'+rtEscapeHtml(eyebrow)+'</span><h2>'+rtEscapeHtml(heading)+'</h2></div>'+
(sub?'<p class="rt-section-sub">'+rtEscapeHtml(sub)+'</p>':'')+
'</div>'+
'<div class="rt-recommend-grid">'+items.map(rtPosterCard).join('')+'</div>'+
'</section>');}
function rtObserveReveals(root){if('IntersectionObserver'in window){const io=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target);}});},{threshold:0.1});root.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});}else{root.querySelectorAll('.reveal').forEach(function(el){el.classList.add('is-visible');});}}