# Ashlin's character art

Ashlin is a painted storybook character in the same style as the rest of the cast (no photos are used in the game).

| Version | Chapters | Painted body (head, hair, torso, dress; no limbs) | Rig joints + colours |
|---|---|---|---|
| Child | 1-2 | `assets/ashlin-child-art.webp` (4 px per art unit) | `assets/ashlin-child.json` |
| Adult | 3-11 | `assets/ashlin-adult-art.webp` | `assets/ashlin-adult.json` |

Arms and legs are drawn by `js/rig.js` from the joints in the JSON (tapered limbs with a calf / forearm shape, skin `limb`,
soft outline `line`, highlight `hi`, shade `lo`, sandal colour `foot`). Gait comes from `js/kneerig.js`:
walk ~1.7 steps/s, run ~2.8 steps/s, arms swing opposite the legs, knees and elbows bend, the planted foot never slides.

Source paintings: `art_raw/ashlin/` in the work folder; build with `tools/build_ashlin_art.py`
(chroma key, skirt shortened to knee length, cropped into the rig frame). Bump `GAMEV` and the `sw.js` cache after any change.
