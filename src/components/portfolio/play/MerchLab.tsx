/* eslint-disable @next/next/no-img-element */
"use client";
import { useId, useState } from "react";
import { FiDownload, FiRefreshCw, FiScissors } from "react-icons/fi";
import type { Artwork, TeeColor } from "./play-data";
import styles from "./playground.module.css";

const tee =
  "M190 65Q215 87 250 90Q300 107 350 90Q385 86 410 65L505 110 575 225 485 280 448 227 450 560Q300 590 150 560L152 227 115 280 25 225 95 110Z";
const seams =
  "M194 71Q300 140 406 71 M153 543Q300 572 447 543 M97 119L121 264 M503 119L479 264";

export default function MerchLab({
  artworks,
  colors,
  onMade,
}: {
  artworks: Artwork[];
  colors: TeeColor[];
  onMade: () => void;
}) {
  const id = useId().replace(/:/g, ""),
    [artId, setArtId] = useState(artworks[0].id),
    [colorId, setColorId] = useState(colors[0].id),
    [size, setSize] = useState(190);
  const [saving, setSaving] = useState(false),
    [message, setMessage] = useState("");
  const art = artworks.find((item) => item.id === artId) || artworks[0],
    color = colors.find((item) => item.id === colorId) || colors[0];
  const save = async () => {
    if (saving) return;
    setSaving(true);
    setMessage("");
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 600;
      canvas.height = 640;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");
      const outline = new Path2D(tee);
      context.fillStyle = color.value;
      context.shadowColor = "#00000025";
      context.shadowBlur = 18;
      context.shadowOffsetY = 10;
      context.fill(outline);
      context.shadowColor = "transparent";
      const light = context.createLinearGradient(80, 0, 520, 640);
      light.addColorStop(0, "#ffffff24");
      light.addColorStop(0.45, "#ffffff00");
      light.addColorStop(1, "#00000018");
      context.fillStyle = light;
      context.fill(outline);
      context.strokeStyle = "#00000030";
      context.lineWidth = 2;
      context.stroke(outline);
      context.strokeStyle = "#00000025";
      context.lineWidth = 1.5;
      context.stroke(new Path2D(seams));
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = art.src;
      await image.decode();
      const ratio = Math.min(
          size / image.naturalWidth,
          (size * 1.1) / image.naturalHeight,
        ),
        w = image.naturalWidth * ratio,
        h = image.naturalHeight * ratio;
      context.drawImage(image, 300 - w / 2, 180 + (size * 1.1 - h) / 2, w, h);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) throw new Error("Export failed");
      const url = URL.createObjectURL(blob),
        anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `bandadda-play-${art.id}-${color.id}.png`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      onMade();
      setMessage("Saved. A little something you made here, to take with you.");
    } catch {
      setMessage(
        "Couldn’t save this print. Try another artwork and give it another go.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className={styles.gameBody}>
      <div className={`${styles.stage} ${styles.merchStage}`}>
        <div className={styles.stageHeading}>
          <span className={styles.stagePill}>
            <FiScissors /> From the Bandadda sketch drawer
          </span>
          <span>Yours to remix</span>
        </div>
        <div className={styles.teePreview}>
          <span className={styles.teeAnnotation}>
            a little less screen.
            <br />a little more self-expression.
          </span>
          <svg
            className={styles.teeSvg}
            viewBox="0 0 600 640"
            role="img"
            aria-label={`${art.name} artwork on a ${color.name.toLowerCase()} T-shirt`}
          >
            <defs>
              <linearGradient
                id={`tee-light-${id}`}
                x1="0"
                x2="1"
                y1="0"
                y2="1"
              >
                <stop stopColor="#fff" stopOpacity=".14" />
                <stop offset=".45" stopColor="#fff" stopOpacity="0" />
                <stop offset="1" stopColor="#000" stopOpacity=".1" />
              </linearGradient>
              <pattern
                id={`tee-grain-${id}`}
                width="5"
                height="5"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 1h2m1 3h2"
                  stroke="#fff"
                  strokeWidth=".6"
                  opacity=".08"
                />
              </pattern>
            </defs>
            <path d={tee} fill={color.value} stroke="#0003" strokeWidth="2" />
            <path d={tee} fill={`url(#tee-light-${id})`} />
            <path d={tee} fill={`url(#tee-grain-${id})`} />
            <path d={seams} fill="none" stroke="#0003" strokeWidth="1.5" />
            <image
              href={art.src}
              x={300 - size / 2}
              y="180"
              width={size}
              height={size * 1.1}
              preserveAspectRatio="xMidYMid meet"
            />
          </svg>
          <span className={styles.teeEdition}>
            BANDADDA
            <br />
            <small>A little original.</small>
          </span>
        </div>
        <p className={styles.stageNote}>
          {art.name} / {color.name.toLowerCase()} / your version
        </p>
      </div>
      <div className={styles.controls}>
        <p className={styles.smallLabel}>For the maker in you</p>
        <h2>Wear your kind of weird.</h2>
        <p className={styles.controlIntro}>
          These are my original Bandadda graphics. Pick a print, find its
          colour, and take your version home.
        </p>
        <fieldset className={styles.artPicker}>
          <legend>Choose a print</legend>
          <div>
            {artworks.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setArtId(item.id);
                  setMessage("");
                }}
                aria-label={`Use ${item.name} artwork`}
                aria-pressed={art.id === item.id}
                title={item.name}
              >
                <img src={item.src} alt="" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className={styles.colorPicker}>
          <legend>
            Tee colour <span>{color.name}</span>
          </legend>
          <div>
            {colors.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setColorId(item.id);
                  setMessage("");
                }}
                aria-label={`${item.name} tee`}
                aria-pressed={color.id === item.id}
                title={item.name}
              >
                <span style={{ background: item.value }} />
              </button>
            ))}
          </div>
        </fieldset>
        <div className={styles.rangeControl}>
          <label htmlFor={`${id}-size`}>
            Print size<output>{Math.round((size / 190) * 100)}%</output>
          </label>
          <input
            id={`${id}-size`}
            type="range"
            min="140"
            max="240"
            step="2"
            value={size}
            onChange={(event) => {
              setSize(Number(event.target.value));
              setMessage("");
            }}
          />
        </div>
        <button
          className={styles.primaryButton}
          disabled={saving}
          onClick={save}
        >
          <FiDownload />
          {saving ? "Making your PNG…" : "Save my tee"}
        </button>
        <div className={styles.feedback} role="status" aria-live="polite">
          <p>
            {message ||
              (art.id === "guitar-lines" && color.id === "bone"
                ? "Light prints love a darker tee. Try Ink or Moss for a little more contrast."
                : "Save your version as a transparent PNG and collect your maker stamp.")}
          </p>
        </div>
        <div className={styles.secondaryActions}>
          <button
            onClick={() => {
              setArtId(artworks[0].id);
              setColorId(colors[0].id);
              setSize(190);
              setMessage("");
            }}
          >
            <FiRefreshCw /> Start fresh
          </button>
        </div>
      </div>
    </div>
  );
}
