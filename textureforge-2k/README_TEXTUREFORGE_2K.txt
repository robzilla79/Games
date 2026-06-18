TextureForge 2K

Repo build location:
- textureforge-2k/index.html

What this branch adds:
- Standalone browser texture decal workflow.
- Body, clothing, and full-pack modes.
- Region templates with prompt generation.
- Bulk image import with filename matching and duplicate-match protection.
- Per-region source import.
- Browser-side neutral-background removal and transparent PNG processing.
- Mirrored and split output variants.
- Validation for selected output completeness, dimensions, alpha, and size warnings.
- Manifest, README, prompts, individual PNG downloads, contact sheet export, and zip export.
- Local settings persistence.

How to use:
1. Open textureforge-2k/index.html from a static host or local browser.
2. Choose Body, Clothing, or Full mode.
3. Select the regions you want.
4. Copy prompts and generate source images.
5. Import generated images individually or with Bulk Import.
6. Resolve duplicate region matches before applying bulk imports.
7. Process selected regions or all imported regions.
8. Check Validation.
9. Export the zip.

Notes:
- This repo build is intentionally asset-free so it can live cleanly in the Games repo as a single working app file.
- The richer uploaded package included sample PNG and zip assets; those are not embedded here.
- The size target is a warning target, not PNG recompression.
