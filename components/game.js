const game = {
  status: 'READY', // READY, ROLLINCOMING, ROLLONGOING, STOPPED, PAYINGWINS, UPCOMINGBONUS, BONUS
  optionsNextRoll: { autoWin: false, autoBonus: false },
  pendingWins: 0,
  balance: 5,
  reelInfoById: {
    reel0: {
      now: { centerFaceIndex: 0, n: 12, hidden: [3, 4, 5, 6, 7, 8, 9] },
      next: {
        centerFaceIndex: null,
        n: null,
        hidden: [null, null, null, null, null, null, null],
      },
    },
    reel1: {
      now: { centerFaceIndex: 0, n: 12, hidden: [3, 4, 5, 6, 7, 8, 9] },
      next: {
        centerFaceIndex: null,
        n: null,
        hidden: [null, null, null, null, null, null, null],
      },
    },
    reel2: {
      now: { centerFaceIndex: 0, n: 12, hidden: [3, 4, 5, 6, 7, 8, 9] },
      next: {
        centerFaceIndex: null,
        n: null,
        hidden: [null, null, null, null, null, null, null],
      },
    },
  },
  round: 0,
};

const texturePool = {
  T: new THREE.TextureLoader().load('2D_assets/T.png'),
  J: new THREE.TextureLoader().load('2D_assets/J.png'),
  Q: new THREE.TextureLoader().load('2D_assets/Q.png'),
  K: new THREE.TextureLoader().load('2D_assets/K.png'),
  W: new THREE.TextureLoader().load('2D_assets/W.png'),
  S: new THREE.TextureLoader().load('2D_assets/S.png'),
};

function RandomKeyFrom(obj) {
  const keys = Object.keys(obj);
  const randomKey = keys[(keys.length * Math.random()) << 0];
  return randomKey;
}

AFRAME.registerComponent('reorderobjectcchildren', {
  init: function () {
    this.el.addEventListener('model-loaded', () => {
      // Reorder objects children
      const obj = this.el.getObject3D('mesh');
      if (typeof obj !== 'undefined') {
        // Because model-loaded more than once
        const children = Array.from(obj.children);
        children.sort((a, b) => a.name.localeCompare(b.name));
        obj.children = children;

        // Add initial textures & color
        obj.children.forEach((face) => {
          face.material.color = new THREE.Color('skyblue');
          const textureKey = RandomKeyFrom(texturePool);
          face.material.map = texturePool[textureKey];
        });
      }
    });
  },
});

function toggleGreyscaleFilter() {
  if (document.getElementById('grayscale').checked == true) {
    document.body.style.filter = 'grayscale(100%)';
  } else {
    document.body.style.filter = '';
  }
}

