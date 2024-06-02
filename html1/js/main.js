'use strict';

import { initCanvas, plotCoord, setCanvasMarginsPx, getBounds } from './canvasPlot.js'
import presets from './presets.js';

/** @type {number} Gravitational Constant in m^3 / (kg * s^2) */
const gravitationalConstant = 6.674e-11;

/** @type {number} Integration step size in seconds */
const stepSeconds = 10;
/** @type {number} Counter of number integration steps per plotted point */
const stepPerPoint = 100;
/** @type {number} The setInterval() timer period in milliseconds */
const IntervalTimerMilliSeconds = 10;

/** @type {number} Ad-hoc display scale factor to span -100 to +100 coordinate space */
const displayScaleFactor = 1e7;

/** @type {boolean} Flag used to pause simulation */
let paused = true;
/** @type {number} Counter used to auto-pause simulation */
let autoPauseTimer = 0;

/** @type {array} Holds simulation state (position, velocity, acceleration) */
const masses = [
  {
    dataLabel: 'Mass #1'
  },
  {
    dataLabel: 'Mass #2'
  },
  {
    dataLabel: 'Mass #3'
  }
];

//
// Update button labels using data from presets module
//
for (let i = 0; i < presets.length; i++) {
  if (presets[i][0].buttonLabel) {
    const buttonIdStr = 'button' + i.toString() + 'Id';
    const buttonEl = document.getElementById(buttonIdStr);
    buttonEl.textContent = presets[i][0].buttonLabel;
  }
}

// -------------------------------------
//
//    P H Y S I C S   S E C T I O N
//
// -------------------------------------

// Units
//
//   time: seconds
//   mass: kilograms
//   position: meters
//   velocity: meters/second
//   acceleration: meters/(second^2)
//   force: Newtons, kg-m/(s^2)
//

/**
 * Calculate force vector for one remote mass
 * Gravitational force = G * m1 * m2 / (r^2)
 * @param {number} indexSelf - Mass that is acted on by force
 * @param {number} indexRemote - Remote mass producing gravitational force
 * @returns {object} Returns object contains force vector in Newtons
 */
const calcForceVector = (indexSelf, indexRemote) => {
  const deltaX = masses[indexRemote].positionX - masses[indexSelf].positionX;
  const deltaY = masses[indexRemote].positionY - masses[indexSelf].positionY;

  // distance = sqrt(x^2 + y^2)
  const distance = Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
  const scalerForce = gravitationalConstant *
    masses[indexSelf].mass * masses[indexRemote].mass /
    (distance * distance);
  const forceX = scalerForce * deltaX / distance;
  const forceY = scalerForce * deltaY / distance;

  return {
    distance,
    scalerForce,
    forceX,
    forceY
  };
};
// console.log(JSON.stringify(calcForceVector(2, 0), null, 2));

/**
 * Combine all force vectors to obtain acceleration vector
 * @param {Number} indexSelf - Mass that is acted on by force
 * @returns {object} Returns object containing combined acceleration vector in kg/(m^2)
 */
const combineAccelerationVectors = (indexSelf) => {
  let indexOne;
  let indexTwo;
  if (indexSelf === 0) {
    indexOne = 1;
    indexTwo = 2;
  }
  if (indexSelf === 1) {
    indexOne = 0;
    indexTwo = 2;
  }
  if (indexSelf === 2) {
    indexOne = 0;
    indexTwo = 1;
  }
  const forceOne = calcForceVector(indexSelf, indexOne);
  const forceTwo = calcForceVector(indexSelf, indexTwo);
  // F = M * a,  therefore a = F / M
  const accelerationX = (forceOne.forceX + forceTwo.forceX) / masses[indexSelf].mass;
  const accelerationY = (forceOne.forceY + forceTwo.forceY) / masses[indexSelf].mass;
  return {
    accelerationX,
    accelerationY
  };
};
// console.log(JSON.stringify(combineAccelerationVectors(0), null, 2));

/**
 * For each mass update new acceleration values in state data
 */
const updateAcceleration = () => {
  const accelZero = combineAccelerationVectors(0);
  const accelOne = combineAccelerationVectors(1);
  const accelTwo = combineAccelerationVectors(2);
  masses[0].accelerationX = accelZero.accelerationX;
  masses[0].accelerationY = accelZero.accelerationY;
  masses[1].accelerationX = accelOne.accelerationX;
  masses[1].accelerationY = accelOne.accelerationY;
  masses[2].accelerationX = accelTwo.accelerationX;
  masses[2].accelerationY = accelTwo.accelerationY;
};
// updateAcceleration();
// console.log(JSON.stringify(masses, null, 2));

/**
 * Advance time by one time increment.
 * Compute velocity and position changes
 */
const advanceTime = () => {
  updateAcceleration();
  for (let i = 0; i < 3; i++) {
    // v = v0 + (a * t)
    masses[i].velocityX += masses[i].accelerationX * stepSeconds;
    masses[i].velocityY += masses[i].accelerationY * stepSeconds;

    // x = x0 + (v * t)
    masses[i].positionX += masses[i].velocityX * stepSeconds;
    masses[i].positionY += masses[i].velocityY * stepSeconds;
  }
  // console.log('Velocity-one', Math.sqrt((masses[1].velocityX * masses[1].velocityX) +
  //    (masses[1].velocityY * masses[1].velocityY)));
};

