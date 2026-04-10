// OMDB API integration — pulls ratings, cast, and trailer link for each review
// Get your free API key at https://www.omdbapi.com/apikey.aspx (free up to 1,000 req/day)
const OMDB_API_KEY = 'cbf175fb';

// Streaming platform registry — add new platforms here as needed
// logo: Simple Icons CDN slug (https://simpleicons.org)
const PLATFORMS = {
    netflix:   { name: 'Netflix',     url: 'https://www.netflix.com',       cls: 'netflix',   logo: 'netflix'       },
    prime:     { name: 'Prime Video', url: 'https://www.primevideo.com',    cls: 'prime',     logo: 'primevideo'    },
    disney:    { name: 'Disney+',     url: 'https://www.disneyplus.com',    cls: 'disney',    logo: 'disneyplus'    },
    max:       { name: 'Max',         url: 'https://www.max.com',           cls: 'max',       logo: 'max'           },
    hulu:      { name: 'Hulu',        url: 'https://www.hulu.com',          cls: 'hulu',      logo: 'hulu'          },
    appletv:   { name: 'Apple TV',    url: 'https://tv.apple.com',          cls: 'appletv',   logo: 'appletv'       },
    paramount: { name: 'Paramount+',  url: 'https://www.paramountplus.com', cls: 'paramount', logo: 'paramountplus' },
    peacock:   { name: 'Peacock',     url: 'https://www.peacocktv.com',     cls: 'peacock',   logo: 'peacock'       },
};

document.addEventListener('DOMContentLoaded', async function () {
    const article = document.querySelector('.movie-review');
    if (!article) return;

    // --- Where to Watch (works with no API key) ---
    const streamingAttr = article.dataset.streaming;
    if (streamingAttr) insertWhereToWatch(article, streamingAttr);

    // --- OMDB ratings / cast / trailer ---
    if (!OMDB_API_KEY || OMDB_API_KEY === 'YOUR_OMDB_API_KEY') return;
    const imdbId = article.dataset.imdbid;
    if (!imdbId) return;

    try {
        const res = await fetch(`https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.Response === 'False') return;
        insertOMDBBlock(article, data);
    } catch (e) {
        // Silent fail — page works fine without it
    }
});

function insertWhereToWatch(article, streamingAttr) {
    const keys = streamingAttr.split(',').map(k => k.trim()).filter(k => PLATFORMS[k]);
    if (!keys.length) return;

    const buttons = keys.map(key => {
        const p = PLATFORMS[key];
        return `<a href="${p.url}" target="_blank" rel="noopener" class="wtw-btn ${p.cls}" aria-label="Watch on ${p.name}">${p.name}</a>`;
    }).join('');

    const html = `
    <div class="where-to-watch">
        <p class="wtw-label">Where to Watch</p>
        <div class="wtw-links">${buttons}</div>
    </div>`;

    article.insertAdjacentHTML('beforeend', html);
}

function insertOMDBBlock(article, data) {
    const imdb     = data.imdbRating !== 'N/A' ? data.imdbRating : null;
    const rt       = data.Ratings?.find(r => r.Source === 'Rotten Tomatoes')?.Value ?? null;
    const meta     = data.Ratings?.find(r => r.Source === 'Metacritic')?.Value?.replace('/100', '') ?? null;
    const director = data.Director !== 'N/A' ? data.Director : null;
    const cast     = data.Actors   !== 'N/A' ? data.Actors   : null;

    const imdbLink    = `https://www.imdb.com/title/${data.imdbID}/`;
    const trailerLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(data.Title + ' ' + data.Year + ' official trailer')}`;

    const badges = [
        imdb  ? `<a href="${imdbLink}" target="_blank" rel="noopener" class="rating-badge imdb">IMDb ★ ${imdb}</a>` : '',
        rt    ? `<span class="rating-badge rt">🍅 ${rt}</span>`             : '',
        meta  ? `<span class="rating-badge meta">Metacritic ${meta}</span>` : ''
    ].filter(Boolean).join('');

    const html = `
    <div class="omdb-info">
        ${badges ? `<div class="omdb-ratings">${badges}</div>` : ''}
        ${director ? `<p class="omdb-meta"><strong>Director:</strong> ${director}</p>` : ''}
        ${cast     ? `<p class="omdb-meta"><strong>Cast:</strong> ${cast}</p>`         : ''}
        <a href="${trailerLink}" target="_blank" rel="noopener" class="trailer-btn">▶ Watch Trailer on YouTube</a>
    </div>`;

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
