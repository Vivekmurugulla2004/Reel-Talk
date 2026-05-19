(function () {
    var form  = document.getElementById('newsletter-form');
    var btn   = document.getElementById('newsletter-btn');
    var input = document.getElementById('newsletter-email');
    var note  = document.getElementById('newsletter-note');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        btn.textContent = 'Subscribing…';
        btn.disabled = true;
        fetch('https://magic.beehiiv.com/v1/ccd6cd5f-6fa2-4db3-9367-24d90d4047a3', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: input.value })
        })
        .then(function (res) {
            if (res.ok || res.status === 201) {
                btn.textContent = 'Subscribed!';
                input.value = '';
                note.textContent = 'Check your inbox to confirm your subscription.';
            } else {
                btn.textContent = 'Subscribe';
                btn.disabled = false;
                note.textContent = 'Something went wrong. Please try again.';
            }
        })
        .catch(function () {
            btn.textContent = 'Subscribe';
            btn.disabled = false;
            note.textContent = 'Something went wrong. Please try again.';
        });
    });
})();
