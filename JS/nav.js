document.addEventListener('DOMContentLoaded', function () {
    // ── Active nav link ────────────────────────────────────────────────
    const path = window.location.pathname;
    document.querySelectorAll('.subheader a').forEach(function (a) {
        const href = a.getAttribute('href');
        // Match exact page or section (e.g. /Reviews/ matches reviews.html)
        if (
            href &&
            (path.endsWith(href) ||
             (href.includes('reviews') && path.includes('/Reviews/')) ||
             (href.includes('games')   && path.includes('/Games/'))   ||
             (href.includes('comics')  && path.includes('/Comic/'))   ||
             (href.includes('articles') && path.includes('/Articles/')))
        ) {
            a.classList.add('active');
        }
    });

    // ── Mobile nav toggle ──────────────────────────────────────────────
    const nav = document.querySelector('.subheader');
    if (nav) {
        const btn = document.createElement('button');
        btn.className = 'nav-toggle';
        btn.setAttribute('aria-label', 'Toggle navigation');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<span></span><span></span><span></span>';
        nav.prepend(btn);

        btn.addEventListener('click', function () {
            const isOpen = nav.classList.toggle('nav-open');
            btn.setAttribute('aria-expanded', isOpen);
        });

        document.addEventListener('click', function (e) {
            if (!nav.contains(e.target)) {
                nav.classList.remove('nav-open');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ── Dark mode toggle ───────────────────────────────────────────────
    const darkBtn = document.createElement('button');
    darkBtn.className = 'dark-toggle';
    darkBtn.setAttribute('aria-label', 'Toggle dark mode');
    darkBtn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
    document.body.appendChild(darkBtn);

    darkBtn.addEventListener('click', function () {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            darkBtn.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            darkBtn.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        }
    });

    // ── Back to top button ─────────────────────────────────────────────
    const topBtn = document.createElement('button');
    topBtn.className = 'back-to-top';
    topBtn.setAttribute('aria-label', 'Back to top');
    topBtn.textContent = '↑';
    document.body.appendChild(topBtn);

    window.addEventListener('scroll', function () {
        topBtn.classList.toggle('visible', window.scrollY > 300);
    }, { passive: true });

    topBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
