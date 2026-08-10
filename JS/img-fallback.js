function rtImgFallback(img){
    if(img.dataset.rtFallback)return;
    img.dataset.rtFallback='1';
    function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
    function wrap(s,max){
        var words=String(s).split(' ');var lines=[];var cur='';
        words.forEach(function(w){
            if((cur+' '+w).trim().length>max){lines.push(cur.trim());cur=w;}
            else{cur=(cur+' '+w).trim();}
        });
        if(cur)lines.push(cur);
        return lines.slice(0,2);
    }
    var label=(img.alt||'Image').replace(/\s+(poster|cover|review image)$/i,'');
    var path=img.getAttribute('src')||'';
    var w=img.width||225,h=img.height||337;
    var titleLines=wrap(label,26);
    var pathLines=wrap(path,34);
    var midY=h/2;
    var titleY=midY-6;
    var text=titleLines.map(function(l,i){return '<text x="'+(w/2)+'" y="'+(titleY+i*18)+'" fill="#d8d8e6" font-family="Helvetica,Arial,sans-serif" font-size="14" font-weight="600" text-anchor="middle">'+esc(l)+'</text>';}).join('');
    var pathY=titleY+titleLines.length*18+22;
    var pathText=pathLines.map(function(l,i){return '<text x="'+(w/2)+'" y="'+(pathY+i*13)+'" fill="#7a7a8c" font-family="Helvetica,Arial,sans-serif" font-size="10" text-anchor="middle">'+esc(l)+'</text>';}).join('');
    var svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'">'+
        '<rect width="'+w+'" height="'+h+'" fill="#181822"/>'+
        '<rect x="6" y="6" width="'+(w-12)+'" height="'+(h-12)+'" fill="none" stroke="#3a3a48" stroke-width="1.5" stroke-dasharray="5 5"/>'+
        '<text x="'+(w/2)+'" y="'+(titleY-28)+'" font-size="22" text-anchor="middle">🎥</text>'+
        text+
        '<text x="'+(w/2)+'" y="'+(pathY-16)+'" fill="#55556a" font-family="Helvetica,Arial,sans-serif" font-size="9" letter-spacing="1" text-anchor="middle">DROP IMAGE AT</text>'+
        pathText+
        '</svg>';
    img.src='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
    img.style.objectFit='contain';
    img.style.background='#181822';
}
