(function () {
  var form = document.querySelector('.form');
  if (!form || !window.fetch) return;

  var thanks = document.querySelector('.form-thanks');
  var error = form.querySelector('.form-error');
  var button = form.querySelector('button[type="submit"]');

  // Send via Formspree's JSON API so the visitor stays on the site. Without
  // JavaScript the form still posts normally to Formspree's thank-you page.
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    error.hidden = true;
    button.disabled = true;
    button.textContent = 'Sending…';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (res) {
        if (res.ok) {
          form.hidden = true;
          thanks.hidden = false;
          thanks.focus();
          return;
        }
        return res.json().then(function (data) {
          var msg = data && data.errors && data.errors.map(function (er) { return er.message; }).join(' ');
          throw new Error(msg || 'Something went wrong.');
        });
      })
      .catch(function (err) {
        error.textContent = (err && err.message ? err.message + ' ' : '') +
          'Please try again, or message me on Instagram.';
        error.hidden = false;
      })
      .finally(function () {
        button.disabled = false;
        button.textContent = 'Send';
      });
  });
})();
