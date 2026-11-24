const homePage = document.querySelector('#home-page');
const sagaPage = document.querySelector('#saga-page');
const journalPage = document.querySelector('#journal-page');
const pageLinks = document.querySelectorAll('[data-page]');
const skipLink = document.querySelector('#skip-link');
const sagaAnchors = new Set(['#saga', '#libros', '#personajes', '#vin', '#alomancia', '#mapas', '#laminas']);

function showPage() {
  const hash = location.hash;
  const isSaga = sagaAnchors.has(hash);
  const isJournal = hash === '#diario' || hash === '#chapter-form';
  const page = isJournal ? journalPage : isSaga ? sagaPage : homePage;
  const changed = page.hidden;
  homePage.hidden = isSaga || isJournal;
  sagaPage.hidden = !isSaga;
  journalPage.hidden = !isJournal;
  const active = isJournal ? 'journal' : isSaga ? 'saga' : 'home';
  for (const link of pageLinks) {
    if (link.dataset.page === active) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  }
  skipLink.href = isJournal ? '#chapter-form' : isSaga ? '#libros' : '#ruta';
  document.title = `${{journal:'Diario', saga:'Nacidos de la Bruma', home:'Mi viaje'}[active]} · El Códice de los Mundos`;
  if (changed) {
    page.classList.remove('page-arriving');
    requestAnimationFrame(() => {
      if (!page.hidden) page.classList.add('page-arriving');
    });
  }
  const anchor = hash === '#laminas' ? 'mapas' : hash.slice(1);
  if (changed && ['inicio','saga','diario'].includes(anchor)) {
    page.querySelector('h1')?.focus({ preventScroll:true });
  }
  if (anchor) document.getElementById(anchor)?.scrollIntoView({ block:'start' });
}

window.addEventListener('hashchange', showPage);
showPage();

const motionControl = document.querySelector('#motion-control');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionKey = 'codice-motion';
let motionOverride;
try {
  motionOverride = localStorage.getItem(motionKey);
} catch {
  // The control still works for the current visit.
}

function syncMotion() {
  const paused = motionOverride ? motionOverride === 'paused' : motionPreference.matches;
  document.documentElement.dataset.motion = paused ? 'paused' : 'playing';
  motionControl.setAttribute('aria-pressed', String(paused));
  motionControl.textContent = paused ? 'Activar efectos' : 'Pausar efectos';
}

motionControl.addEventListener('click', () => {
  motionOverride = document.documentElement.dataset.motion === 'paused' ? 'playing' : 'paused';
  try {
    localStorage.setItem(motionKey, motionOverride);
  } catch {
    // Keep the in-memory selection.
  }
  syncMotion();
});
motionPreference.addEventListener('change', syncMotion);
syncMotion();

for (const field of document.querySelectorAll('.ember-field')) {
  const embers = Array.from({ length: 27 }, (_, index) => {
    const ember = document.createElement('span');
    ember.style.setProperty('--x', `${(index * 37 + 7) % 101}%`);
    ember.style.setProperty('--y', `${(index * 19 + 13) % 95}%`);
    ember.style.setProperty('--delay', `-${index * .73}s`);
    ember.style.setProperty('--duration', `${7 + index % 8}s`);
    ember.style.setProperty('--size', `${1 + index % 3}px`);
    return ember;
  });
  field.append(...embers);
}

let burst;
document.addEventListener('reading-complete', () => {
  if (document.documentElement.dataset.motion === 'paused') return;
  const anchor = !journalPage.hidden ? '#chapter-form' : sagaPage.hidden ? '#progress-panel' : '#saga-books';
  const panel = document.querySelector(anchor);
  panel.classList.remove('reading-spark');
  cancelAnimationFrame(burst);
  burst = requestAnimationFrame(() => panel.classList.add('reading-spark'));
});

const metals = [
  { name:'Hierro', type:'físico', color:'#b5c8da', effect:'Atrae hacia el alomántico los metales externos cercanos.', title:'Atraedor' },
  { name:'Acero', type:'físico', color:'#a2cced', effect:'Empuja los metales externos cercanos, alejándolos del alomántico.', title:'Lanzamonedas' },
  { name:'Estaño', type:'físico', color:'#e7e5cf', effect:'Agudiza los sentidos del alomántico.', title:'Ojo de estaño' },
  { name:'Peltre', type:'físico', color:'#d3b8a1', effect:'Potencia la fuerza y la resistencia físicas.', title:'Brazo de peltre o violento' },
  { name:'Cinc', type:'mental', color:'#9ed9ce', effect:'Intensifica las emociones de otras personas.', title:'Encendedor' },
  { name:'Latón', type:'mental', color:'#e5c984', effect:'Atenúa las emociones de otras personas.', title:'Aplacador' },
  { name:'Cobre', type:'mental', color:'#e1a68a', effect:'Oculta los pulsos alománticos de quienes se encuentran en su radio de efecto.', title:'Ahumador' },
  { name:'Bronce', type:'mental', color:'#dcb38a', effect:'Permite percibir pulsos alománticos cercanos.', title:'Buscador' },
];

const wheel = document.querySelector('#metal-wheel');
const metalInfo = document.querySelector('.metal-info');
const metalGroup = document.querySelector('#metal-group');
const metalName = document.querySelector('#metal-name');
const metalEffect = document.querySelector('#metal-effect');
const metalMisting = document.querySelector('#metal-misting');
const metalButtons = metals.map((metal, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'metal-button';
  button.textContent = metal.name;
  button.style.setProperty('--metal-accent', metal.color);
  const angle = index * Math.PI / 4 - Math.PI / 2;
  button.style.left = `${50 + Math.cos(angle) * 36}%`;
  button.style.top = `${50 + Math.sin(angle) * 36}%`;
  button.setAttribute('aria-pressed', String(index === 0));
  button.addEventListener('click', () => selectMetal(index));
  return button;
});
const wheelCenter = document.createElement('span');
wheelCenter.className = 'wheel-center';
wheelCenter.textContent = '✧';
wheelCenter.setAttribute('aria-hidden','true');
wheel.append(wheelCenter, ...metalButtons);

function selectMetal(index) {
  const metal = metals[index];
  for (const [position, button] of metalButtons.entries()) button.setAttribute('aria-pressed', String(position === index));
  wheel.style.setProperty('--active-metal', metal.color);
  metalInfo.style.setProperty('--active-metal', metal.color);
  metalGroup.textContent = `Metal ${metal.type}`;
  metalName.textContent = metal.name;
  metalEffect.textContent = metal.effect;
  metalMisting.textContent = `Brumoso · ${metal.title}`;
  if (document.documentElement.dataset.motion !== 'paused' && typeof metalInfo.animate === 'function') {
    metalInfo.getAnimations().forEach(animation => animation.cancel());
    metalInfo.animate([{ opacity:.55, transform:'translateY(6px)' }, { opacity:1, transform:'translateY(0)' }], { duration:380, easing:'ease-out' });
  }
}
