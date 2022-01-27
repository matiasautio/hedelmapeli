let canRoll = true;

function lastReelEventListener(){
    const lastReel = document.getElementById("reel2");
    lastReel.addEventListener('animationcomplete', function(){
        canRoll = true;
    });
  };

const element = document.getElementById("playBtn");
element.addEventListener("click", function() {
  if(canRoll) {
    canRoll = false;
    let reels = [];
    reels.push(document.getElementById("reel0"));
    reels.push(document.getElementById("reel1"));
    reels.push(document.getElementById("reel2"));
    let delay = 0;
    //document.getElementById("reel0").setAttribute("animation", "property: rotation; to: 360 0 0; dur: 2000; easing: linear; loop: false")
    reels.forEach(element => {
      console.log("Reels rolling");
      // tried delay for each reel, doesn't work yet
      // for what ever reason the animation needs to be reset first
      element.setAttribute("animation", "property: rotation; from: 0 0 0; to: 0 0 0");
      element.setAttribute("animation", "property: rotation; from: 0 0 0; to: 360 0 0; delay: "+delay+"");
      delay += 200;
      element.getObject3D('mesh').children[0].material.color = new THREE.Color( 'skyblue' );
    });
  }
});
