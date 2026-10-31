# Ashlin's character art

Ashlin is a painted storybook character in the same style as the rest of the cast (no photos are used in the game).

| Version | Chapters | Painted body (head, hair, torso, dress; no limbs) | Rig joints + colours |
|---|---|---|---|
| Child | 1-2 | `assets/ashlin-child-art.webp` (4 px per art unit) | `assets/ashlin-child.json` |
| Adult | 3-11 | `assets/ashlin-adult-art.webp` | `assets/ashlin-adult.json` |
| Child, side view | 1-2 (walking / running) | `assets/ashlin-child-side-art.webp` | `assets/ashlin-child-side.json` |
| Adult, side view | 3-11 (walking / running) | `assets/ashlin-adult-side-art.webp` | `assets/ashlin-adult-side.json` |

Arms and legs are drawn by `js/rig.js` from the joints in the JSON (tapered limbs with a calf / forearm shape, skin `limb`,
soft outline `line`, highlight `hi`, shade `lo`, sandal colour `foot`). Gait comes from `js/kneerig.js`:
walk ~1.7 steps/s, run ~2.8 steps/s, arms swing opposite the legs, knees and elbows bend, the planted foot never slides.

Source paintings: `art_raw/ashlin/` in the work folder; build with `tools/build_ashlin_art.py`
(chroma key, skirt shortened to knee length, cropped into the rig frame). Bump `GAMEV` and the `sw.js` cache after any change.

Walking and running use the side-view (profile) art, facing the way she moves (mirrored when she goes left), so her face, body
and feet all point the same way. The front art is only for standing still and story scenes. Side gait (`sidePose` in `js/rig.js`):
the hips ride up and down so the standing leg stays nearly straight, heel strikes first, the foot rolls flat and pushes off the toe,
the touching point never slides, arms swing opposite the legs with bent elbows, and the upper body leans a little forward (more when running).
Side art is built with `tools/build_ashlin_side.py` from `art_raw/ashlin/<v>_profile_body.jpg`.
