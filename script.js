const sketch = document.querySelector("#sketch");
const colorPicker = document.querySelector("#color-picker");
const buttons = document.querySelectorAll(".button");
const solidButton = document.querySelector("#solid-color");
const randomButton = document.querySelector("#random-color");
const lightDarkButton = document.querySelector("#light-dark-button");
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
  colorButtonToggle();
});
solidButton.addEventListener("click", () => {
  // Use the color from the picker to set the grid draw color
  // Unset any other draw style settings
  random = false;
  color = colorPicker.value;
  lightDarkForceOff = true;
  lightDarkToggle();
  colorButtonToggle();
});
randomButton.addEventListener("click", () => {
  // Use a random color for every square in the grid when drawing
  // Unset any other draw style settings
  random = true;
  lightDarkForceOff = true;
  lightDarkToggle();
  colorButtonToggle();
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

function colorButtonToggle() {
  // Check the state of random and lightDark to decide which button to
  // highlight
  if (lightDark) {
    solidButton.children[0].classList.remove("option-select");
    randomButton.children[0].classList.remove("option-select");
  } else if (random) {
    solidButton.children[0].classList.remove("option-select");
    randomButton.children[0].classList.add("option-select");
  } else {
    solidButton.children[0].classList.add("option-select");
    randomButton.children[0].classList.remove("option-select");
  }
}

function lightDarkToggle() {
  // Toggle the button indicators on lightDark
  if (lightDarkForceOff) {
    // Couldn't pass a bool directly to the function simply, so used a global
    // var as a flag that tells a call to this function to remove the effects
    // and button styles
    lightenText.classList.remove("option-select");
    darkenText.classList.remove("option-select");
    lightDark = 0;
    lightDarkForceOff = false;
    colorButtonToggle();
    return;
  }
  // lightDark cycles through states 0, 1, 2 when this function is called,
  // which tells the rest of this function and onMouseOver which effect is
  // active. 0 = off, 1 = lighten, 2 = darken
  lightDark += 1;
  if (lightDark % 3 === 1) {
    lightenText.classList.add("option-select");
  } else if (lightDark % 3 === 2) {
    lightenText.classList.remove("option-select");
    darkenText.classList.add("option-select");
  } else {
    darkenText.classList.remove("option-select");
    lightDark = 0;
  }
  colorButtonToggle();
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

function clearGrid() {
  for (row of [...sketch.childNodes]) {
    for (square of [...row.childNodes]) {
      square.style.backgroundColor = "white";
    }
  }
  // Turn off lighten/darken feature when grid is cleared (does nothing on
  // empty grids)
  lightDarkForceOff = true;
  lightDarkToggle();
  colorButtonToggle();
}

function gridSizeChange(event) {
  // Change size of grid (resets with all blank squares)
  size = event.target.value;
  createGrid(size);
  // Turn off lighten/darken feature when grid is changed (does nothing on
  // empty grids)
  lightDarkForceOff = true;
  lightDarkToggle();
  colorButtonToggle();
}

function gridSizeLabelChange(event) {
  // Adjust label of grid size selector
  size = event.target.value;
  gridSizeLabel.textContent = `Grid size: ${size} x ${size}`;
}

// Initialize page
createGrid(gridSizeSelector.value);
colorButtonToggle();
