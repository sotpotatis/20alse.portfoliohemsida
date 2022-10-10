/* main.js
Innehåller lite JavaScript som gör att menyn fungerar.
*/
console.log("Hej från main.js!");

// Hämta textrutor med innehåll på sidan
const textBoxes = document.getElementsByClassName("content-wrapper");
console.log(textBoxes);
let activeTextBox = textBoxes[0]; // Sätt första textrutan som aktiv
const menuItemChanged = new CustomEvent("menuItemChanged", { detail: true }); // Event för när den aktuella menygrejen ändras
const menuItemScrolledTo = new CustomEvent("menuItemChanged", {
  detail: false,
});
const menuItems = document.getElementsByClassName("menu-item");
const anchors = document.getElementsByName("anchor");

/**
 * Hanterar menyklick för en grej i menyn.
 * @param {*} item: Saken som klickades på (this)
 */
function handleMenuClick(item) {
  activeTextBox = document.getElementById(item.dataset.controls); // Hämta textboxen som menysaken hör till och ändra aktiv textbox
  console.log(`Ändrade aktiv textbox till ${activeTextBox.id}.`);
  document.dispatchEvent(menuItemChanged); // Se till att menyn uppdateras
}

/**
 * Funktion för att gå till den aktiva textboxen och ändra aktivt element i menyn.
 */
function displayActiveMenuItem(e) {
  console.log(
    `Ändrar meny och skrollar till aktiv textbox ${activeTextBox.id}...`
  );
  if (e.detail) {
    // Säger om vi ska skrolla eller bara uppdatera menyn
    activeTextBox.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  }
  // Se till att menyn matchar den nyvalda saken
  for (const menuItem of menuItems) {
    if (menuItem.dataset.controls === activeTextBox.id) {
      menuItem.dataset.active = "true";
    } else {
      menuItem.dataset.active = "false";
    }
  }
}

/**
 * Öppnar en URL i en ny flik.
 * @param {string} url Länken som ska öppnas.
 */
function openURL(url) {
  window.open(url, "_blank").focus();
}

/**
 * Uppdaterar menyn
 */
function updateMenuToVisibleItem() {
  let currentScrolledAnchor = null; // Den gömda länk (se html) som är den senaste man har skrollat ner för
  for (const anchor of anchors) {
    // För varje gömd länk
    let anchorRect = anchor.getBoundingClientRect();
    if (window.scrollY > anchorRect.top) {
      // Kolla om användaren har skrollat nedanför länken
      currentScrolledAnchor = anchor;
    }
  }
  // Det finns ett fall när användaren inte har skrollat förbi någon länk. Isåfall är man längst upp på sidan, så den första länken ska visas.
  if (currentScrolledAnchor === null) {
    currentScrolledAnchor = anchors[0];
  }
  activeTextBox = document.getElementById(currentScrolledAnchor.dataset.for); // Använd data-for attributet på länken för att hitta aktiv textbox
  document.dispatchEvent(menuItemScrolledTo); // Skicka ut event som säger att menyknapp har uppdateras
}

document.addEventListener("menuItemChanged", displayActiveMenuItem); // Uppdatera menyn när en ny menyflik väljs
document.dispatchEvent(menuItemScrolledTo); // Se till att menyn uppdateras
setInterval(updateMenuToVisibleItem, 500); // Uppdatera menyn 2 gånger per sekund