/**
 * Plot x-y position on the browser canvas
 */
const plotPoints = () => {
  plotCoord(masses[0].positionX / displayScaleFactor,
    masses[0].positionY / displayScaleFactor, '#ffffff');
  plotCoord(masses[1].positionX / displayScaleFactor,
    masses[1].positionY / displayScaleFactor, '#ff0000');
  plotCoord(masses[2].positionX / displayScaleFactor,
    masses[2].positionY / displayScaleFactor, '#00ff00');
};

// ---------------------------------------
//
// Web page button event handler section
//
// ---------------------------------------

/**
 * Set variables and visibility for paused simulation
 */
const pauseSimulation = () => {
  paused = true;
  document.getElementById('pausedDiv').removeAttribute('hidden');
  console.log('Data values when paused', JSON.stringify(masses, null, 2));
};

/**
 * Set variables and visibility for active running simulation
 */
const resumeSimulation = () => {
  autoPauseTimer = 0;
  paused = false;
  document.getElementById('pausedDiv').setAttribute('hidden', '');
};

/**
 * Copy preset data at index value to simulation variables,
 * then initializes the canvas and starts simulation running.
 * @param {number} index - Index into array of preset data sets
 */
const _setPresetFromIndex = (index) => {
  initCanvas();
  masses[0].mass = presets[index][0].mass;
  masses[0].positionX = presets[index][0].positionX;
  masses[0].positionY = presets[index][0].positionY;
  masses[0].velocityX = presets[index][0].velocityX;
  masses[0].velocityY = presets[index][0].velocityY;
  masses[0].accelerationX = null;
  masses[0].accelerationY = null;

  masses[1].mass = presets[index][1].mass;
  masses[1].positionX = presets[index][1].positionX;
  masses[1].positionY = presets[index][1].positionY;
  masses[1].velocityX = presets[index][1].velocityX;
  masses[1].velocityY = presets[index][1].velocityY;
  masses[1].accelerationX = null;
  masses[1].accelerationY = null;

  masses[2].mass = presets[index][2].mass;
  masses[2].positionX = presets[index][2].positionX;
  masses[2].positionY = presets[index][2].positionY;
  masses[2].velocityX = presets[index][2].velocityX;
  masses[2].velocityY = presets[index][2].velocityY;
  masses[2].accelerationX = null;
  masses[2].accelerationY = null;

  resumeSimulation();
};

//
// Preset Buttons
document.getElementById('button0Id').addEventListener('click', () => {
  _setPresetFromIndex(0);
});
document.getElementById('button1Id').addEventListener('click', () => {
  _setPresetFromIndex(1);
});
document.getElementById('button2Id').addEventListener('click', () => {
  _setPresetFromIndex(2);
});
document.getElementById('button3Id').addEventListener('click', () => {
  _setPresetFromIndex(3);
});
document.getElementById('button4Id').addEventListener('click', () => {
  _setPresetFromIndex(4);
});
document.getElementById('button5Id').addEventListener('click', () => {
  _setPresetFromIndex(5);
});
document.getElementById('button6Id').addEventListener('click', () => {
  _setPresetFromIndex(6);
});
document.getElementById('button7Id').addEventListener('click', () => {
  _setPresetFromIndex(7);
});

//
// Pause / Resume Buttons
//
document.getElementById('resumeButton').addEventListener('click', () => {
  resumeSimulation();
});
// Click anywhere on the canvas area to pause or resume.
document.getElementById('chartContainer').addEventListener('click', () => {
  if (paused) {
    resumeSimulation();
  } else {
    pauseSimulation();
  }
});

// ----------------------------
// Launch the simulation page
// ----------------------------
setCanvasMarginsPx({ rightOffset: 20, bottomOffset: 75 });
initCanvas();
console.log('Canvas configuration', JSON.stringify(getBounds(), null, 2));
console.log('Display scale factor', displayScaleFactor.toFixed(0));
// The default preset is '3 Body' button values at index 3
_setPresetFromIndex(3);
pauseSimulation();
plotPoints();

// ----------------------------
// Simulation interval timer
// ----------------------------
let busy = false;
setInterval(() => {
  if (paused) return;
  if (!busy) {
    busy = true;
    for (let i = 0; i < stepPerPoint; i++) {
      advanceTime();
    }
    // console.log(JSON.stringify(masses[0], null, 2));
    plotPoints();
    busy = false;
  } else {
    console.log('timer tick before previous was completed.');
  }
}, IntervalTimerMilliSeconds);

// ----------------------------
// Auto-pause timer
// ----------------------------
setInterval(() => {
  if (!paused) {
    autoPauseTimer++;
    if (autoPauseTimer > 60) {
      pauseSimulation();
    }
  }
}, 1000);
