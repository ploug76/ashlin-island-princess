# Dropping in Ashlin's photos

Ashlin has two separate cutouts with different proportions:

| Version | Chapters | Body image (head, hair, dress) | Joints | Face slot |
|---|---|---|---|---|
| Child | 1-2 (shipwreck, growing up on the island) | `assets/ashlin-child.png` (90x200 ratio, drawn at 4x = 360x800) | `assets/ashlin-child.json` | `assets/ashlin-child-face.png` |
| Adult | 3-11 | `assets/ashlin-adult.png` (110x300 ratio, drawn at 4x = 440x1200) | `assets/ashlin-adult.json` | `assets/ashlin-adult-face.png` |

The arms and legs are not in the PNG. The game draws them from the joints in the JSON (knees and elbows bend, feet stay planted),
so she keeps walking and running naturally whatever image you use. The white glow, ground shadow and the round story-box portrait
are all made from her cutout, so a new photo shows up there automatically too.

## Option A: face only (quickest)
1. Crop a face photo to a square. A PNG with a transparent background looks best.
2. Save it as `assets/ashlin-child-face.png` and/or `assets/ashlin-adult-face.png`.
3. Turn it on in `assets/photos.json`:
   ```json
   {"childFace":"ashlin-child-face.png","adultFace":"ashlin-adult-face.png"}
   ```
   Leave a value as `""` to keep that version as the plain cutout.
4. The face is clipped into the head circle (`"head": [x, y, radius]` in the JSON).

## Option B: whole cutout (head, hair and dress from a photo)
1. Open `assets/ashlin-child-template.png` or `assets/ashlin-adult-template.png`.
   The head circle is pink, leg joints blue, arm joints green.
2. Make a PNG with the same width:height ratio (child 90:200, adult 110:300), facing right, with her head, hair and dress
   in the same place and the arms and legs left off. Transparent background.
3. Save it over `assets/ashlin-child.png` or `assets/ashlin-adult.png`.
4. Optional, in the JSON: `"limb"` = arm/leg colour (a skin tone or tights colour), `"line"` = outline colour,
   `"glow"` = glow colour (e.g. `"rgba(255,255,255,.95)"`).

## Then bump the version (so phones pick it up)
Run `python3 /workspace/sw-autoupdate/patch.py <repo>` and raise the number in `CACHE='ashlin-island-princess-vN'` in `sw.js`
(and `window.GAMEV` in `index.html`, which busts the image cache). Commit, `git pull --rebase`, push.
