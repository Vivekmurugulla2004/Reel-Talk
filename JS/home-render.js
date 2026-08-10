function rtBuildFeatured(item){const rec=item.verdict||{};return('<section class="rt-featured reveal" aria-label="Featured review">'+
'<a class="rt-featured-media" href="'+item.url+'">'+
'<img src="'+item.reviewImage+'" alt="" loading="lazy" width="700" height="394" onerror="rtImgFallback(this)">'+
'</a>'+
'<div class="rt-featured-body">'+
'<span class="rt-eyebrow">Editor’s Pick</span>'+
'<h3 class="rt-featured-title"><a href="'+item.url+'">'+rtEscapeHtml(item.title)+'</a></h3>'+
(rec.finalRating?'<span class="rt-featured-rating">'+rtEscapeHtml(rec.finalRating)+'</span>':'')+
(rec.verdictText?'<p class="rt-featured-quote">“'+rtEscapeHtml(rec.verdictText)+'”</p>':'<p class="rt-featured-quote">'+rtEscapeHtml(item.desc||'')+'</p>')+
'<a class="rt-featured-cta" href="'+item.url+'">Read the Full Review &#8594;</a>'+
'</div>'+
'</section>');}
document.addEventListener('DOMContentLoaded',function(){const mount=document.getElementById('rt-home-dynamic');if(!mount)return;const all=rtBuildMediaIndex();const editors=all.filter(function(d){return d.editorsPick;});const hiddenGems=all.filter(function(d){return d.hiddenGem;}).slice(0,4);const franchiseMap={};all.forEach(function(d){if(!d.franchise)return;(franchiseMap[d.franchise.name]=franchiseMap[d.franchise.name]||[]).push(d);});const franchises=Object.keys(franchiseMap).map(function(name){return{name:name,items:franchiseMap[name].sort(function(a,b){return(a.franchise.order||0)-(b.franchise.order||0);})};}).filter(function(f){return f.items.length>1;});let html='';if(editors.length){const featured=editors.slice().sort(function(a,b){return rtOverallScore(b)-rtOverallScore(a);})[0];const rest=editors.filter(function(d){return d.slug!==featured.slug;}).slice(0,4);html+=rtBuildFeatured(featured);if(rest.length)html+=rtCardRow('editors-picks','Editor’s Picks','More From the Editor','The rest of what we’d point you to first.',rest,'collections.html#editors-picks');}
if(hiddenGems.length)html+=rtCardRow('hidden-gems','Worth Seeking Out','Hidden Gems','Great films, comics, and games that never got the audience they deserved.',hiddenGems,'collections.html#hidden-gems');if(franchises.length){html+='<section class="rt-section reveal" id="franchise-spotlights">'+
'<div class="rt-section-head"><div><span class="rt-eyebrow">Watch Order</span><h2>Franchise Spotlights</h2></div>'+
'<p class="rt-section-sub">Every entry from a franchise we\'ve covered, in watch order.</p></div>'+
franchises.map(function(f){return'<div class="rt-franchise-block">'+
'<h3 class="rt-franchise-name">'+rtEscapeHtml(f.name)+'</h3>'+
'<div class="rt-recommend-grid">'+f.items.map(rtPosterCard).join('')+'</div>'+
'</div>';}).join('')+
'</section>';}
mount.innerHTML=html;rtObserveReveals(mount);});
