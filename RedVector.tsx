import { useEffect, useRef, useState, type ButtonHTMLAttributes, type PointerEvent, type ReactNode } from "react";
import { Crosshair, Heart, Shell } from "lucide-react";
import { RedVectorGame } from "@/game/engine";
import type { HudState } from "@/game/types";

const initial: HudState = {
  hp: 100,
  ammo: 60,
  score: 0,
  level: 1,
  weapon: "PISTOL",
  weaponIndex: 0,
  enemiesLeft: 5,
  fps: 30,
  phase: "title",
  message: "",
};

export function RedVector() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<RedVectorGame | null>(null);
  const [hud, setHud] = useState<HudState>(initial);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const game = new RedVectorGame(canvas, setHud);
    gameRef.current = game;
    game.startLoop();
    return () => game.destroy();
  }, []);

  const playing = hud.phase === "play" || hud.phase === "level";

  return (
    <main className="relative flex h-full min-h-dvh flex-col bg-bg text-fg">
      <div className="flex min-h-0 flex-1 items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-5xl">
          <canvas
            ref={canvasRef}
            className="aspect-[16/9] w-full bg-bg shadow-[0_0_0_1px_var(--color-border)] [image-rendering:pixelated]"
            onClick={() => {
              if (hud.phase === "play") gameRef.current?.requestLock();
            }}
          />
          {playing && <Hud hud={hud} />}
          {playing && (
            <button
              type="button"
              className="absolute right-3 top-3 min-h-11 bg-surface px-3 font-display text-xs tracking-[0.16em] text-fg ring-1 ring-border"
              onClick={() => gameRef.current?.togglePause()}
            >
              PAUSE
            </button>
          )}
          {hud.phase === "title" && (
            <Screen
              kicker="30 FPS CORRIDOR CLEARANCE"
              title="RED VECTOR"
              body="Geometric targets. Three weapons. Three sectors. Hold the line and clear every corridor."
              action="START RUN"
              onAction={() => gameRef.current?.begin()}
            />
          )}
          {hud.phase === "level" && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-bg/55">
              <p className="font-display text-3xl tracking-[0.18em] text-fg">{hud.message}</p>
            </div>
          )}
          {hud.phase === "pause" && (
            <div className="absolute inset-0 flex items-center justify-center bg-bg/78 p-6">
              <div className="max-w-md text-center">
                <p className="text-[11px] tracking-[0.28em] text-accent">HOLDING</p>
                <h2 className="mt-2 font-display text-4xl tracking-[0.14em] text-fg">PAUSED</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Sector {hud.level} · Score {hud.score}
                </p>
                <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    className="min-h-11 min-w-36 bg-accent px-6 py-2 font-display text-sm tracking-[0.18em] text-bg"
                    onClick={() => gameRef.current?.togglePause()}
                  >
                    RESUME
                  </button>
                  <button
                    type="button"
                    className="min-h-11 min-w-36 bg-surface px-6 py-2 font-display text-sm tracking-[0.18em] text-fg ring-1 ring-border"
                    onClick={() => gameRef.current?.restart()}
                  >
                    RESTART
                  </button>
                </div>
              </div>
            </div>
          )}
          {hud.phase === "over" && (
            <div className="absolute inset-0 flex items-center justify-center bg-bg/88 p-6">
              <div className="max-w-md text-center">
                <p className="text-[11px] tracking-[0.28em] text-accent">TERMINATED</p>
                <h1 className="mt-2 font-display text-4xl tracking-[0.14em] text-fg sm:text-5xl">SIGNAL LOST</h1>
                <p className="mt-3 text-sm leading-relaxed text-muted">{hud.message}</p>
                <p className="mt-1 text-xs text-muted">The corridor held. You did not.</p>
                <button
                  type="button"
                  className="mt-6 min-h-11 bg-accent px-6 py-2 font-display text-sm tracking-[0.18em] text-bg"
                  onClick={() => gameRef.current?.restart()}
                >
                  RETRY
                </button>
              </div>
            </div>
          )}
          {hud.phase === "win" && (
            <Screen
              kicker="SECTORS CLEAR"
              title="VECTOR CLOSED"
              body={hud.message}
              action="RUN AGAIN"
              onAction={() => gameRef.current?.restart()}
            />
          )}
        </div>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-xs text-muted sm:px-6">
        <span className="font-display tracking-[0.2em] text-fg">RED VECTOR</span>
        <span className="hidden sm:inline">Esc pause · W/S move · A/D strafe · arrows or mouse turn · 1 2 3 weapons</span>
        <span className="tabular-nums text-amber">{hud.fps} FPS</span>
      </footer>

      <TouchPad
        hidden={hud.phase !== "play" && hud.phase !== "level" && hud.phase !== "pause"}
        paused={hud.phase === "pause"}
        onChange={(partial) => gameRef.current?.setTouch(partial)}
        onWeapon={(i) => gameRef.current?.selectWeapon(i)}
        onPause={() => gameRef.current?.togglePause()}
        onRestart={() => gameRef.current?.restart()}
        weapon={hud.weaponIndex}
      />
    </main>
  );
}

