export type HudState = {
  hp: number;
  ammo: number;
  score: number;
  level: number;
  weapon: string;
  weaponIndex: number;
  enemiesLeft: number;
  fps: number;
  phase: "title" | "play" | "level" | "pause" | "over" | "win";
  message: string;
};

export type ControlsProbe = {
  getYaw: () => number;
  getSpeed: () => number;
  getPos: () => { x: number; y: number };
  setKeys: (codes: string[]) => void;
};

declare global {
  interface Window {
    __controlsTest?: ControlsProbe;
    __redVectorReady?: boolean;
  }
}

export const STEP = 1 / 30;
