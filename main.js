/* main.js
Innehåller lite JavaScript som gör att menyn fungerar.
*/
// För att göra så att console.log() outputar i färg kan man använda
// CSS i console.log()-anropet. För att slippa återupprepa mig definierar jag
// allämna stilar här.
const logGreenBoxStyle =
  "color:white;background-color:green;padding:10em;font-family:'Comic Sans MS'";
console.log(
  "%c👋 Hej från main.js!",
  "color:black;background-color:darkgrey;font-size:120%;padding:10em;font-family:'Comic Sans MS'"
);

// Förberedelser!
const textBoxes = document.getElementsByClassName("content-wrapper"); // Hämta textrutor med innehåll på sidan
let activeTextBox = textBoxes[0]; // Sätt första textrutan som aktiv
// Skapa events
const menuItemChanged = new CustomEvent("menuItemChanged", {
  detail: {
    shouldScroll: true,
  },
}); // Event för när fliken i den aktuella menyn ändras
const menuItemScrolledTo = new CustomEvent("menuItemChanged", {
  detail: {
    shouldScroll: false,
  },
}); // Event för när fliken i den aktuella menyn skrollas till
const menuItems = document.getElementsByClassName("menu-item"); // Hämta alla menyflikar
const anchors = document.getElementsByName("anchor"); // Hämta alla dolda länkar

/**
 * Hanterar menyklick för en knapp i menyn.
 * @param {*} item: Elementet som klickades på (this)
 */
function handleMenuClick(item) {
  activeTextBox = document.getElementById(item.dataset.controls); // Hämta textboxen som menysaken hör till och ändra aktiv textbox
  console.log(
    `%c➡️Klick detekterat%cÄndrade aktiv textbox till ${activeTextBox.id}.`,
    logGreenBoxStyle
  );
  document.dispatchEvent(menuItemChanged); // Se till att menyn uppdateras
}

/**
 * Funktion för att gå till den aktiva textboxen och ändra aktivt element i menyn.
 * @param {CustomEvent} e Eventet som triggades. Antingen är det menuItemScrolledTo eller menuItemChanged. Se toppen
 * av filen för de olika skillnaderna. Om en knapp har aktivt klickats på (menuItemChanged) ska vi ju skrolla
 * ner till vart den sektionen befinner sig. Men om det bara är så att man skrollat förbi en menybox (menuItemScrolledTo)
 * ska vi ju bara uppdatera menyn utan att skrolla.
 */
function displayActiveMenuItem(e) {
  console.log(
    `%c➡️Uppdaterar meny%cÄndrar meny och skrollar till aktiv textbox ${activeTextBox.id}...`,
    logGreenBoxStyle
  );
  // e.detail.shouldScroll är ett attribut som finns i eventet och är true om vi ska skrolla och false om vi bara ska uppdatera menyn.
  if (e.detail.shouldScroll) {
    console.log(
      "%c✅Skrollat%c Skrollade till den valda sektionen.",
      logGreenBoxStyle
    );
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
 * Uppdaterar menyn för att visa den flik som just nu ska visas baserat på hur användaren
 * skrollat.
 */
function updateMenuToVisibleItem() {
  let currentScrolledAnchor = null; // Den gömda länk (se html) som är den senaste man har skrollat ner för
  for (const anchor of anchors) {
    // För varje gömd länk
    let anchorRect = anchor.getBoundingClientRect();
    if (anchorRect.top < window.scrollY) {
      // Kolla om användaren har skrollat nedanför länken
      currentScrolledAnchor = anchor;
    }
  }
  // Det finns ett fall när användaren inte har skrollat förbi någon länk. Isåfall är man längst upp på sidan, så den första textboxen ska visas som aktiv.
  if (currentScrolledAnchor === null) {
    currentScrolledAnchor = anchors[0];
  }
  activeTextBox = document.getElementById(currentScrolledAnchor.dataset.for); // Använd data-for attributet på länken för att hitta aktiv textbox
  document.dispatchEvent(menuItemScrolledTo); // Skicka ut event som säger att menyknapp har uppdateras
}

// Lägg till events som anropar funktionerna ovan när de bör anropas.
document.addEventListener("menuItemChanged", displayActiveMenuItem); // Uppdatera menyn när en ny menyflik väljs
document.dispatchEvent(menuItemScrolledTo); // Se till att menyn uppdateras vid sidans start
document.addEventListener("scroll", updateMenuToVisibleItem); // Uppdatera menyn varje gång man skrollar.
