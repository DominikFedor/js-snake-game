const canvas = document.getElementById('canvas')
const score1 = document.getElementById('score1')
const score2 = document.getElementById('score2')
const gridInput = document.getElementById('grid-input')
const sizeInput = document.getElementById('size-input')
const status = document.getElementById('status')
const div = document.getElementById('settings')
const play = document.getElementById('play')
const playersOption = document.getElementById('multi')
const BordersOption = document.getElementById('iBorders')
let grid = gridInput.value
let s = Math.floor(window.innerHeight * sizeInput.value / grid)
canvas.width = s * grid
canvas.height = s * grid
const ctx = canvas.getContext('2d')
const cells = [[], []] // snake cells/parts
const breakPoints = [[], []] // breakpoints for snake cells
let paused = false
let multi = true
let infBorders = true
for (let x = 0; x <= 1; x += 1) {
  cells[0].push({ x: 2 - x, y: 0, d: 'R' }) // pushing initial cells' positions and directions
}
for (let x = 0; x <= 1; x += 1) {
  console.log(grid);
  cells[1].push({ x: grid - 2 + x, y: grid - 1, d: 'L' }) // pushing initial cells' positions and directions
}

const feeds = [{ x: Math.floor(Math.random() * (grid - 1)) + 1,
  y: Math.floor(Math.random() * (grid - 1)) + 1 }] // first feed random position

