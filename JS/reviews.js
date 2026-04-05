const recentReviews = [
    { title: 'The Amazing Spider-Man (2012)',                        poster: 'Images/Review/Poster/tasm poster.jpg',   url: 'Reviews/tasm.html'   },
    { title: 'Batman v. Superman: Dawn of Justice (2016)',           poster: 'Images/Review/Poster/bvs poster.jpg',    url: 'Reviews/bvs.html'    },
    { title: 'Spider-Man 3 (2007)',                                  poster: 'Images/Review/Poster/sm3 poster.webp',   url: 'Reviews/sm3.html'    },
    { title: 'Spider-Man 2 (2004)',                                  poster: 'Images/Review/Poster/sm2 poster.jpg',    url: 'Reviews/sm2.html'    },
    { title: '500 Days of Summer (2009)',                            poster: 'Images/Review/Poster/500dos poster.png', url: 'Reviews/500dos.html' },
    { title: 'Star Wars: Episode III — Revenge of the Sith (2005)', poster: 'Images/Review/Poster/sw3 poster.jpg',    url: 'Reviews/sw3.html'    },
];

const container = document.getElementById('reviews-container');

recentReviews.forEach(review => {
    container.innerHTML += `
        <div class="review-card">
            <a href="${review.url}">
                <img src="${review.poster}" alt="${review.title} poster">
            </a>
            <a href="${review.url}" class="review-card-title">${review.title}</a>
        </div>
    `;
});
