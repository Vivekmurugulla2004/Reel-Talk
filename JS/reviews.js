const recentReviews = [
    { title: 'The Amazing Spider-Man (2012)',                        desc: 'Andrew Garfield takes on the iconic role in this grounded reboot of the Spider-Man story.',           poster: 'Images/Review/Poster/tasm poster.jpg',   url: 'Reviews/tasm.html'   },
    { title: 'Batman v. Superman: Dawn of Justice (2016)',           desc: 'The two most iconic DC heroes clash in a dark and divisive battle of ideals.',                        poster: 'Images/Review/Poster/bvs poster.jpg',    url: 'Reviews/bvs.html'    },
    { title: 'Spider-Man 3 (2007)',                                  desc: 'Peter Parker faces his darkest chapter as multiple villains and personal demons collide.',             poster: 'Images/Review/Poster/sm3 poster.webp',   url: 'Reviews/sm3.html'    },
    { title: 'Spider-Man 2 (2004)',                                  desc: 'A modern blueprint for superhero storytelling that balances spectacle with genuine heart.',            poster: 'Images/Review/Poster/sm2 poster.jpg',    url: 'Reviews/sm2.html'    },
    { title: '500 Days of Summer (2009)',                            desc: 'A refreshingly honest look at love that refuses to follow the usual romantic playbook.',              poster: 'Images/Review/Poster/500dos poster.png', url: 'Reviews/500dos.html' },
    { title: 'Star Wars: Episode III — Revenge of the Sith (2005)', desc: "Anakin Skywalker's tragic fall to the dark side brings the prequel trilogy to a powerful close.",    poster: 'Images/Review/Poster/sw3 poster.jpg',    url: 'Reviews/sw3.html'    },
];

const container = document.getElementById('reviews-container');

recentReviews.forEach(review => {
    container.innerHTML += `
        <div class="review-card">
            <a href="${review.url}">
                <img src="${review.poster}" alt="${review.title} poster">
            </a>
            <span class="review-card-category">Movie Review</span>
            <a href="${review.url}" class="review-card-title">${review.title}</a>
            <p class="review-card-desc">${review.desc}</p>
        </div>
    `;
});
