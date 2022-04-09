let sketch = document.querySelector("#sketch");
let buttons = document.querySelectorAll(".button")
let clearButton = document.querySelector("#clear")

// for (button of [...buttons]) {
//   button.addEventListener()
// }
clearButton.addEventListener("click", clearGrid);

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
  for (let i = 0; i < len; i++) {
    sketch.appendChild(createRow(len));
  }
}

function onMouseOver(event) {
  event.target.style.backgroundColor = "black";
}

function clearGrid() {
  for (row of [...sketch.childNodes]) {
    for (square of [...row.childNodes]) {
      square.style.backgroundColor = "white";
    }
  }
}

createGrid(16);
