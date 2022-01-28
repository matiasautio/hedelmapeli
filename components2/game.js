let canRoll = true;

AFRAME.registerComponent('reorderobjectcchildren', {
  init: function(){
    this.el.addEventListener('model-loaded', () => {
      const obj = this.el.getObject3D('mesh');
      var children = Array.from(obj.children);
      children.sort((a, b) => a.name.localeCompare(b.name));
      console.log(children);
      obj.children = children;
    });
  }
});

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
      // for what ever reason the animation needs to be reset first
      element.setAttribute("animation", "property: rotation; from: 0 0 0; to: 0 0 0");
      element.setAttribute("animation", "property: rotation; from: 0 0 0; to: 360 0 0; delay: "+delay+"");
      element.getObject3D('mesh').children[9].material.color = new THREE.Color( 'skyblue' );
      console.log(element.getObject3D('mesh').children);
      delay += 200;
    });
  }
});
