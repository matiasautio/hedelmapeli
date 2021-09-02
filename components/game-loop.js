function sleep(ms) {
  console.log("sleeping");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function idle() {
  console.log("stop pressing play");
}

// Check if spin matches any from prizetable
function checkWinningLines(spinLine) {
  let prizeMatch = new Array(PRIZETABLE.length).fill(0);
  for (let i = 0; i < spinLine.length; i++) {
    for (let j = 0; j < PRIZETABLE.length; j++) {
      if (Number.isNaN(PRIZETABLE[j]["line"][i])) {
        prizeMatch[j]++;
      } else if (spinLine[i] == PRIZETABLE[j]["line"][i]) {
        prizeMatch[j]++;
      }
    }
  }
  return prizeMatch;
}

// Find highest prize won and zero if no wins
function findHighestPrizeForSpin(prizeMatch) {
  let highestPrize = 0;
  for (let i = 0; i < PRIZETABLE.length; i++) {
    if (prizeMatch[i] == 3 && PRIZETABLE[i]["prize"] > highestPrize) {
      highestPrize = PRIZETABLE[i]["prize"];
    }
  }
  return highestPrize;
}

// Remap letters and numbers to emoji
function remapGraphics(lineToMap) {
  for(var i = 0; i < lineToMap.length; i++) {
    simplifiedSlots_0 = ["null", "A", "K", "Q", "J", "10", "9"];
    let simplifiedIndex = simplifiedSlots_0.indexOf(lineToMap[i], 0);
    console.log(lineToMap[i], emojiSlots_0[simplifiedIndex]);
    lineToMap[i] = emojiSlots_0[simplifiedIndex];
  }
  return lineToMap;
  /* let prizeMatch = new Array(PRIZETABLE.length).fill(0);
  for (let i = 0; i < lineToMap.length; i++) {
    for (let j = 0; j < PRIZETABLE.length; j++) {
      if (Number.isNaN(PRIZETABLE[j]["line"][i])) {
        prizeMatch[j]++;
      } else if (lineToMap[i] == PRIZETABLE[j]["line"][i]) {
        prizeMatch[j]++;
      }
    }
  }
  return prizeMatch;*/
}

// async because await is used to add delay between icon changes in the spools
async function spin() {
  // to do: change the slot variables to contain different icons
  // atm all spools use slots_0
  // const slots_0 = ["null", "🍓", "🍒", "🍇", "🍊", "🍋", "🍍"];
  const slots_1 = ["null", "🍓", "🍒", "🍇", "🍊", "🍋", "🍍"];
  const slots_2 = ["null", "🍓", "🍒", "🍇", "🍊", "🍋", "🍍"];

  // Divs for each of the three spools
  const spool_0 = document.getElementById("one");
  const spool_1 = document.getElementById("two");
  const spool_2 = document.getElementById("three");

  let money = document.getElementById("money").innerHTML;
  let playCost = 1;
  money = parseFloat(money);
  if (money < 1) return; // stop if not enough funds

  // makes sure that the player can only roll once. this is reset after results are in
  document.getElementById("playBtn").onclick = function () {
    idle();
  };

  money = money - playCost;
  document.getElementById("money").innerHTML = money;

  // Calcute a random value for each spool to display
  var one = 1 + Math.floor(Math.random() * Math.floor(slots_0.length - 1));
  var two = 1 + Math.floor(Math.random() * Math.floor(slots_0.length - 1));
  var three = 1 + Math.floor(Math.random() * Math.floor(slots_0.length - 1));

  let a = 1;
  let sleepTime = 100;

  playSpinSound();
  // This short delay is nice feedback with the sound, let's remove it if there's no audio
  if(!isMuted) {
    await new Promise((r) => setTimeout(r, 200));
  }

  // iterate on the array of the slots, creating an effect of spinning spools
  for (let i = 1; i < slots_0.length + one; i++) {
    playCoinSound();
    await new Promise((r) => setTimeout(r, sleepTime));
    spool_0.innerHTML = slots_0[a];
    a++;
    if (a == slots_0.length) {
      a = 1;
    }
  }
  // by adding this we get the probability of a die roll when the slots array length is 6
  // it also means that iterating on the array is just for show
  document.getElementById("one").innerHTML = slots_0[one];

  let b = 1;
  for (let i = 1; i < slots_0.length + two; i++) {
    playCoinSound();
    await new Promise((r) => setTimeout(r, sleepTime));
    spool_1.innerHTML = slots_0[b];
    b++;
    if (b == slots_0.length) {
      b = 1;
    }
  }
  document.getElementById("two").innerHTML = slots_0[two];

  let c = 1;
  for (let i = 0; i < slots_0.length + three; i++) {
    playCoinSound();
    await new Promise((r) => setTimeout(r, sleepTime));
    spool_2.innerHTML = slots_0[c];
    c++;
    if (c == slots_0.length) {
      c = 1;
    }
    if (i >= (slots_0.length + three) / 2) {
      sleepTime = sleepTime * 1.4;
    }
  }
  document.getElementById("three").innerHTML = slots_0[three];

  // prints a neat representation of the icon results to the console
  var zero = spool_0.innerHTML;
  var uno = spool_1.innerHTML;
  var dos = spool_2.innerHTML;
  console.log(zero, uno, dos);

  // checks the resulting sum of money
  // x x x = 3
  // x 0 x = 2
  // x x 0 or 0 x x = 1
  // yes, probability for x0x or xx0 is the same, but they give different amounts of money now
  
  let spinLine = [spool_0.innerHTML, spool_1.innerHTML, spool_2.innerHTML];
  let prizeMatch;
  if (canUseGraphics) {
    prizeMatch = checkWinningLines(spinLine);
  } else {
    spinline = remapGraphics(spinLine);
    prizeMatch = checkWinningLines(spinLine);
  }
  console.log(prizeMatch);
  let prize = findHighestPrizeForSpin(prizeMatch);
  money = money + prize;
  document.getElementById("money").innerHTML = money;
  if (prize != 0 && prize <= 2) {
    displaySplash();
    playSplashSound();
  }
  else if (prize == 3) {
    displayJackpotSplash();
    playJackpotSplashSound();
  }

  document.getElementById("playBtn").onclick = function () {
    spin();
  };
}

// Simplified spin function to simulate a jackpot
function jackpot() {
  const spool_0 = document.getElementById("one");
  const spool_1 = document.getElementById("two");
  const spool_2 = document.getElementById("three");
  spool_0.innerHTML = slots_0[1];
  spool_1.innerHTML = slots_0[1];
  spool_2.innerHTML = slots_0[1];

  let spinLine = [spool_0.innerHTML, spool_1.innerHTML, spool_2.innerHTML];
  let prizeMatch = checkWinningLines(spinLine);
  let prize = findHighestPrizeForSpin(prizeMatch);

  if (prize != 0 && prize <= 2) {
    displaySplash();
    playSplashSound();
  }
  else if (prize == 3) {
    displayJackpotSplash();
    playJackpotSplashSound();
  }
}
