// Contact form — submit via fetch, show inline result. Falls back to standard POST if JS disabled.
(function () {
  const form = document.getElementById('contact-form');
  const result = document.getElementById('form-result');
  if (!form || !result) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    result.innerHTML = '';

    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = 'Sending…';

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' },
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        result.innerHTML = '<div class="alert ok"><strong>Thanks — message received.</strong> I\'ll reply within 24 hours, and a confirmation is on its way to your inbox. Want to move faster? <a href="https://calendar.app.google/vXohio54MnjJy57X7" target="_blank" rel="noopener">Book a free 20-minute call →</a></div>';
        form.reset();
        if (typeof gtag === 'function') gtag('event', 'generate_lead', { tool: 'contact_form' });
      } else {
        const msg = (json && json.error) ? json.error : 'Something went wrong. Please email rob@chiefgrowthengineer.com.';
        result.innerHTML = '<div class="alert error"><strong>Could not send.</strong> ' + msg + '</div>';
      }
    } catch (err) {
      result.innerHTML = '<div class="alert error"><strong>Network error.</strong> Please email rob@chiefgrowthengineer.com directly.</div>';
    } finally {
      btn.disabled = false;
      btn.innerHTML = original;
    }
  });
})();
