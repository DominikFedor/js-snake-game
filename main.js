const canvas = document.getElementById('canvas')
const score = document.getElementsByClassName('score')[0]
const grid = 40
const s = Math.floor(window.innerHeight * 0.6 / grid)
canvas.width = s * grid
canvas.height = s * grid
const ctx = canvas.getContext('2d')
const cells = []
const breakPoints = []
let paused = false
for (let x = 0; x <= 1; x += 1) {
  cells.push({ x: 0 - x,
    y: 0,
    d: 'R' })
}
const feeds = [{ x: Math.floor(Math.random() * (grid - 1)) + 1,
  y: Math.floor(Math.random() * (grid - 1)) + 1 }]

function movecells(i) {
  breakPoints.map((breakPoint) => {
    if (cells[i].x === breakPoint.x && cells[i].y === breakPoint.y) {
      cells[i].d = breakPoint.d // redirecting cells direction to breakpoint direction
      if (i === cells.length - 1) breakPoints.shift()
    }
  })
  switch (cells[i].d) {
    case 'U':
      cells[i].y = cells[i].y - 1
      break
    case 'D':
      cells[i].y = cells[i].y + 1
      break
    case 'R':
      cells[i].x = cells[i].x + 1
      break
    case 'L':
      cells[i].x = cells[i].x - 1
      break
    default:
  }
  if (i !== cells.length - 1) {
    ctx.fillStyle = '#404040'
  }
  ctx.fillRect(cells[i].x * s, cells[i].y * s, s, s)
  ctx.stroke()
}
function snakeNav(dir) {
  if (dir !== cells[0].d) { breakPoints.push({ x: cells[0].x, y: cells[0].y, d: dir }) }
}
function clearSnake() {
  cells.map((cell) => {
    ctx.clearRect(cell.x * s, cell.y * s, s, s)
  })
}
function moveBody() {
  clearSnake()
  cells.map((cell, i) => {
    movecells(i)
    if (cells[0].x >= grid || cells[0].y >= grid || cells[0].x < 0 || cells[0].y < 0 // conditions for head reaching canvas borders
      || (i > 0 && (cells[0].x === cell.x && cells[0].y === cell.y))) { // conditions for head reaching other body cells
      score.innerHTML = String('Game over')
      paused = true
    }
  })
  feeds.map((feed) => {
    if (feed.x === cells[0].x && feed.y === cells[0].y) {
      switch (cells[0].d) {
        case 'U':
          cells.unshift({ x: cells[0].x, y: cells[0].y - 1, d: cells[0].d })
          break
        case 'D':
          cells.unshift({ x: cells[0].x, y: cells[0].y + 1, d: cells[0].d })
          break
        case 'R':
          cells.unshift({ x: cells[0].x + 1, y: cells[0].y, d: cells[0].d })
          break
        case 'L':
          cells.unshift({ x: cells[0].x - 1, y: cells[0].y, d: cells[0].d })
          break
        default:
      }
      feeds.shift()
      feeds.push({ x: Math.floor(Math.random() * (grid - 1)) + 1,
        y: Math.floor(Math.random() * (grid - 1)) + 1 })
      score.innerHTML = String(cells.length - 1)
    }
    ctx.fillStyle = '#404040'
    ctx.fillRect(feed.x * s, feed.y * s, s, s)
  })
}
window.onkeyup = function (e) {
  const key = e.keyCode ? e.keyCode : e.which
  ctx.stroke()
  switch (key) {
    case 38:
      if (cells[0].d !== 'D') { snakeNav('U') }
      break
    case 40:
      if (cells[0].d !== 'U') { snakeNav('D') }
      break
    case 37:
      if (cells[0].d !== 'R') { snakeNav('L') }
      break
    case 39:
      if (cells[0].d !== 'L') { snakeNav('R') }
      break
    case 32:
      score.innerHTML = String('Pause')
      paused = !paused
      if (!paused) score.innerHTML = score.innerHTML = String(cells.length - 1)
      break
    default:
  }
}
setInterval(() => {
  if (!paused) {
    moveBody()
  }
}, 70)
