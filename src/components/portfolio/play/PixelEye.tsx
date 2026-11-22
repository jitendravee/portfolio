/* eslint-disable @next/next/no-img-element */
"use client";
import { useId, useState, type CSSProperties } from "react";
import { FiCheck, FiHelpCircle, FiRefreshCw, FiSliders } from "react-icons/fi";
import { similarity, type Knobs, type PixelRound } from "./play-data";
import styles from "./playground.module.css";

function CardStudy({ round, knobs }: { round: PixelRound; knobs: Knobs }) {
  return (
    <div
      className={`${styles.studyCard} ${styles[round.tone] || ""}`}
      style={
        {
          "--study-space": `${knobs.space}px`,
          "--study-radius": `${knobs.radius}px`,
          "--study-width": `${knobs.width}%`,
        } as CSSProperties
      }
    >
      <div className={styles.studyArtwork}>
        {round.image ? (
          <img src={round.image} alt="" draggable={false} />
        ) : (
          <svg viewBox="0 0 120 90" aria-hidden="true">
            <path
              d="M35 10h36l15 16v54H35Z M71 10v18h15 M45 42h30m-30 10h24m-24 10h30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="m18 31 8 8 15-18"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
        )}
      </div>
      <div className={styles.studyCopy}>
        <span>{round.brand}</span>
        <h3>{round.title}</h3>
        <p>{round.description}</p>
      </div>
      <span className={styles.studyCta}>{round.cta}</span>
    </div>
  );
}
const controls = [
  { key: "space", label: "Breathing room", min: 8, max: 32, unit: "px" },
  { key: "radius", label: "Corner softness", min: 4, max: 28, unit: "px" },
  { key: "width", label: "Button width", min: 40, max: 100, unit: "%" },
] as const;

export default function PixelEye({
  rounds,
  best,
  onScore,
}: {
  rounds: PixelRound[];
  best: number;
  onScore: (score: number) => void;
}) {
  const id = useId(),
    [index, setIndex] = useState(0),
    round = rounds[index % rounds.length];
  const [knobs, setKnobs] = useState<Knobs>(round.initial),
    [score, setScore] = useState<number | null>(null),
    [hint, setHint] = useState(false);
  const solved = score !== null && score >= 95;
  const check = () => {
    const result = similarity(knobs, round.target);
    setScore(result);
    onScore(result);
  };
  const next = () => {
    const nextIndex = (index + 1) % rounds.length;
    setIndex(nextIndex);
    setKnobs(rounds[nextIndex].initial);
    setScore(null);
    setHint(false);
  };
  const gaps = controls
    .map((control) => ({
      label: control.label.toLowerCase(),
      delta:
        Math.abs(knobs[control.key] - round.target[control.key]) /
        (control.max - control.min),
    }))
    .sort((a, b) => b.delta - a.delta);
  return (
    <div className={styles.gameBody}>
      <div className={`${styles.stage} ${styles.pixelStage}`}>
        <div className={styles.stageHeading}>
          <span className={styles.stagePill}>
            <FiSliders /> A study in the little things
          </span>
          <span>
            Study {(index % rounds.length) + 1} of {rounds.length}
          </span>
        </div>
        <div className={styles.cardComparison}>
          <figure>
            <figcaption>THE REFERENCE</figcaption>
            <CardStudy round={round} knobs={round.target} />
          </figure>
          <figure>
            <figcaption>
              YOUR TAKE <span className={styles.liveTag}>editable</span>
            </figcaption>
            <CardStudy round={round} knobs={knobs} />
          </figure>
        </div>
        <p className={styles.stageNote}>
          The content is the same. The feeling is in the details.
        </p>
      </div>
      <div className={styles.controls}>
        <p className={styles.smallLabel}>For the designer in you</p>
        <h2>How good is your eye?</h2>
        <p className={styles.controlIntro}>
          Match the card on the left using three small decisions. Get 95% or
          closer to earn your stamp.
        </p>
        <div className={styles.rangeGroup}>
          {controls.map((control) => (
            <div className={styles.rangeControl} key={control.key}>
              <label htmlFor={`${id}-${control.key}`}>
                {control.label}
                <output>
                  {knobs[control.key]}
                  {control.unit}
                </output>
              </label>
              <input
                id={`${id}-${control.key}`}
                type="range"
                min={control.min}
                max={control.max}
                value={knobs[control.key]}
                onChange={(event) => {
                  setKnobs((value) => ({
                    ...value,
                    [control.key]: Number(event.target.value),
                  }));
                  setScore(null);
                }}
              />
            </div>
          ))}
        </div>
        <button className={styles.primaryButton} onClick={check}>
          {solved ? (
            <>
              <FiCheck /> Looking good
            </>
          ) : (
            "Check my eye"
          )}
        </button>
        <div className={styles.feedback} role="status" aria-live="polite">
          {score !== null ? (
            <>
              <strong className={solved ? styles.successInk : ""}>
                {score}% {solved ? "· Good eye!" : "· Almost in focus"}
              </strong>
              <p>
                {solved
                  ? "That’s the rhythm. Nicely spotted."
                  : `Try adjusting the ${gaps[0].label}. A few pixels can change a lot.`}
              </p>
            </>
          ) : (
            <p>
              Personal best <strong>{best ? `${best}%` : "not set yet"}</strong>
            </p>
          )}
        </div>
        <div className={styles.secondaryActions}>
          <button onClick={next}>
            <FiRefreshCw /> Next study
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
            Try {round.target.space}px of space, {round.target.radius}px
            corners, and a {round.target.width}% button. The controls work with
            your arrow keys, too.
          </p>
        )}
      </div>
    </div>
  );
}
