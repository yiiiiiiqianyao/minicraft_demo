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