document.addEventListener('DOMContentLoaded', function () {
    const feed = document.getElementById('articles-feed');
    if (!feed) return;

    const sorted = [...allArticles].sort((a, b) => new Date(b.date) - new Date(a.date));

    function renderCards(filter) {
        feed.innerHTML = '';
        const filtered = filter === 'all' ? sorted : sorted.filter(function (a) { return a.type === filter; });
        filtered.forEach(function (article) {
            const date = new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const card = document.createElement('a');
            card.href = article.url;
            card.className = 'post-card';
            card.innerHTML =
                '<div class="post-card-img-wrap">' +
                    '<img src="' + article.image + '" alt="' + article.title + '" loading="lazy">' +
                '</div>' +
                '<div class="post-card-body">' +
                    '<span class="post-tag">' + article.type + '</span>' +
                    '<h3 class="post-title">' + article.title + '</h3>' +
                    '<span class="post-date">' + date + '</span>' +
                '</div>';
            feed.appendChild(card);
        });
    }

    renderCards('all');

    document.querySelectorAll('.filter-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            renderCards(btn.dataset.filter);
        });
    });
});
