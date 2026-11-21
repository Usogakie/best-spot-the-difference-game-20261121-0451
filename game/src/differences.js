// The differences of every level, in panel coordinates (each panel is 560x420).
// A difference is a circle the player must click: x, y and radius r, plus a short
// name shown when it is found. The right panel's painter reads the same ids from
// `mods` and draws that element altered, so the two pictures agree exactly with
// this table: every entry here is a real, visible change, and every change in the
// right picture is listed here.

export const DIFFERENCES = {
  garden: [
    { id: 'sun-rays', x: 72, y: 62, r: 44, name: 'The sun lost two rays' },
    { id: 'cloud', x: 305, y: 72, r: 32, name: 'A cloud drifted away' },
    { id: 'smoke', x: 148, y: 168, r: 26, name: 'No smoke from the chimney' },
    { id: 'apples', x: 442, y: 198, r: 38, name: 'Two apples are gone' },
    { id: 'flower', x: 318, y: 356, r: 22, name: 'A flower changed colour' },
    { id: 'butterfly', x: 382, y: 122, r: 24, name: 'The butterfly flew off' },
    { id: 'picket', x: 252, y: 332, r: 22, name: 'A fence picket is missing' },
  ],
  kitchen: [
    { id: 'clock', x: 468, y: 82, r: 32, name: 'The clock shows another time' },
    { id: 'steam', x: 202, y: 148, r: 26, name: 'The kettle stopped steaming' },
    { id: 'fruit', x: 302, y: 302, r: 32, name: 'An apple left the bowl' },
    { id: 'tail', x: 424, y: 330, r: 32, name: "The cat's tail dropped" },
    { id: 'mug', x: 142, y: 300, r: 22, name: 'A mug changed colour' },
    { id: 'bird', x: 92, y: 112, r: 26, name: 'A bird left the window' },
    { id: 'bloom', x: 502, y: 302, r: 24, name: 'The plant lost its flower' },
  ],
  harbor: [
    { id: 'moon', x: 92, y: 72, r: 32, name: 'The moon turned crescent' },
    { id: 'beam', x: 122, y: 182, r: 38, name: 'The lighthouse beam is out' },
    { id: 'star', x: 352, y: 62, r: 18, name: 'A star went out' },
    { id: 'sail', x: 302, y: 282, r: 30, name: 'A sail changed colour' },
    { id: 'buoy', x: 452, y: 352, r: 22, name: 'The buoy drifted away' },
    { id: 'gull', x: 252, y: 102, r: 24, name: 'A gull flew off' },
    { id: 'window', x: 482, y: 222, r: 24, name: 'A cottage window went dark' },
    { id: 'fish', x: 202, y: 362, r: 22, name: 'The jumping fish is gone' },
  ],
};

/** The differences of a level, by its id. */
export function diffsOf(levelId) {
  return DIFFERENCES[levelId] ?? [];
}
