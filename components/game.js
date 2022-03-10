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

      obj.children.forEach(face => {
        face.material.color = new THREE.Color( 'skyblue' );
        face.material.map = texture_pool[THREE.Math.randInt(0, texture_pool.length - 1)];
      });
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

function GetFaceFromPosition(quaternion, angle_to_change, sides){
  const euler = new THREE.Euler( 0, 0, 0 );
  euler.setFromQuaternion( quaternion );
  let degree = Math.round(THREE.Math.radToDeg(euler.x));

  if(degree < 0) {
    degree += 360;
  }

  const face = (degree + angle_to_change) / (360 / sides);
  return(face);
};

function GetHiddenFacesFromOppositeFace(face){
  const default_hidden_faces = [
    3, 4, 5, 6, 7, 8, 9
  ];

  const current_hidden_faces = default_hidden_faces.map( function(value) {
    return (value + face) % 12;
  } );

  return(current_hidden_faces);
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

      const angle_to_change = 180;
      const sides = 12;
      const rotation_target = GetRotationTargetFromCurrentPosition(element.object3D.rotation.x, angle_to_change);

      const current_face = GetFaceFromPosition(element.object3D.quaternion, 0, sides);
      const next_face = GetFaceFromPosition(element.object3D.quaternion, angle_to_change, sides);
      const current_hidden_faces = GetHiddenFacesFromOppositeFace(current_face);

      for (const face of current_hidden_faces) {
        element.getObject3D('mesh').children[face].material.map = texture_pool[THREE.Math.randInt(0, texture_pool.length - 1)];
      }

      element.setAttribute("animation", "property: rotation; to: "+rotation_target+" 0 0; delay: "+delay+"");

      delay += 200;
    });
  }
});
