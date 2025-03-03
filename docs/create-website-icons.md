# Steps for generating icons

[How to Favicon in 2025: Three files that fit most needs](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs)

## Favicon

```sh
magick public/icon.svg -define icon:auto-resize=32,16 public/favicon.ico
```

## Apple Touch Icon

```sh
magick public/icon.svg -resize 140x140 -gravity center -extent 180x180 public/apple-touch-icon.png
```

## Web app manifest Icons

```sh
magick public/icon.svg -resize 192x192 public/icons/icon-192.png
magick public/icon.svg -resize 512x512 public/icons/icon-512.png
magick public/icon.svg -resize 320x320 -gravity center -extent 512x512+0+40 public/icons/icon-mask.png
```

> [!NOTE]
> `-extent 512x512+0+40` is used to shift the triangle up 40px from center for
> better masking.

## Future Ideas

- Consider [automatically generating](https://kremalicious.com/favicon-generation-with-astro/)
  with Astro
