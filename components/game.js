let canRoll = true;

let texture_pool = [
  new THREE.TextureLoader().load( "2D_assets/T.png"),
  new THREE.TextureLoader().load( "2D_assets/J.png"),
  new THREE.TextureLoader().load( "2D_assets/Q.png"),
  new THREE.TextureLoader().load( "2D_assets/K.png")
];

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

function GetRotationTargetFromCurrentPosition(current_rotation, angle_to_change){
  const rotation_target = THREE.Math.radToDeg(current_rotation) + angle_to_change;
  return(rotation_target);
};

function GetUpcomingFaceFromCurrentPosition(quaternion, angle_to_change, sides){
  const euler = new THREE.Euler( 0, 0, 0 );
  euler.setFromQuaternion( quaternion );
  const face = (Math.round(THREE.Math.radToDeg(euler.x)) + angle_to_change) / (360 / sides);
  return(face);
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

    reels.forEach(element => {
      console.log("Reels rolling");

      // Get indices of current hidden-from-view slots
      // Change those slots to random slots

      const angle_to_change = 30;
      const sides = 12;
      const rotation_target = GetRotationTargetFromCurrentPosition(element.object3D.rotation.x, angle_to_change);
      const face = GetUpcomingFaceFromCurrentPosition(element.object3D.quaternion, angle_to_change, sides);

      element.setAttribute("animation", "property: rotation; to: "+rotation_target+" 0 0; delay: "+delay+"");
      // element.getObject3D('mesh').children[11].material.color = new THREE.Color( 'skyblue' );
      // console.log(element.getObject3D('mesh').children);
      delay += 200;
    });

    reels[2].getObject3D('mesh').children.forEach(slot => {
      slot.material.map = texture_pool[1];
    });

  }
});
