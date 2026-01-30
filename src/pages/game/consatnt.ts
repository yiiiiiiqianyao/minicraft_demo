export enum State {
    Running = 'running',
    Paused = 'paused',
}

export class GameState {
  static isStarted = false;
  static state = State.Running; // running paused
}

export const GameEvent = {
    ClosePopup: 'ClosePopup',
    OpenPopup: 'OpenPopup',
}

export enum PopupType {
    Craft = 'Craft',
    Backpacker = 'Backpacker',
}

export enum RenderView {
    FirstPerson = 'firstPerson',
    ThirdPerson = 'thirdPerson',
}