const degreesToRotateInOneRoll = 180;

const texturePool = {
  T: new THREE.TextureLoader().load('2D_assets/T.png'),
  J: new THREE.TextureLoader().load('2D_assets/J.png'),
  Q: new THREE.TextureLoader().load('2D_assets/Q.png'),
  K: new THREE.TextureLoader().load('2D_assets/K.png'),
};

function RandomKeyFrom(obj) {
  const keys = Object.keys(obj);
  const randomKey = keys[(keys.length * Math.random()) << 0];
  return randomKey;
}

function RandomPropertyFrom(obj) {
  const randomKey = RandomKeyFrom(obj);
  const randomProperty = obj[randomKey];
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

function GetCurrentLine() {
  let reels = [];
  reels.push(document.getElementById('reel0'));
  reels.push(document.getElementById('reel1'));
  reels.push(document.getElementById('reel2'));

  const currentLine = reels.map((element) => {
    const currentlyFacing = GetFaceFromRotation({
      quaternion: element.object3D.quaternion,
    });

    const symbol =
      element.getObject3D('mesh').children[currentlyFacing].material.map.name;

    return symbol;
  });
  return currentLine;
}

function CheckIfWin() {
  currentLine = GetCurrentLine().join('');

  const winTable = [
    { line: 'TTT', win: 2 },
    { line: 'JJJ', win: 4 },
    { line: 'QQQ', win: 8 },
    { line: 'KKK', win: 8 },
  ];

  maxWin = 0;
  for (const winLine of winTable) {
    if (winLine.line === currentLine) {
      if (winLine.win > maxWin) {
        maxWin = winLine.win;
      }
    }
  }

  if (maxWin > 0) {
    DisablePlayButton()
    const splashText = document.getElementById('splashText');
    splashText.object3D.visible = true;
    splashText.setAttribute('text', 'value: ' + 0);
    splashText.setAttribute('text', 'opacity: ' + 1);
    splashText.setAttribute('animation__2', 'to: ' + maxWin);
    splashText.emit('startWinAnim', null, false);
    splashText.emit('startWinCounterAnim', null, false);
  } else {
    EnablePlayButton()
  }
}

function RotateTo({ fromRotation, degreesToRotate }) {
  const rotation = THREE.Math.radToDeg(fromRotation) + degreesToRotate;
  return rotation;
}

function GetFaceFromRotation({ quaternion, faces = 12 }) {
  const euler = new THREE.Euler(0, 0, 0);
  euler.setFromQuaternion(quaternion);
  let degree = Math.round(THREE.Math.radToDeg(euler.x));

  if (degree < 0) {
    degree += 360;
  }

  const face = degree / (360 / faces);
  return face;
}

function GetHiddenFacesFrom({ face, initiallyHidden = [3, 4, 5, 6, 7, 8, 9] }) {
  const hiddenFaces = initiallyHidden.map(function (value) {
    return (value + face) % 12;
  });
  return hiddenFaces;
}

function HaveBalance(balance) {
  return balance >= 1;
}

function ChangeBalanceBy(balance, change = 1) {
  // make sure that 1 + 1 and not 1 + "1" (= 11)
  return balance + change;
}

function WhichReel(element) {
  if (element.id === 'reel0') {
    return 0;
  } else if (element.id === 'reel1') {
    return 1;
  } else if (element.id === 'reel2') {
    return 2;
  }
}

function DrawNextLine(isAutowin) {
  if (isAutowin) {
    const textureKey = RandomKeyFrom(texturePool);
    return [textureKey, textureKey, textureKey];
  } else {
    return [
      RandomKeyFrom(texturePool),
      RandomKeyFrom(texturePool),
      RandomKeyFrom(texturePool),
    ];
  }
}

function Roll(isAutowin) {
  let reels = [];
  reels.push(document.getElementById('reel0'));
  reels.push(document.getElementById('reel1'));
  reels.push(document.getElementById('reel2'));
  let delay = 0;

  const nextLineShouldBe = DrawNextLine(isAutowin);

  reels.forEach((element) => {
    const rotation_target = RotateTo({
      fromRotation: element.object3D.rotation.x,
      degreesToRotate: degreesToRotateInOneRoll,
    });

    const currentlyFacing = GetFaceFromRotation({
      quaternion: element.object3D.quaternion,
    });

    const currentlyHiddenFaces = GetHiddenFacesFrom({
      face: currentlyFacing,
    });

    const willBeFacing =
      (currentlyFacing + degreesToRotateInOneRoll / (360 / 12)) % 12;

    for (const face of currentlyHiddenFaces) {
      let lineItem = RandomKeyFrom(texturePool);
      if (face === willBeFacing) {
        const whichReel = WhichReel(element);
        lineItem = nextLineShouldBe[whichReel];
      }
      element.getObject3D('mesh').children[face].material.map =
        texturePool[lineItem];
      element.getObject3D('mesh').children[face].material.map.name = lineItem;
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

function AddLastReelAnimationEventListener() {
  const lastReel = document.getElementById('reel2');
  lastReel.addEventListener('animationcomplete', function () {
    CheckIfWin();
  });
}

function IsAnimationCounterAnimation(e) {
  return e.detail.name === 'animation__2';
}

function AddWinToBalance() {
  const balance = Number(document.getElementById('balance').innerHTML);
  document.getElementById('balance').innerHTML = ChangeBalanceBy(
    balance,
    maxWin
  );
}

function DisablePlayButton() {
  document.getElementById('playBtn').disabled = true;
}

function EnablePlayButton() {
  document.getElementById('playBtn').disabled = false;
}

function EndRoll() {
  AddWinToBalance();
  EnablePlayButton();
}

function AddWinCounterAnimationEventListener() {
  const splashText = document.getElementById('splashText');
  splashText.addEventListener('animationcomplete', function (e) {
    if (IsAnimationCounterAnimation(e)) {
      EndRoll();
    }
  });
}

function DeductFeeFromBalance(balance) {
  document.getElementById('balance').innerHTML = balance - 1;
}

function AttemptRoll() {
  const isAutowin = document.getElementById('autowin').checked;
  const balance = Number(document.getElementById('balance').innerHTML);
  if (HaveBalance(balance)) {
    DisablePlayButton()
    DeductFeeFromBalance(balance);
    Roll(isAutowin);
  }
}

function AddPlayButtonEventListener() {
  const element = document.getElementById('playBtn');
  element.addEventListener('click', function () {
    AttemptRoll();
  });
}

function AddEventListeners() {
  AddLastReelAnimationEventListener();
  AddWinCounterAnimationEventListener();
  AddPlayButtonEventListener();
}
