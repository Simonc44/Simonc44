# `/public/models/hero.glb` — Workflow

> The Hero scene will look for a `.glb` at this exact path. Drop yours
> in, optimise it, then reload the page — the procedural torus-knot
> fallback is replaced transparently.

## TL;DR

1. Author / source your model (Blender, Maya, Substance, …)
2. Export as **glTF 2.0 / `.glb`** (binary, NOT `.gltf + .bin + .textures`)
3. **Apply Draco mesh compression** (cuts file size 70-90%)
4. **Pack textures as KTX2 / BasisU** (cuts GPU upload + bandwidth)
5. Validate with `gltf-validator` and `@gltf-transform/inspect`
6. Place the file at `public/models/hero.glb` (≈ < 5 MB recommended)

## Detailed steps

### 1. Export from Blender

- File → Export → glTF 2.0
- Format: **glTF Binary (.glb)**
- ✅ Compression → Draco mesh compression (level 6 is a good default)
- ✅ Texture settings → KTX2 with BasisU
- ✅ Limit to: Selected Objects (whitelist your hero mesh, not lights/cameras)
- Apply transforms before export (Object → Apply → All Transforms)
- Keep units in metres; r3f has no built-in unit system

### 2. CLI confirmation

The reference toolchain is [`@gltf-transform/cli`](https://gltf-transform.dev/cli.html):

```bash
npm i -g @gltf-transform/cli

# Inspect what shipped
gltf-transform inspect public/models/hero.glb

# Validate
gltf-transform validate public/models/hero.glb

# If you forgot Draco at export time:
gltf-transform draco public/models/hero.glb

# If you forgot KTX2 textures:
gltf-transform ktx2 public/models/hero.glb
```

### 3. File budget

| Asset class | Target size |
|---|---|
| Hero mesh only | ≤ 3 MB |
| Each embedded texture | ≤ 512 KB |
| Hero total | ≤ 5 MB |

Anything beyond `5 MB` will be visibly slow to first-paint on mobile —
even with Suspense — so opt for **lower poly with normal maps** over
high-poly with no normals.

### 4. Anchor points

For the parallax + tilt behaviour to feel right:
- Model origin (`0,0,0`) should be the model's visual centre.
- The mesh group should fit within a unit sphere with radius ≈ 1.2 — the
  `<GLTFModel>` wrapper applies ±0.5 rad parallax; meshes that scale to
  `> 1.5` will look like they're clipping the camera near plane.

### 5. Lights & materials

`<GLTFModel>` ships **without** lights of its own — it relies on
`<Environment preset="city" />` (loaded async) for IBL. Author your
materials with **metallic-roughness** (KHR_materials_pbr) and avoid
emissive-only materials; they don't react to the HDR cleanly.

### 6. Test paths

```bash
# After placing the file:
curl -I http://localhost:3000/models/hero.glb
# → expect 200 OK, Content-Type: model/gltf-binary
```

If you see `404`:
- Confirm the file is at `public/models/hero.glb` (Next.js serves from
  `public/` at the URL root)
- Confirm the prop value in `app/page.tsx` matches: must be
  `"/models/hero.glb"` (leading slash, no "public/" prefix)
- Restart `next dev` if the asset was added after the server started

### 7. Updating the model

The `useGLTF.preload(modelUrl)` call in `Hero3D` caches the asset on
mount. If you replace `hero.glb`:

- Restart `next dev` (some bundlers cache `.glb` aggressively)
- Or hard-refresh (`⇧⌘R` / `Ctrl+Shift+R`)
- Or use a different filename and bump `modelUrl` accordingly

### 8. Disabling the model

If you ever want to demo without the `.glb` (or the file is missing),
just pass `modelUrl={undefined}` to `<Hero />` in `page.tsx`. The
procedural `MeshTransmissionMaterial` fallback kicks in seamlessly.
