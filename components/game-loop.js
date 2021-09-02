function sleep(ms) {
  console.log("sleeping");
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function idle() {
  console.log("stop pressing play");
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
  if (money < 1) return;  // stop if not enough funds

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
  if (
    spool_0.innerHTML === spool_1.innerHTML &&
    spool_0.innerHTML === spool_2.innerHTML
  ) {
    money = money + 3;
    document.getElementById("money").innerHTML = money;
    console.log("3");
    displaySplash();
    playSplashSound();
  } else if (spool_0.innerHTML === spool_1.innerHTML) {
    money = money + 1;
    document.getElementById("money").innerHTML = money;
    console.log("1");
    displaySplash();
    playSplashSound();
  } else if (spool_0.innerHTML === spool_2.innerHTML) {
    money = money + 2;
    document.getElementById("money").innerHTML = money;
    console.log("2");
    displaySplash();
    playSplashSound();
  } else if (spool_1.innerHTML === spool_2.innerHTML) {
    money = money + 1;
    document.getElementById("money").innerHTML = money;
    console.log("1");
    displaySplash();
    playSplashSound();
  }

  document.getElementById("playBtn").onclick = function () {
    spin();
  };
}
