const button = document.getElementById("start-btn");
const input = document.getElementById("input-text");
const result = document.getElementById("result");
const letterWidth = 30;
const startLeft = 20;
const startTop = 20;

let draggedElement = null;
let offsetX = 0;
let offsetY = 0;
let resaltRect = null;
let startDragLeft = 0;
let startDragTop = 0;

button.addEventListener("click", function renderLetters() {
  const str = input.value;
  result.innerHTML = "";

  for (let i = 0; i < str.length; i++) {
    const span = document.createElement("span");
    span.textContent = str[i];
    span.style.position = "absolute";
    span.style.left = startLeft + i * letterWidth + "px";
    span.style.top = startTop + "px";
    span.style.padding = "5px";
    span.style.border = "2px solid black";
    span.style.border;
    result.appendChild(span);

    span.addEventListener("mousedown", function (e) {
      draggedElement = span;
      const rect = span.getBoundingClientRect();
      offsetX = event.clientX - rect.left;
      offsetY = event.clientY - rect.top;
      resaltRect = result.getBoundingClientRect();
      startDragLeft = parseInt(span.style.left);
      startDragTop = parseInt(span.style.top);
    });
  }
});

document.addEventListener("mousemove", function (e) {
  if (draggedElement) {
    draggedElement.style.left = e.clientX - offsetX - resaltRect.left + "px";
    draggedElement.style.top = e.clientY - offsetY - resaltRect.top + "px";
  }
});

document.addEventListener("mouseup", function (e) {
  if (draggedElement) {
    const draggedRect = draggedElement.getBoundingClientRect();

    for (const letter of result.children) {
      if (letter !== draggedElement) {
        const letterRect = letter.getBoundingClientRect();

        const isOverLap = !(
          draggedRect.right < letterRect.left ||
          draggedRect.left > letterRect.right ||
          draggedRect.bottom < letterRect.top ||
          draggedRect.top > letterRect.bottom
        );

        if (isOverLap) {     
          draggedElement.style.left = letterRect.left - resaltRect.left + "px";
          draggedElement.style.top = letterRect.top - resaltRect.top + "px";
          letter.style.left = startDragLeft + "px";
          letter.style.top = startDragTop + "px";
        }
      }
    }
  }
  draggedElement = null;
});
