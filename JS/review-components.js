(function () {
    const article = document.querySelector('.movie-review');
    if (!article) return;

    const slug = location.pathname
        .split('/')
        .pop()
        .replace(/\.html?$/, '');

    const dataset =
        (typeof allReviews !== 'undefined' && allReviews) ||
        (typeof allComics !== 'undefined' && allComics) ||
        (typeof allGames !== 'undefined' && allGames) ||
        [];

    const combinedIndex = []
        .concat(typeof allReviews !== 'undefined' ? allReviews : [])
        .concat(typeof allComics !== 'undefined' ? allComics : [])
        .concat(typeof allGames !== 'undefined' ? allGames : []);

    const data = dataset.find(function (d) {
        return d.slug === slug;
    });

    if (!data || !data.scores) return;

    /*
     * Track recently viewed reviews
     */
    (function trackRecentlyViewed() {
        const KEY = 'rt_recently_viewed';
        let list = [];

        try {
            list = JSON.parse(localStorage.getItem(KEY) || '[]');
        } catch (e) {
            list = [];
        }

        list = list.filter(function (r) {
            return r.url !== data.url;
        });

        list.unshift({
            title: data.title,
            url: data.url
        });

        localStorage.setItem(
            KEY,
            JSON.stringify(list.slice(0, 8))
        );
    })();

    /*
     * Recommendation labels
     */
    const REC_LABELS = {
        'watch-now': ['Watch It Now', 'rt-rec-watch-now'],
        'wait-for-streaming': ['Wait for Streaming', 'rt-rec-wait'],
        'skip': ['Skip It', 'rt-rec-skip']
    };

    /*
     * Escape HTML
     */
    function esc(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[c];
        });
    }

    /*
     * Build the verdict section
     *
     * Keeps:
     * - The Verdict
     * - Recommendation
     * - Verdict text
     *
     * Does not display audience tags.
     */
    function buildVerdict() {
        if (!data.verdict) return '';

        const rec =
            REC_LABELS[data.verdict.recommendation] ||
            REC_LABELS['watch-now'];

        return (
            '<section class="rt-verdict rt-verdict-top reveal">' +

                '<span class="rt-verdict-label rt-eyebrow">' +
                    'The Verdict' +
                '</span>' +

                '<div class="rt-verdict-meta">' +

                    '<span class="rt-verdict-pill ' +
                        rec[1] +
                    '">' +
                        rec[0] +
                    '</span>' +

                '</div>' +

                '<p class="rt-verdict-body">' +
                    esc(data.verdict.verdictText) +
                '</p>' +

            '</section>'
        );
    }

    /*
     * Build related review cards
     *
     * Keeps the "More Reviews" section.
     */
    function relatedCardHTML(item) {
        return (
            '<a href="' +
                (
                    item.url.startsWith('Reviews/') ||
                    item.url.startsWith('Comic/') ||
                    item.url.startsWith('Games/')
                        ? '../' + item.url
                        : item.url
                ) +
            '" class="related-card">' +

                '<img src="' +
                    '../' + item.poster +
                    '" alt="' +
                    esc(item.title) +
                    '" loading="lazy" decoding="async" ' +
                    'onerror="rtImgFallback(this)">' +

                '<span class="related-title">' +
                    esc(item.title) +
                '</span>' +

            '</a>'
        );
    }

    /*
     * Build "More Reviews"
     */
    function buildRelatedGrid() {
        let picks = (data.similarSlugs || [])
            .map(function (s) {
                return combinedIndex.find(function (d) {
                    return d.slug === s;
                });
            })
            .filter(Boolean);

        if (!picks.length) {
            picks = dataset
                .filter(function (d) {
                    return d.slug !== slug;
                })
                .sort(function (a, b) {
                    return rtScoreOf(b) - rtScoreOf(a);
                })
                .slice(0, 3);
        }

        if (!picks.length) return '';

        return (
            '<section class="related-reviews reveal">' +

                '<p class="related-heading">' +
                    'More Reviews' +
                '</p>' +

                '<div class="related-grid">' +
                    picks
                        .slice(0, 3)
                        .map(relatedCardHTML)
                        .join('') +
                '</div>' +

            '</section>'
        );
    }

    /*
     * Calculate average score for related reviews
     */
    function rtScoreOf(item) {
        if (!item.scores) return 0;

        const vals = Object.keys(item.scores)
            .map(function (k) {
                return item.scores[k];
            })
            .filter(function (v) {
                return v > 0;
            });

        return vals.length
            ? vals.reduce(function (a, b) {
                return a + b;
            }, 0) / vals.length
            : 0;
    }

    /*
     * Build previous / next navigation
     */
    function buildPrevNext() {
        const sorted = dataset
            .slice()
            .sort(function (a, b) {
                return new Date(a.date) - new Date(b.date);
            });

        const idx = sorted.findIndex(function (d) {
            return d.slug === slug;
        });

        if (idx === -1 || sorted.length < 2) return '';

        const prev =
            sorted[(idx - 1 + sorted.length) % sorted.length];

        const next =
            sorted[(idx + 1) % sorted.length];

        return (
            '<nav class="rt-prevnext reveal" aria-label="More reviews">' +

                '<a href="' +
                    next.slug +
                    '.html" ' +
                    'class="rt-prevnext-link rt-prevnext-prev">' +

                    '<span class="rt-prevnext-label">' +
                        '&#8592; Newer' +
                    '</span>' +

                    '<span class="rt-prevnext-title">' +
                        esc(next.title) +
                    '</span>' +

                '</a>' +

                '<a href="' +
                    prev.slug +
                    '.html" ' +
                    'class="rt-prevnext-link rt-prevnext-next">' +

                    '<span class="rt-prevnext-label">' +
                        'Older &#8594;' +
                    '</span>' +

                    '<span class="rt-prevnext-title">' +
                        esc(prev.title) +
                    '</span>' +

                '</a>' +

            '</nav>'
        );
    }

    /*
     * Structured data for search engines
     */
    (function injectStructuredData() {
        const scoreVals = Object.keys(data.scores)
            .map(function (k) {
                return data.scores[k];
            })
            .filter(function (v) {
                return v > 0;
            });

        const overall =
            scoreVals.reduce(function (a, b) {
                return a + b;
            }, 0) / scoreVals.length;

        const itemType =
            data.type === 'Comic Review'
                ? 'CreativeWork'
                : data.type === 'Game Review'
                    ? 'VideoGame'
                    : 'Movie';

        const ld = {
            '@context': 'https://schema.org',
            '@type': 'Review',

            itemReviewed: {
                '@type': itemType,
                name: data.title,
                genre: data.genre || undefined
            },

            reviewRating: {
                '@type': 'Rating',
                ratingValue: overall.toFixed(1),
                bestRating: '10',
                worstRating: '0'
            },

            author: {
                '@type': 'Organization',
                name: 'Reel Talk'
            },

            publisher: {
                '@type': 'Organization',
                name: 'Reel Talk'
            },

            datePublished: data.date,
            description: data.desc
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(ld);

        document.head.appendChild(script);
    })();

    /*
     * Insert simplified verdict
     */
    const panelReserve =
        document.getElementById('rt-panel-reserve');

    const ratingBlock =
        article.querySelector('.review-rating');

    const topHTML = buildVerdict();

    if (panelReserve) {
        panelReserve.outerHTML = topHTML;
    } else if (ratingBlock) {
        ratingBlock.insertAdjacentHTML(
            'afterend',
            topHTML
        );
    }

    /*
     * Insert:
     * - Newer / Older navigation
     * - More Reviews
     */
    const footerHTML =
        buildPrevNext() +
        buildRelatedGrid();

    const mount =
        document.getElementById('rt-related-mount');

    if (mount) {
        mount.outerHTML = footerHTML;
    } else if (footerHTML) {
        article.insertAdjacentHTML(
            'afterend',
            footerHTML
        );
    }

    /*
     * Reveal animation
     */
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        io.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.15
            }
        );

        document
            .querySelectorAll('.reveal')
            .forEach(function (el) {
                io.observe(el);
            });

    } else {
        document
            .querySelectorAll('.reveal')
            .forEach(function (el) {
                el.classList.add('is-visible');
            });
    }
})();