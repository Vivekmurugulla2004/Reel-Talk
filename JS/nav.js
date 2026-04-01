document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.subheader');
    if (!nav) return;

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
});
