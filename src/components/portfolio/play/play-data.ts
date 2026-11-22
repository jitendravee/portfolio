import seed from "../../../../public/data/play.json";

export type Knobs = { space: number; radius: number; width: number };
export type PixelRound = {
  id: string;
  brand: string;
  title: string;
  description: string;
  cta: string;
  image: string;
  tone: string;
  target: Knobs;
  initial: Knobs;
};
export type Tile = {
  kind: "corner" | "straight";
  rotation: number;
  label: string;
};
export type Artwork = { id: string; name: string; src: string };
export type TeeColor = { id: string; name: string; value: string };
export type PlayConfig = {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  pixelRounds: PixelRound[];
  signal: {
    source: string;
    destination: string;
    stages: string[];
    tiles: Tile[];
  };
  artworks: Artwork[];
  teeColors: TeeColor[];
};
export const initialPlay = seed as PlayConfig;
export type Progress = { pixel: number; signal: number | null; merch: boolean };
export const emptyProgress: Progress = { pixel: 0, signal: null, merch: false };

const record = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object";
const text = (value: unknown): value is string => typeof value === "string";
const bounded = (value: unknown, min: number, max: number) =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value >= min &&
  value <= max;
const knobs = (value: unknown) =>
  record(value) &&
  bounded(value.space, 8, 32) &&
  bounded(value.radius, 4, 28) &&
  bounded(value.width, 40, 100);
export function validPlay(value: unknown): value is PlayConfig {
  if (
    !record(value) ||
    ![value.eyebrow, value.title, value.accent, value.description].every(text)
  )
    return false;
  return (
    Array.isArray(value.pixelRounds) &&
    value.pixelRounds.length > 0 &&
    value.pixelRounds.every(
      (round) =>
        record(round) &&
        [
          round.id,
          round.brand,
          round.title,
          round.description,
          round.cta,
          round.image,
          round.tone,
        ].every(text) &&
        knobs(round.target) &&
        knobs(round.initial),
    ) &&
    record(value.signal) &&
    text(value.signal.source) &&
    text(value.signal.destination) &&
    Array.isArray(value.signal.stages) &&
    value.signal.stages.length === 3 &&
    value.signal.stages.every(text) &&
    Array.isArray(value.signal.tiles) &&
    value.signal.tiles.length === 9 &&
    value.signal.tiles.every(
      (tile) =>
        record(tile) &&
        ["corner", "straight"].includes(tile.kind as string) &&
        Number.isInteger(tile.rotation) &&
        bounded(tile.rotation, 0, 3) &&
        text(tile.label),
    ) &&
    Array.isArray(value.artworks) &&
    value.artworks.length > 0 &&
    value.artworks.every(
      (art) => record(art) && [art.id, art.name, art.src].every(text),
    ) &&
    Array.isArray(value.teeColors) &&
    value.teeColors.length > 0 &&
    value.teeColors.every(
      (color) =>
        record(color) &&
        text(color.id) &&
        text(color.name) &&
        text(color.value) &&
        /^#[\da-f]{6}$/i.test(color.value),
    )
  );
}
export function readProgress(value: unknown): Progress {
  if (!record(value)) return emptyProgress;
  return {
    pixel: bounded(value.pixel, 0, 100) ? (value.pixel as number) : 0,
    signal: bounded(value.signal, 0, 9999) ? (value.signal as number) : null,
    merch: value.merch === true,
  };
}
export function similarity(value: Knobs, target: Knobs) {
  const error =
    Math.abs(value.space - target.space) / 24 +
    Math.abs(value.radius - target.radius) / 24 +
    Math.abs(value.width - target.width) / 60;
  return Math.max(0, Math.round(100 - (error / 3) * 100));
}
export function tilePorts(tile: Tile, rotation: number) {
  return (tile.kind === "corner" ? [0, 1] : [0, 2]).map(
    (port) => (port + rotation) % 4,
  );
}
export function traceSignal(
  tiles: Tile[],
  rotations: number[],
  stages: string[],
) {
  const path: number[] = [],
    visited = new Set<number>(),
    labels: string[] = [];
  let index = 3,
    entry = 3;
  while (!visited.has(index)) {
    visited.add(index);
    const ports = tilePorts(tiles[index], rotations[index]);
    if (!ports.includes(entry)) return { path, success: false };
    path.push(index);
    if (tiles[index].label) labels.push(tiles[index].label);
    const exit = ports.find((port) => port !== entry)!;
    if (index === 5 && exit === 1)
      return {
        path,
        success:
          stages.every((stage, position) => labels[position] === stage) &&
          labels.length === stages.length,
      };
    const row = Math.floor(index / 3),
      col = index % 3;
    const nextRow = row + [-1, 0, 1, 0][exit],
      nextCol = col + [0, 1, 0, -1][exit];
    if (nextRow < 0 || nextRow > 2 || nextCol < 0 || nextCol > 2)
      return { path, success: false };
    index = nextRow * 3 + nextCol;
    entry = (exit + 2) % 4;
  }
  return { path, success: false };
}
