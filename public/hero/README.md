# Hero media

For each perfume id (`obsidian-oud`, `velvet-santal`, `noir-vetiver`, `lumiere-blanche`):

| File | Used for |
|------|----------|
| `{id}-idle.jpg`  | bottle at rest: video poster, the still revealed after each mist swap, fallback |
| `{id}-spray.jpg` | bottle spraying: fallback slider only |
| `{id}-spray.mp4` | clip idle -> spray (scrubbed on the home hero and on that perfume's product page) |

The transitions between perfumes are drawn in code (canvas mist), so no swap clips are needed.

Re-encode every clip for smooth scroll scrubbing (every frame a keyframe, 1280px wide, no audio):

    mkdir -p out && for f in *-spray.mp4; do
      ffmpeg -i "$f" -vf scale=1280:-2 -c:v libx264 -crf 24 -g 1 -an -movflags +faststart "out/$f"
    done
