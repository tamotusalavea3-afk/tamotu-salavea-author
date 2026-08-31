const menu = document.querySelector('.menu');
const nav = document.querySelector('nav');

if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });

  document.querySelectorAll('nav a').forEach((a) => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open navigation');
    });
  });
}

// Library filters
const filters = document.querySelectorAll('.filter');
if (filters.length) {
  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      filters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      document.querySelectorAll('.book-card[data-status]').forEach((card) => {
        card.classList.toggle('hidden', filter !== 'all' && filter !== card.dataset.status);
      });

      document.querySelectorAll('.catalog-grid').forEach((grid) => {
        const cards = [...grid.querySelectorAll('.book-card[data-status]')];
        const section = grid.closest('section');
        if (!section || !cards.length) return;
        section.classList.toggle(
          'filter-section-hidden',
          filter !== 'all' && !cards.some((card) => !card.classList.contains('hidden'))
        );
      });
    });
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

// Reader reviews
const API = window.REVIEWS_API_URL || '/api/reviews';
const clean = (s) => String(s || '').trim();
const escapeHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
}[c]));

async function loadApprovedReviews(form) {
  const book = form.dataset.book;
  const empty = form.parentElement.querySelector('.review-empty');
  const old = form.parentElement.querySelector('.review-list');
  if (old) old.remove();

  const loading = document.createElement('p');
  loading.className = 'review-loading';
  loading.textContent = 'Loading reader reviews…';
  form.parentElement.insertBefore(loading, form);

  try {
    const r = await fetch(`${API}?book=${encodeURIComponent(book)}`);
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Unable to load reviews.');

    loading.remove();
    if (!data.reviews?.length) {
      if (empty) empty.hidden = false;
      return;
    }

    if (empty) empty.hidden = true;
    const list = document.createElement('div');
    list.className = 'review-list';
    list.innerHTML = data.reviews.map((x) => `
      <article class="review-card">
        <div class="review-card-stars" aria-label="${x.rating} out of 5 stars">${'★'.repeat(x.rating)}${'☆'.repeat(5 - x.rating)}</div>
        <p>${escapeHTML(x.review_text)}</p>
        <div class="review-card-meta">— ${escapeHTML(x.reviewer_name)}</div>
      </article>`).join('');
    form.parentElement.insertBefore(list, form);
  } catch (err) {
    loading.remove();
    if (empty) empty.hidden = false;
  }
}

document.querySelectorAll('.review-form').forEach((form) => {
  loadApprovedReviews(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const note = form.querySelector('.review-note');
    const button = form.querySelector('button[type="submit"]');
    const fd = new FormData(form);
    const payload = {
      book: form.dataset.book,
      name: clean(fd.get('name')),
      rating: Number(fd.get('rating')),
      review: clean(fd.get('review')),
      website: ''
    };

    if (!payload.name || !payload.review || !payload.rating) {
      note.textContent = 'Please complete your name, rating, and review.';
      return;
    }

    button.disabled = true;
    note.textContent = 'Submitting your review…';

    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Unable to submit review.');
      form.reset();
      note.textContent = 'Thank you! Your review was received and will be published after manual review.';
    } catch (err) {
      note.textContent = err.message || 'Unable to submit your review right now. Please try again later.';
    } finally {
      button.disabled = false;
    }
  });
});
