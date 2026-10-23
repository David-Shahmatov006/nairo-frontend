Source: gemini_generated_video_f14a98c3.mp4, 10 seconds.
Decode: 16 fps, 640×360 RGBA.
Segmentation: @imgly/background-removal-node 1.4.5, medium IS-Net model, local temporary processing dependencies only. Original RGB preserved; segmentation alpha normalized from 8..210 to 0..255. No color-based removal.
Encode: crop x128/y0/384×360, Lanczos resize to 288×270, infinite-loop RGBA APNG. Static fallback is first frame. Audit all frames for sudden mask-area drops; inspect contact sheets on light/dark backgrounds.

v2: Refine only the enclosed gap between pompom and gift. Within source ROI x145–265, y125–235, remove connected neutral backdrop-colored components (minimum100 pixels, minimum10px width/height), using a per-row background sample at x120. Protect the connected dark face region and its4px perimeter before refining. Small highlights and other foreground details retain the original semantic alpha. New imported filenames prevent stale-cache reuse.
