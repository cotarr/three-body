//
// The smaller axis will span from -100 to +100 units
// The larger axis will increase span to fill the browser window
// The function plotPoints() in main.js includes ad-hoc scale factor that
//    is used to fit output position data in range of -100 to +100 units.
//
//
//     Canvas pixel coordinates
//     0,0                          (width)
//     + ------------------------------X
//     |                               |
//     |                               |
//     |               Y               |
//     |               |               |
//     |               | Sim coords    |
//     |               | 0,0           |
//     |        -----  + ------ X      |
//     |               |               |
//     |               |               |
//     |               |               |
//     |                               |
//     |                               |
//     |-------------------------------+
//     Y
//  (height)
//
'use strict';

//
// Module variables
//
let ctx = null;
let canvasRightOffset = 0;
let canvasBottomOffset = 0;
let canvasWidthPx = null;
let canvasHeightPx = null;
let originPxX = null;
let originPxY = null;
let coordMinX = null;
let coordMaxX = null;
let coordMinY = null;
let coordMaxY = null;
let pixelPerUnit = null;

/**
 * Define reserved space on page when auto-sizing the canvas element
 * @param {number} rightOffset reserved area to right of canvas (width in pixels)
 * @param {number} bottomOffset  reserved area at bottom of canvas (height in pixels)
 */
export const setCanvasMarginsPx = (options) => {
  if (options) {
    if (Object.hasOwn(options, 'rightOffset')) canvasRightOffset = options.rightOffset;
    if (Object.hasOwn(options, 'bottomOffset')) canvasBottomOffset = options.bottomOffset;
  }
};

/**
 * Function to return canvas configuration settings
 * @returns {object} - Returns object with canvas data
 */
export const getBounds = () => {
  return {
    canvasWidthPx,
    canvasHeightPx,
    originPxX,
    originPxY,
    pixelPerUnit,
    coordMinX,
    coordMaxX,
    coordMinY,
    coordMaxY
  };
};

/**
 * Plot 1 pixel on the browser canvas using canvas coordinates
 * @param {number} x - x horizontal coordinate on canvas area
 * @param {number} y - y vertical coordinate on canvas area
 * @param {string} color - String in format '#ffffff'
 */
export const plotPixel = (x, y, color) => {
  ctx.save();
  ctx.strokeStyle = color || '#ffffff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 1, y);
  ctx.stroke();
  ctx.restore();
};

/**
 * Plot 1 pixel on the browser canvas using calculation X-Y coordinates
 * @param {*} coordX - X horizontal coordinate with zero in canvas center
 * @param {*} coordY - Y vertical coordinate with zero in canvas center
 * @param {*} color - String in format '#ffffff'
 */
export const plotCoord = (coordX, coordY, color) => {
  const x = originPxX + (coordX * pixelPerUnit);
  const y = originPxY - (coordY * pixelPerUnit);

  if ((x >= 0) && (x < canvasWidthPx) && (y >= 0) && (y < canvasHeightPx)) {
    plotPixel(x, y, color);
  } else {
    // console.log('plotCoord: Out of range', coordX, coordY);
  };
};

/**
 * Initialize the browser canvas
 */
export const initCanvas = () => {
  // Width/Height selected to match CSS styles
  // while leaving space for buttons at the bottom.
  canvasWidthPx = window.innerWidth - canvasRightOffset;
  canvasHeightPx = window.innerHeight - canvasBottomOffset;

  //
  // The smaller axis will span from -100 to +100 units
  // The larger axis will increase span to fill the browser window
  // The function plotPoints() in main.js includes ad-hoc scale factor that
  //    is used to fit output position data in range of -100 to +100 units.
  //
  if (canvasWidthPx > canvasHeightPx) {
    coordMinY = -100;
    coordMaxY = 100;
    originPxX = Math.floor(canvasWidthPx / 2);
    originPxY = Math.floor(canvasHeightPx / 2);
    pixelPerUnit = canvasHeightPx / (coordMaxY - coordMinY);
    coordMinX = Math.floor(-100 - (((canvasWidthPx - canvasHeightPx) / pixelPerUnit) / 4));
    coordMaxX = Math.floor(100 + (((canvasWidthPx - canvasHeightPx) / pixelPerUnit) / 4));
  } else {
    coordMinX = -100;
    coordMaxX = 100;
    originPxX = Math.floor(canvasWidthPx / 2);
    originPxY = Math.floor(canvasHeightPx / 2);
    pixelPerUnit = canvasWidthPx / (coordMaxX - coordMinX);
    coordMinY = Math.floor(-100 - (((canvasHeightPx - canvasWidthPx) / pixelPerUnit) / 4));
    coordMaxY = Math.floor(100 + (((canvasHeightPx - canvasWidthPx) / pixelPerUnit) / 4));
  }

  //
  // Initialize Canvas
  //
  const canvasElement = document.getElementById('canvasElementId');
  ctx = canvasElement.getContext('2d');

  canvasElement.setAttribute('width', canvasWidthPx);
  canvasElement.setAttribute('height', canvasHeightPx);

  ctx.fillStyle = '#000000';

  // 0, 0, W, H
  ctx.fillRect(0, 0, canvasWidthPx, canvasHeightPx);
};

export default initCanvas;
