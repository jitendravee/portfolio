"use client";

import { memo, useId, type ReactNode } from "react";

export const sketchKinds = [
  "artwork",
  "storefront",
  "travel",
  "architecture",
  "mobile",
  "website",
  "journey",
  "documents",
  "automation",
  "dashboard",
  "community",
  "stories",
] as const;
export type SketchKind = (typeof sketchKinds)[number];
type Artwork = { src: string; alt: string };

// Deliberately drawn as paths, rather than screenshots with a decorative frame.
// Every page shares the same ink, wash, hatching, and handwritten annotations.
function Line({
  d,
  faint = false,
  blue = false,
}: {
  d: string;
  faint?: boolean;
  blue?: boolean;
}) {
  return (
    <g
      className={`${faint ? "pencil-faint" : ""} ${blue ? "pencil-blue" : ""}`}
    >
      <path d={d} />
      {!faint && (
        <path
          d={d}
          transform="translate(.6 .5)"
          opacity=".17"
          strokeWidth=".7"
        />
      )}
    </g>
  );
}
function Frame({
  x,
  y,
  w,
  h,
  fill = "none",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
}) {
  return (
    <path
      d={`M${x + 5} ${y + 1} Q${x + w * 0.5} ${y - 1} ${x + w - 4} ${y + 1} Q${x + w + 1} ${y + 1} ${x + w} ${y + 6} L${x + w - 1} ${y + h - 4} Q${x + w} ${y + h + 1} ${x + w - 5} ${y + h} L${x + 4} ${y + h - 1} Q${x - 1} ${y + h} ${x} ${y + h - 5} L${x + 1} ${y + 5} Q${x} ${y} ${x + 5} ${y + 1}Z`}
      fill={fill}
    />
  );
}
function Words({
  x,
  y,
  children,
  small = false,
  blue = false,
  size,
  rotate = 0,
}: {
  x: number;
  y: number;
  children: ReactNode;
  small?: boolean;
  blue?: boolean;
  size?: number;
  rotate?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      transform={`rotate(${rotate} ${x} ${y})`}
      className={`${blue ? "pencil-blue" : ""} ${small ? "sketch-small" : ""}`}
      style={size ? { fontSize: size } : undefined}
    >
      {children}
    </text>
  );
}
function Arrow({ d }: { d: string }) {
  return <path d={d} className="sketch-arrow pencil-blue" />;
}
function Shirt({
  x,
  y,
  scale = 1,
  children,
}: {
  x: number;
  y: number;
  scale?: number;
  children?: ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Line d="M29 4 L13 11 1 28 14 37 22 27 22 82 Q49 87 77 82 L76 27 86 38 98 28 85 11 68 4 Q51 17 29 4Z" />
      <Line d="M30 5 Q47 28 67 5 M24 78 Q49 82 75 78" faint />
      {children}
    </g>
  );
}
function Browser({ children }: { children: ReactNode }) {
  return (
    <g>
      <Frame x={10} y={18} w={300} h={188} />
      <Line d="M11 39 Q160 37 309 39" faint />
      <circle cx="22" cy="29" r="1.8" />
      <circle cx="30" cy="29" r="1.8" />
      <circle cx="38" cy="29" r="1.8" />
      <Line d="M254 28 H298" faint />
      {children}
    </g>
  );
}
function Phone({
  x,
  y,
  rotate = 0,
  children,
}: {
  x: number;
  y: number;
  rotate?: number;
  children: ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate} 48 96)`}>
      <Frame x={0} y={0} w={95} h={190} fill="var(--book-paper)" />
      <Line d="M33 8 H61 M40 181 H57" faint />
      {children}
    </g>
  );
}
function Person({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-6 0 Q-8-10 0-11 Q9-11 7 0 Q5 8 0 8 Q-6 8-6 0Z M-1 11 Q-15 10-17 32 L-10 35-9 60 M3 11 Q16 10 18 32 L10 35 9 60 M-9 38 H9" />
    </g>
  );
}

function BookIllustration({
  kind,
  images = [],
  label,
}: {
  kind: SketchKind;
  images?: Artwork[];
  label: string;
}) {
  const id = useId().replace(/:/g, ""),
    hatch = `pencil-hatch-${id}`;
  const darkInk = `pencil-ink-${id}`,
    lightInk = `pencil-white-${id}`;
  const art = (
    image: Artwork | undefined,
    x: number,
    y: number,
    width: number,
    height: number,
  ) =>
    image && (
      <image
        href={image.src}
        x={x}
        y={y}
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid meet"
        filter={`url(#${/guitar-lines|connecting-people|life-sounds|music-is-life/.test(image.src) ? lightInk : darkInk})`}
      />
    );
  return (
    <svg
      className={`book-illustration illustration-${kind}`}
      viewBox="0 0 320 242"
      role="img"
      aria-label={label}
    >
      <defs>
        <pattern
          id={hatch}
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(17)"
        >
          <path
            d="M0 6L6 0"
            stroke="currentColor"
            strokeWidth=".55"
            opacity=".24"
          />
        </pattern>
        <filter id={darkInk} colorInterpolationFilters="sRGB">
          <feColorMatrix values="0 0 0 0 .29 0 0 0 0 .28 0 0 0 0 .25 -.2126 -.7152 -.0722 0 1" />
          <feComposite operator="in" in2="SourceAlpha" />
        </filter>
        <filter id={lightInk} colorInterpolationFilters="sRGB">
          <feColorMatrix values="0 0 0 0 .29 0 0 0 0 .28 0 0 0 0 .25 .2126 .7152 .0722 0 0" />
          <feComposite operator="in" in2="SourceAlpha" />
        </filter>
      </defs>
      <g className="pencil-drawing">
        {kind === "artwork" && (
          <>
            <path
              d="M28 179Q85 173 151 186L142 210 23 203Z"
              className="pencil-wash"
            />
            <Shirt x={18} y={27} scale={1.65}>
              {art(images[0], 28, 25, 42, 43)}
            </Shirt>
            {art(images[1], 211, 13, 88, 91)}
            {art(images[2], 210, 115, 90, 83)}
            <Arrow d="M184 74Q172 63 151 70m7-6-7 6 9 3" />
            <Words x={181} y={115} small rotate={-5}>
              line studies
            </Words>
            <Words x={40} y={217} blue rotate={-3}>
              a thought you can wear.
            </Words>
            <Line d="M218 211l44-7m-37 13 34-7" faint />
          </>
        )}
        {kind === "storefront" && (
          <>
            <Browser>
              <Words x={24} y={59} size={16}>
                Bandadda
              </Words>
              <Line d="M197 53h26m10 0h26m10 0h26" faint />
              <path
                d="M24 72H295V130Q154 125 24 134Z"
                className="pencil-wash"
              />
              <Words x={30} y={94} size={24}>
                Wear your music.
              </Words>
              <Words x={31} y={116} small>
                Original art. A whole world around it.
              </Words>
              {[35, 135, 235].map((x) => (
                <g key={x}>
                  <Shirt x={x} y={143} scale={0.5} />
                  <Line d={`M${x - 1} 194h45`} faint />
                </g>
              ))}
            </Browser>
            <Arrow d="M227 225q-25-6-25-24m-5 7 5-7 5 7" />
            <Words x={24} y={234} blue>
              design → store → community
            </Words>
          </>
        )}
        {kind === "travel" && (
          <>
            <path
              d="M32 113Q120 19 284 78L279 121Q151 87 35 145Z"
              className="pencil-wash"
            />
            <Line
              d="M11 117L53 73 79 97 119 39 157 89 187 64 217 105 259 47 309 114 M92 74l26-17 18 17 M245 74l14-12 18 16"
              faint
            />
            <path
              d={`M24 116l29-25 31 28 36-48 39 37 29-22 28 35 45-58 31 55v27H24Z`}
              fill={`url(#${hatch})`}
              stroke="none"
            />
            <Line d="M45 135Q101 96 162 130T280 116" blue />
            <circle cx="44" cy="135" r="4" />
            <circle cx="280" cy="116" r="4" />
            <Words x={24} y={156} small>
              Pune
            </Words>
            <Words x={270} y={141} small>
              Goa
            </Words>
            {[22, 123, 224].map((x, i) => (
              <g key={x}>
                <Frame x={x} y={175} w={75} h={46} />
                <Words x={x + 9} y={191} small>
                  Day {i + 1}
                </Words>
                <Line d={`M${x + 10} 202h45m-45 8h32`} faint />
              </g>
            ))}
            <Words x={99} y={25} size={21} rotate={-3}>
              Rimigo
            </Words>
            <Words x={168} y={238} small blue>
              a plan worth sharing
            </Words>
          </>
        )}
        {kind === "architecture" && (
          <>
            <Frame x={14} y={30} w={194} h={150} />
            <Line d="M15 50H207" faint />
            <circle cx="25" cy="40" r="2" />
            <circle cx="34" cy="40" r="2" />
            <Words x={26} y={73} size={16}>
              route(&apos;/trips&apos;)
            </Words>
            <Words x={34} y={98} size={15} blue>
              protect the journey
            </Words>
            <Line d="M30 116h127m-109 13h121m-139 13h94m-76 13h97" faint />
            <path d="M25 163h148v7H25Z" fill={`url(#${hatch})`} stroke="none" />
            {[27, 99, 171].map((y, i) => (
              <g key={y}>
                <Frame x={239} y={y} w={70} h={39} />
                <Words x={251} y={y + 25} size={16}>
                  {["Routes", "Query", "AI"][i]}
                </Words>
              </g>
            ))}
            <Arrow d="M208 103Q232 103 233 48m-4 7 4-7 4 7 M208 105h28m-7-4 7 4-7 4 M208 107Q230 110 234 187m-5-6 5 6 4-7" />
            <Words x={37} y={218} blue rotate={-2}>
              small pieces. one useful system.
            </Words>
            <Line d="M73 224q77 7 147-3" faint />
          </>
        )}
        {kind === "mobile" && (
          <>
            <Phone x={44} y={15} rotate={-7}>
              <Words x={13} y={34} size={18}>
                twig g
              </Words>
              <Words x={12} y={56} small>
                Your accounts
              </Words>
              <path d="M10 67H85V108H10Z" className="pencil-wash" />
              <Line d="M14 98l13-9 13 4 11-15 12 7 14-13" blue />
              <Line d="M13 119h66m-66 20h66m-66 20h66" faint />
              <circle cx="20" cy="130" r="3" />
              <circle cx="20" cy="150" r="3" />
              <Line d="M33 130h40m-40 20h31" />
            </Phone>
            <Phone x={180} y={25} rotate={8}>
              <Words x={13} y={34} size={16}>
                Twigg AI
              </Words>
              <Frame x={10} y={49} w={75} h={38} />
              <Words x={17} y={65} small>
                How am
              </Words>
              <Words x={17} y={79} small>
                I doing?
              </Words>
              <Line d="M13 108h61m-61 13h49m-49 13h56" faint />
              <Frame x={10} y={150} w={75} h={19} />
            </Phone>
            <Words x={72} y={235} blue>
              clarity, in your pocket.
            </Words>
          </>
        )}
        {kind === "website" && (
          <>
            <Browser>
              <Words x={25} y={60} size={18}>
                TWIGG
              </Words>
              <Words x={26} y={99} size={25}>
                Money.
              </Words>
              <Words x={26} y={125} size={25}>
                Made simple.
              </Words>
              <Line d="M27 141h101m-101 11h86" faint />
              <Frame x={28} y={167} w={77} h={20} fill="var(--book-wash)" />
              <Words x={39} y={181} small>
                Explore →
              </Words>
              <g transform="translate(196 60) scale(.63)">
                <Phone x={0} y={0} rotate={8}>
                  <Words x={14} y={39} size={18}>
                    Overview
                  </Words>
                  <Line d="M12 70h69m-69 30h69m-69 30h69" faint />
                  <path d="M14 106l16-15 19 6 26-26" />
                </Phone>
              </g>
            </Browser>
            <Words x={60} y={232} blue>
              the same care, on every screen.
            </Words>
          </>
        )}
        {kind === "journey" && (
          <>
            <Words x={15} y={31} size={24}>
              Wayvia
            </Words>
            <Line
              d="M26 81Q109 27 183 80T298 66 M26 81Q130 141 211 92T298 66"
              blue
            />
            {[26, 173, 298].map((x, i) => (
              <g key={x}>
                <circle
                  cx={x}
                  cy={[81, 77, 66][i]}
                  r="5"
                  fill="var(--book-paper)"
                />
              </g>
            ))}
            <Words x={105} y={43} small rotate={-4}>
              another route
            </Words>
            <Arrow d="M194 27Q213 27 212 59m-4-6 4 6 5-6" />
            <g transform="translate(28 134)">
              <Line d="M0 47V7Q2-1 12 0H166L207 31V47Z M126 1V46 M0 47H207 M-10 62H224 M-8 69H224" />
              {[12, 49, 86, 140].map((x) => (
                <Frame
                  key={x}
                  x={x}
                  y={9}
                  w={24}
                  h={20}
                  fill="var(--book-wash)"
                />
              ))}
              <path d="M176 10l25 19h-25Z" fill={`url(#${hatch})`} />
              {[25, 101, 162, 192].map((x) => (
                <circle key={x} cx={x} cy={49} r="6" />
              ))}
              {Array.from({ length: 12 }, (_, i) => (
                <path key={i} d={`M${i * 20 - 4} 60l-6 12`} opacity=".3" />
              ))}
            </g>
            <Words x={79} y={235} blue>
              keep the journey possible.
            </Words>
          </>
        )}
        {kind === "documents" && (
          <>
            <path
              d="M27 32L134 30 158 55V202L27 199Z M134 31L134 56 157 56"
              fill="var(--book-paper)"
            />
            <Words x={43} y={74} size={24}>
              PDF
            </Words>
            <path d="M42 91h91v24H42Z" className="pencil-wash" />
            <Line
              d="M44 101h70m-70 29h94m-94 15h82m-82 15h92m-92 15h61"
              faint
            />
            <path d="M184 37Q180 31 189 31H302V102H232L214 119 216 102H185Z" />
            <Words x={198} y={54} size={16}>
              Merge these.
            </Words>
            <Words x={199} y={78} size={15} blue>
              Done. ✓
            </Words>
            <Arrow d="M172 120Q203 121 212 147m-7-3 7 3 1-9" />
            <Frame x={207} y={151} w={72} h={66} />
            <Line d="M213 143h73v65" faint />
            <path
              d="M227 184l12 11 22-27"
              className="pencil-blue"
              strokeWidth="2.5"
            />
            <Words x={12} y={234} blue>
              FlowPDF / just ask.
            </Words>
          </>
        )}
        {kind === "automation" && (
          <>
            <g transform="translate(20 66)">
              <Frame x={0} y={0} w={62} h={67} />
              <Line d="M10 14h42m-42 14h34m-34 14h42" faint />
              <Words x={5} y={89} size={17}>
                Enquiry
              </Words>
            </g>
            <g transform="translate(130 65)">
              <Frame x={0} y={0} w={62} h={67} />
              <path d="M9 13h44v43H9Z M9 27h44M9 41h44M24 13v43M39 13v43" />
              <Words x={12} y={90} size={17}>
                Sheets
              </Words>
            </g>
            <g transform="translate(240 80)">
              <Frame x={0} y={0} w={65} h={49} />
              <Line d="M1 4l31 25L63 4 M1 45l22-22m42 22L43 23" />
              <Words x={15} y={75} size={17}>
                Gmail
              </Words>
            </g>
            <Arrow d="M89 98h32m-7-5 7 5-7 5 M199 98h32m-7-5 7 5-7 5" />
            <Line d="M28 184Q162 208 291 181" faint />
            <Words x={54} y={214} blue>
              less repetition. more room to think.
            </Words>
            <Words x={79} y={34} size={17} rotate={-4}>
              let the dots connect.
            </Words>
          </>
        )}
        {kind === "dashboard" && (
          <>
            <Browser>
              <Line d="M76 40V205" faint />
              <Words x={20} y={59} small>
                SkillsPe
              </Words>
              <Line d="M20 80h43m-43 21h35m-35 21h40m-40 21h28" faint />
              {[90, 163, 236].map((x, i) => (
                <g key={x}>
                  <Frame
                    x={x}
                    y={54}
                    w={61}
                    h={33}
                    fill={i === 1 ? "var(--book-wash)" : "none"}
                  />
                  <Words x={x + 5} y={75} small>
                    {["Review", "Live", "Insights"][i]}
                  </Words>
                </g>
              ))}
              <Line
                d="M95 110v64h192 M105 156l22-15 29 6 25-28 29 11 37-23 29 8"
                blue
              />
              <Line d="M102 190h75m25 0h82" faint />
            </Browser>
            <Words x={59} y={233} blue>
              make the busy bits feel calm.
            </Words>
          </>
        )}
        {kind === "community" && (
          <>
            <path d="M48 50Q160-9 285 59L273 157H43Z" className="pencil-wash" />
            <Line
              d="M17 177Q151 169 306 177 M27 48V169 M291 48V169 M26 49Q160 10 292 49"
              faint
            />
            <Person x={135} y={84} scale={1.25} />
            <g transform="translate(163 58) rotate(20)">
              <path d="M8 34V0H17V34Q35 35 29 52Q45 76 18 83Q-9 79 0 58Q-14 39 8 34Z" />
              <circle cx="12" cy="55" r="7" />
              <Line d="M10 5v66m4-66v66" faint />
            </g>
            <Line d="M82 77V167 M70 168h26 M78 71q4-7 10-2l6 3q-2 7-8 6Z" />
            {[43, 83, 126, 168, 212, 259].map((x, i) => (
              <Person key={x} x={x} y={190 + (i % 2) * 4} scale={0.75} />
            ))}
            <Words x={204} y={36} small rotate={8}>
              meet. make. play.
            </Words>
            <path d="M42 68l-4-16 13-3v15m-13 4q-8-2-7 4t7-4m13-4q-8-2-7 4t7-4" />
          </>
        )}
        {kind === "stories" && (
          <>
            <g transform="translate(54 16) rotate(-5 100 45)">
              <path d="M0 14H35L43 1H88L97 14H174V95H0Z" />
              <circle cx="88" cy="54" r="29" />
              <circle cx="88" cy="54" r="21" />
              <Frame x={130} y={27} w={24} h={13} />
              <Line d="M13 4h19m91 1h31" faint />
              <path d="M62 55q0-25 28-24" className="pencil-blue" />
            </g>
            {[16, 122, 228].map((x, i) => (
              <g key={x}>
                <Frame x={x} y={151} w={77} h={65} />
                {i === 0 ? (
                  <Shirt x={x + 15} y={162} scale={0.45} />
                ) : i === 1 ? (
                  <path
                    d={`M${x + 29} 166l25 17-25 17Z`}
                    className="pencil-blue"
                  />
                ) : (
                  <path
                    d={`M${x + 15} 178l40-13v36l-40-13Z M${x + 27} 192l3 14 9-3-3-13`}
                  />
                )}
              </g>
            ))}
            <Line d="M96 183h21m82 0h24" faint />
            <Words x={56} y={239} blue>
              make it. tell its story. keep going.
            </Words>
          </>
        )}
      </g>
    </svg>
  );
}

export default memo(BookIllustration);
