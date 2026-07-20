# Portfolio v3 — Next.js 15 module

> Drop-in App Router module containing the floating glassmorphism navbar
> (with FR/EN/ES language switcher) and the fullscreen **Identité** Hero
> (interactive 3D, GPU particle field, animated title reveal, Lenis scroll).

This directory is **self-contained**. It mirrors the conventions of a
fresh `npx create-next-app@latest` project (App Router, `'use client'`
boundaries, server-rendered shells, client islands).

## File map

```
src/portfolio-next/
├── app/
│   ├── layout.tsx          ← Server. <html>/<body>, font, providers.
│   ├── page.tsx            ← Server. Renders <Navbar/> + <Hero/>.
│   └── globals.css         ← Cinematic dark tokens + utilities.
├── providers/
│   ├── intl-provider.tsx   ← "use client". FR/EN/ES React Context.
│   └── smooth-scroll.tsx   ← "use client". Lenis (lenis/react) wrapper.
├── hooks/
│   └── useReveal.ts        ← Reusable scroll-reveal hook (useInView).
├── components/
│   ├── Navbar.tsx          ← Floating glassmorphism pill + switcher.
│   ├── LanguageSwitcher.tsx← FR/EN/ES pill with animated layoutId.
│   ├── Hero.tsx            ← Fullscreen identity section.
│   ├── Hero3D.tsx          ← R3F Canvas, GPU particles, model layer.
│   └── TitleReveal.tsx     ← Char-by-char staggered reveal + cursor.
└── README.md
```

## Install

Inside a Next.js 15 + React 18/19 project:

```bash
npm i next@^15 react@^18 @types/three three \
      @react-three/fiber @react-three/drei \
      framer-motion lenis lucide-react
```

If you want post-processing on top of the 3D scene
(`@react-three/postprocessing` not bundled here to keep the module
lightweight).

## Use

1. Copy the directory tree above into your Next.js 15 project.
2. Make sure your `tsconfig.json` has the path alias:

   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

3. Customize:
   - **Color tokens** — edit `app/globals.css` `:root` block.
   - **Languages** — extend `DICTIONARIES` in `providers/intl-provider.tsx`.
   - **3D model** — pass `modelUrl="/models/hero.glb"` to `<Hero />` (or
     `<Hero3D />`). Falls back to a procedural transmissive torus knot
     if no URL is provided.
   - **Title & copy** — all strings live in the dictionaries; nothing
     else is hardcoded.
   - **Font** — currently `Inter` (loaded via `next/font/google`). If
     you want `Geist`, install `@fontsource-variable/geist` and swap
     the `inter` import in `layout.tsx`.

## Performance notes

- Particles: `THREE.Points` with a custom `ShaderMaterial`. **No
  per-frame JS array updates** — everything runs in the vertex shader.
  Count is `1500`. Drop to `600` for mid-range mobile.
- `<Canvas>` is mounted **once** in the Hero — never stack two Canvases
  (each WebGL context costs roughly 100MB GPU memory).
- Mouse parallax, particle repulsion, model tilt and the soft cursor
  all read `state.pointer` independently — no shared React state, no
  render thrashing.
- `prefers-reduced-motion` is honored in **every** animated primitive:
  - Lenis is bypassed (native scroll resumes)
  - Title rendering falls back to plain text
  - Particles keep their position but lose attraction-repulsion
  - Scroll-cue float animation collapses to final state

## Accessibility

- `<html lang>` updates when the user changes language (post-mount to
  avoid hydration mismatch).
- Every CTA / link carries `aria-label`.
- The 3D canvas is `aria-hidden="true"`; the title, eyebrow badge, copy
  and CTAs are independently readable screen-reader content.
- LanguageSwitcher exposes `aria-pressed` on each choice; Navbar uses
  `aria-current="page"` on the active section.

## Gotchas

- `useGLTF` must always run as a hook. The fallback split into
  `<FallbackModel />` + `<GLTFModel url={…} />` keeps the rules of
  hooks intact.
- `MeshTransmissionMaterial` requires an envmap. Always wrap
  `<Environment />` (and the model) in a `<Suspense>` so the query
  state doesn't tear the render.
- Localised strings hydrate from `localStorage` on mount, so the
  first paint defaults to `fr`. For SSR-correct first paint, persist
  in a cookie and read it inside `layout.tsx` server component.
- In-page anchors use plain `<a href="#…">` (not `<Link>`) so Lenis's
  `anchors` option can intercept them without conflict.
- The `lenis/react` import path looks like `lenis/react`. Older
  versions only expose `Lenis` directly — pin `lenis@^1.1`.
