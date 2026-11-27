# LED video-wall pixel-pitch calculator

Zero-dependency JavaScript formula module and CLI demo for early indoor LED planning. MIT licensed by Kasturi Technology Sdn. Bhd. Requires Node.js 20+; no package install, API key or network call.

```sh
npm test
npm run check
node cli.js 4800 2700 1.25 600 337.5 600 200
```

Arguments: width mm, height mm, pitch mm, cabinet width mm, cabinet height mm, manufacturer maximum W/m², optional manufacturer typical W/m². The example's cabinet and power inputs are **illustrative**, not a quoted Kasturi product. Output is JSON. Invalid inputs exit 1. `--help` prints usage. The CLI is the runnable demo; no hosted demo or GitHub remote is claimed.

## Functions

| Export | Result |
|---|---|
| `resolution(widthMm,heightMm,pitchMm)` | Rounded nominal pixels plus exact fractional calculation and nominal flag |
| `cabinetGrid(widthMm,heightMm,cabinetWidthMm,cabinetHeightMm)` | Ceil-to-fit grid, count, installed size and aspect ratio |
| `layout16x9(cabinetWidthMm,cabinetHeightMm,minWidthMm)` | Smallest exact 16:9 grid by row count at or above requested width; fails beyond 10,000 rows |
| `viewingDistances(pitchMm,minimumFactorMPerMm=1)` | Adjustable screening minimum and separate one-arcminute visual-acuity distance |
| `power(widthMm,heightMm,maxWPerM2,typicalWPerM2=null)` | Area × supplied power density; unknown typical power stays null |

Supports P1.2, P1.5, P1.8 and P2.5 through `PITCHES_MM`, and any finite positive pitch such as P1.25. Display pixels are physical width/pitch and height/pitch. Marketing labels can round exact pitch: confirm the real cabinet/module pixel matrix with the supplier before specifying a processor canvas.

Square cabinets require 16 columns × 9 rows for the smallest exact 16:9 grid. Cabinets already shaped 16:9 need equal row/column counts. Ceil-to-fit can exceed available wall space: verify installed dimensions and structure; do not assume it fits.

The default screening minimum of 1 m per mm is an adjustable **heuristic**, not a standard, manufacturer recommendation, pixel-invisibility threshold or text-readability guarantee. One-arcminute visual acuity uses `(pitch mm / 1000) / tan(1 arc minute)`, approximately 3.438 m per mm. Content, contrast and vision change the practical choice. See [Planar's viewing-distance explanation](https://www.planar.com/media/439462/understanding-viewing-distance.pdf).

Power uses the installed cabinet area. Supply real maximum and typical density figures from the chosen product, including the applicable brightness/test condition. This does not size circuits, feeders, protection, inrush, cooling, redundancy or controllers. Have the electrical design checked by a qualified professional.

For a 4.8 × 2.7 m wall, nominal resolution is 4000 × 2250 at P1.2, 3200 × 1800 at P1.5, 2667 × 1500 at P1.8, and 1920 × 1080 at P2.5. Fractional results are flagged as nominal rather than presented as buildable pixel matrices.

[Kasturi LED video-wall design](https://www.kasturi.com.my/video-wall/) • [Kasturi Technology](https://www.kasturi.com.my/)

Contribute a reproducible calculation and primary source for device-specific corrections. Linked sources retain their own licences. No certification, actual product specification or remote publication is implied.
