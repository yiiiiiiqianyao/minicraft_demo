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

export function updateProgressGUI(percentLoaded: number) {
  const progressBar = document.getElementById("loading-progress-bar");
  if (progressBar) {
    progressBar.style.width = `${percentLoaded}%`;
  }
}