// Reads from JS/reviews-data.js — add new reviews there.
// Shows the 6 most recent entries (by date) in the carousel.

const recentReviews = [...allReviews]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

const track   = document.getElementById('carousel-track');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');

// Slide 0 is hardcoded in index.html for fast LCP — build slides 1–5 here
recentReviews.forEach((review, i) => {
    if (i === 0) return;
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = `
        <img src="${review.reviewImage}" alt="${review.title}" width="1440" height="810" loading="lazy">
        <div class="carousel-slide-overlay">
            <span class="slide-category">${review.type}</span>
            <h3 class="slide-title">${review.title}</h3>
            <p class="slide-desc">${review.desc}</p>
            <a href="${review.url}" class="slide-link" aria-label="Read review of ${review.title}">Read Review →</a>
        </div>
    `;
    track.appendChild(slide);
});

let currentIndex = 0;
let autoTimer;

function goTo(index) {
    currentIndex = (index + recentReviews.length) % recentReviews.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

function startAuto() {
    autoTimer = setInterval(() => goTo(currentIndex + 1), 10000);
}

function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
}

prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); resetAuto(); });
nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); resetAuto(); });

// Pause on hover
track.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
track.parentElement.addEventListener('mouseleave', startAuto);

startAuto();
