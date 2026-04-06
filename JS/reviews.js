// Reads from JS/reviews-data.js — add new reviews there.
// Shows the 6 most recent entries (by date) in the carousel.

const recentReviews = [...allReviews]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

const track    = document.getElementById('carousel-track');
const dotsEl   = document.getElementById('carousel-dots');
const prevBtn  = document.querySelector('.carousel-prev');
const nextBtn  = document.querySelector('.carousel-next');

// Build slides
recentReviews.forEach((review, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    // First slide: high priority (it's the LCP element). Rest: lazy load.
    const imgAttrs = i === 0
        ? 'fetchpriority="high"'
        : 'loading="lazy"';
    slide.innerHTML = `
        <img src="${review.reviewImage}" alt="${review.title}" width="1200" height="520" ${imgAttrs}>
        <div class="carousel-slide-overlay">
            <span class="slide-category">${review.type}</span>
            <h3 class="slide-title">${review.title}</h3>
            <p class="slide-desc">${review.desc}</p>
            <a href="${review.url}" class="slide-link">Read Review →</a>
        </div>
    `;
    track.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
});

let currentIndex = 0;
let autoTimer;

function goTo(index) {
    currentIndex = (index + recentReviews.length) % recentReviews.length;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    document.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === currentIndex);
    });
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