function movecells(snake, i) { // ( snakeID, current cell )
  if (breakPoints[snake].length > cells[snake].length) breakPoints[snake].shift()
  breakPoints[snake].map((breakPoint) => { // handling individual cell breakpoints
    if (cells[snake][i].x === breakPoint.x && cells[snake][i].y === breakPoint.y) { //
      cells[snake][i].d = breakPoint.d // redirecting cells[0] dir to breakpoint dir
      if (i === cells[snake].length - 1) breakPoints[snake].shift()
    }
  })
  switch (cells[snake][i].d) { // cell movements according to moving direction
    case 'U':
      cells[snake][i].y = cells[snake][i].y - 1
      break
    case 'D':
      cells[snake][i].y = cells[snake][i].y + 1
      break
    case 'R':
      cells[snake][i].x = cells[snake][i].x + 1
      break
    case 'L':
      cells[snake][i].x = cells[snake][i].x - 1
      break
    default:
  }
  if (infBorders) { // handling reaching infinitive borders
    if (cells[snake][i].x > grid - 1) {
      cells[snake][i].x = 0
    }
    if (cells[snake][i].x < 0) {
      cells[snake][i].x = grid
    }
    if (cells[snake][i].y > grid - 1) {
      cells[snake][i].y = 0
    }
    if (cells[snake][i].y < 0) {
      cells[snake][i].y = grid
    }
  }
  if (snake === 0) ctx.fillStyle = '#1E88E5' // snake1 colour
  if (snake === 1) ctx.fillStyle = '#EF5350' // snake2 colour
  ctx.fillRect(cells[snake][i].x * s, cells[snake][i].y * s, s, s)
  ctx.stroke()
}
function snakeNav(snakeID, dir) { // handling snake's head direction changes
  if (dir !== cells[snakeID][0].d) {
    breakPoints[snakeID].push({ // pushing new breakpoints for the rest body / cells
      x: cells[snakeID][0].x, // breakpoint x position
      y: cells[snakeID][0].y, // breakpoint y position
      d: dir }) // pointing to new direction
  }
}
function clearSnake(snake) { // erasing cells for the next frame
  cells[snake].map((cell) => {
    ctx.clearRect(cell.x * s, cell.y * s, s, s)
  })
}
function moveBody(snake) {
  setTimeout(() => {
    clearSnake(snake)
    cells[snake].map((cell, i) => {
      movecells(snake, i)
      if ((i > 0 && (cells[snake][0].x === cell.x && cells[snake][0].y === cell.y)) || // head reaching other body cells[0]
        (!infBorders && (cells[snake][0].x >= grid || cells[snake][0].x < 0 || // head reaching horizontal borders
          cells[snake][0].y >= grid || cells[snake][0].y < 0))) { // head reaching vertical borders
        if (cells[0].length !== cells[1].length && multi) { // multiplayer score comparison
          if (snake === 1) {
            status.style.color = '#1E88E5'
            status.innerHTML = String('Blue won')
            score2.innerHTML = String('-')
          } else {
            status.style.color = '#EF5350'
            status.innerHTML = String('Red wins')
            score1.innerHTML = String('-')
          }
        } else {
          multi ? status.innerHTML = String('Draw')
            : status.innerHTML = String('Game over') // single player
        }
        paused = true
      }
    })
    feeds.map((feed) => {
      if (feed.x === cells[snake][0].x && feed.y === cells[snake][0].y) { // head reaching feed
        switch (cells[snake][cells[snake].length - 1].d) { // pushing new cell at the end of the body according to move direction
          case 'U':
            cells[snake].push({
              x: cells[snake][cells[snake].length - 1].x,
              y: cells[snake][cells[snake].length - 1].y + 1,
              d: cells[snake][cells[snake].length - 1].d }) // keeps moving in the same dir. of the previous cell
            break
          case 'D':
            cells[snake].push({
              x: cells[snake][cells[snake].length - 1].x,
              y: cells[snake][cells[snake].length - 1].y - 1,
              d: cells[snake][cells[snake].length - 1].d })
            break
          case 'R':
            cells[snake].push({
              x: cells[snake][cells[snake].length - 1].x - 1,
              y: cells[snake][cells[snake].length - 1].y,
              d: cells[snake][cells[snake].length - 1].d })
            break
          case 'L':
            cells[snake].push({
              x: cells[snake][cells[snake].length - 1].x + 1,
              y: cells[snake][cells[snake].length - 1].y,
              d: cells[snake][cells[snake].length - 1].d })
            break
          default:
        }
        feeds.shift() // deleting feed
        feeds.unshift({ x: Math.floor(Math.random() * (grid - 1)) + 1,
          y: Math.floor(Math.random() * (grid - 1)) + 1 }) // generating new feed
        score1.innerHTML = String(cells[0].length - 1)
        if (multi) score2.innerHTML = String(cells[1].length - 1)
      }
      ctx.fillStyle = '#404040' // feed colour
      ctx.fillRect(feed.x * s, feed.y * s, s, s)
    })
  }, 100)
}
window.onkeyup = function (e) {
  const key = e.keyCode ? e.keyCode : e.which
  ctx.stroke()
  switch (key) { // binding keys for snake ID's
    case 38:
      if (cells[0][0].d !== 'D') snakeNav(0, 'U') // new directions of snake's head
      break
    case 40:
      if (cells[0][0].d !== 'U') snakeNav(0, 'D')
      break
    case 37:
      if (cells[0][0].d !== 'R') snakeNav(0, 'L')
      break
    case 39:
      if (cells[0][0].d !== 'L') snakeNav(0, 'R')
      break
    case 83:
      if (cells[1][0].d !== 'U') snakeNav(1, 'D')
      break
    case 87:
      if (cells[1][0].d !== 'D') snakeNav(1, 'U')
      break
    case 68:
      if (cells[1][0].d !== 'L') snakeNav(1, 'R')
      break
    case 65:
      if (cells[1][0].d !== 'R') snakeNav(1, 'L')
      break
    case 32:
      status.innerHTML = String('Pause')
      paused = !paused
      if (!paused) status.innerHTML = String('')
      break
    case 13:
      if (paused) location.reload()
      break
    default:
  }
}
play.onclick = function () { // game started
  if (div.style.display !== 'none') {
    div.style.display = 'none'
  } else {
    div.style.display = 'block'
  }
  multi = playersOption.checked
  score1.innerHTML = String(cells[0].length - 1)
  if (multi) score2.innerHTML = String(cells[1].length - 1)
  infBorders = BordersOption.checked  // updated options ...
  grid = gridInput.value
  console.log(sizeInput.value)
  s = Math.floor(window.innerHeight * sizeInput.value / grid)
  canvas.width = s * grid
  canvas.height = s * grid
  setInterval(() => {
    if (!paused) {
      moveBody(0)
    }
    if (multi) {
      if (!paused) {
        moveBody(1)
      }
    }
  }, 60) // move speed
}
