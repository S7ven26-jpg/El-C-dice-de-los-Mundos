const viewer = document.querySelector('#reference-viewer');
const viewerTitle = document.querySelector('#reference-title');
const viewerImage = document.querySelector('#reference-image');
const originalLink = document.querySelector('#reference-original');
const zoom = document.querySelector('#reference-zoom');
const viewport = viewer.querySelector('.reference-scroll');
let activeLink;

function resetZoom() {
  viewerImage.classList.remove('reference-zoomed');
  zoom.setAttribute('aria-pressed', 'false');
  zoom.textContent = 'Ampliar';
  viewport.scrollTo(0, 0);
}

for (const link of document.querySelectorAll('[data-reference]')) {
  link.addEventListener('click', event => {
    if (typeof viewer.showModal !== 'function' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    activeLink = link;
    viewerTitle.textContent = link.dataset.reference;
    viewerImage.alt = link.querySelector('img')?.alt || link.dataset.reference;
    viewerImage.src = link.href;
    originalLink.href = link.href;
    resetZoom();
    viewer.showModal();
  });
}

zoom.addEventListener('click', () => {
  const expanded = viewerImage.classList.toggle('reference-zoomed');
  zoom.setAttribute('aria-pressed', String(expanded));
  zoom.textContent = expanded ? 'Ajustar a la pantalla' : 'Ampliar';
  if (!expanded) viewport.scrollTo(0, 0);
});

viewer.addEventListener('close', () => {
  viewerImage.removeAttribute('src');
  activeLink?.focus({ preventScroll: true });
});
