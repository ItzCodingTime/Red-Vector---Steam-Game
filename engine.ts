import { STEP, type ControlsProbe, type HudState } from "./types";

type Enemy = {
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  alive: boolean;
  type: number;
  walk: number;
};

type Level = {
  map: number[][];
  start: [number, number];
  enemies: { x: number; y: number; type: number; hp: number }[];
};

const wallColors: Array<[number, number, number] | null> = [
  null,
  [180, 80, 40],
  [100, 100, 100],
  [80, 120, 60],
  [140, 100, 60],
];

const levels: Level[] = [
  {
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    start: [1.5, 1.5],
    enemies: [
      { x: 5.5, y: 3.5, type: 0, hp: 3 },
      { x: 10.5, y: 5.5, type: 1, hp: 5 },
      { x: 7.5, y: 10.5, type: 2, hp: 2 },
      { x: 12.5, y: 8.5, type: 0, hp: 3 },
      { x: 3.5, y: 12.5, type: 3, hp: 4 },
    ],
  },
  {
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 2, 2, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    start: [2.5, 2.5],
    enemies: [
      { x: 6.5, y: 4.5, type: 1, hp: 6 },
      { x: 9.5, y: 4.5, type: 1, hp: 6 },
      { x: 4.5, y: 8.5, type: 2, hp: 2 },
      { x: 11.5, y: 8.5, type: 2, hp: 2 },
      { x: 8.5, y: 11.5, type: 0, hp: 4 },
      { x: 3.5, y: 13.5, type: 3, hp: 3 },
    ],
  },
  {
    map: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 2, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 3, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    start: [1.5, 1.5],
    enemies: [
      { x: 5.5, y: 3.5, type: 1, hp: 7 },
      { x: 10.5, y: 3.5, type: 1, hp: 7 },
      { x: 3.5, y: 6.5, type: 2, hp: 2 },
      { x: 12.5, y: 6.5, type: 2, hp: 2 },
      { x: 7.5, y: 9.5, type: 0, hp: 4 },
      { x: 4.5, y: 12.5, type: 3, hp: 3 },
      { x: 11.5, y: 12.5, type: 3, hp: 3 },
    ],
  },
];

const weapons = [
  { name: "PISTOL", type: "ranged" as const, damage: 1, cooldown: 0.26, ammoCost: 1, hitRadius: 11 },
  { name: "SHOTGUN", type: "ranged" as const, damage: 3, cooldown: 0.62, ammoCost: 2, hitRadius: 24 },
  { name: "MELEE", type: "melee" as const, damage: 5, cooldown: 0.42, ammoCost: 0, range: 1.45 },
];

const enemySpeed = [0.55, 0.38, 0.85, 0.65];

const VW = 480;
const VH = 270;

export class RedVectorGame {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly keys = new Set<string>();
  private touch = {
    forward: false,
    back: false,
    left: false,
    right: false,
    turnL: false,
    turnR: false,
    fire: false,
  };
  private fireLatch = false;

  private map = levels[0]!.map;
  private mapW = 16;
  private mapH = 16;
  private posX = 1.5;
  private posY = 1.5;
  private dirX = -1;
  private dirY = 0;
  private planeX = 0;
  private planeY = 0.66;
  private health = 100;
  private ammo = 60;
  private score = 0;
  private enemies: Enemy[] = [];
  private level = 0;
  private weapon = 0;
  private attackCd = 0;
  private flash = 0;
  private swing = 0;
  private phase: HudState["phase"] = "title";
  private message = "";
  private speed = 0;
  private fps = 30;
  private raf = 0;
  private last = 0;
  private lastRender = 0;
  private acc = 0;
  private running = false;
  private levelTimer = 0;
  private hudKey = "";
  private audio: AudioContext | null = null;
  private zbuf = new Float32Array(VW);
  private onHud: (h: HudState) => void;

