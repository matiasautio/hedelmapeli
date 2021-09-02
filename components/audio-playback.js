//
// Audio playback works ok enough on desktop like this - for now
// Playback on mobile is very glitchy
//

const spinSound = new Audio("sounds/smw_stomp.wav")
const spoolSound = new Audio("sounds/smw_coin.wav")
const splashSound = new Audio("sounds/smw_power-up.wav")
const jackpotSplashSound = new Audio("sounds/smw_message_block.wav")
let isMuted = false;

// Play spin sound
function playSpinSound() {
  if(!isMuted) {
    spinSound .play();
  }
}

// Play coin sound
function playCoinSound() {
  if(!isMuted) {
    spoolSound.play();
  }
}
// Play splash effect sound
function playSplashSound() {
  if(!isMuted) {
    splashSound.play();
  }
}
async function playJackpotSplashSound() {
  if(!isMuted) {
    for (var i = 0; i < 3; i++) {
      jackpotSplashSound.play();
      await new Promise((r) => setTimeout(r, 900));
    }
  }
}