function GetCurrentLine() {
  const reels = [
    document.getElementById('reel0'),
    document.getElementById('reel1'),
    document.getElementById('reel2'),
  ];

  const currentLine = reels.map((element) => {
    const currentlyFacing = game.reelInfoById[element.id].now.centerFaceIndex;

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

function TransformWildsToWin({ lineWithWilds, replaceWildsWith }) {
  // for letter in lineWithWilds, if W then replace by letter in replaceWildsWith
  let transformed = '';
  for (var i = 0; i < lineWithWilds.length; i++) {
    if (lineWithWilds.charAt(i) === 'W') {
      transformed += replaceWildsWith.charAt(i);
    } else {
      transformed += lineWithWilds.charAt(i);
    }
  }
  return transformed;
}

function EvaluateWins() {
  const currentLine = GetCurrentLine().join('');

  if (currentLine === '') {
    return;
  }

  const winTable = [
    { line: 'TTT', win: 2 },
    { line: 'JJJ', win: 4 },
    { line: 'QQQ', win: 8 },
    { line: 'KKK', win: 8 },
    { line: 'WWW', win: 16 },
  ];

  let max = 0;
  for (const winLine of winTable) {
    const currentLineWildsTransformed = TransformWildsToWin({
      lineWithWilds: currentLine,
      replaceWildsWith: winLine.line,
    });
    if (winLine.line === currentLineWildsTransformed) {
      if (winLine.win > max) {
        max = winLine.win;
      }
    }
  }
  game.pendingWins += max;

  if (game.pendingWins > 0) {
    game.status = 'PAYINGWINS';
    DisablePlayButton();
    const winSplash = document.getElementById('winSplash');
    winSplash.object3D.visible = true;
    winSplash.setAttribute('text', 'value: ' + 0);
    winSplash.setAttribute('text', 'opacity: ' + 1);
    winSplash.setAttribute('animation__counter', 'to: ' + game.pendingWins);
    winSplash.emit('startWinSplashFade', null, false);
    winSplash.emit('startWinSplashCounter', null, false);
    winSplash.components.sound.playSound();
  }

  if (currentLine === 'SSS') {
    game.status = 'UPCOMINGBONUS';
  }
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

function StatusFromRollingToStopped() {
  game.status = 'STOPPED';

  const ids = ['reel0', 'reel1', 'reel2'];

  for (id of ids) {
    game.reelInfoById[id].now.centerFaceIndex =
      game.reelInfoById[id].next.centerFaceIndex;
    game.reelInfoById[id].now.n = game.reelInfoById[id].next.n;

    const nextHidden = game.reelInfoById[id].next.hidden;
    for (let i = 0; i < nextHidden.length; i++) {
      game.reelInfoById[id].now.hidden[i] = nextHidden[i];
    }
  }

  EvaluateWins();
}

function TurnReel({ element, turn, delay }) {
  const n = game.reelInfoById[element.id].now.n;

  const rotation_target =
    THREE.Math.radToDeg(element.object3D.rotation.x) + (turn * 360) / n;

  const duration = GetDuration();

  element.components.animation__normalroll.data.to = rotation_target + ' 0 0';
  element.components.animation__normalroll.data.delay = delay;
  element.components.animation__normalroll.data.dur = duration;

  element.emit('startNormalRoll', null, false);

  element.components.sound.playSound();
}

function ChangeHiddenFaceTextures({ element, nextFaceTexture }) {
  const hidden = game.reelInfoById[element.id].now.hidden;
  const nextFacing = game.reelInfoById[element.id].next.centerFaceIndex;

  for (const face of hidden) {
    let lineItem = RandomKeyFrom(texturePool);
    if (face === nextFacing) {
      lineItem = nextFaceTexture;
    }
    element.getObject3D('mesh').children[face].material.map =
      texturePool[lineItem];
    element.getObject3D('mesh').children[face].material.map.name = lineItem;
  }
}

function DrawNextLine() {
  if (game.optionsNextRoll.autoBonus) {
    return ['S', 'S', 'S'];
  } else if (game.optionsNextRoll.autoWin) {
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

function SetNextReelInfo(facesForReelsToTurn) {
  facesForReelsToTurn.forEach((nudges, index) => {
    const id = 'reel' + index;

    game.reelInfoById[id].next.n = game.reelInfoById[id].now.n;

    const nextCenterFaceIndex =
      (game.reelInfoById[id].now.centerFaceIndex + nudges) %
      game.reelInfoById[id].next.n;

    game.reelInfoById[id].next.centerFaceIndex = nextCenterFaceIndex;

    const hidden = game.reelInfoById[id].now.hidden;
    const n = game.reelInfoById[id].now.n;

    const nextHidden = hidden.map(function (value) {
      return (value + nudges) % n;
    });

    for (let i = 0; i < nextHidden.length; i++) {
      game.reelInfoById[id].next.hidden[i] = nextHidden[i];
    }
  });
}

function StatusFromReadyToRolling() {
  game.status = 'ROLLINCOMING';

  const nextLineShouldBe = DrawNextLine();

  const facesForReelsToTurn = [6, 6, 6];
  SetNextReelInfo(facesForReelsToTurn);

  const turnAnimationDelays = [0, 200, 400];

  const reels = [
    document.getElementById('reel0'),
    document.getElementById('reel1'),
    document.getElementById('reel2'),
  ];

  reels.forEach((element, index) => {
    const facesToTurn = facesForReelsToTurn[index];
    const nextFaceTexture = nextLineShouldBe[index];

    ChangeHiddenFaceTextures({
      element: element,
      nextFaceTexture: nextFaceTexture,
    });

    const delay = turnAnimationDelays[index];

    TurnReel({
      element: element,
      turn: facesToTurn,
      delay: delay,
    });

    game.status = 'ROLLONGOING';
  });
}

function AddLastReelAnimationsEventListener() {
  const lastReel = document.getElementById('reel2');
  lastReel.addEventListener('animationcomplete', function (e) {
    if (e.detail.name === 'animation__movebehind') {
      BonusRoll();
      SetNormalStage();
    } else if (e.detail.name === 'animation__movefront') {
      game.status = 'READY';
      EnablePlayButton();
    } else if (e.detail.name === 'animation__normalroll') {
      StatusFromRollingToStopped();
      if (game.status === 'UPCOMINGBONUS') {
        StatusFromUpcomingBonusToBonus();
      } else if (game.status === 'STOPPED') {
        StatusFromStoppedToReady();
      }
    }
  });
}

function AddWinToBalance() {
  game.balance += game.pendingWins;
  document.getElementById('balance').innerHTML = game.balance;
  game.pendingWins = 0;
}

function SetBonusStage() {
  const reel0 = document.getElementById('reel0');
  reel0.emit('startSetBonusStage', null, false);
  const reel1 = document.getElementById('reel1');
  reel1.emit('startSetBonusStage', null, false);
  const reel2 = document.getElementById('reel2');
  reel2.emit('startSetBonusStage', null, false);
}

function BonusRoll() {
  console.log('Bonus rolling...');
}

function SetNormalStage() {
  const reel0 = document.getElementById('reel0');
  reel0.emit('startSetNormalStage', null, false);
  const reel1 = document.getElementById('reel1');
  reel1.emit('startSetNormalStage', null, false);
  const reel2 = document.getElementById('reel2');
  reel2.emit('startSetNormalStage', null, false);
}

function StatusFromStoppedToReady() {
  EnablePlayButton();
  game.status = 'READY';
}

function StatusFromUpcomingBonusToBonus() {
  game.status = 'BONUS';
  SetBonusStage();
}

function DeductFeeFromBalance() {
  game.balance -= 1;
  document.getElementById('balance').innerHTML = game.balance;
}

function HaveBalance() {
  return game.balance >= 1;
}

function EvaluateOptions() {
  const isAutobonus = document.getElementById('autobonus').checked;
  game.optionsNextRoll.autoBonus = isAutobonus;

  const isAutowin = document.getElementById('autowin').checked;
  game.optionsNextRoll.autoWin = isAutowin;
}

function AttemptRoll() {
  if (game.status === 'READY') {
    EvaluateOptions();
    if (HaveBalance()) {
      DisablePlayButton();
      DeductFeeFromBalance();
      StatusFromReadyToRolling();
    }
  }
}

function ToggleMenu() {
  const menu = document.getElementById('menu');
  if (window.getComputedStyle(menu).display === 'none') {
    menu.style.display = 'block';
  } else {
    menu.style.display = 'none';
  }
}

function AddPlayButtonEventListener() {
  const element = document.getElementById('playBtn');
  element.addEventListener('click', function () {
    AttemptRoll();
  });
}

function AddMenuButtonEventListener() {
  const element = document.getElementById('menuButton');
  element.addEventListener('click', function () {
    ToggleMenu();
  });
}

function AddWinSplashAnimationsEventListener() {
  const winSplash = document.getElementById('winSplash');
  winSplash.addEventListener('animationcomplete', function (e) {
    if (e.detail.name === 'animation__counter') {
      AddWinToBalance();
      if (game.status === 'UPCOMINGBONUS') {
        StatusFromUpcomingBonusToBonus();
      } else {
        StatusFromStoppedToReady();
      }
    }
  });
}

function AddEventListeners() {
  AddLastReelAnimationsEventListener();
  AddWinSplashAnimationsEventListener();
  AddPlayButtonEventListener();
  AddMenuButtonEventListener();
}