  constructor(canvas: HTMLCanvasElement, onHud: (h: HudState) => void) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas unsupported");
    this.ctx = ctx;
    this.onHud = onHud;
    canvas.width = VW;
    canvas.height = VH;
    this.bindInput();
    this.publishProbe();
    this.emitHud(true);
  }

  startLoop() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.lastRender = this.last;
    const tick = (now: number) => {
      if (!this.running) return;
      let frame = (now - this.last) / 1000;
      this.last = now;
      if (frame > 0.1) frame = 0.1;
      this.acc += frame;
      if (this.acc >= STEP) {
        let steps = 0;
        while (this.acc >= STEP && steps < 3) {
          this.update(STEP);
          this.acc -= STEP;
          steps++;
        }
        const since = now - this.lastRender;
        this.lastRender = now;
        if (since > 0) this.fps = this.fps * 0.75 + (1000 / since) * 0.25;
        this.render();
        this.emitHud(false);
      }
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
    window.__redVectorReady = true;
  }

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("blur", this.onBlur);
    document.removeEventListener("pointerlockchange", this.onLockChange);
    this.canvas.removeEventListener("click", this.onClick);
    this.canvas.removeEventListener("mousemove", this.onMouse);
    if (window.__controlsTest) delete window.__controlsTest;
  }

  setTouch(partial: Partial<typeof this.touch>) {
    Object.assign(this.touch, partial);
  }

  begin() {
    this.unlockAudio();
    this.resetRun();
    this.phase = "play";
    this.emitHud(true);
  }

  restart() {
    this.unlockAudio();
    this.resetRun();
    this.phase = "play";
    this.emitHud(true);
  }

  togglePause() {
    if (this.phase === "play" || this.phase === "level") {
      this.phase = "pause";
      this.clearInput();
      if (document.pointerLockElement === this.canvas) document.exitPointerLock();
      this.emitHud(true);
      return;
    }
    if (this.phase === "pause") {
      this.phase = "play";
      this.emitHud(true);
    }
  }

  private clearInput() {
    this.keys.clear();
    this.touch = {
      forward: false,
      back: false,
      left: false,
      right: false,
      turnL: false,
      turnR: false,
      fire: false,
    };
    this.fireLatch = false;
  }

  private resetRun() {
    this.health = 100;
    this.ammo = 60;
    this.score = 0;
    this.weapon = 0;
    this.attackCd = 0;
    this.flash = 0;
    this.swing = 0;
    this.loadLevel(0, false);
  }

  private loadLevel(idx: number, announce: boolean) {
    if (idx >= levels.length) {
      this.phase = "win";
      this.message = `All corridors cleared. Score ${this.score}`;
      return;
    }
    const L = levels[idx]!;
    this.level = idx;
    this.map = L.map;
    this.mapW = L.map[0]!.length;
    this.mapH = L.map.length;
    this.posX = L.start[0];
    this.posY = L.start[1];
    this.dirX = -1;
    this.dirY = 0;
    this.planeX = 0;
    this.planeY = 0.66;
    this.enemies = L.enemies.map((e) => ({
      x: e.x,
      y: e.y,
      hp: e.hp,
      maxHp: e.hp,
      alive: true,
      type: e.type,
      walk: Math.random() * Math.PI * 2,
    }));
    if (announce) {
      this.phase = "level";
      this.message = `Sector ${idx + 1}`;
      this.levelTimer = 1.1;
    }
  }

  private isWall(x: number, y: number) {
    const mx = Math.floor(x);
    const my = Math.floor(y);
    if (mx < 0 || my < 0 || mx >= this.mapW || my >= this.mapH) return true;
    return (this.map[my]?.[mx] ?? 1) > 0;
  }

  private lineBlocked(x1: number, y1: number, x2: number, y2: number) {
    for (let i = 1; i < 26; i++) {
      const t = i / 26;
      if (this.isWall(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t)) return true;
    }
    return false;
  }

  private held(code: string) {
    return this.keys.has(code);
  }

  private update(dt: number) {
    if (this.phase === "level") {
      this.levelTimer -= dt;
      if (this.levelTimer <= 0) this.phase = "play";
      return;
    }
    if (this.phase !== "play") {
      this.speed = 0;
      return;
    }

    this.attackCd = Math.max(0, this.attackCd - dt);
    this.flash = Math.max(0, this.flash - dt);
    this.swing = Math.max(0, this.swing - dt);

    const rot = 1.9 * dt;
    if (this.held("ArrowLeft") || this.touch.turnL) this.rotate(rot);
    if (this.held("ArrowRight") || this.touch.turnR) this.rotate(-rot);

    let mx = 0;
    let my = 0;
    const forward = this.held("KeyW") || this.held("ArrowUp") || this.touch.forward;
    const back = this.held("KeyS") || this.held("ArrowDown") || this.touch.back;
    const strafeL = this.held("KeyA") || this.touch.left;
    const strafeR = this.held("KeyD") || this.touch.right;
    if (forward) {
      mx += this.dirX;
      my += this.dirY;
    }
    if (back) {
      mx -= this.dirX;
      my -= this.dirY;
    }
    // A = screen-left, D = screen-right. Camera plane points screen-right.
    if (strafeL) {
      mx -= this.planeX;
      my -= this.planeY;
    }
    if (strafeR) {
      mx += this.planeX;
      my += this.planeY;
    }

    const len = Math.hypot(mx, my);
    const speed = 2.15;
    this.speed = len > 0 ? speed : 0;
    if (len > 0) {
      mx = (mx / len) * speed * dt;
      my = (my / len) * speed * dt;
      if (!this.isWall(this.posX + mx, this.posY)) this.posX += mx;
      if (!this.isWall(this.posX, this.posY + my)) this.posY += my;
    }

    if ((this.held("Space") || this.touch.fire) && !this.fireLatch) {
      this.attack();
      this.fireLatch = true;
    }
    if (!this.held("Space") && !this.touch.fire) this.fireLatch = false;

    let alive = 0;
    for (const e of this.enemies) {
      if (!e.alive) continue;
      alive++;
      const dx = this.posX - e.x;
      const dy = this.posY - e.y;
      const dist = Math.hypot(dx, dy) || 0.0001;
      const spd = (enemySpeed[e.type] ?? 0.55) * dt;
      let moved = false;
      if (dist > 0.5 && dist < 16) {
        const nx = e.x + (dx / dist) * spd;
        const ny = e.y + (dy / dist) * spd;
        if (!this.isWall(nx, e.y)) {
          e.x = nx;
          moved = true;
        }
        if (!this.isWall(e.x, ny)) {
          e.y = ny;
          moved = true;
        }
      }
      if (moved) {
        const rate = e.type === 2 ? 11 : 7;
        e.walk += dt * rate;
      }
      if (dist < 0.7) this.health -= (e.type === 2 ? 16 : 11) * dt;
    }

    if (alive === 0) this.loadLevel(this.level + 1, true);
    if (this.health <= 0) {
      this.health = 0;
      this.phase = "over";
      this.message = `Sector ${this.level + 1} · Score ${this.score}`;
      this.clearInput();
      if (document.pointerLockElement === this.canvas) document.exitPointerLock();
    }
  }

  private rotate(rot: number) {
    const od = this.dirX;
    this.dirX = this.dirX * Math.cos(rot) - this.dirY * Math.sin(rot);
    this.dirY = od * Math.sin(rot) + this.dirY * Math.cos(rot);
    const op = this.planeX;
    this.planeX = this.planeX * Math.cos(rot) - this.planeY * Math.sin(rot);
    this.planeY = op * Math.sin(rot) + this.planeY * Math.cos(rot);
  }

  private attack() {
    const wpn = weapons[this.weapon]!;
    if (this.attackCd > 0) return;
    if (wpn.type === "ranged" && this.ammo < wpn.ammoCost) return;
    this.attackCd = wpn.cooldown;
    if (wpn.type === "ranged") {
      this.ammo -= wpn.ammoCost;
      this.flash = 0.1;
      this.blip(220, 0.04);
    } else {
      this.swing = 0.22;
      this.blip(90, 0.05);
    }

    const invDet = 1 / (this.planeX * this.dirY - this.dirX * this.planeY);
    let best: Enemy | null = null;
    let bestDist = 999;
    for (const e of this.enemies) {
      if (!e.alive) continue;
      const dx = e.x - this.posX;
      const dy = e.y - this.posY;
      const dist = Math.hypot(dx, dy);
      if (wpn.type === "melee") {
        if (dist > wpn.range) continue;
        const ang = Math.atan2(dy, dx) - Math.atan2(this.dirY, this.dirX);
        const a = Math.atan2(Math.sin(ang), Math.cos(ang));
        if (Math.abs(a) > 0.9) continue;
      } else {
        const tx = invDet * (this.dirY * dx - this.dirX * dy);
        const ty = invDet * (-this.planeY * dx + this.planeX * dy);
        if (ty <= 0.15 || dist > 14) continue;
        const screenX = (VW / 2) * (1 + tx / ty);
        if (Math.abs(screenX - VW / 2) >= wpn.hitRadius) continue;
      }
      if (dist < bestDist && !this.lineBlocked(this.posX, this.posY, e.x, e.y)) {
        best = e;
        bestDist = dist;
      }
    }
    if (best) {
      best.hp -= wpn.damage;
      this.blip(140, 0.03);
      if (best.hp <= 0) {
        best.alive = false;
        this.score += 100 + best.type * 20;
      }
    }
  }

  private render() {
    const ctx = this.ctx;
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, VW, VH / 2);
    ctx.fillStyle = "#2a1a0a";
    ctx.fillRect(0, VH / 2, VW, VH / 2);
    this.zbuf.fill(Infinity);

    for (let x = 0; x < VW; x++) {
      const cameraX = (2 * x) / VW - 1;
      const rayDirX = this.dirX + this.planeX * cameraX;
      const rayDirY = this.dirY + this.planeY * cameraX;
      let mapX = Math.floor(this.posX);
      let mapY = Math.floor(this.posY);
      const deltaDistX = Math.abs(1 / (rayDirX || 1e-8));
      const deltaDistY = Math.abs(1 / (rayDirY || 1e-8));
      let stepX: number, stepY: number, sideDistX: number, sideDistY: number;
      if (rayDirX < 0) {
        stepX = -1;
        sideDistX = (this.posX - mapX) * deltaDistX;
      } else {
        stepX = 1;
        sideDistX = (mapX + 1 - this.posX) * deltaDistX;
      }
      if (rayDirY < 0) {
        stepY = -1;
        sideDistY = (this.posY - mapY) * deltaDistY;
      } else {
        stepY = 1;
        sideDistY = (mapY + 1 - this.posY) * deltaDistY;
      }
      let hit = false;
      let side = 0;
      let guard = 0;
      while (!hit && guard++ < 64) {
        if (sideDistX < sideDistY) {
          sideDistX += deltaDistX;
          mapX += stepX;
          side = 0;
        } else {
          sideDistY += deltaDistY;
          mapY += stepY;
          side = 1;
        }
        if (mapX < 0 || mapY < 0 || mapX >= this.mapW || mapY >= this.mapH) {
          hit = true;
          break;
        }
        if ((this.map[mapY]?.[mapX] ?? 0) > 0) hit = true;
      }
      const perp = side === 0 ? sideDistX - deltaDistX : sideDistY - deltaDistY;
      this.zbuf[x] = perp;
      const lh = Math.floor(VH / Math.max(perp, 0.0001));
      const ds = Math.max(0, -lh / 2 + VH / 2);
      const de = Math.min(VH - 1, lh / 2 + VH / 2);
      const wt = this.map[mapY]?.[mapX] ?? 1;
      let col = wallColors[wt] ?? wallColors[1]!;
      if (side === 1) col = [col[0] >> 1, col[1] >> 1, col[2] >> 1];
      const fog = Math.min(1, perp / 12);
      const wallX = side === 0 ? this.posY + perp * rayDirY : this.posX + perp * rayDirX;
      const u = wallX - Math.floor(wallX);
      this.drawWallColumn(x, ds, de, col, fog, u, wt);
    }

    this.drawEnemies();
    this.drawCorpses();
    this.drawWeapon();
    this.drawCrosshair();
    if (this.phase === "play" || this.phase === "level") this.drawMinimap();
  }

  private drawMinimap() {
    const ctx = this.ctx;
    const cell = 4;
    const pad = 6;
    const w = this.mapW * cell;
    const h = this.mapH * cell;
    ctx.fillStyle = "rgba(12,13,16,0.72)";
    ctx.fillRect(pad - 2, pad - 2, w + 4, h + 4);
    for (let y = 0; y < this.mapH; y++) {
      for (let x = 0; x < this.mapW; x++) {
        const t = this.map[y]?.[x] ?? 0;
        if (t > 0) {
          ctx.fillStyle = "#3a3e46";
          ctx.fillRect(pad + x * cell, pad + y * cell, cell, cell);
        }
      }
    }
    for (const e of this.enemies) {
      ctx.fillStyle = e.alive ? "#e23b2f" : "#5a3030";
      ctx.fillRect(pad + Math.floor(e.x) * cell, pad + Math.floor(e.y) * cell, cell, cell);
    }
    const px = pad + this.posX * cell;
    const py = pad + this.posY * cell;
    ctx.fillStyle = "#7dce6a";
    ctx.fillRect(px - 1, py - 1, 3, 3);
    ctx.strokeStyle = "#7dce6a";
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + this.dirX * 6, py + this.dirY * 6);
    ctx.stroke();
  }

  private drawWallColumn(
    x: number,
    ds: number,
    de: number,
    col: [number, number, number],
    fog: number,
    u: number,
    wt: number,
  ) {
    const ctx = this.ctx;
    const h = de - ds + 1;
    for (let y = ds; y <= de; y++) {
      const v = (y - ds) / Math.max(1, h);
      let shade = 1;
      if (wt === 1) {
        const brick = (Math.floor(u * 6) + Math.floor(v * 8)) % 2 === 0;
        shade = brick ? 1 : 0.72;
        if (Math.abs(v * 8 - Math.floor(v * 8)) < 0.08) shade *= 0.6;
      } else if (wt === 2) {
        shade = Math.abs(u * 4 - Math.floor(u * 4 + 0.5)) < 0.08 ? 0.65 : 1;
        if (Math.abs(v - 0.35) < 0.03 || Math.abs(v - 0.7) < 0.03) shade *= 0.7;
      } else if (wt === 3) {
        shade = Math.sin(u * 18 + v * 4) > 0.2 ? 1 : 0.78;
      } else {
        shade = (Math.floor(u * 10) ^ Math.floor(v * 12)) & 1 ? 1 : 0.8;
      }
      const r = (col[0] * shade * (1 - fog)) | 0;
      const g = (col[1] * shade * (1 - fog)) | 0;
      const b = (col[2] * shade * (1 - fog)) | 0;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  private drawEnemies() {
    const ctx = this.ctx;
    const list = this.enemies
      .filter((e) => e.alive)
      .map((e) => {
        const dx = e.x - this.posX;
        const dy = e.y - this.posY;
        return { e, dist: dx * dx + dy * dy, dx, dy };
      })
      .sort((a, b) => b.dist - a.dist);
    const invDet = 1 / (this.planeX * this.dirY - this.dirX * this.planeY);
    for (const s of list) {
      const tx = invDet * (this.dirY * s.dx - this.dirX * s.dy);
      const ty = invDet * (-this.planeY * s.dx + this.planeX * s.dy);
      if (ty <= 0.1) continue;
      const sx = Math.floor((VW / 2) * (1 + tx / ty));
      const sh = Math.abs(Math.floor((VH / ty) * 1.12));
      const sw = Math.floor(sh * 0.46);
      const y0 = Math.max(0, -sh / 2 + VH / 2);
      const y1 = Math.min(VH - 1, sh / 2 + VH / 2);
      const x0 = Math.max(0, -sw / 2 + sx);
      const x1 = Math.min(VW - 1, sw / 2 + sx);
      const hpR = s.e.hp / (s.e.maxHp || 3);
      for (let stripe = x0; stripe < x1; stripe++) {
        if (ty >= (this.zbuf[stripe] ?? Infinity)) continue;
        const relX = (stripe - (sx - sw / 2)) / sw;
        if (relX < 0 || relX > 1) continue;
        this.drawHumanoid(stripe, y0, y1, relX, s.e.type, hpR, s.e.walk);
      }
    }
    void ctx;
  }

  private drawHumanoid(
    stripe: number,
    y0: number,
    y1: number,
    relX: number,
    type: number,
    hpRatio: number,
    walk: number,
  ) {
    const h = y1 - y0;
    if (h < 5) return;
    const ctx = this.ctx;
    let r = 200,
      g = 30,
      b = 30;
    if (type === 1) {
      r = 130;
      g = 135;
      b = 145;
    }
    if (type === 2) {
      r = 255;
      g = 70;
      b = 15;
    }
    if (type === 3) {
      r = 170;
      g = 35;
      b = 75;
    }
    r = (r * (0.5 + 0.5 * hpRatio)) | 0;
    const edge = Math.abs(relX - 0.5) > 0.36 ? 0.72 : 1;
    const fill = `rgb(${(r * edge) | 0},${(g * edge) | 0},${(b * edge) | 0})`;
    ctx.fillStyle = fill;
    let headW = 0.22,
      headH = 0.13,
      bodyW = 0.34,
      armW = 0.11;
    if (type === 1) {
      bodyW = 0.44;
      headW = 0.24;
    }
    if (type === 3) {
      headH = 0.1;
      bodyW = 0.28;
    }
    const bob = Math.sin(walk) * h * 0.02;
    const swing = Math.sin(walk);
    const mid = 0.5;
    const headCy = y0 + h * headH * 0.55 + bob;
    const headRx = headW / 2;
    const headRy = h * headH * 0.55;
    const hx = (relX - mid) / headRx;
    if (hx * hx < 1) {
      const span = Math.sqrt(1 - hx * hx) * headRy;
      ctx.fillRect(stripe, headCy - span, 1, span * 2);
      if (Math.abs(hx) < 0.4) {
        ctx.fillStyle = "#111";
        ctx.fillRect(stripe, headCy - span * 0.2, 1, Math.max(1, span * 0.35));
        ctx.fillStyle = fill;
      }
    }
    const headBot = y0 + h * headH + bob;
    const torsoBot = y0 + h * 0.58 + bob;
    const bodyRx = bodyW / 2;
    const bx = (relX - mid) / bodyRx;
    if (bx * bx < 1) {
      ctx.fillRect(stripe, headBot - 1, 1, torsoBot - headBot + 2);
      if (Math.abs(bx) < 0.35 && Math.abs((torsoBot - headBot) / h - 0.22) < 0.04) {
        ctx.fillStyle = `rgb(${Math.max(0, r - 40)},${Math.max(0, g - 20)},${Math.max(0, b - 20)})`;
        ctx.fillRect(stripe, headBot + h * 0.1, 1, 2);
        ctx.fillStyle = fill;
      }
      if (type === 1 && Math.abs(bx) < 0.55) {
        ctx.fillStyle = "#666";
        ctx.fillRect(stripe, headBot + h * 0.07, 1, h * 0.08);
        ctx.fillStyle = fill;
      }
    }
    const armTop = headBot + h * 0.05;
    const armBot = torsoBot - h * 0.02;
    const leftArm = mid - bodyW / 2 - 0.04 + swing * 0.035;
    const rightArm = mid + bodyW / 2 + 0.04 - swing * 0.035;
    if (Math.abs(relX - leftArm) < armW / 2 || Math.abs(relX - rightArm) < armW / 2) {
      ctx.fillRect(stripe, armTop, 1, armBot - armTop);
    }
    const leftLeg = mid - 0.09 + swing * 0.045;
    const rightLeg = mid + 0.09 - swing * 0.045;
    if (Math.abs(relX - leftLeg) < 0.05) {
      const lift = Math.max(0, swing) * h * 0.04;
      ctx.fillRect(stripe, torsoBot - 1, 1, y1 - torsoBot + 1 - lift);
    }
    if (Math.abs(relX - rightLeg) < 0.05) {
      const lift = Math.max(0, -swing) * h * 0.04;
      ctx.fillRect(stripe, torsoBot - 1, 1, y1 - torsoBot + 1 - lift);
    }
  }

  private drawCorpses() {
    const list = this.enemies
      .filter((e) => !e.alive)
      .map((e) => {
        const dx = e.x - this.posX;
        const dy = e.y - this.posY;
        return { e, dist: dx * dx + dy * dy, dx, dy };
      })
      .sort((a, b) => b.dist - a.dist);
    const invDet = 1 / (this.planeX * this.dirY - this.dirX * this.planeY);
    for (const s of list) {
      const tx = invDet * (this.dirY * s.dx - this.dirX * s.dy);
      const ty = invDet * (-this.planeY * s.dx + this.planeX * s.dy);
      if (ty <= 0.1) continue;
      const sx = Math.floor((VW / 2) * (1 + tx / ty));
      const sh = Math.abs(Math.floor((VH / ty) * 0.38));
      const sw = Math.floor(sh * 1.7);
      const y1 = Math.min(VH - 1, VH / 2 + sh * 0.5);
      const y0 = Math.max(0, y1 - sh);
      const x0 = Math.max(0, -sw / 2 + sx);
      const x1 = Math.min(VW - 1, sw / 2 + sx);
      for (let stripe = x0; stripe < x1; stripe++) {
        if (ty >= (this.zbuf[stripe] ?? Infinity)) continue;
        const relX = (stripe - (sx - sw / 2)) / sw;
        if (relX < 0 || relX > 1) continue;
        this.drawCorpse(stripe, y0, y1, relX, s.e.type);
      }
    }
  }

  private drawCorpse(stripe: number, y0: number, y1: number, relX: number, type: number) {
    const h = y1 - y0;
    if (h < 3) return;
    const ctx = this.ctx;
    let r = 120,
      g = 20,
      b = 20;
    if (type === 1) {
      r = 90;
      g = 95;
      b = 105;
    }
    if (type === 2) {
      r = 150;
      g = 40;
      b = 10;
    }
    if (type === 3) {
      r = 110;
      g = 25;
      b = 50;
    }
    if (Math.min(relX, 1 - relX) < 0.05) return;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    const bodyTop = y0 + h * 0.4;
    if (relX > 0.2 && relX < 0.8) ctx.fillRect(stripe, bodyTop, 1, y1 - bodyTop);
    if (relX > 0.1 && relX < 0.26) ctx.fillRect(stripe, bodyTop + h * 0.15, 1, h * 0.35);
    if (relX > 0.74 && relX < 0.9) ctx.fillRect(stripe, bodyTop + h * 0.1, 1, h * 0.4);
    if (Math.abs(relX - 0.5) < 0.07) ctx.fillRect(stripe, bodyTop - h * 0.25, 1, h * 0.3);
  }

  private drawWeapon() {
    const ctx = this.ctx;
    const baseY = VH - 36 + (this.flash > 0 ? 3 : 0);
    if (this.weapon === 0) {
      ctx.fillStyle = "#4a4a4a";
      ctx.fillRect(VW / 2 - 9, baseY, 18, 34);
      ctx.fillStyle = "#2a2a2a";
      ctx.fillRect(VW / 2 - 5, baseY - 6, 10, 10);
      ctx.fillStyle = "#777";
      ctx.fillRect(VW / 2 - 8, baseY + 8, 16, 5);
      ctx.fillStyle = "#111";
      ctx.fillRect(VW / 2 - 2, baseY + 14, 4, 12);
    } else if (this.weapon === 1) {
      ctx.fillStyle = "#5a3a22";
      ctx.fillRect(VW / 2 - 16, baseY + 4, 32, 30);
      ctx.fillStyle = "#3a2210";
      ctx.fillRect(VW / 2 - 5, baseY - 8, 10, 16);
      ctx.fillStyle = "#7a5a3a";
      ctx.fillRect(VW / 2 - 14, baseY + 10, 28, 6);
      ctx.fillStyle = "#222";
      ctx.fillRect(VW / 2 - 3, baseY + 18, 6, 10);
    } else {
      ctx.save();
      ctx.translate(VW / 2 + 10, baseY + 16);
      ctx.rotate(this.swing > 0 ? Math.sin(this.swing * 14) * 0.7 : 0.15);
      ctx.fillStyle = "#c8c8c8";
      ctx.fillRect(-3, -36, 6, 26);
      ctx.fillStyle = "#444";
      ctx.fillRect(-5, -12, 10, 14);
      ctx.fillStyle = "#eee";
      ctx.fillRect(-2, -40, 4, 6);
      ctx.restore();
    }
    if (this.flash > 0 && weapons[this.weapon]!.type === "ranged") {
      ctx.fillStyle = "#ffee55";
      ctx.fillRect(VW / 2 - 12, baseY - 14, 24, 8);
    }
  }

  private drawCrosshair() {
    const ctx = this.ctx;
    ctx.strokeStyle = "#7dce6a";
    ctx.lineWidth = 1;
    const cx = VW >> 1;
    const cy = VH >> 1;
    ctx.beginPath();
    ctx.moveTo(cx - 7, cy);
    ctx.lineTo(cx - 2, cy);
    ctx.moveTo(cx + 2, cy);
    ctx.lineTo(cx + 7, cy);
    ctx.moveTo(cx, cy - 7);
    ctx.lineTo(cx, cy - 2);
    ctx.moveTo(cx, cy + 2);
    ctx.lineTo(cx, cy + 7);
    ctx.stroke();
  }

  private emitHud(force: boolean) {
    const left = this.enemies.filter((e) => e.alive).length;
    const key = [
      Math.floor(this.health),
      this.ammo,
      this.score,
      this.level,
      this.weapon,
      left,
      this.phase,
      Math.round(this.fps),
    ].join("|");
    if (!force && key === this.hudKey) return;
    this.hudKey = key;
    this.onHud({
      hp: Math.max(0, Math.floor(this.health)),
      ammo: this.ammo,
      score: this.score,
      level: this.level + 1,
      weapon: weapons[this.weapon]!.name,
      weaponIndex: this.weapon,
      enemiesLeft: left,
      fps: Math.round(Math.min(60, this.fps)),
      phase: this.phase,
      message: this.message,
    });
  }

  private publishProbe() {
    const probe: ControlsProbe = {
      getYaw: () => Math.atan2(this.dirY, this.dirX),
      getSpeed: () => this.speed,
      getPos: () => ({ x: this.posX, y: this.posY }),
      setKeys: (codes) => {
        this.keys.clear();
        for (const c of codes) this.keys.add(c);
      },
    };
    window.__controlsTest = probe;
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Escape") {
      e.preventDefault();
      // Pointer lock already exits on Escape; onLockChange pauses in that case.
      if (document.pointerLockElement === this.canvas) return;
      this.togglePause();
      return;
    }
    if (this.phase === "pause") return;
    if (e.repeat && (e.code === "Space" || e.code.startsWith("Digit"))) return;
    this.keys.add(e.code);
    if (e.code === "Digit1") this.weapon = 0;
    if (e.code === "Digit2") this.weapon = 1;
    if (e.code === "Digit3") this.weapon = 2;
    if (e.code === "KeyR" && (this.phase === "over" || this.phase === "win" || this.phase === "play")) {
      this.restart();
    }
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
  };

  private onBlur = () => {
    this.clearInput();
  };

  private onLockChange = () => {
    if (document.pointerLockElement !== this.canvas && (this.phase === "play" || this.phase === "level")) {
      this.phase = "pause";
      this.clearInput();
      this.emitHud(true);
    }
  };

  private onClick = () => {
    if (this.phase === "play") this.attack();
  };

  private onMouse = (e: MouseEvent) => {
    if (document.pointerLockElement !== this.canvas || this.phase !== "play") return;
    const sens = 0.0022;
    if (e.movementX) this.rotate(-e.movementX * sens);
  };

  private bindInput() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.onBlur);
    document.addEventListener("pointerlockchange", this.onLockChange);
    this.canvas.addEventListener("click", this.onClick);
    this.canvas.addEventListener("mousemove", this.onMouse);
  }

  selectWeapon(i: number) {
    this.weapon = i;
    this.emitHud(true);
  }

  requestLock() {
    if (this.canvas.requestPointerLock) void this.canvas.requestPointerLock();
  }

  private unlockAudio() {
    if (!this.audio) {
      const AC = window.AudioContext;
      if (!AC) return;
      this.audio = new AC();
    }
    void this.audio.resume();
  }

  private blip(freq: number, dur: number) {
    if (!this.audio) return;
    const o = this.audio.createOscillator();
    const g = this.audio.createGain();
    o.type = "square";
    o.frequency.value = freq;
    g.gain.value = 0.03;
    o.connect(g);
    g.connect(this.audio.destination);
    o.start();
    o.stop(this.audio.currentTime + dur);
  }
}
