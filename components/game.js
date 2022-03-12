let currentWin = 0;

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
  const reels = [
    document.getElementById('reel0'),
    document.getElementById('reel1'),
    document.getElementById('reel2'),
  ];

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

function DisablePlayButton() {
  document.getElementById('playBtn').disabled = true;
}

function EnablePlayButton() {
  document.getElementById('playBtn').disabled = false;
}

function CheckIfWin() {
  const currentLine = GetCurrentLine().join('');

  const winTable = [
    { line: 'TTT', win: 2 },
    { line: 'JJJ', win: 4 },
    { line: 'QQQ', win: 8 },
    { line: 'KKK', win: 8 },
  ];

  for (const winLine of winTable) {
    if (winLine.line === currentLine) {
      if (winLine.win > currentWin) {
        currentWin = winLine.win;
      }
    }
  }

  if (currentWin > 0) {
    DisablePlayButton();
    const winSplash = document.getElementById('winSplash');
    winSplash.object3D.visible = true;
    winSplash.setAttribute('text', 'value: ' + 0);
    winSplash.setAttribute('text', 'opacity: ' + 1);
    winSplash.setAttribute('animation__counter', 'to: ' + currentWin);
    winSplash.emit('startWinSplashFade', null, false);
    winSplash.emit('startWinSplashCounter', null, false);
    winSplash.components.sound.playSound();
  } else {
    EnablePlayButton();
  }
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

function GetDuration() {
  const shouldMultiplyDuration = document.getElementById('fastspin').checked;
  const duration = 2000;
  if (shouldMultiplyDuration) {
    return duration * 0.3;
  } else {
    return duration;
  }
}

function TurnReel({ element, turn, delay }) {
  const rotation_target =
    THREE.Math.radToDeg(element.object3D.rotation.x) + (turn * 360) / 12;

  const duration = GetDuration();

  element.setAttribute(
    'animation',
    'property: rotation; to: ' +
      rotation_target +
      ' 0 0; \
    delay: ' +
      delay +
      '; \
    dur: ' +
      duration +
      ';'
  );

  element.components.sound.playSound();
}

function ChangeHiddenFaceTextures({ element, willTurn, nextFaceTexture }) {
  const currentlyFacing = GetFaceFromRotation({
    quaternion: element.object3D.quaternion,
  });

  const currentlyHiddenFaces = GetHiddenFacesFrom({
    face: currentlyFacing,
  });

  const willBeFacing = (currentlyFacing + willTurn) % 12;

  for (const face of currentlyHiddenFaces) {
    let lineItem = RandomKeyFrom(texturePool);
    if (face === willBeFacing) {
      lineItem = nextFaceTexture;
    }
    element.getObject3D('mesh').children[face].material.map =
      texturePool[lineItem];
    element.getObject3D('mesh').children[face].material.map.name = lineItem;
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
  const nextLineShouldBe = DrawNextLine(isAutowin);

  let delay = 0;

  const reels = [
    document.getElementById('reel0'),
    document.getElementById('reel1'),
    document.getElementById('reel2'),
  ];

  const facesForReelsToTurn = [6, 6, 6];

  const turnAnimationDelays = [0, 200, 400];

  reels.forEach((element, index) => {
    const facesToTurn = facesForReelsToTurn[index];
    const nextFaceTexture = nextLineShouldBe[index];

    ChangeHiddenFaceTextures({
      element: element,
      willTurn: facesToTurn,
      nextFaceTexture: nextFaceTexture,
    });

    const delay = turnAnimationDelays[index];

    TurnReel({
      element: element,
      turn: facesToTurn,
      delay: delay,
    });
  });
}

function AddLastReelAnimationEventListener() {
  const lastReel = document.getElementById('reel2');
  lastReel.addEventListener('animationcomplete', function () {
    CheckIfWin();
  });
}

function IsAnimationCounterAnimation(e) {
  return e.detail.name === 'animation__counter';
}

function AddWinToBalance() {
  const balance = Number(document.getElementById('balance').innerHTML);
  document.getElementById('balance').innerHTML = balance + currentWin;
  currentWin = 0;
}

function EndRoll() {
  AddWinToBalance();
  EnablePlayButton();
}

function AddWinCounterAnimationEventListener() {
  const winSplash = document.getElementById('winSplash');
  winSplash.addEventListener('animationcomplete', function (e) {
    if (IsAnimationCounterAnimation(e)) {
      EndRoll();
    }
  });
}

function DeductFeeFromBalance(balance) {
  document.getElementById('balance').innerHTML = balance - 1;
}

function HaveBalance(balance) {
  return balance >= 1;
}

function AttemptRoll() {
  const isAutowin = document.getElementById('autowin').checked;
  const balance = Number(document.getElementById('balance').innerHTML);
  if (HaveBalance(balance)) {
    DisablePlayButton();
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
