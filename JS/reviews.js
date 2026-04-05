// Reads from JS/reviews-data.js — add new reviews there.
// Shows the 6 most recent entries (sorted by date) in the carousel.

const recentReviews = [...allReviews]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

const track     = document.getElementById('carousel-track');
const titleEl   = document.getElementById('carousel-title');
const descEl    = document.getElementById('carousel-desc');
const linkEl    = document.getElementById('carousel-link');
const categoryEl= document.getElementById('carousel-category');

recentReviews.forEach(review => {
    const card = document.createElement('div');
    card.className = 'carousel-card';
    card.innerHTML = `
        <a href="${review.url}">
            <img src="${review.poster}" alt="${review.title} poster">
        </a>
    `;
    track.appendChild(card);
});

const prevBtn  = document.querySelector('.prev-btn');
const nextBtn  = document.querySelector('.next-btn');
const maxIndex = recentReviews.length - 1;
let currentIndex = 0;

function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 225}px)`;
    const r = recentReviews[currentIndex];
    titleEl.textContent    = r.title;
    descEl.textContent     = r.desc;
    linkEl.href            = r.url;
    categoryEl.textContent = r.type;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
}

prevBtn.addEventListener('click', () => { if (currentIndex > 0)        { currentIndex--; updateCarousel(); } });
nextBtn.addEventListener('click', () => { if (currentIndex < maxIndex) { currentIndex++; updateCarousel(); } });

updateCarousel();
