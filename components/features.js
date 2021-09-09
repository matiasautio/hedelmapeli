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
  slots_0 = simplifiedSlots_0;
  canUseGraphics = false;
}

// Use fruit symbols
function toggleFruitSymbols() {
  slots_0 = emojiSlots_0;
  canUseGraphics = true;
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
// Let's simpilfy this by having just one function for the splash
async function displaySplash(message, color) {
  if (canDisplaySplash) {
    var splash = document.getElementById("splash");
    var splashChild = document.getElementById("splashChild");
    splashChild.innerHTML = message;
    splashChild.style.color = color;
    //splash.firstChild.style
    splash.style.display = "block";
    await new Promise((r) => setTimeout(r, 1500));
    splash.style.display = "none";
  }
}
