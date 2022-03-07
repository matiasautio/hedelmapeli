let coinSound = document.getElementById("coinSound");
let canDisplaySplash = true;
let canUseGraphics = true;

let keepSpinning = false;
let scatterSpins = 2;

let winColor = '#ffd700';
let jackpotColor = '#f03a17';
let scatterColor = '#bad80a';

let simplifiedSlots_0 = ["null", "A", "K", "Q", "J", "🍹", "⭐"];
let emojiSlots_0 = ["null", "🍓", "🍒", "🍇", "🍊", "🍹", "⭐"];
var slots_0 = ["null", "🍓", "🍒", "🍇", "🍊", "🍹", "⭐"];

// variables to enable scatter debugging
let scatterSlots = ["🍹", "🍹", "🍹"];

const PRIZETABLE = [
  { prize: 3, line: ["🍋", "🍋", "🍋"] },
  { prize: 2, line: ["🍋", NaN, "🍋"] },
  { prize: 1, line: ["🍋", "🍋", NaN] },
  { prize: 1, line: [NaN, "🍋", "🍋"] },
  { prize: 3, line: ["🍓", "🍓", "🍓"] },
  { prize: 2, line: ["🍓", NaN, "🍓"] },
  { prize: 1, line: ["🍓", "🍓", NaN] },
  { prize: 1, line: [NaN, "🍓", "🍓"] },
  { prize: 3, line: ["🍒", "🍒", "🍒"] },
  { prize: 2, line: ["🍒", NaN, "🍒"] },
  { prize: 1, line: ["🍒", "🍒", NaN] },
  { prize: 1, line: [NaN, "🍒", "🍒"] },
  { prize: 3, line: ["🍇", "🍇", "🍇"] },
  { prize: 2, line: ["🍇", NaN, "🍇"] },
  { prize: 1, line: ["🍇", "🍇", NaN] },
  { prize: 1, line: [NaN, "🍇", "🍇"] },
  { prize: 3, line: ["🍊", "🍊", "🍊"] },
  { prize: 2, line: ["🍊", NaN, "🍊"] },
  { prize: 1, line: ["🍊", "🍊", NaN] },
  { prize: 1, line: [NaN, "🍊", "🍊"] },
  { prize: 3, line: ["🍍", "🍍", "🍍"] },
  { prize: 2, line: ["🍍", NaN, "🍍"] },
  { prize: 1, line: ["🍍", "🍍", NaN] },
  { prize: 1, line: [NaN, "🍍", "🍍"] },
  { prize: 999, line: ["🍹", "🍹", "🍹"] },
];
