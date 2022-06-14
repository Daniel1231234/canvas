"use strict"

function init() {
  gCanvas = document.querySelector("canvas")
  gCtx = gCanvas.getContext("2d")
  resizeCanvas()
  addListeners()
}

function renderCanvas() {
  gCtx.fillStyle = "#fff"
  gCtx.fillRect(0, 0, gCanvas.width, gCanvas.height)
  //   renderShape()
}

function renderShape() {
  const { offsetX, offsetY } = gCurrShape

  switch (gCurrShape.name) {
    case "triangle":
      drawTriangle(offsetX, offsetY)
      break
    case "square":
      drawRect(offsetX, offsetY)
      break
    case "circle":
      drawCircle(offsetX, offsetY)
      break
  }
}
function draw(ev) {
  if (gCurrShape === undefined) return
  const { offsetX, offsetY } = ev
  setShape(gCurrShape.name, offsetX, offsetY)
}

function setShape(name, offsetX, offsetY) {
  var currShape = getShape(name, offsetX, offsetY)
  currShape.name = name
  if (!currShape.name) return
  switch (currShape.name) {
    case "triangle":
      drawTriangle(offsetX, offsetY)
      break
    case "square":
      drawRect(offsetX, offsetY)
      break
    case "circle":
      drawCircle(offsetX, offsetY)
      break
  }
  console.log(currShape.name)
}

function onChooseColor(color) {
  getColor(color)
}

function clearCanvas() {
  gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}

function downloadImg(elLink) {
  var imgContent = gCanvas.toDataURL("image/jpeg")
  elLink.href = imgContent
}

function resizeCanvas() {
  const elContainer = document.querySelector(".canvas-container")
  gCanvas.width = elContainer.offsetWidth
  gCanvas.height = elContainer.offsetHeight
}

function addListeners() {
  addMouseListeners()
  addTouchListeners()

  window.addEventListener("resize", () => {
    resizeCanvas()
    renderCanvas()
  })
}

function addMouseListeners() {
  gCanvas.addEventListener("mousemove", onMove)
  gCanvas.addEventListener("mousedown", onDown)
  gCanvas.addEventListener("mouseup", onUp)
}

function addTouchListeners() {
  gCanvas.addEventListener("touchmove", onMove)
  gCanvas.addEventListener("touchstart", onDown)
  gCanvas.addEventListener("touchend", onUp)
}

function onMove(ev) {
  //   console.log(ev.offsetX, ev.offsetY)
  if (gIsDrawing) {
    const pos = getEvPos(ev)
    setShape(gCurrShape.name, pos.x, pos.y)
  }
}

function onDown(ev) {
  if (gCurrShape === undefined) return
  gIsDrawing = true
  const pos = getEvPos(ev)
  gStartPos = pos
  document.body.style.cursor = "grabbing"
  //   console.log("mouseDown: ", ev.offsetX, ev.offsetY)
}

function onUp(ev) {
  //   console.log("mouseUp: ", ev.offsetX, ev.offsetY)
  document.body.style.cursor = "grab"
  gIsDrawing = false
}

function getEvPos(ev) {
  //   console.log(ev.type)
  //Gets the offset pos , the default pos
  var pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  }
  // Check if its a touch ev
  if (gTouchEvs.includes(ev.type)) {
    //soo we will not trigger the mouse ev
    ev.preventDefault()
    //Gets the first touch point
    ev = ev.changedTouches[0]
    //Calc the right pos according to the touch screen
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    }
  }
  return pos
}

function onImgInput(ev) {
  loadImageFromInput(ev, renderImg)
}
//                               CallBack func will run on success load of the img
function loadImageFromInput(ev, onImageReady) {
  var reader = new FileReader()
  //After we read the file
  reader.onload = function (event) {
    var img = new Image() // Create a new html img element
    img.src = event.target.result // Set the img src to the img file we read
    //Run the callBack func , To render the img on the canvas
    img.onload = onImageReady.bind(null, img)
  }
  reader.readAsDataURL(ev.target.files[0]) // Read the file we picked
}

function renderImg(img) {
  //Draw the img on the canvas
  gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
}

function uploadImg() {
  const imgDataUrl = gCanvas.toDataURL("image/jpeg") // Gets the canvas content as an image format

  // A function to be called if request succeeds
  function onSuccess(uploadedImgUrl) {
    //Encode the instance of certain characters in the url
    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
    console.log(encodedUploadedImgUrl)
    document.querySelector(
      ".user-msg"
    ).innerText = `Your photo is available here: ${uploadedImgUrl}`
    //Create a link that on click will make a post in facebook with the image we uploaded
    document.querySelector(".share-container").innerHTML = `
      <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
         Share   
      </a>`
  }
  //Send the image to the server
  doUploadImg(imgDataUrl, onSuccess)
}

function doUploadImg(imgDataUrl, onSuccess) {
  //Pack the image for delivery
  const formData = new FormData()
  formData.append("img", imgDataUrl)
  //Send a post req with the image to the server
  fetch("//ca-upload.com/here/upload.php", {
    method: "POST",
    body: formData,
  }) //Gets the result and extract the text/ url from it
    .then((res) => res.text())
    .then((url) => {
      console.log("Got back live url:", url)
      //Pass the url we got to the callBack func onSuccess, that will create the link to facebook
      onSuccess(url)
    })
    .catch((err) => {
      console.error(err)
    })
}
