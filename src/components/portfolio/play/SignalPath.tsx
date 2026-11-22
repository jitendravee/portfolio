"use client";
import { useEffect, useId, useRef, useState } from "react";
import { FiCheck, FiHelpCircle, FiRotateCw, FiSend } from "react-icons/fi";
import { tilePorts, traceSignal, type PlayConfig } from "./play-data";
import styles from "./playground.module.css";

export default function SignalPath({
  config,
  best,
  onWin,
}: {
  config: PlayConfig["signal"];
  best: number | null;
  onWin: (moves: number) => void;
}) {
  const id = useId(),
    [rotations, setRotations] = useState(
      config.tiles.map((tile) => tile.rotation),
    ),
    [moves, setMoves] = useState(0),
    [visited, setVisited] = useState<number[]>([]);
  const [running, setRunning] = useState(false),
    [result, setResult] = useState<"success" | "failed" | null>(null),
    [hint, setHint] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]),
    buttons = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const reset = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRotations(config.tiles.map((tile) => tile.rotation));
    setMoves(0);
    setVisited([]);
    setResult(null);
    setRunning(false);
  };
  const rotate = (index: number) => {
    if (running) return;
    setRotations((value) =>
      value.map((rotation, position) =>
        position === index ? (rotation + 1) % 4 : rotation,
      ),
    );
    setMoves((value) => value + 1);
    setVisited([]);
    setResult(null);
  };
  const send = () => {
    if (running) return;
    const trace = traceSignal(config.tiles, rotations, config.stages);
    setVisited([]);
    setResult(null);
    setRunning(true);
    const finish = () => {
      setVisited(trace.path);
      setResult(trace.success ? "success" : "failed");
      setRunning(false);
      if (trace.success) onWin(moves);
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    timers.current.forEach(clearTimeout);
    timers.current = [];
    trace.path.forEach((_, index) =>
      timers.current.push(
        setTimeout(
          () => setVisited(trace.path.slice(0, index + 1)),
          (index + 1) * 190,
        ),
      ),
    );
    timers.current.push(setTimeout(finish, (trace.path.length + 1) * 190));
  };
  const directions = ["up", "right", "down", "left"];
  return (
    <div className={styles.gameBody}>
      <div className={`${styles.stage} ${styles.signalStage}`}>
        <div className={styles.stageHeading}>
          <span className={styles.stagePill}>
            <FiSend /> A tiny system, waiting to work
          </span>
          <span>
            {moves} {moves === 1 ? "turn" : "turns"}
          </span>
        </div>
        <div className={styles.circuitLayout}>
          <div className={styles.terminal}>
            <span className={styles.inputDot} />
            <strong>IN</strong>
            <span>{config.source}</span>
          </div>
          <div
            className={styles.circuitBoard}
            role="group"
            aria-label="Signal routing board"
            aria-describedby={`${id}-instructions`}
          >
            {config.tiles.map((tile, index) => (
              <button
                key={index}
                ref={(element) => {
                  buttons.current[index] = element;
                }}
                data-tile={index}
                data-rotation={rotations[index]}
                data-powered={visited.includes(index)}
                className={`${styles.wireTile} ${tile.label ? styles.componentTile : ""}`}
                disabled={running}
                aria-label={`Rotate ${tile.label || `wire ${index + 1}`} tile; connected ${tilePorts(
                  tile,
                  rotations[index],
                )
                  .map((port) => directions[port])
                  .join(" and ")}`}
                onClick={() => rotate(index)}
                onKeyDown={(event) => {
                  const offset: Record<string, number> = {
                    ArrowLeft: -1,
                    ArrowRight: 1,
                    ArrowUp: -3,
                    ArrowDown: 3,
                  };
                  if (!(event.key in offset)) return;
                  event.preventDefault();
                  const next = index + offset[event.key];
                  if (
                    next >= 0 &&
                    next < 9 &&
                    (Math.abs(offset[event.key]) === 3 ||
                      Math.floor(next / 3) === Math.floor(index / 3))
                  )
                    buttons.current[next]?.focus();
                }}
              >
                <svg
                  viewBox="0 0 80 80"
                  aria-hidden="true"
                  style={{ transform: `rotate(${rotations[index] * 90}deg)` }}
                >
                  <path
                    d={
                      tile.kind === "corner"
                        ? "M40 -4V25Q40 40 55 40H84"
                        : "M40 -4V84"
                    }
                  />
                  <circle cx="40" cy="0" r="3" />
                  <circle
                    cx={tile.kind === "corner" ? 80 : 40}
                    cy={tile.kind === "corner" ? 40 : 80}
                    r="3"
                  />
                </svg>
                {tile.label && (
                  <span className={styles.nodeBadge}>{tile.label}</span>
                )}
                <FiRotateCw className={styles.rotateHint} />
              </button>
            ))}
          </div>
          <div
            className={`${styles.terminal} ${result === "success" ? styles.terminalSuccess : ""}`}
          >
            <span className={styles.outputDot} />
            <strong>OUT</strong>
            <span>{config.destination}</span>
          </div>
        </div>
        <p className={styles.stageNote}>
          An enquiry. A little logic. One less thing to do manually.
        </p>
      </div>
      <div className={styles.controls}>
        <p className={styles.smallLabel}>For the engineer in you</p>
        <h2>Connect the useful dots.</h2>
        <p className={styles.controlIntro} id={`${id}-instructions`}>
          Turn the wire tiles to route the enquiry through{" "}
          <strong>{config.stages.join(", then ")}</strong>, and out to the
          reply. Click or press Enter to rotate.
        </p>
        <div className={styles.miniStats}>
          <div>
            <strong>{moves}</strong>
            <span>your turns</span>
          </div>
          <div>
            <strong>{best ?? "—"}</strong>
            <span>personal best</span>
          </div>
        </div>
        <button
          className={styles.primaryButton}
          disabled={running}
          onClick={send}
        >
          {running ? (
            "Following the signal…"
          ) : result === "success" ? (
            <>
              <FiCheck /> Run it again
            </>
          ) : (
            <>
              <FiSend /> Send a signal
            </>
          )}
        </button>
        <div className={styles.feedback} role="status" aria-live="polite">
          {result === "success" ? (
            <>
              <strong className={styles.successInk}>
                Flow state, achieved.
              </strong>
              <p>
                The enquiry is checked, saved, and followed up. That’s a little
                automation magic.
              </p>
            </>
          ) : result === "failed" ? (
            <>
              <strong>There’s a loose connection.</strong>
              <p>
                {visited.length
                  ? `The signal reached ${config.tiles[visited.at(-1)!].label || "a bend"}. Give the next connection another look.`
                  : "Start at the left-hand input. The first wire needs to let the signal in."}
              </p>
            </>
          ) : (
            <p>
              Get the whole flow working to earn your stamp. Fewer turns is a
              nice bonus.
            </p>
          )}
        </div>
        <div className={styles.secondaryActions}>
          <button onClick={reset} disabled={running}>
            <FiRotateCw /> Reset board
          </button>
          <button
            aria-expanded={hint}
            onClick={() => setHint((value) => !value)}
          >
            <FiHelpCircle /> {hint ? "Hide hint" : "Need a hint?"}
          </button>
        </div>
        {hint && (
          <p className={styles.hint}>
            Think up, across, then down. The three named tiles belong in the
            same continuous path. Tab between tiles or use the arrow keys to
            move around the board.
          </p>
        )}
      </div>
    </div>
  );
}
