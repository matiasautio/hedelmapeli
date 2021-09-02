let coinSound = document.getElementById("coinSound");
let canDisplaySplash = true;

var slots_0 = ["null", "🍓", "🍒", "🍇", "🍊", "🍋", "🍍"];

const PRIZETABLE = [
  {
    prize: 3,
    line: ["🍋", "🍋", "🍋"],
  },

  {
    prize: 2,
    line: ["🍋", NaN, "🍋"],
  },

  {
    prize: 1,
    line: ["🍋", "🍋", NaN],
  },

  {
    prize: 1,
    line: [NaN, "🍋", "🍋"],
  },

  {
    prize: 3,
    line: ["🍓", "🍓", "🍓"],
  },

  {
    prize: 2,
    line: ["🍓", NaN, "🍓"],
  },

  {
    prize: 1,
    line: ["🍓", "🍓", NaN],
  },

  {
    prize: 1,
    line: [NaN, "🍓", "🍓"],
  },

  {
    prize: 3,
    line: ["🍒", "🍒", "🍒"],
  },

  {
    prize: 2,
    line: ["🍒", NaN, "🍒"],
  },

  {
    prize: 1,
    line: ["🍒", "🍒", NaN],
  },

  {
    prize: 1,
    line: [NaN, "🍒", "🍒"],
  },

  {
    prize: 3,
    line: ["🍇", "🍇", "🍇"],
  },

  {
    prize: 2,
    line: ["🍇", NaN, "🍇"],
  },

  {
    prize: 1,
    line: ["🍇", "🍇", NaN],
  },

  {
    prize: 1,
    line: [NaN, "🍇", "🍇"],
  },

  {
    prize: 3,
    line: ["🍊", "🍊", "🍊"],
  },

  {
    prize: 2,
    line: ["🍊", NaN, "🍊"],
  },

  {
    prize: 1,
    line: ["🍊", "🍊", NaN],
  },

  {
    prize: 1,
    line: [NaN, "🍊", "🍊"],
  },

  {
    prize: 3,
    line: ["🍍", "🍍", "🍍"],
  },

  {
    prize: 2,
    line: ["🍍", NaN, "🍍"],
  },

  {
    prize: 1,
    line: ["🍍", "🍍", NaN],
  },

  {
    prize: 1,
    line: [NaN, "🍍", "🍍"],
  },
];
