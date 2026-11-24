const diaryKey = 'codice-diario-pozo-v1';
const diaryFormat = 'el-codice-diario';
const diaryBook = 'pozo';
const epilogue = 61;
const chapterSelect = document.querySelector('#chapter-select');
const noteInput = document.querySelector('#journal-note');
const fileInput = document.querySelector('#journal-file');
const feedback = document.querySelector('#journal-feedback');
const resourceList = document.querySelector('#journal-resources');
const noteList = document.querySelector('#saved-notes');

function chapterLabel(step) {
  if (step === 0) return 'Antes de empezar';
  if (step === 1) return 'Prólogo';
  if (step === epilogue) return 'Epílogo';
  return `Capítulo ${step - 1}`;
}

function validStep(step) {
  return Number.isInteger(step) && step >= 0 && step <= epilogue;
}

function noteKey(note) {
  return JSON.stringify([note.step, note.text]);
}

function validateDiary(data) {
  if (!data || !validStep(data.step) || !Array.isArray(data.notes)) throw Error('Diario inválido');
  const notes = new Map();
  for (const note of data.notes) {
    if (!note || !validStep(note.step) || typeof note.text !== 'string' || !note.text.trim() || note.text.length > 6000) {
      throw Error('Nota inválida');
    }
    notes.set(noteKey(note), {step:note.step, text:note.text});
  }
  return {step:data.step, notes:[...notes.values()]};
}

let diary = {step:0, notes:[]};
try {
  const stored = localStorage.getItem(diaryKey);
  if (stored) diary = validateDiary(JSON.parse(stored));
} catch {
  // The diary remains available if storage is empty or unreadable.
}

for (let step = 0; step <= epilogue; step += 1) {
  const option = el('option','',chapterLabel(step));
  option.value = String(step);
  chapterSelect.append(option);
}

const diaryResources = [
  {step:0,title:'Atlas de Luthadel',description:'Ten a mano el mapa de la ciudad y su leyenda.',href:'#mapas'},
  {step:1,title:'Guía de los ocho metales',description:'Repasa los efectos de la alomancia conocidos en el primer libro.',href:'#alomancia'},
  {step:11,title:'Pausa de lectura · Capítulo 10',description:'¿Qué pregunta sobre Luthadel te gustaría poder responder? Anota una teoría y la pista que la sostiene.'},
  {step:31,title:'Pausa de lectura · Capítulo 30',description:'Vuelve a tu primera teoría. Escribe qué evidencia la refuerza y cuál podría contradecirla.'},
  {step:61,title:'Balance del libro',description:'Antes de avanzar, guarda tus tres momentos favoritos y una pregunta pendiente.'},
];

function effectiveStep() {
  return completed.has(diaryBook) ? epilogue : diary.step;
}

function updateDiaryAtlas() {
  const entry = atlasEntries.find(({book}) => book[0] === diaryBook);
  const step = effectiveStep();
  entry.button.classList.toggle('atlas-in-progress', step > 0 && step < epilogue);
  entry.orb.style.setProperty('--chapter-angle', `${step / epilogue * 360}deg`);
  if (step > 0 && step < epilogue) {
    entry.button.setAttribute('aria-label', `${routePositions.get(diaryBook)}. ${titles.get(diaryBook)}, leído hasta ${chapterLabel(step)}`);
  } else if (!completed.has(diaryBook)) {
    const state = entry.button.dataset.state === 'next' ? 'siguiente' : 'pendiente';
    entry.button.setAttribute('aria-label', `${routePositions.get(diaryBook)}. ${titles.get(diaryBook)}, ${state}`);
  }
  const link = document.querySelector('#continue-pozo');
  link.textContent = step && step < epilogue ? `Continuar diario · ${chapterLabel(step)} terminado` : 'Abrir diario de lectura';
}

function renderDiaryProgress() {
  const step = effectiveStep();
  chapterSelect.value = String(step);
  document.querySelector('#chapter-progress').value = step;
  document.querySelector('#chapter-meter').textContent = `${chapterLabel(step)} · ${Math.round(step / epilogue * 100)} %`;
  document.querySelector('#note-chapter').textContent = chapterLabel(step);
  const available = diaryResources.filter(resource => step >= resource.step);
  resourceList.replaceChildren(...available.map(({title,description,href}) => {
    const row = el('li','');
    const heading = el(href ? 'a' : 'strong','',title);
    if (href) heading.href = href;
    row.append(heading, el('p','muted',description));
    return row;
  }));
  const remaining = diaryResources.length - available.length;
  document.querySelector('#locked-resources').textContent = remaining ? `${remaining} por desbloquear.` : 'Todos los recursos están disponibles.';
  updateDiaryAtlas();
}

