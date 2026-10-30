# Ashlin as the Island Princess

A private story game in 11 chapters that follows the 2007 film *Barbie as the Island Princess*, with Ashlin as the heroine.
All art is original: the painted backgrounds, animals and characters in `art/` were made for this game, and so is Ashlin herself:
a painted storybook character (child for chapters 1-2, adult for chapters 3-11) on a jointed rig. No photos are used anywhere in the game.
How her art is built and animated: see **[ART.md](ART.md)**.

## What's in here
| Path | What |
|---|---|
| `art/*.webp` | painted backgrounds (`*_p` = portrait versions) and character / prop sprites |
| `assets/` | Ashlin's painted bodies (`ashlin-*-art.webp`) and rig joints/colours (`ashlin-*.json`) |
| `js/gfx.js` | painted-scene helpers: parallax, sprites, particles, ambient motion |
| `js/games.js` | the 10 mini-game types |
| `js/story.js` | the 11 chapters, story lines and cinematic story scenes |
| `fonts/lilita.woff2` | Lilita One (SIL Open Font License) |


After any change, bump the version in `sw.js` (or run `/workspace/sw-autoupdate/patch.py <repo>`) so phones pick up the update.

## Studio logo
Peter hasn't picked a studio for this game yet. To add one, set `CONFIG.studioLogo` at the top of `js/core.js` to a logo file in the repo root,
for example `'logo-589.png'`. It then shows tiny in the bottom-right corner.
