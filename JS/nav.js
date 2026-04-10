document.addEventListener('DOMContentLoaded', function () {
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
