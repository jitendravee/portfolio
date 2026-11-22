# Jitendra Choudhary — Portfolio

A responsive portfolio built with Next.js 15, React 19, TypeScript, and Tailwind CSS. The redesign follows the visual direction of [Matthew Yu’s portfolio](https://matthewyu.dev/) using Jitendra’s own work, copy, links, and media.

## Run locally

```sh
npm ci
npm run dev
```

Open the local URL printed by Next.js. For a production export:

```sh
npm run build
```

The static-export configuration produces `out/`. Development uses `.next-dev/` and production uses `.next/`, so a local dev server can keep running during a build. Host that directory with a server that resolves extensionless routes to their `.html` files.

## Pages and interactions

- `/`: project sketchbook with 3D page turns, keyboard and swipe navigation, and a two-column project gallery.
- `/work`: standalone project index.
- `/work/[slug]`: 16 shareable work detail pages. Normal gallery clicks open the same content in a sheet above the gallery, with browser history, Escape, close, and full-screen controls. Modified clicks open the standalone URL.
- `/play`: an interactive studio with design, automation, and original Bandadda artwork experiments.
- `/play/flow-field`: interactive canvas experiment with pause, cycle controls, variations, and PNG export.
- `/about`: biography and experience based on the existing résumé.
- `/inspiration`: a visual collection using project imagery and the supplied design reference.

The theme follows the operating system until the visitor chooses light or dark mode. Reduced-motion preferences disable book turns and automatic video/canvas motion. Original `?project=<projectName>` links redirect to the corresponding detail URL; legacy `#work`, `#about`, `#home`, and `#contact` destinations remain supported.

## Content and media

- `src/data/projects.json` holds the complete work gallery: 10 retained software projects plus Bandadda, Wayvia, original graphics, content, community, and FlowPDF. Ridvig’s Drive Dosti project was removed as requested; the employment role remains in the timeline.
- `src/data/portfolio.ts` defines the content types. Titles, slugs, layouts, filters, links, sections, galleries, and media all live in projects.json.
- `src/components/portfolio/` contains the new shared UI.
- `public/projects/manifest.json` records downloaded asset sources and media status.

Nine public-site walkthroughs are included in `public/projects/reels/`: Rimigo, Twigg, Saharsh Cabins, SkillsPe, Service Hive, Praxis Forge, FlowPDF, Bandadda, and Wayvia. They show actual public-site navigation with a lavender pointer, trailing halo, click feedback, and gentle camera zooms. Each has a WebP poster and a JSON provenance record listing the URL and actions. Page-load footage is trimmed and playback is paced for gallery previews. The recordings are integrated into the corresponding project cards and detail pages; FlowPDF appears on Play.

The separate SkillsPe app MP4 was converted from the original `playstore.gif`. Native Twigg, the private admin console, and the internal automation workflow use existing product imagery or original previews. The recordings do not claim to demonstrate private account flows or native app interactions.

The live Praxis Forge page was verified in the browser. Its raw HTML metadata still mentions Ryuzentech, but the rendered site uses PraxisForge branding.

### Repeat captures and browser checks

```sh
npx playwright install chromium
npm run build
npm run preview
# In another terminal:
npm run test:ui
npm run record:project -- rimigo
python3 scripts/encode-recording.py rimigo
```

`PORTFOLIO_BASE_URL` overrides the browser-test URL. `PORTFOLIO_BROWSER_EXECUTABLE` selects an existing Chromium binary. Screenshots and raw recordings go under ignored `.artifacts/` folders. The capture script only visits public pages and does not submit forms or log in.

The preview server resolves extensionless static routes and supports MP4 byte-range requests. `npm start` serves the production export as well. Jost is served locally with its bundled OFL license, so builds do not need Google Fonts access.

## Experience timeline

Home and About share `src/components/portfolio/ExperienceTimeline.tsx`. Edit **`public/data/experience.json`** to update the heading, employers, roles, dates, short points, logos, and links. Entries render in the order you list them. Add another object to `entries` to add a role; no component changes are needed.

Use `YYYY-MM` dates and `null` for a current role’s end date. Company logos can be local public paths or HTTPS URLs. Omit `logo` to use an icon. Available icon keys: `briefcase`, `code`, `globe`, `layers`, `smartphone`, `apple`, and `play-store`. Unknown icons and failed logos fall back gracefully.

The component includes the bundled JSON for its initial render and fetches `/data/experience.json` on each visit. In a deployed static site, replace the deployed JSON file to update the live content without rebuilding the component bundle. Repository changes still need to be copied or deployed to the host. Invalid or unavailable JSON keeps the bundled content visible.

The center line fills with scroll; cards and labels reveal in 600 ms. Mobile uses a single-sided timeline, and reduced-motion preferences show every entry without reveal animations. The reference for this section is [Diego’s experience timeline](https://diegovz.com/), adapted to the portfolio’s existing theme.

With the preview running, verify it with `npm run test:experience`. Run `npm run test:creative` for the six book spreads, rapid navigation, keyboard/swipe controls, runtime JSON, and artwork gallery.

## Verification

The production build includes TypeScript checks, lint checks, and static generation. The migration was also checked against the original project array to verify every text field, URL, image reference, and technology name was retained. Playwright checks cover desktop and mobile routes, project sheets, history, theme persistence, legacy project links, book turns, reduced motion, and canvas controls/export. Screenshots were inspected for layout issues.

## Creative sketchbook

Edit `public/data/book.json` to update the hero title and the six facing spreads. The story moves through Bandadda graphics and ownership, Rimigo product thinking and engineering, Twigg mobile and web, Wayvia and FlowPDF, automation and operations, then community and content. Each page has `illustration`, `eyebrow`, `title`, `note`, `tags`, and optional original `images`. The JSON is fetched on each visit with a validated bundled fallback.

`BookIllustration.tsx` draws the pages as static SVG pencil studies, including original apparel artwork rendered as graphite on paper. Screenshots, photograph mounts, and videos are kept in the work gallery. The book uses the locally bundled 75 KB Caveat handwriting font with its OFL license. Ink, paper, restrained washes, and annotations are consistent across every page.

On desktop, on the first visit in a browser session, the book waits for its artwork and lettering, then turns through two laps with increasing durations before landing on the first spread. User navigation cancels the remaining intro. The visible index commits only after the page turn; incoming paper and the turning sheet share identical geometry. Resizing, hiding the tab, and enabling reduced motion settle the current animation.

Run `npm run test:book` to inspect the intro, forward/backward handoffs, all twelve pages at 1440/768/390/320 pixels, session behavior, rapid interruptions, and reduced motion. It writes frame samples and motion traces to `.artifacts/book-redesign/qa/`. Run `npm run test:book:pixels` (Pillow required) to compare the actual first and final frames against the resting pages; it allows small antialiasing differences while detecting visible shifts, flashes, or changes in sharpness. `npm run test:creative` also checks runtime JSON, keyboard/swipe navigation, and the artwork gallery.

`public/creative/` contains 13 clean, non-explicit original apparel graphics as transparent WebP files, real product imagery, and a trimmed garment campaign clip. The original alpha channels are preserved; no artificial background is baked into the artwork. Sources are listed in `public/creative/sources.json`. Community stage imagery is brand artwork, and the event poster is displayed as an example of the platform experience.

Capture plans are editable in `scripts/recording-plans.json`. Set `PORTFOLIO_CAPTURE_DIR` to use a different raw capture folder for both recording and encoding. Output reels include their action and camera provenance alongside each MP4.

## Play studio

The Play page has three complete browser-local experiments:

- **Pixel Eye:** match a reference layout using spacing, corner radius, and button width. Three studies use Bandadda, Wayvia, and FlowPDF content. Matching at least 95% earns a stamp. Sliders support keyboard adjustment, and hints expose the target values.
- **Signal Path:** rotate a real 3×3 wire puzzle to connect an enquiry through Validate, Sheets, and Gmail. Signals follow connected ports, incomplete routes fail, and a completed route records the fewest turns. The animation respects reduced motion.
- **Merch Lab:** remix four original Bandadda graphics with tee colours and print sizing. Export creates a real 600×640 transparent PNG in the browser. Artwork stays in its original colours.

`public/data/play.json` contains the page copy, layout studies and targets, wire blueprint, original artwork paths, and tee colours. It is fetched on each visit with validated bundled fallback data. Keep a wire board at nine tiles; its input is the middle-left tile and its output is the middle-right. Each named stage must be visited in order.

Personal bests and earned stamps stay in the visitor’s browser. Unfinished experiments survive changing tabs. Keyboard tab navigation, tile controls, light/dark themes, and a compact sticky preview in mobile portrait mode are included. The existing Flow Field experiment remains at `/play/flow-field`.

Research references: [Method of Action](https://method.ac/), [Neal.fun](https://neal.fun/), and [Bruno Simon](https://bruno-simon.com/). Their use of immediate interaction informed these original experiments; the games and artwork here are specific to this portfolio.

Run `npm run test:play` against the preview (`PORTFOLIO_BASE_URL` overrides the URL). The browser checks actually solve both puzzles, export a tee, verify saved progress, exercise keyboard and reduced-motion behavior, and inspect 320/390/768/1440px layouts in both themes. Screenshots and downloads go under `.artifacts/play-redesign/qa/`.

## Mobile checks

Phones and coarse pointers start with a still first spread, then use a 520 ms fold when tapped or swiped. Each paper keeps a consistent rendering layer to avoid text sharpness changes at the handoff. Vertical scrolling and pinch zoom remain available. The header reports its actual height so the Play tabs and compact preview stay below it; landscape uses normal document flow.

Run `npm run test:mobile` against the preview. Set `PORTFOLIO_BROWSER_ENGINE=webkit` to check WebKit; `PORTFOLIO_BROWSER_EXECUTABLE` can select a local engine binary. The check covers touch input, animation endpoint screenshots, 320–430px layouts, all book spreads, orientation changes, other routes, and reachable Play controls. `PORTFOLIO_MOBILE_QA_DIR` selects the screenshot folder. Run the pixel check with `PORTFOLIO_BOOK_QA_DIR` pointing to that folder.
