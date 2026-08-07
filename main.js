const button = document.getElementById("start-btn");
const input = document.getElementById("input-text");
const result = document.getElementById("result");
const rubber = document.querySelector(".rubber");
const letterWidth = 30;
const startLeft = 20;
const startTop = 20;

let draggedElement = null;
let offsetX = 0;
let offsetY = 0;
let resaltRect = null;
let startDragLeft = 0;
let startDragTop = 0;

let selectedLetters = new Set();

let lastMouseX = 0;
let lastMouseY = 0;

let isSelecting = false;
let selectionStartX = 0;
let selectionStartY = 0;

button.addEventListener("click", function renderLetters() {
  // розкладаємо літери і додаємо слухачів
  const str = input.value;
  result.innerHTML = "";
  result.appendChild(rubber);

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
      if (!e.ctrlKey) {
        // контроль - чи натиснута клавіша ctrl
        draggedElement = span;
        const rect = span.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        resaltRect = result.getBoundingClientRect();
        startDragLeft = parseInt(span.style.left);
        startDragTop = parseInt(span.style.top);
      } else {
        //Запис літери і перевірка чи вже є така, якщо є видаляємо
        if (selectedLetters.has(span)) {
          selectedLetters.delete(span);
          span.style.backgroundColor = "";
        } else {
          selectedLetters.add(span);
          span.style.backgroundColor = "#ff0000";
        }
      }
    });
  }
});

document.addEventListener("mousemove", function (e) {
  if (draggedElement && !selectedLetters.has(draggedElement)) {
    draggedElement.style.left = e.clientX - offsetX - resaltRect.left + "px";
    draggedElement.style.top = e.clientY - offsetY - resaltRect.top + "px";
  } else if (draggedElement && selectedLetters.has(draggedElement)) {
    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;

    for (const letter of selectedLetters) {
      letter.style.left = parseInt(letter.style.left) + deltaX + "px";
      letter.style.top = parseInt(letter.style.top) + deltaY + "px";
    }
  } else if (isSelecting) {
    const currentX = e.clientX - resaltRect.left;
    const currentY = e.clientY - resaltRect.top;
    const left = Math.min(selectionStartX, currentX);
    const width = Math.abs(currentX - selectionStartX);
    const top = Math.min(selectionStartY, currentY);
    const height = Math.abs(currentY - selectionStartY);
    rubber.style.left = left + "px";
    rubber.style.top = top + "px";
    rubber.style.width = width + "px";
    rubber.style.height = height + "px";
  }
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});

document.addEventListener("mouseup", function (e) {
  if (draggedElement) {
    const draggedRect = draggedElement.getBoundingClientRect();

    for (const letter of result.children) {
      if (letter !== draggedElement) {
        const letterRect = letter.getBoundingClientRect();
        const isOverLap = rectsOverlap(draggedRect, letterRect);
        if (isOverLap) {
          draggedElement.style.left = letterRect.left - resaltRect.left + "px";
          draggedElement.style.top = letterRect.top - resaltRect.top + "px";
          letter.style.left = startDragLeft + "px";
          letter.style.top = startDragTop + "px";
        }
      }
    }
  } else if (isSelecting) {
    const rubberRect = rubber.getBoundingClientRect();

    if (rubberRect.width < 5 && rubberRect.height < 5) {
      // перевірка це звичайний клік чи тягнемо трикутник
      for (const letter of selectedLetters) {
        letter.style.backgroundColor = "";
      }
      selectedLetters.clear();
    } // логіка виділення
    else {
      for (const letter of result.children) {
        if (letter !== rubber) {
          const letterRect = letter.getBoundingClientRect();
          const isOverLap = rectsOverlap(rubberRect, letterRect);
          if (isOverLap) {
            selectedLetters.add(letter);
            letter.style.backgroundColor = "#ff0000";
          }
        }
      }
    }
  }
  draggedElement = null;
  rubber.style.display = "none";
  isSelecting = false;
});

// створення прямокутника для виділення
result.addEventListener("mousedown", function (e) {
  if (e.target === result) {
    isSelecting = true;
    resaltRect = result.getBoundingClientRect();
    selectionStartX = e.clientX - resaltRect.left;
    selectionStartY = e.clientY - resaltRect.top;
    rubber.style.display = "block";
    rubber.style.left = selectionStartX + "px";
    rubber.style.top = selectionStartY + "px";
    rubber.style.width = "0";
    rubber.style.height = "0";
  }
});

// окрема функція для перевірки перетину двох прямокутників
function rectsOverlap(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}
