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
let lightDarkForceOff = false;

colorPicker.addEventListener("change", (event) => {
  // Use browser color picker to set the grid draw color
  // Unset any other draw style settings
  color = event.target.value;
  random = false;
  lightDarkForceOff = true;
  lightDarkToggle();
});
solidButton.addEventListener("click", () => {
  // Use the color from the picker to set the grid draw color
  // Unset any other draw style settings
  random = false;
  color = colorPicker.value;
  lightDarkForceOff = true;
  lightDarkToggle();
});
randomButton.addEventListener("click", () => {
  // Use a random color for every square in the grid when drawing
  // Unset any other draw style settings
  random = true;
  lightDarkForceOff = true;
  lightDarkToggle();
});
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
  // Create a single div, add it to the grid style, and add the event listener
  // for drawing
  let div = document.createElement("div");
  div.setAttribute("class", "square");
  div.addEventListener("pointerover", onMouseOver);
  return div;
}

function createRow(len) {
  // Create a single row of divs for the grid and set style
  let row = document.createElement("div");
  row.setAttribute("class", "row");
  for (let i = 0; i < len; i++) {
    row.appendChild(createDiv());
  }
  return row;
}

function createGrid(len) {
  // Create a full grid out of rows of divs
  // Uses the same len for height and width so always makes a square
  for (row of [...sketch.childNodes]) {
    sketch.removeChild(row);
  }
  for (let i = 0; i < len; i++) {
    sketch.appendChild(createRow(len));
  }
}

function onMouseOver(event) {
  // Change color of divs in grid as the mouse passes over them
  // The effect applied depends on global vars color, random, and lightDark
  if (lightDark) {
    if (!event.target.style.backgroundColor) {
      // Skip squares that haven't been drawn on
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
  // Responsive style change for buttons
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
  if (lightDarkForceOff) {
    // Couldn't pass a bool directly to the function simply, so used a global
    // var as a flag that tells a call to this function to remove the effects
    // and button styles
    lightenText.classList.remove("light-dark");
    darkenText.classList.remove("light-dark");
    lightDark = 0;
    lightDarkForceOff = false;
    return;
  }
  // lightDark cycles through states 0, 1, 2 when this function is called,
  // which tells the rest of this function and onMouseOver which effect is
  // active. 0 = off, 1 = lighten, 2 = darken
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
