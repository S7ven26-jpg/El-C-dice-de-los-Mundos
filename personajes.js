const characterGalleries = [...document.querySelectorAll('[data-reading-gate]')].map(container => {
  const gate = container.dataset.readingGate.split(' ');
  const message = container.querySelector(':scope > p');
  const details = container.querySelector('details');
  const grid = details.querySelector('.character-gallery');
  const template = container.querySelector('template');

  details.addEventListener('toggle', () => {
    if (details.open && !details.hidden && !grid.firstElementChild) {
      grid.append(template.content.cloneNode(true));
    }
  });

  return {gate, message, details, grid};
});

function updateCharacterGalleries() {
  for (const {gate, message, details, grid} of characterGalleries) {
    const unlocked = gate.every(id => completed.has(id));
    message.hidden = unlocked;
    details.hidden = !unlocked;
    if (!unlocked) {
      details.open = false;
      grid.replaceChildren();
    }
  }
}

document.addEventListener('codice-progress', updateCharacterGalleries);
updateCharacterGalleries();
