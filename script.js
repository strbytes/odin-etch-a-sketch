let sketch = document.querySelector("#sketch");
let colorPicker = document.querySelector("#color-picker");
let buttons = document.querySelectorAll(".button");
let solidButton = document.querySelector("#solid-color");
let randomButton = document.querySelector("#random-color");
let clearButton = document.querySelector("#clear");
let gridSizeSelector = document.querySelector("#grid-size");
let gridSizeLabel = document.querySelector("#slider-label");

let random = false;
let color = colorPicker.value;

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
clearButton.addEventListener("click", clearGrid);
gridSizeSelector.addEventListener("change", gridSizeChange);
gridSizeSelector.addEventListener("input", gridSizeLabelChange);

for (let button of [...buttons]) {
  if (button.id === "grid-slider") continue;
  button.addEventListener("mousedown", (e) => {
    e.target.classList.remove("button");
    e.target.classList.add("button-click");
  });
  button.addEventListener("mouseup", (e) => {
    e.target.classList.remove("button-click");
    e.target.classList.add("button");
  });
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
  // color = "black";
  if (random) {
    color = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
  }
  event.target.style.backgroundColor = color;
}

function clearGrid() {
  for (row of [...sketch.childNodes]) {
    for (square of [...row.childNodes]) {
      square.style.backgroundColor = "white";
    }
  }
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
