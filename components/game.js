let canRoll = true;
let balance = 3;

const texturePool = {
  T: new THREE.TextureLoader().load('2D_assets/T.png'),
  J: new THREE.TextureLoader().load('2D_assets/J.png'),
  Q: new THREE.TextureLoader().load('2D_assets/Q.png'),
  K: new THREE.TextureLoader().load('2D_assets/K.png'),
};

function RandomPropertyFrom(obj) {
  const keys = Object.keys(obj);
  const randomProperty = obj[keys[(keys.length * Math.random()) << 0]];
  return randomProperty;
}

AFRAME.registerComponent('reorderobjectcchildren', {
  init: function () {
    this.el.addEventListener('model-loaded', () => {
      // Reorder objects children
      const obj = this.el.getObject3D('mesh');
      const children = Array.from(obj.children);
      children.sort((a, b) => a.name.localeCompare(b.name));
      obj.children = children;

      // Add initial textures & color
      obj.children.forEach((face) => {
        face.material.color = new THREE.Color('skyblue');
        face.material.map = RandomPropertyFrom(texturePool);
      });
    });
  },
});

function lastReelEventListener() {
  const lastReel = document.getElementById('reel2');
  lastReel.addEventListener('animationcomplete', function () {
    canRoll = true;
  });
}

function RotateTo({ fromRotation, degreesToRotate }) {
  const rotation = THREE.Math.radToDeg(fromRotation) + degreesToRotate;
  return rotation;
}

function GetFaceFromRotation({ quaternion, faces, furtherRotation = 0 }) {
  const euler = new THREE.Euler(0, 0, 0);
  euler.setFromQuaternion(quaternion);
  let degree = Math.round(THREE.Math.radToDeg(euler.x));

  if (degree < 0) {
    degree += 360;
  }

  const face = (degree + furtherRotation) / (360 / faces);
  return face;
}

function GetHiddenFacesFrom({ face, initiallyHidden = [3, 4, 5, 6, 7, 8, 9] }) {
  const hiddenFaces = initiallyHidden.map(function (value) {
    return (value + face) % 12;
  });
  return hiddenFaces;
}

function HaveBalance(balance) {
  return balance > 1
}

const element = document.getElementById('playBtn');
element.addEventListener('click', function () {
  if (canRoll && HaveBalance(balance)) {
    canRoll = false;
    balance -= 1;
    console.log(balance)
    let reels = [];
    reels.push(document.getElementById('reel0'));
    reels.push(document.getElementById('reel1'));
    reels.push(document.getElementById('reel2'));
    let delay = 0;
    console.log('Reels rolling');

    reels.forEach((element) => {

      const degreesToRotateInOneRoll = 180;

      const faces = 12;

      const rotation_target = RotateTo({
        fromRotation: element.object3D.rotation.x,
        degreesToRotate: degreesToRotateInOneRoll,
      });

      const currentlyFacing = GetFaceFromRotation({
        quaternion: element.object3D.quaternion,
        faces: faces,
        furtherRotation: 0,
      });

      const willFaceNext = GetFaceFromRotation({
        quaternion: element.object3D.quaternion,
        faces: faces,
        furtherRotation: degreesToRotateInOneRoll,
      });

      const currentlyHiddenFaces = GetHiddenFacesFrom({face: currentlyFacing});

      for (const face of currentlyHiddenFaces) {
        element.getObject3D('mesh').children[face].material.map =
          RandomPropertyFrom(texturePool);
      }

      // Trigger animation
      element.setAttribute(
        'animation',
        'property: rotation; to: ' +
          rotation_target +
          ' 0 0; delay: ' +
          delay +
          ''
      );

      delay += 200;
    });
  }
});