function Hud({ hud }: { hud: HudState }) {
  const hp = Math.max(0, Math.min(100, hud.hp));
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-bg/80 to-transparent p-3 sm:p-4">
      <div className="flex min-w-36 flex-col gap-2">
        <Meter icon={<Heart className="size-3.5" />} label="HP" value={hp} max={100} tone="ok" />
        <Meter icon={<Shell className="size-3.5" />} label="AMMO" value={hud.ammo} max={80} tone="info" />
      </div>
      <div className="text-center">
        <p className="font-display text-lg tracking-[0.22em]">{hud.weapon}</p>
        <p className="text-[11px] text-muted">SECTOR {hud.level}</p>
      </div>
      <div className="text-right text-xs leading-5">
        <p className="flex items-center justify-end gap-1">
          <Crosshair className="size-3.5 text-accent" />
          {hud.enemiesLeft}
        </p>
        <p className="text-muted">SCORE {hud.score}</p>
      </div>
    </div>
  );
}

function Meter({
  icon,
  label,
  value,
  max,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  max: number;
  tone: "ok" | "info";
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="flex items-center gap-2">
      <span className={tone === "ok" ? "text-ok" : "text-info"}>{icon}</span>
      <div className="h-2 w-24 overflow-hidden bg-surface ring-1 ring-border">
        <div className={tone === "ok" ? "h-full bg-ok" : "h-full bg-info"} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 text-[11px] tabular-nums">
        {label} {value}
      </span>
    </div>
  );
}

function Screen({
  kicker,
  title,
  body,
  action,
  onAction,
}: {
  kicker: string;
  title: string;
  body: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-bg/78 p-6">
      <div className="max-w-md text-center">
        <p className="text-[11px] tracking-[0.28em] text-accent">{kicker}</p>
        <h1 className="mt-2 font-display text-4xl tracking-[0.14em] text-fg sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
        <button
          type="button"
          className="mt-6 min-h-11 bg-accent px-6 py-2 font-display text-sm tracking-[0.18em] text-bg"
          onClick={onAction}
        >
          {action}
        </button>
      </div>
    </div>
  );
}

function TouchPad({
  hidden,
  paused,
  weapon,
  onChange,
  onWeapon,
  onPause,
  onRestart,
}: {
  hidden: boolean;
  paused: boolean;
  weapon: number;
  onChange: (p: {
    forward?: boolean;
    back?: boolean;
    left?: boolean;
    right?: boolean;
    turnL?: boolean;
    turnR?: boolean;
    fire?: boolean;
  }) => void;
  onWeapon: (i: number) => void;
  onPause: () => void;
  onRestart: () => void;
}) {
  if (hidden) return null;
  const hold = (key: "forward" | "back" | "left" | "right" | "turnL" | "turnR" | "fire") => ({
    onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      onChange({ [key]: true });
    },
    onPointerUp: () => onChange({ [key]: false }),
    onPointerCancel: () => onChange({ [key]: false }),
  });
  return (
    <div className="grid grid-cols-3 gap-2 border-t border-border bg-surface p-3 touch-none sm:hidden">
      <div className="grid grid-cols-3 grid-rows-3 gap-1">
        <span />
        <Pad label="W" {...hold("forward")} />
        <span />
        <Pad label="A" {...hold("left")} />
        <span />
        <Pad label="D" {...hold("right")} />
        <span />
        <Pad label="S" {...hold("back")} />
        <span />
      </div>
      <div className="flex flex-col items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            type="button"
            className={
              i === weapon
                ? "min-h-11 w-full bg-accent text-xs tracking-widest text-bg"
                : "min-h-11 w-full bg-bg text-xs tracking-widest text-fg ring-1 ring-border"
            }
            onClick={() => onWeapon(i)}
            disabled={paused}
          >
            {i + 1}
          </button>
        ))}
        <button
          type="button"
          className="min-h-11 w-full bg-bg text-xs tracking-widest text-fg ring-1 ring-border"
          onClick={onPause}
        >
          {paused ? "RESUME" : "PAUSE"}
        </button>
        {paused && (
          <button
            type="button"
            className="min-h-11 w-full bg-accent text-xs tracking-widest text-bg"
            onClick={onRestart}
          >
            RESTART
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-1">
        <Pad label="L" {...hold("turnL")} />
        <Pad label="R" {...hold("turnR")} />
        <button
          type="button"
          className="col-span-2 min-h-14 bg-accent font-display tracking-[0.16em] text-bg"
          {...hold("fire")}
        >
          FIRE
        </button>
      </div>
    </div>
  );
}

function Pad({ label, ...rest }: { label: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className="min-h-11 bg-bg text-xs text-fg ring-1 ring-border" {...rest}>
      {label}
    </button>
  );
}
