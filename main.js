class twoDimentionalArray {
  constructor(cellCountX, cellCountY) {
    this.cellCountX = cellCountX;
    this.cellCountY = cellCountY;
    this.array = new Int8Array(cellCountX * cellCountY).fill(0);
  }
  get(x, y) {
    if (this.array[x + y * this.cellCountX] == undefined) {
      return 0;
    }
    return this.array[x + y * this.cellCountX];
  }
  set(x, y, value) {
    this.array[x + y * this.cellCountX] = value;
  }
}

function main() {
  let started = false;
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const start = document.getElementById("start");
  const clear = document.getElementById("clear")
  const cellCountX = 200;
  const cellCountY = 150;
  const cellSize = 15;
  let scale = 1;
  let scrollAmount = 1;
  let x = 0;
  let y = 0;
  let arr = new twoDimentionalArray(cellCountX, cellCountY);

  arr.set(114, 71, 1);
  arr.set(112, 72, 1);
  arr.set(114, 72, 1);
  arr.set(102, 73, 1);
  arr.set(103, 73, 1);
  arr.set(110, 73, 1);
  arr.set(111, 73, 1);
  arr.set(124, 73, 1);
  arr.set(125, 73, 1);
  arr.set(101, 74, 1);
  arr.set(105, 74, 1);
  arr.set(110, 74, 1);
  arr.set(111, 74, 1);
  arr.set(124, 74, 1);
  arr.set(125, 74, 1);
  arr.set(90, 75, 1);
  arr.set(91, 75, 1);
  arr.set(100, 75, 1);
  arr.set(106, 75, 1);
  arr.set(110, 75, 1);
  arr.set(111, 75, 1);
  arr.set(90, 76, 1);
  arr.set(91, 76, 1);
  arr.set(100, 76, 1);
  arr.set(104, 76, 1);
  arr.set(106, 76, 1);
  arr.set(107, 76, 1);
  arr.set(112, 76, 1);
  arr.set(114, 76, 1);
  arr.set(100, 77, 1);
  arr.set(106, 77, 1);
  arr.set(114, 77, 1);
  arr.set(101, 78, 1);
  arr.set(105, 78, 1);
  arr.set(102, 79, 1);
  arr.set(103, 79, 1);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const initgrid = mousePosToGridPos(
    window.innerWidth / 2 - (cellCountX * cellSize) / 2,
    window.innerHeight / 2 - (cellCountY * cellSize) / 2,
    cellSize,
    scale
  );

  const positonOfGrid = { x: initgrid.x, y: initgrid.y };

  renderGrid(
    cellCountX,
    cellCountY,
    cellSize,
    scale,
    ctx,
    positonOfGrid.x,
    positonOfGrid.y,
    arr
  );

  window.addEventListener("wheel", (e) => {
    let mousePos = { x: 0, y: 0 };
    let newMousePos = { x: 0, y: 0 };

    //prettier-ignore
    mousePos = mousePosToGridPos( e.clientX, e.clientY, cellSize, scale, positonOfGrid);

    scrollAmount += e.deltaY / 1000;

    scale = Math.pow(scrollAmount, 1.01);

    if (scrollAmount < 0.6) {
      scale = 0.6;
      scrollAmount = 0.6;
    }
    //prettier-ignore
    newMousePos = mousePosToGridPos(e.clientX, e.clientY, cellSize, scale, positonOfGrid);

    const offsetX = newMousePos.x - mousePos.x;
    const offsetY = newMousePos.y - mousePos.y;

    positonOfGrid.x += offsetX;
    positonOfGrid.y += offsetY;
  });

  window.addEventListener("mousedown", (e) => {
    let currentMousePosition = mousePosToGridPos(
      e.clientX,
      e.clientY,
      cellSize,
      scale
    );
    let tempX = Math.floor(currentMousePosition.x - positonOfGrid.x);
    let tempY = Math.floor(currentMousePosition.y - positonOfGrid.y);
    tempX = Math.min(tempX, cellCountX - 1);
    tempX = Math.max(0, tempX);
    tempY = Math.min(tempY, cellCountY - 1);
    tempY = Math.max(0, tempY);
    if (arr.get(tempX, tempY) == 0) {
      arr.set(tempX, tempY, 1);
    } else {
      arr.set(tempX, tempY, 0);
    }
  });
  start.addEventListener("click", () => {
    started = !started;
  });
  setInterval(() => {
    if (started == true) {
      gameRules(cellCountY, cellCountX, arr);
      ctx.fillStyle = "grey";
    }
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    //prettier-ignore
    renderGrid(cellCountX, cellCountY, cellSize, scale, ctx, positonOfGrid.x , positonOfGrid.y, arr);
  }, 66);
  clear.addEventListener("click", () =>{
    arr = new twoDimentionalArray(cellCountX, cellCountY);
  })
}

function mousePosToGridPos(x, y, cellSize, scale) {
  let gridPosition = { x: 0, y: 0 };

  gridPosition.x = x / (cellSize * scale);
  gridPosition.y = y / (cellSize * scale);

  return gridPosition;
}

//prettier-ignore
function renderGrid( cellCountX, cellCountY, cellSize, scale, ctx, offsetX, offsetY, arr) 
{
  let newCellSize = cellSize * scale;

   for (let i = 0; i < cellCountX; i++) {
    for (let j = 0; j < cellCountY; j++) {
      
      if (arr.get(i,j) ==  0){
        ctx.fillStyle = "grey"
      } else if (arr.get(i,j)==1){
        ctx.fillStyle = "yellow"
        ctx.fillRect(
          (i + offsetX) * newCellSize ,
        //prettier-ignore
        (j + offsetY) * newCellSize,
        newCellSize,
        newCellSize
        )
        
      }
      ctx.strokeStyle = "white";
    
      ctx.strokeRect(
        (i + offsetX) * newCellSize ,
        //prettier-ignore
        (j + offsetY) * newCellSize,
        newCellSize,
        newCellSize
      );
    }
  }
}

function gameRules(cellCountY, cellCountX, arr) {
  const newArr = new twoDimentionalArray(cellCountX, cellCountY);

  for (let i = 0; i < cellCountY; i++) {
    for (let j = 0; j < cellCountX; j++) {
      let cell = arr.get(j, i);
      let aliveNeighbour =
        arr.get(j + 1, i) +
        arr.get(j - 1, i) +
        arr.get(j, i + 1) +
        arr.get(j, i - 1) +
        arr.get(j + 1, i - 1) +
        arr.get(j - 1, i + 1) +
        arr.get(j + 1, i + 1) +
        arr.get(j - 1, i - 1);

      if (cell == 1) {
        if (aliveNeighbour < 2 || aliveNeighbour > 3) {
          newArr.set(j, i, 0); // Any live cell with fewer than two live neighbors dies, or with more than three live neighbors dies
        } else {
          newArr.set(j, i, 1); // Any live cell with two or three live neighbors lives on to the next generation
        }
      } else {
        if (aliveNeighbour == 3) {
          newArr.set(j, i, 1); // Any dead cell with exactly three live neighbors becomes a live cell
        } else {
          newArr.set(j, i, 0); // All other dead cells remain dead
        }
      }
    }
  }

  for (let i = 0; i < cellCountY; i++) {
    for (let j = 0; j < cellCountX; j++) {
      arr.set(j, i, newArr.get(j, i));
    }
  }
}
main();
