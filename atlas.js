const atlasBooks = document.querySelector('#atlas-books');
const atlasSvg = document.querySelector('#atlas-lines');
const atlasTrace = document.querySelector('#atlas-trace');
const atlasReadTrace = document.querySelector('#atlas-read-trace');
const atlasCurrentTrace = document.querySelector('#atlas-current-trace');
const bookDialog = document.querySelector('#atlas-book-dialog');
const atlasToggle = document.querySelector('#atlas-book-toggle');
const atlasStages = ['#d9a368','#ead094','#86c3f4','#f09eab','#e59a76','#8edbc3','#c6b3f0','#a1aedf'];
let selectedEntry;

const atlasEntries = principal.map(({book, group}, index) => {
  const item = el('li', 'atlas-stop');
  const button = el('button','atlas-node');
  const orb = el('span','atlas-world');
  const order = el('span','atlas-number',String(index + 1));
  const name = el('span','atlas-name',book[1]);
  const stageIndex = principalGroups.indexOf(group);
  button.type = 'button';
  button.setAttribute('aria-haspopup','dialog');
  orb.setAttribute('aria-hidden','true');
  item.style.setProperty('--world-color',atlasStages[stageIndex]);
  item.style.setProperty('--world-x', `${(stageIndex % 4) * 100 / 3}%`);
  item.style.setProperty('--world-y', stageIndex < 4 ? '0%' : '100%');
  orb.append(order);
  button.append(orb,name);
  item.append(button);
  const entry = {book, group, item, button, orb};
  button.addEventListener('click', () => {
    if (typeof bookDialog.showModal !== 'function') {
      jumpToBook(book[0]);
      return;
    }
    selectedEntry = entry;
    updateBookDialog();
    bookDialog.showModal();
  });
  return entry;
});
atlasBooks.append(...atlasEntries.map(({item}) => item));

function updateBookDialog() {
  if (!selectedEntry) return;
  const {book, group} = selectedEntry;
  const [id, title, original, note] = book;
  const done = completed.has(id);
  const warning = readingWarning(id);
  document.querySelector('#atlas-book-stage').textContent = `${routePositions.get(id)} de ${principal.length} · ${group.title}`;
  document.querySelector('#atlas-book-title').textContent = title;
  document.querySelector('#atlas-book-original').textContent = original === title ? '' : original;
  document.querySelector('#atlas-book-note').textContent = note || group.note;
  document.querySelector('#atlas-book-warning').textContent = warning;
  atlasToggle.textContent = done ? '✓ Leído · Desmarcar' : 'Marcar como leído';
  document.querySelector('#atlas-book-journal').hidden = id !== 'pozo';
}

atlasToggle.addEventListener('click', () => {
  const id = selectedEntry.book[0];
  toggleBook(id, !completed.has(id));
});

bookDialog.addEventListener('close', () => {
  selectedEntry?.button.focus({ preventScroll:true });
  selectedEntry = undefined;
});

const mediumAtlas = matchMedia('(max-width: 900px)');
const narrowAtlas = matchMedia('(max-width: 560px)');

function positionAtlas() {
  const columns = narrowAtlas.matches ? 3 : mediumAtlas.matches ? 4 : 6;
  for (const [index, {item}] of atlasEntries.entries()) {
    const row = Math.floor(index / columns);
    const step = index % columns;
    item.style.gridColumn = row % 2 === 0 ? step + 1 : columns - step;
    item.style.gridRow = row + 1;
    item.style.setProperty('--world-nudge', `${[2,-6,4,-4,7,-3][index % 6]}px`);
  }
  drawAtlas();
}

function linkSegment(a, b, index) {
  const bend = index % 2 === 0 ? 10 : -10;
  if (Math.abs(a.x - b.x) < 24) {
    const y = (a.y + b.y) / 2;
    const offset = 26 * (a.x > atlasSvg.clientWidth / 2 ? 1 : -1);
    return `M${a.x},${a.y} C${a.x + offset},${y} ${b.x + offset},${y} ${b.x},${b.y}`;
  }
  const x = (a.x + b.x) / 2;
  return `M${a.x},${a.y} Q${x},${(a.y + b.y) / 2 + bend} ${b.x},${b.y}`;
}

function drawAtlas() {
  const rect = atlasSvg.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  atlasSvg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
  const points = atlasEntries.map(({orb}) => {
    const node = orb.getBoundingClientRect();
    return {x:node.left + node.width / 2 - rect.left,y:node.top + node.height / 2 - rect.top};
  });
  const connections = points.slice(1).map((point,index) => linkSegment(points[index],point,index));
  const firstPending = atlasEntries.findIndex(({book}) => !completed.has(book[0]));
  atlasTrace.setAttribute('d', connections.join(' '));
  atlasReadTrace.setAttribute('d', connections.filter((_, index) => completed.has(atlasEntries[index].book[0]) && completed.has(atlasEntries[index + 1].book[0])).join(' '));
  atlasCurrentTrace.setAttribute('d', firstPending > 0 ? connections[firstPending - 1] : '');
}

function syncAtlas() {
  const next = principal.find(({book}) => !completed.has(book[0]))?.book[0];
  for (const {book, button} of atlasEntries) {
    const [id, title] = book;
    const state = completed.has(id) ? 'read' : id === next ? 'next' : 'pending';
    button.dataset.state = state;
    button.setAttribute('aria-label', `${routePositions.get(id)}. ${title}, ${{read:'leído',next:'siguiente',pending:'pendiente'}[state]}`);
  }
  drawAtlas();
  updateBookDialog();
}

for (const breakpoint of [mediumAtlas, narrowAtlas]) breakpoint.addEventListener('change',positionAtlas);
new ResizeObserver(drawAtlas).observe(atlasBooks);
document.addEventListener('codice-progress', syncAtlas);
positionAtlas();
syncAtlas();

document.querySelector('#atlas-book-journal').addEventListener('click', () => bookDialog.close());

document.addEventListener('reading-complete', event => {
  if (document.documentElement.dataset.motion === 'paused') return;
  const position = routePositions.get(event.detail);
  if (!position || position >= atlasEntries.length) return;
  const segment = atlasTrace.getAttribute('d')?.match(/M[^M]*/g)?.[position - 1];
  if (!segment) return;
  const sweep = document.querySelector('#atlas-sweep');
  sweep.setAttribute('d',segment);
  sweep.classList.remove('atlas-sweep');
  sweep.removeAttribute('hidden');
  requestAnimationFrame(() => sweep.classList.add('atlas-sweep'));
});
document.querySelector('#atlas-sweep').addEventListener('animationend', event => {
  event.currentTarget.setAttribute('hidden','');
});
