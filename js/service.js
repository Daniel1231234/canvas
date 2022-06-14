"use strict"

var gCanvas
var gCtx
var gCurrShape
var gCurrColor = "#000000"
var gIsDrawing = false
var gStartPos = {}
const gTouchEvs = ["touchstart", "touchmove", "touchend"]

function getShape(name, offsetX, offsetY) {
  gCurrShape = {
    name,
    offsetX,
    offsetY,
    size: 60,
    color: gCurrColor,
  }
  return gCurrShape
}

function drawTriangle(x, y) {
  gCtx.beginPath()
  gCtx.lineWidth = 2
  gCtx.moveTo(x, y)
  gCtx.lineTo(x - 30, y + 30)
  gCtx.lineTo(x + 30, y + 30)
  gCtx.closePath()
  gCtx.fillStyle = gCurrColor
  gCtx.fill()
}

function drawCircle(x, y) {
  gCtx.beginPath()
  gCtx.lineWidth = 6
  gCtx.arc(x, y, 50, 0, 2 * Math.PI)
  gCtx.fillStyle = gCurrColor
  gCtx.fill()
}

function drawRect(x, y) {
  gCtx.beginPath()
  gCtx.rect(x, y, 50, 50)
  gCtx.fillStyle = gCurrColor
  gCtx.fillRect(x, y, 50, 50)
  gCtx.strokeStyle = gCurrColor
  gCtx.stroke()
}

function getColor(color) {
  gCurrColor = color
}

// function isShapeClicked(clickedPos) {
//   const { pos } = gCurrShape
//   // Calc the distance between two dots
//   const distance = Math.sqrt(
//     (pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2
//   )
//   //If its smaller then the radius of the circle we are inside
//   return distance <= gCurrShape.size
// }
