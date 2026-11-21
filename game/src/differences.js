// Twin Spots — the difference sets. Each scene is drawn twice (original and
// changed) by scenes.js; every entry below is one deliberate change, with
// its panel-local position (600x600), click radius and human label.
export const SCENES = [
  {
    id: 'garden',
    name: 'Sunny Garden',
    tagline: 'A bright garden morning',
    difficulty: 'Easy',
    seed: 11,
    differences: [
      { x: 96, y: 88, r: 58, label: 'Sun rays', note: 'two rays went missing' },
      { x: 428, y: 72, r: 42, label: 'Cloud', note: 'a cloud drifted away' },
      { x: 178, y: 522, r: 24, label: 'Tulip', note: 'one tulip changed colour' },
      { x: 468, y: 238, r: 20, label: 'Apple', note: 'an apple fell off the tree' },
      { x: 330, y: 332, r: 22, label: 'Fence post', note: 'a fence post vanished' },
      { x: 252, y: 182, r: 22, label: 'Butterfly', note: 'the butterfly flew off' },
      { x: 522, y: 152, r: 20, label: 'Bird', note: 'a new bird appeared' },
      { x: 92, y: 542, r: 28, label: 'Watering can', note: 'a watering can showed up' },
    ],
  },
  {
    id: 'kitchen',
    name: 'Cozy Kitchen',
    tagline: 'Tea is brewing and something moved',
    difficulty: 'Medium',
    seed: 23,
    differences: [
      { x: 300, y: 92, r: 36, label: 'Clock', note: 'the clock hands moved' },
      { x: 252, y: 372, r: 22, label: 'Teapot lid', note: 'the lid knob is gone' },
      { x: 432, y: 428, r: 30, label: 'Fruit bowl', note: 'an apple went missing' },
      { x: 118, y: 152, r: 26, label: 'Curtain', note: 'the curtain tie changed colour' },
      { x: 352, y: 212, r: 24, label: 'Jar label', note: 'a jar label changed colour' },
      { x: 252, y: 322, r: 20, label: 'Steam', note: 'the teapot stopped steaming' },
      { x: 482, y: 122, r: 32, label: 'Window sky', note: 'the sun hid behind a cloud' },
      { x: 300, y: 542, r: 26, label: 'Rug stripe', note: 'a rug stripe changed colour' },
    ],
  },
  {
    id: 'harbor',
    name: 'Night Harbor',
    tagline: 'The harbour sleeps under the moon',
    difficulty: 'Tricky',
    seed: 37,
    differences: [
      { x: 112, y: 92, r: 42, label: 'Moon', note: 'a moon crater faded away' },
      { x: 302, y: 62, r: 16, label: 'Star', note: 'a star went out' },
      { x: 482, y: 182, r: 42, label: 'Lighthouse beam', note: 'the beam swung the other way' },
      { x: 202, y: 422, r: 32, label: 'Sail', note: 'a sail changed colour' },
      { x: 422, y: 302, r: 20, label: 'Window light', note: 'a window went dark' },
      { x: 522, y: 502, r: 20, label: 'Buoy', note: 'the buoy changed colour' },
      { x: 112, y: 522, r: 24, label: 'Moon reflection', note: 'the moon lost its reflection' },
      { x: 482, y: 108, r: 18, label: 'Lighthouse flag', note: 'the flag blew away' },
    ],
  },
];
