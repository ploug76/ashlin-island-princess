# Ashlin as the Island Princess

A private story game in 11 chapters that follows the 2007 film *Barbie as the Island Princess*, with Ashlin as the heroine.
All art and music are original and drawn or synthesized in code. Nothing is copied from the film.

Play: https://ploug76.github.io/ashlin-island-princess/

## Swapping in Ashlin's photos

Right now Ashlin is a plain white cutout in two versions:

| Version | Used in | Body image | Joints file |
|---|---|---|---|
| Child | Chapters 1–2 | `assets/ashlin-child.png` | `assets/ashlin-child.json` |
| Adult | Chapters 3–11 | `assets/ashlin-adult.png` | `assets/ashlin-adult.json` |

The PNG holds only her **head, hair, body and skirt**. The arms and legs are drawn by the game from the joints in the JSON, with knees and elbows,
so she keeps walking and running naturally after you add a photo. There are two ways to add a photo.

### Option A: face photo only (easiest)
1. Crop a face photo to a square (a PNG with a transparent background looks best).
2. Save it as `assets/ashlin-child-face.png` and/or `assets/ashlin-adult-face.png`.
3. In `assets/photos.json`, fill in the file names:
   `{"childFace":"ashlin-child-face.png","adultFace":"ashlin-adult-face.png"}`
4. The game puts the photo in the head circle (the `head` value in the JSON is `[x, y, radius]`).

### Option B: replace the whole cutout
1. Open `assets/ashlin-child-template.png` or `assets/ashlin-adult-template.png`. They show the cutout with the head circle in pink, the leg joints in blue and the arm joints in green.
2. Make a new PNG with the **same width and height ratio** (child 90×200, adult 110×300, any multiple works, such as 4× = 360×800 and 440×1200). Draw or paste her head, hair and dress in the same place, facing right, and leave the arms and legs off.
3. Save it over `assets/ashlin-child.png` or `assets/ashlin-adult.png`.
4. Optional: change the limb colors in the JSON. `"limb"` is the arm and leg color (use a skin tone or her tights color), and `"line"` is the outline color.

After any change, bump the version in `sw.js` (or run `/workspace/sw-autoupdate/patch.py <repo>`) so phones pick up the update.

## Studio logo
Peter hasn't picked a studio for this game yet. To add one, set `CONFIG.studioLogo` at the top of `js/core.js` to a logo file in the repo root,
for example `'logo-589.png'`. It then shows tiny in the bottom-right corner.
