const vinLockedMessage = document.querySelector('#vin-locked');
const vinExtra = document.querySelector('#vin-extra-art');
const vinExtraGrid = document.querySelector('#vin-extra-grid');
const vinExtraArt = document.querySelector('#vin-extra-template');

function updateCharacterGallery() {
  const unlocked = principalGroups[0].books.every(([id]) => completed.has(id));
  vinLockedMessage.hidden = unlocked;
  vinExtra.hidden = !unlocked;
  if (!unlocked) {
    vinExtra.open = false;
    vinExtraGrid.replaceChildren();
  }
}

vinExtra.addEventListener('toggle', () => {
  if (vinExtra.open && !vinExtra.hidden && !vinExtraGrid.firstElementChild) {
    vinExtraGrid.append(vinExtraArt.content.cloneNode(true));
  }
});
document.addEventListener('codice-progress', updateCharacterGallery);
updateCharacterGallery();
