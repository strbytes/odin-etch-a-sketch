const sketch = document.querySelector("#sketch");
const colorPicker = document.querySelector("#color-picker");
const buttons = document.querySelectorAll(".button");
const solidButton = document.querySelector("#solid-color");
const randomButton = document.querySelector("#random-color");
const lightDarkButton = document.querySelector("#light-dark");
const lightenText = document.querySelector("#lighten");
const darkenText = document.querySelector("#darken");
const clearButton = document.querySelector("#clear");
const gridSizeSelector = document.querySelector("#grid-size");
const gridSizeLabel = document.querySelector("#slider-label");

let random = false;
let color = colorPicker.value;
let lightDark = 0;

colorPicker.addEventListener("change", (event) => {
  color = event.target.value;
});
solidButton.addEventListener("click", () => {
  random = false;
  color = colorPicker.value;
});

solidButton.addEventListener("click", () => {
  random = false;
  color = colorPicker.value;
});
randomButton.addEventListener("click", () => (random = true));
lightDarkButton.addEventListener("click", lightDarkToggle);
clearButton.addEventListener("click", clearGrid);
gridSizeSelector.addEventListener("change", gridSizeChange);
gridSizeSelector.addEventListener("input", gridSizeLabelChange);

for (let button of [...buttons]) {
  if (button.id === "grid-slider") continue;
  button.addEventListener("mousedown", buttonClick);
  button.addEventListener("mouseup", buttonUnclick);
}

function createDiv() {
  let div = document.createElement("div");
  div.setAttribute("class", "square");
  div.addEventListener("pointerover", onMouseOver);
  return div;
}

function createRow(len) {
  let row = document.createElement("div");
  row.setAttribute("class", "row");
  for (let i = 0; i < len; i++) {
    row.appendChild(createDiv());
  }
  return row;
}

function createGrid(len) {
  for (row of [...sketch.childNodes]) {
    sketch.removeChild(row);
  }
  for (let i = 0; i < len; i++) {
    sketch.appendChild(createRow(len));
  }
}

function onMouseOver(event) {
  // Change color of divs in grid as the mouse passes over them
  // The color change depends on global vars color and lightDark
  if (lightDark) {
    if (!event.target.style.backgroundColor) {
      return;
    }
    divColor = parseColor(event.target.style.backgroundColor);
    amount = lightDark === 1 ? 25 : -25;
    newColor = lightDarkColor(divColor, amount);
    event.target.style.backgroundColor = newColor;
  } else {
    if (random) {
      // Choose a random color each time if random is true
      color = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
    }
    event.target.style.backgroundColor = color;
  }
}

function buttonClick(event) {
  if (event.target.className === "") {
    // swap target on .button, not the spans on lighten/darken
    event.target.parentNode.classList.remove("button");
    event.target.parentNode.classList.add("button-click");
  } else {
    event.target.classList.remove("button");
    event.target.classList.add("button-click");
  }
}

function buttonUnclick(event) {
  if (event.target.className === "" || event.target.nodeName === "SPAN") {
    // swap target on .button, not the spans on lighten/darken
    event.target.parentNode.classList.remove("button-click");
    event.target.parentNode.classList.add("button");
  } else {
    event.target.classList.remove("button-click");
    event.target.classList.add("button");
  }
}

function clearGrid() {
  for (row of [...sketch.childNodes]) {
    for (square of [...row.childNodes]) {
      square.style.backgroundColor = "white";
    }
  }
}

function lightDarkToggle() {
  // Toggle the button indicators on lightDark
  lightDark += 1;
  if (lightDark % 3 === 1) {
    lightenText.classList.add("light-dark");
  } else if (lightDark % 3 === 2) {
    lightenText.classList.remove("light-dark");
    darkenText.classList.add("light-dark");
  } else {
    darkenText.classList.remove("light-dark");
    lightDark = 0;
  }
}

function parseColor(input) {
  // extract color values from RGB
  return input.split("(")[1].split(")")[0].split(",");
}

function lightDarkColor(divColor, amount) {
  // Apply color changes
  newColor = "rgb(";
  for (rgb of divColor) {
    rgb = parseInt(rgb);
    rgb += amount;
    if (rgb < 0) rgb = 0;
    if (rgb > 255) rgb = 255;
    newColor += rgb + ", ";
  }
  newColor = newColor.slice(0, -2) + ")";
  return newColor;
}

function gridSizeChange(event) {
  size = event.target.value;
  createGrid(size);
}

function gridSizeLabelChange(event) {
  size = event.target.value;
  gridSizeLabel.textContent = `Grid size: ${size} x ${size}`;
}

createGrid(gridSizeSelector.value);
