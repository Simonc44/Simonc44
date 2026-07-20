# Portfolio v3 — Next.js 15 module

> Self-contained App Router drop-in: floating glassmorphism navbar with
> FR/EN/ES language switcher, fullscreen **Identité** Hero (live `.glb`
> model support + GPU particle field + animated title reveal + Lenis
> smooth scroll) and four i18n-ready content sections (About, Tech,
> Projects, Contact).

```
src/portfolio-next/
├── app/
│   ├── layout.tsx          ← Server. <html>/<body>, font, providers.
│   ├── page.tsx            ← Server. Wires Hero (with modelUrl) + sections.
│   └── globals.css         ← Cinematic dark tokens + utilities.
├── providers/
│   ├── intl-provider.tsx   ← "use client". FR/EN/ES React Context + PROJECT_IDS registry.
│   └── smooth-scroll.tsx   ← "use client". Lenis (lenis/react) wrapper.
├── hooks/
│   └── useReveal.ts        ← Reusable scroll-reveal hook (useInView + MarginType).
├── components/
│   ├── Navbar.tsx          ← Floating glassmorphism pill + switcher.
│   ├── LanguageSwitcher.tsx← FR/EN/ES pill with animated layoutId.
│   ├── Hero.tsx            ← Fullscreen identity section.
│   ├── Hero3D.tsx          ← R3F Canvas + GPU particles + GLTF/fallback model.
│   ├── TitleReveal.tsx     ← Char-by-char staggered reveal + cursor.
│   ├── About.tsx           ← Currently list + 3 process steps + quote.
│   ├── TechStack.tsx       ← Two infinite marquees (Frontend / Backend).
│   ├── Projects.tsx       ← Filter pills + 5 cards (every string from i18n).
│   ├── Contact.tsx         ← Email copy + mailto + 3 social cards.
│   ├── Footer.tsx          ← Localised "built with" footer.
│   └── tech-stack-icons.tsx← Letter-glyph icons shipped with the module.
└── public/
    └── models/
        ├── hero.glb         ← Your optimised model (Draco + KTX2)
        └── README.md         ← Asset workflow.
```

## Install

Next.js 15 + React 18/19 project:

```bash
npm i next@^15 react@^18 @types/three three \
      @react-three/fiber @react-three/drei \
      framer-motion lenis lucide-react
```

(Plus a shadcn-style `components/ui/button` matching the prop shape
`{ asChild, size, variant, className }`. The `Contact` section ships its
own inline notice — no `use-toast` required.)

## Use

1. Copy the directory tree above into your project.
2. Set the path alias in `tsconfig.json`:

   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

3. Drop your `.glb` into `public/models/hero.glb` — see
   `public/models/README.md` for the Blender → Draco → KTX2 workflow.
4. The Hero in `app/page.tsx` already passes `modelUrl="/models/hero.glb"`,
   so the swap is automatic once the file is on disk. To use the
   procedural fallback instead, change the prop to `modelUrl={undefined}`.

## Tech-stack icons

The `TechStack` component imports a small registry of icons from
`@/components/tech-stack-icons`. The module **does** ship a minimal
SVG-letter stub (`components/tech-stack-icons.tsx`) so the runtime
resolves out-of-the-box — every icon is a `<svg>` letter chip with a
brand-flavoured fill.

When you're ready to upgrade:

- **Recommended**: copy the curated brand SVGs from the Vite-shadcn
  sibling repo (`Simonc44/Simonc44`) into the same file path —
  same component shape, zero call-site changes.
- **Roll your own**: each export is a `React.ComponentType<{
  className?: string }>`. Export whatever shape you need as long as
  the prop is honoured.

The runtime doesn't care which icon you provide as long as the
component accepts the optional `className` prop.

## i18n

`DICTIONARIES` in `providers/intl-provider.tsx` is a flat object keyed by
`section.element` (e.g. `about.title`, `project.mandat.subtitle`).
Adding a key requires:

1. Add it to all three languages (`fr`, `en`, `es`).
2. Use it via `t["section.element"]` in any client component.

The `PROJECT_IDS` constant lists the project IDs. Cards in `Projects.tsx`
look up `t[\`project.${id}.title\`]` for each `id`, so adding a project
is a dictionary + meta entry — no component edit needed.

### First-paint i18n

Default language is `fr` until the `useEffect` in `IntlProvider` reads
`localStorage`. For SSR-correct first paint, persist the choice in a
cookie and read it server-side in `app/layout.tsx`:

```tsx
// server
const lang = (await cookies()).get("lang")?.value ?? "fr";
return <html lang={lang}>{/* … */}</html>
```

## `.glb` workflow

See `public/models/README.md` for the full workflow (Blender → Draco
→ KTX2 → `@gltf-transform/cli`). The Hero:

- Calls `useGLTF.preload(modelUrl)` on mount for parallel first paint.
- Streams the file via `<Suspense fallback={<SceneLoader />}>` so the
  wireframe torus keeps the perceived load reactive.
- Falls back to a procedural `MeshTransmissionMaterial` torus knot
  if `modelUrl` is undefined or fails to load.

## Performance notes

- Particles: `THREE.Points` + `ShaderMaterial`. **No per-frame JS work.**
  Count is `1500`. Drop to `600` for mid-range mobile.
- One `<Canvas>` in the Hero — never stack two (each WebGL context
  costs ~100MB GPU memory).
- Mouse parallax, particle repulsion, model tilt and the soft cursor
  all read `state.pointer` independently. No shared React state.
- `prefers-reduced-motion`: Lenis bypassed, scroll-cue float collapses,
  TitleReveal falls back to plain text, GlowBadge pulse stops,
  InfiniteMarquees degrade to flex-wrap chips.

## Accessibility

- `<html lang>` is updated when the user switches language (post-mount).
- Every CTA / link carries a localised `aria-label`.
- The 3D canvas is `aria-hidden="true"`; the title, eyebrow badge, copy
  and CTAs are independently readable screen-reader content.
- `LanguageSwitcher` exposes `aria-pressed`; Navbar uses
  `aria-current="page"` on the active section.
- Projects filter pills use the `tablist` / `tab` / `tabpanel` ARIA
  pattern with focus styles.
- Toast messages use `role="status"`; destructive variants flip to
  `role="alert"`.

## Gotchas

- `useGLTF` must always run as a hook. The fallback split into
  `<FallbackModel />` + `<GLTFModel url={…} />` keeps the rules of
  hooks intact.
- `MeshTransmissionMaterial` requires an IBL envmap. Always wrap
  `<Environment />` (and the model) in `<Suspense>` so the query
  state doesn't tear the render.
- In-page anchors use plain `<a href="#…">` (not `<Link>`) so Lenis's
  `anchors` option can intercept them without conflict.
- The local `<SceneLoader />` is just a wireframe torus — it's a
  deliberately classic "loading" look. Swap as needed but keep the
  total weight negligible (a wireframe `<meshBasicMaterial>` is fine).
- `lenis/react` export shape: `lenis@^1.1` exports `<ReactLenis>` from
  `lenis/react`. Older versions only expose the imperative `Lenis`.
