(function () {
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var UTM_STORAGE_KEY = 'qm_utm_params';

  function captureUtmParams() {
    var params = new URLSearchParams(window.location.search);
    var found = {};
    var hasAny = false;

    UTM_KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value) {
        found[key] = value.slice(0, 255);
        hasAny = true;
      }
    });

    if (hasAny) {
      try {
        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(found));
      } catch (e) {
        // sessionStorage unavailable (private mode, etc.) — fall through, still usable this pageview
      }
      return found;
    }

    try {
      var stored = sessionStorage.getItem(UTM_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      // ignore
    }

    return {};
  }

  function initQuoteForm(form) {
    var button = form.querySelector('button[type="submit"]');
    var statusEl = document.createElement('p');
    statusEl.className = 'form-note form-status';
    statusEl.setAttribute('role', 'status');
    statusEl.style.display = 'none';
    form.appendChild(statusEl);

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var data = {
        name: form.elements.name.value,
        org: form.elements.org.value,
        phone: form.elements.phone.value,
        sqft: form.elements.sqft.value,
        notes: form.elements.notes.value,
        utm: captureUtmParams(),
        page_url: window.location.href,
      };

      button.disabled = true;
      var originalLabel = button.textContent;
      button.textContent = 'Sending...';
      statusEl.style.display = 'none';

      fetch('/api/submit-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (response) {
          return response.json().then(function (json) {
            return { ok: response.ok, json: json };
          });
        })
        .then(function (result) {
          if (result.ok) {
            form.reset();
            statusEl.textContent = 'Thanks! We received your request and will call you back next business day.';
            statusEl.style.color = '#1a6b1a';
          } else {
            statusEl.textContent = (result.json && result.json.error) || 'Something went wrong. Please call us instead.';
            statusEl.style.color = '#a3221f';
          }
          statusEl.style.display = 'block';
        })
        .catch(function () {
          statusEl.textContent = 'Something went wrong. Please call us instead.';
          statusEl.style.color = '#a3221f';
          statusEl.style.display = 'block';
        })
        .finally(function () {
          button.disabled = false;
          button.textContent = originalLabel;
        });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    captureUtmParams(); // persist UTM params from the landing page even if the form isn't on this page
    var forms = document.querySelectorAll('form[data-quote-form]');
    forms.forEach(initQuoteForm);
  });
})();
