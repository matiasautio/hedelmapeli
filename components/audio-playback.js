//
// Audio playback works ok enough on desktop like this - for now
// Playback on mobile is very glitchy
//
const coin = new Audio("sounds/smw_coin.wav")
const splash = new Audio("sounds/smw_power-up.wav")
const jackpotSplash = new Audio("sounds/smw_message_block.wav")
let isMuted = false;

// Play coin sound
function playCoinSound() {
  if(!isMuted) {
    coin.play();
  }
}
// Play splash effect sound
function playSplashSound() {
  if(!isMuted) {
    splash.play();
  }
}
async function playJackpotSplashSound() {
  if(!isMuted) {
    for (var i = 0; i < 3; i++) {
      jackpotSplash.play();
      await new Promise((r) => setTimeout(r, 900));
    }
  }
}
