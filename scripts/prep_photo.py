"""
Prepare a portrait photo for clean ASCII conversion:
  1. remove the background (rembg) so the subject is isolated
  2. boost LOCAL contrast (CLAHE) so a flatly-lit face gains highlights and
     shadows -- this is what turns a dark blob into a recognizable face
  3. composite the subject onto pure white so the background reads as blank
     (white -> spaces in the ascii ramp)

Output: source-prepped.png (grayscale), consumed by make_ascii_svg.py.
Run once whenever the source photo changes; the ascii SVG itself is static.

Robust Fallback: If rembg or cv2 are not available, it uses pure PIL (Pillow) to
grayscale, auto-contrast, and threshold the image to ensure high-contrast output.

    python scripts/prep_photo.py [input.png] [output.png]
"""
import os
import sys
from PIL import Image, ImageOps, ImageEnhance

HERE = os.path.dirname(os.path.abspath(__file__))
INP = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "..", "source-photo.png")
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, "..", "source-prepped.png")

print(f"Prepping photo from {INP} to {OUT}...")

if not os.path.exists(INP):
    print(f"Error: Source photo {INP} does not exist!")
    sys.exit(1)

try:
    import cv2
    import numpy as np
    from rembg import remove
    HAS_LIBS = True
except ImportError:
    print("rembg or cv2 not found. Falling back to pure Pillow (PIL) preprocessing.")
    HAS_LIBS = False

if HAS_LIBS:
    try:
        # 1. cut out the subject
        cut = remove(Image.open(INP).convert("RGBA"))
        rgb = np.array(cut.convert("RGB"))
        alpha = np.array(cut.split()[-1])                 # 0 = background

        # 2. local-contrast the luminance (CLAHE)
        gray = cv2.cvtColor(rgb, cv2.COLOR_RGB2GRAY)
        clahe = cv2.createCLAHE(clipLimit=2.6, tileGridSize=(8, 8))
        gray = clahe.apply(gray)

        # a touch of global lift so the face sits in the sparse end of the ramp
        gray = cv2.convertScaleAbs(gray, alpha=1.05, beta=18)

        # 3. paste onto white using the alpha mask (feathered a hair to avoid a halo)
        mask = (alpha.astype(np.float32) / 255.0)
        mask = cv2.GaussianBlur(mask, (0, 0), 1.0)
        out = gray.astype(np.float32) * mask + 255.0 * (1.0 - mask)
        out = np.clip(out, 0, 255).astype(np.uint8)

        Image.fromarray(out, mode="L").save(OUT)
        print("Successfully wrote prepped image with rembg + cv2:", OUT, out.shape)
    except Exception as e:
        print(f"Error during rembg/cv2 processing: {e}. Falling back to pure Pillow (PIL) preprocessing.")
        HAS_LIBS = False

if not HAS_LIBS:
    # Pure PIL robust fallback
    # Convert image to grayscale, perform autocontrast, and enhance contrast
    img = Image.open(INP).convert("L")
    img = ImageOps.autocontrast(img, cutoff=2)

    # Enhance contrast strongly to mimic CLAHE and make highlights pop
    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.6)

    # Brighten slightly so highlights map to white (sparse character / background spaces)
    enhancer_bright = ImageEnhance.Brightness(img)
    img = enhancer_bright.enhance(1.1)

    img.save(OUT)
    print("Successfully wrote prepped image with pure Pillow (PIL):", OUT, img.size)