function renderNotes() {
  noteList.replaceChildren(...diary.notes.slice().reverse().map(note => {
    const item = el('details','');
    item.append(el('summary','',chapterLabel(note.step)),el('p','note-text',note.text));
    const remove = el('button','','Eliminar nota');
    remove.type = 'button';
    remove.addEventListener('click', () => {
      if (!confirm('¿Eliminar esta nota del diario?')) return;
      diary.notes = diary.notes.filter(saved => noteKey(saved) !== noteKey(note));
      const stored = saveDiary();
      renderNotes();
      noteInput.focus();
      reportSave('Nota eliminada.', stored);
    });
    item.append(remove);
    return item;
  }));
}

function saveDiary() {
  try {
    localStorage.setItem(diaryKey, JSON.stringify(diary));
    return true;
  } catch {
    return false;
  }
}

function reportSave(message, durable) {
  feedback.textContent = durable ? message : 'Cambios disponibles en esta sesión. Exporta una copia para conservarlos.';
}

document.querySelector('#chapter-form').addEventListener('submit', event => {
  event.preventDefault();
  diary.step = Number(chapterSelect.value);
  const isFinished = diary.step === epilogue;
  let progressStored = true;
  if (completed.has(diaryBook) !== isFinished) progressStored = toggleBook(diaryBook, isFinished);
  const diaryStored = saveDiary();
  renderDiaryProgress();
  reportSave(isFinished ? 'Epílogo registrado. El libro quedó marcado como leído.' : 'Avance guardado.', diaryStored && progressStored);
});

document.querySelector('#note-form').addEventListener('submit', event => {
  event.preventDefault();
  const text = noteInput.value.trim();
  if (!text) {
    feedback.textContent = 'Escribe una nota antes de guardarla.';
    return;
  }
  const note = {step:effectiveStep(), text};
  if (!diary.notes.some(saved => noteKey(saved) === noteKey(note))) diary.notes.push(note);
  noteInput.value = '';
  const stored = saveDiary();
  renderNotes();
  reportSave('Nota guardada.', stored);
});

document.querySelector('#export-journal').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify({format:diaryFormat, version:1, completed:[...completed], diary},null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `El-Codice-copia-${new Date().toISOString().slice(0,10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  feedback.textContent = 'Copia preparada. Puedes guardarla en Archivos o iCloud Drive.';
});

document.querySelector('#import-journal').addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];
  if (!file) return;
  fileInput.value = '';
  if (file.size > 4 * 1024 * 1024) {
    feedback.textContent = 'La copia supera el límite de 4 MB.';
    return;
  }
  try {
    const backup = JSON.parse(await file.text());
    if (backup?.format !== diaryFormat || backup.version !== 1 || !Array.isArray(backup.completed) || backup.completed.some(id => typeof id !== 'string')) {
      throw Error('Formato incompatible');
    }
    const incoming = validateDiary(backup.diary);
    const notes = new Map([...diary.notes,...incoming.notes].map(note => [noteKey(note),note]));
    diary = {step:Math.max(diary.step,incoming.step),notes:[...notes.values()]};
    for (const id of backup.completed) if (titles.has(id)) completed.add(id);
    if (diary.step === epilogue) completed.add(diaryBook);
    const chapterStored = saveDiary();
    const readingStored = saveReadingProgress();
    renderNotes();
    reportSave('Copia incorporada. Tus notas y lecturas se combinaron.', chapterStored && readingStored);
  } catch {
    feedback.textContent = 'El archivo seleccionado no es una copia válida de El Códice.';
  }
});

document.addEventListener('codice-progress', () => {
  if (!completed.has(diaryBook) && diary.step === epilogue) {
    diary.step = epilogue - 1;
    saveDiary();
  }
  renderDiaryProgress();
});
renderDiaryProgress();
renderNotes();
