//
// Audio playback works ok enough on desktop like this - for now
// Playback on mobile is very glitchy
//
const coin = new Audio('sounds/smw_coin.wav')
const splash = new Audio('sounds/smw_power-up.wav')
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
