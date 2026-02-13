import * as THREE from "three";
export * from './toolbar/index.ts';

export function swapMenuScreenGUI() {
  const menuScreen = document.getElementById("menu");
  const debugMenu = document.getElementById("debug");
  if (menuScreen) {
    menuScreen.style.display = "none";
    if (debugMenu) {
      debugMenu.style.display = "flex";
    }
  }
}

export function updatePositionGUI(position: THREE.Vector3) {
    const posX = document.getElementById("player-pos-x");
    if (posX) {
      const inner = `x: ${position.x.toFixed(3)}`;
      if(posX.innerHTML !== inner) {
        posX.innerHTML = inner;
      }
    }

    const posY = document.getElementById("player-pos-y");
    if (posY) {
      const inner = `y: ${position.y.toFixed(3)}`;
      if(posY.innerHTML !== inner) {
        posY.innerHTML = inner;
      }
    }

    const posZ = document.getElementById("player-pos-z");
    if (posZ) {
      const inner = `z: ${position.z.toFixed(3)}`;
      if(posZ.innerHTML !== inner) {
        posZ.innerHTML = inner;
      }
    }
}

// 更新当前的时间
export function updateDayTimeGUI(hour: number) {
  const dayTimeElement = document.getElementById("day-time");
  if (dayTimeElement) {
    dayTimeElement.innerHTML = `Day Time Hour: ${hour}`;
  }
}

export function updateProgressGUI(percentLoaded: number) {
  const progressBar = document.getElementById("loading-progress-bar");
  if (progressBar) {
    progressBar.style.width = `${percentLoaded}%`;
  }
}