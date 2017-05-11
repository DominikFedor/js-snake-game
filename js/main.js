var canvas = document.getElementById('canvas');
var score1 = document.getElementById('score1');
var score2 = document.getElementById('score2');
var div = document.getElementById('settings');
var grid = 40;
var s = Math.floor(window.innerHeight * 1 / grid);
canvas.width = s * grid;
canvas.height = s * grid;
var ctx = canvas.getContext('2d');
var cells = [[], []]; // snake cells/parts
var breakPoints = [[], []]; // breakpoints for snake cells
var paused = false;
var multi = true;
var infBorders = true;
for (var x = 0; x <= 1; x += 1) {
  cells[0].push({ x: 2 - x, y: 0, d: 'R' }); // pushing initial cells' positions and directions
}
for (var _x = 0; _x <= 1; _x += 1) {
  cells[1].push({ x: grid - 2 + _x, y: grid - 1, d: 'L' }); // pushing initial cells' positions and directions
}

var feeds = [{ x: Math.floor(Math.random() * (grid - 1)) + 1,
  y: Math.floor(Math.random() * (grid - 1)) + 1 }]; // first feed random position

function movecells(snake, i) {
  // ( snakeID, current cell )

    for (var _b = 0; _b < breakPoints[snake].length; _b += 1) {

    // handling individual cell breakpoints
    if (cells[snake][i].x === breakPoints[snake][_b].x && cells[snake][i].y === breakPoints[snake][_b].y) {
      //
      cells[snake][i].d = breakPoints[snake][_b].d; // redirecting current cell direction to breakpoint direction
      if (i === cells[snake].length - 1) breakPoints[snake].shift(); // removing breakpoint after use of last cell
    }

    }
  switch (cells[snake][i].d) {// cell movements according to moving direction
    case 'U':
      cells[snake][i].y = cells[snake][i].y - 1;
      break;
    case 'D':
      cells[snake][i].y = cells[snake][i].y + 1;
      break;
    case 'R':
      cells[snake][i].x = cells[snake][i].x + 1;
      break;
    case 'L':
      cells[snake][i].x = cells[snake][i].x - 1;
      break;
    default:
  }
  if (infBorders) {
    // handling reaching infinitive borders
    if (cells[snake][i].x > grid - 1) {
      cells[snake][i].x = 0;
    }
    if (cells[snake][i].x < 0) {
      cells[snake][i].x = grid;
    }
    if (cells[snake][i].y > grid - 1) {
      cells[snake][i].y = 0;
    }
    if (cells[snake][i].y < 0) {
      cells[snake][i].y = grid;
    }
  }
  if (snake === 0) ctx.fillStyle = '#1E88E5'; // snake1 colour
  if (snake === 1) ctx.fillStyle = '#EF5350'; // snake2 colour
  ctx.fillRect(cells[snake][i].x * s, cells[snake][i].y * s, s, s);
  ctx.stroke();
}
function snakeNav(snakeID, dir) {
  // handling snake's head direction changes
  if (dir !== cells[snakeID][0].d) {
    breakPoints[snakeID].push({ // pushing new breakpoints for the rest body / cells
      x: cells[snakeID][0].x, // breakpoint x position
      y: cells[snakeID][0].y, // breakpoint y position
      d: dir }); // pointing to new direction
  }
}
function clearSnake(snake) {
  // erasing cells for the next frame
  for (var _y = 0; _y < cells[snake].length; _y += 1) {
    ctx.clearRect(cells[snake][_y].x * s, cells[snake][_y].y * s, s, s);
  }
}
function moveBody(snake) {
  clearSnake(snake);

    for (var _u = 0; _u < cells[snake].length; _u += 1) {
    movecells(snake, _u);
    if (_u > 0 && cells[snake][0].x === cells[snake][_u].x && cells[snake][0].y === cells[snake][_u].y || // head reaching other body cells[0]
    !infBorders && (cells[snake][0].x >= grid || cells[snake][0].x < 0 || // head reaching horizontal borders
    cells[snake][0].y >= grid || cells[snake][0].y < 0)) {
      // head reaching vertical borders
      if (cells[0].length !== cells[1].length && multi) {
        // multiplayer score comparison
        if (snake === 1) {
          document.getElementById('status').innerHTML = String('Blue won');
          document.getElementById('status').style.color = '#1E88E5';
          score2.innerHTML = String('-');
        } else {
          document.getElementById('status').innerHTML = String('Red won');
          document.getElementById('status').style.color = '#EF5350';
          score1.innerHTML = String('-');
        }
      } else {
        multi ? document.getElementById('status').innerHTML = String('Draw') : document.getElementById('status').innerHTML = String('Game over'); // single player
      }
      paused = true;
    }
}
    for (var _f = 0; _f < feeds.length; _f += 1) {
    if (feeds[_f].x === cells[snake][0].x && feeds[_f].y === cells[snake][0].y) {
      // head reaching feed
      switch (cells[snake][cells[snake].length - 1].d) {// pushing new cell at the end of the body according to move direction
        case 'U':
          cells[snake].push({
            x: cells[snake][cells[snake].length - 1].x,
            y: cells[snake][cells[snake].length - 1].y + 1,
            d: cells[snake][cells[snake].length - 1].d }); // keeps moving in the same dir. of the previous cell
          break;
        case 'D':
          cells[snake].push({
            x: cells[snake][cells[snake].length - 1].x,
            y: cells[snake][cells[snake].length - 1].y - 1,
            d: cells[snake][cells[snake].length - 1].d });
          break;
        case 'R':
          cells[snake].push({
            x: cells[snake][cells[snake].length - 1].x - 1,
            y: cells[snake][cells[snake].length - 1].y,
            d: cells[snake][cells[snake].length - 1].d });
          break;
        case 'L':
          cells[snake].push({
            x: cells[snake][cells[snake].length - 1].x + 1,
            y: cells[snake][cells[snake].length - 1].y,
            d: cells[snake][cells[snake].length - 1].d });
          break;
        default:
      }
      feeds.shift(); // deleting feed
      feeds.unshift({ x: Math.floor(Math.random() * (grid - 1)) + 1,
        y: Math.floor(Math.random() * (grid - 1)) + 1 }); // generating new feed
      score1.innerHTML = String(cells[0].length - 1);
      if (multi) score2.innerHTML = String(cells[1].length - 1);
    }
    ctx.fillStyle = '#404040'; // feed colour
    ctx.fillRect(feeds[_f].x * s, feeds[_f].y * s, s, s);
  }
}
window.onkeyup = function (e) {
  var key = e.keyCode ? e.keyCode : e.which;
  ctx.stroke();
  switch (key) {// binding keys for snake ID's
    case 38:
      if (cells[0][0].d !== 'D') snakeNav(0, 'U'); // new directions of snake's head
      break;
    case 40:
      if (cells[0][0].d !== 'U') snakeNav(0, 'D');
      break;
    case 37:
      if (cells[0][0].d !== 'R') snakeNav(0, 'L');
      break;
    case 39:
      if (cells[0][0].d !== 'L') snakeNav(0, 'R');
      break;
    case 83:
      if (cells[1][0].d !== 'U') snakeNav(1, 'D');
      break;
    case 87:
      if (cells[1][0].d !== 'D') snakeNav(1, 'U');
      break;
    case 68:
      if (cells[1][0].d !== 'L') snakeNav(1, 'R');
      break;
    case 65:
      if (cells[1][0].d !== 'R') snakeNav(1, 'L');
      break;
    case 32:
      document.getElementById('status').innerHTML = String('Pause');
      paused = !paused;
      if (!paused) document.getElementById('status').innerHTML = String('');
      break;
    case 13:
      if (paused) location.reload();
      break;
    default:
  }
};
score1.innerHTML = String(cells[0].length - 1);
if (multi) score2.innerHTML = String(cells[1].length - 1);
setInterval(function () {
  if (!paused) {
    moveBody(0);
  }
  if (multi) {
    if (!paused) {
      moveBody(1);
    }
  }
}, 60); // move speed
