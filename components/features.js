// Mute page if checkbox is checked
// and unmute if unchecked
function muteAudio(checkboxElement) {
  if (!checkboxElement.checked) {
    //mutePage(true);
    isMuted = true;
  } else if (checkboxElement.checked) {
    //mutePage(false);
    isMuted = false;
  }
}

// Mute a singular HTML5 element
function muteMe(elem, isMute) {
  elem.muted = isMute;
}

// Try to mute all video and audio elements on the page
function mutePage(isMute) {
  var elems = document.querySelectorAll("video, audio");

  [].forEach.call(elems, function (elem) {
    muteMe(elem, isMute);
  });
}

// Use colors on page if checkbox is checked
// and use grayscale if unchecked
function changePageColor(checkboxElement) {
  if (!checkboxElement.checked) {
    toggleGreyscaleFilter();
  } else if (checkboxElement.checked) {
    toggleGreyscaleFilter();
  }
}

// Change colors to greys
function toggleGreyscaleFilter() {
  if (document.body.style.filter == "grayscale(100%)") {
    document.body.style.filter = "";
  } else {
    document.body.style.filter = "grayscale(100%)";
  }
}

// Use fruit symbols on reels if checkbox is checked
// and use card symbols if unchecked
function changeReelSymbols(checkboxElement) {
  if (!checkboxElement.checked) {
    toggleCardSymbols();
  } else if (checkboxElement.checked) {
    toggleFruitSymbols();
  }
}

// Use card symbols
function toggleCardSymbols() {
  slots_0 = ["null", "A", "K", "Q", "J", "10", "9"];
}

// Use fruit symbols
function toggleFruitSymbols() {
  slots_0 = ["null", "🍓", "🍒", "🍇", "🍊", "🍋", "🍍"];
}

// Show win message if checkbox is checked
// and do not show if unchecked
function toggelSplash(checkboxElement) {
  if (!checkboxElement.checked) {
    //document.getElementById("winMessage").style.display = "none";
    canDisplaySplash = false;
  } else if (checkboxElement.checked) {
    //document.getElementById("winMessage").style.display = "block";
    canDisplaySplash = true;
  }
}

// Displays splash when a win is made
async function displaySplash() {
  console.log("display splash called");
  if (canDisplaySplash) {
    document.getElementById("winMessage").style.display = "block";
    await new Promise((r) => setTimeout(r, 2500));
    document.getElementById("winMessage").style.display = "none";
  }
}
