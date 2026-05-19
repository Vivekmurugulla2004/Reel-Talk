document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('review-grid');
    if (!grid) return;

    allReviews.forEach(review => {
        const card = document.createElement('div');
        card.innerHTML = `
            <a href="${review.url}"><img loading="lazy" src="${review.poster}" alt="${review.title} poster" width="225" height="337"></a>
            <a href="${review.url}">${review.title}</a>
        `;
        grid.appendChild(card);
    });

    const bar = document.createElement('div');
    bar.className = 'sort-bar';
    bar.innerHTML = `
        <label for="sortOrder">Sort:</label>
        <select id="sortOrder">
            <option value="az">A \u2192 Z</option>
            <option value="za">Z \u2192 A</option>
        </select>
    `;
    grid.parentNode.insertBefore(bar, grid);

    function sortKey(card) {
        const links = card.querySelectorAll('a');
        const titleLink = links[links.length - 1];
        const raw = titleLink ? titleLink.textContent : '';
        return raw.replace(/\s*\(\d{4}\)\s*$/, '').trim().toLowerCase().replace(/^(the|a|an)\s+/i, '');
    }

    function sortCards(order) {
        const cards = Array.from(grid.children);
        cards.sort((a, b) => {
            const ta = sortKey(a);
            const tb = sortKey(b);
            return order === 'az' ? ta.localeCompare(tb) : tb.localeCompare(ta);
        });
        grid.append(...cards);
    }

    document.getElementById('sortOrder').addEventListener('change', e => {
        sortCards(e.target.value);
    });

    sortCards('az');
});
