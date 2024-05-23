'use strict';

// Units:
//
//   time: seconds
//   mass: kg
//   position: m
//   velocity: m/s
//   acceleration: m/(s^2)
//   force: kg-m/(s^2)  (newtons)

const farAwayDistance = 1e30;

export const presets = [
  // Index 0
  [
    {
      buttonLabel: 'Circle',
      mass: 5e24,
      positionX: 0,
      positionY: 0,
      velocityX: 0,
      velocityY: -55
    },
    {
      mass: 3.5e23,
      positionX: 400000000,
      positionY: 0,
      velocityX: 0,
      velocityY: 875
    },
    {
      mass: 1.5e23,
      positionX: farAwayDistance, // Insignificant interaction at large distance
      positionY: 0,
      velocityX: 0,
      velocityY: 0
    }
  ],
  // Index 1
  [
    {
      buttonLabel: 'Ellipse',
      mass: 5e24,
      positionX: 0,
      positionY: 0,
      velocityX: 0,
      velocityY: -15
    },
    {
      mass: 3.5e23,
      positionX: 400000000,
      positionY: 0,
      velocityX: 0,
      velocityY: 400
    },
    {
      mass: 1.5e23,
      positionX: farAwayDistance, // Insignificant interaction at large distance
      positionY: 0,
      velocityX: 0,
      velocityY: 0
    }
  ],
  // Index 2
  [
    {
      buttonLabel: 'Fly By',
      mass: 5e24,
      positionX: 0,
      positionY: 0,
      velocityX: 0,
      velocityY: 0
    },
    {
      mass: 3.5e23,
      positionX: 600000000,
      positionY: 800000000,
      velocityX: -1000,
      velocityY: -1000
    },
    {
      mass: 1.5e23,
      positionX: farAwayDistance, // Insignificant interaction at large distance
      positionY: 0,
      velocityX: 0,
      velocityY: 0
    }
  ],
  // Index 3
  [
    {
      buttonLabel: '3 Body',
      paused: false,
      mass: 5e24,
      positionX: 0,
      positionY: 0,
      velocityX: 0,
      velocityY: -67
    },
    {
      mass: 3.5e23,
      positionX: 400000000,
      positionY: 0,
      velocityX: 0,
      velocityY: 875
    },
    {
      mass: 1.5e21,
      positionX: 440000000,
      positionY: 0,
      velocityX: 0,
      velocityY: 1600
    }
  ],
  // Index 4
  [
    {
      buttonLabel: 'Binary',
      mass: 6e24,
      positionX: -100000000,
      positionY: 0,
      velocityX: 0,
      velocityY: -700
    },
    {
      mass: 4e24,
      positionX: 100000000,
      positionY: 0,
      velocityX: 0,
      velocityY: 1000
    },
    {
      mass: 1.5e23,
      positionX: farAwayDistance, // Insignificant interaction at large distance
      positionY: 0,
      velocityX: 0,
      velocityY: 0
    }
  ],
  // Index 5
  [
    {
      buttonLabel: 'Binary+1',
      mass: 6e24,
      positionX: -100000000,
      positionY: 0,
      velocityX: 0,
      velocityY: -700
    },
    {
      mass: 4e24,
      positionX: 100000000,
      positionY: 0,
      velocityX: 0,
      velocityY: 1000
    },
    {
      mass: 1e23,
      positionX: 500000000,
      positionY: 0,
      velocityX: 0,
      velocityY: 1130
    }
  ],
  // Index 6
  // A small symmetrical lateral velocity was added to avoid impact
  [
    {
      buttonLabel: '2-at-rest',
      mass: 5e24,
      positionX: 0,
      positionY: 400000000,
      velocityX: 90,
      velocityY: 0
    },
    {
      mass: 5e24,
      positionX: 0,
      positionY: -400000000,
      velocityX: -100,
      velocityY: 0
    },
    {
      mass: 5e24,
      positionX: farAwayDistance, // Insignificant interaction at large distance
      positionY: 0,
      velocityX: 0,
      velocityY: 0
    }
  ],
  // Index 7
  // An ad-hoc lateral velocity was added to produce interesting result
  [
    {
      buttonLabel: '3-at-rest',
      mass: 5e24,
      positionX: -400000000,
      positionY: 231000000,
      velocityX: 100,
      velocityY: 0
    },
    {
      mass: 5e24,
      positionX: 400000000,
      positionY: 231000000,
      velocityX: 0,
      velocityY: -100
    },
    {
      mass: 5e24,
      positionX: 0,
      positionY: -462000000,
      velocityX: 100,
      velocityY: 0
    }
  ]
];

export default presets;
