const OMDB_API_KEY = 'cbf175fb';
const PLATFORMS = {
    netflix:   { name: 'Netflix',     url: 'https://www.netflix.com',       cls: 'netflix',   img: '../Images/Steaming Logos/netflix.webp'      },
    prime:     { name: 'Prime Video', url: 'https://www.primevideo.com',    cls: 'prime',     img: '../Images/Steaming Logos/prime video.webp'  },
    disney:    { name: 'Disney+',     url: 'https://www.disneyplus.com',    cls: 'disney',    img: '../Images/Steaming Logos/disney plus.webp'  },
    max:       { name: 'Max',         url: 'https://www.max.com',           cls: 'max',       img: '../Images/Steaming Logos/hbo max.webp'      },
    hulu:      { name: 'Hulu',        url: 'https://www.hulu.com',          cls: 'hulu',      img: '../Images/Steaming Logos/hulu logo.webp'    },
    appletv:   { name: 'Apple TV+',   url: 'https://tv.apple.com',          cls: 'appletv',   img: '../Images/Steaming Logos/apple tv.webp'     },
    paramount: { name: 'Paramount+',  url: 'https://www.paramountplus.com', cls: 'paramount', img: null                                         },
    peacock:   { name: 'Peacock',     url: 'https://www.peacocktv.com',     cls: 'peacock',   img: null                                         },
};
document.addEventListener('DOMContentLoaded', async function () {
    const article = document.querySelector('.movie-review');
    if (!article) return;
    const streamingAttr = article.dataset.streaming;
    if (streamingAttr) insertWhereToWatch(article, streamingAttr);
    const imdbId = article.dataset.imdbid;
    if (!OMDB_API_KEY || OMDB_API_KEY === 'YOUR_OMDB_API_KEY' || !imdbId) return;
    // Reserve space before the async fetch resolves so the block landing later doesn't shift the page (CLS).
    const rating = article.querySelector('.review-rating');
    const h4 = article.querySelector('h4');
    const anchor = rating || h4;
    let placeholder = null;
    if (anchor) {
        placeholder = document.createElement('div');
        placeholder.className = 'omdb-reserve';
        anchor.insertAdjacentElement('afterend', placeholder);
    }
    try {
        const res = await fetch('https://www.omdbapi.com/?i=' + imdbId + '&apikey=' + OMDB_API_KEY);
        if (!res.ok) { if (placeholder) placeholder.remove(); return; }
        const data = await res.json();
        if (data.Response === 'False') { if (placeholder) placeholder.remove(); return; }
        insertOMDBBlock(article, data, placeholder);
    } catch (e) { if (placeholder) placeholder.remove(); }
});
function insertWhereToWatch(article, streamingAttr) {
    const keys = streamingAttr.split(',').map(k => k.trim()).filter(k => PLATFORMS[k]);
    if (!keys.length) return;
    const buttons = keys.map(key => {
        const p = PLATFORMS[key];
        const inner = p.img
            ? '<img src="' + p.img + '" alt="' + p.name + '" class="wtw-logo">'
            : p.name;
        return '<a href="' + p.url + '" target="_blank" rel="noopener" class="wtw-btn ' + p.cls + '" aria-label="Watch on ' + p.name + '">' + inner + '</a>';
    }).join('');
    const html = '<div class="where-to-watch"><p class="wtw-label">Where to Watch</p><div class="wtw-links">' + buttons + '</div></div>';
    article.insertAdjacentHTML('beforeend', html);
}
function insertOMDBBlock(article, data, placeholder) {
    const imdb     = data.imdbRating !== 'N/A' ? data.imdbRating : null;
    const rt       = data.Ratings?.find(r => r.Source === 'Rotten Tomatoes')?.Value ?? null;
    const meta     = data.Ratings?.find(r => r.Source === 'Metacritic')?.Value?.replace('/100', '') ?? null;
    const director = data.Director !== 'N/A' ? data.Director : null;
    const cast     = data.Actors   !== 'N/A' ? data.Actors   : null;
    const imdbLink    = 'https://www.imdb.com/title/' + data.imdbID + '/';
    const trailerLink = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(data.Title + ' ' + data.Year + ' official trailer');
    const badges = [
        imdb  ? '<a href="' + imdbLink + '" target="_blank" rel="noopener" class="rating-badge imdb">IMDb ★ ' + imdb + '</a>' : '',
        rt    ? '<span class="rating-badge rt">🍅 ' + rt + '</span>' : '',
        meta  ? '<span class="rating-badge meta">Metacritic ' + meta + '</span>' : ''
    ].filter(Boolean).join('');
    const html =
        '<div class="omdb-info">' +
        (badges ? '<div class="omdb-ratings">' + badges + '</div>' : '') +
        (director ? '<p class="omdb-meta"><strong>Director:</strong> ' + director + '</p>' : '') +
        (cast ? '<p class="omdb-meta"><strong>Cast:</strong> ' + cast + '</p>' : '') +
        '<a href="' + trailerLink + '" target="_blank" rel="noopener" class="trailer-btn">▶ Watch Trailer on YouTube</a></div>';
    if (placeholder) {
        placeholder.outerHTML = html;
        return;
    }
    const rating = article.querySelector('.review-rating');
    const h4 = article.querySelector('h4');
    const anchor = rating || h4;
    if (anchor) {
        anchor.insertAdjacentHTML('afterend', html);
    } else {
        const firstP = article.querySelector('p');
        if (firstP) firstP.insertAdjacentHTML('beforebegin', html);
    }
}
